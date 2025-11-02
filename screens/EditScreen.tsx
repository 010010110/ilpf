import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Appbar, TextInput, Text } from 'react-native-paper';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/FormScreen.styles';
import { updateItem } from '../database/db';
import {
  calcularAreaPorArvore,
  calcularDensidadeArborea,
  calcularDensidadeParcela,
  calcularDimensoesParcela,
  calcularDistanciaEntreParcelas,
  calcularNumArvoresParcelas,
  calcularNumParcelas,
  calcularTaxaOcupacaoSolo,
  calcularTotalArvores,
  calcularTotalArvoresMonitoradas,
} from '@/utils/calculos';
import { alertarVirgula, formatarNumeroBR, limparEntradaDecimal, limparEntradaInteira } from '@/utils/Numberformatter';
import { Config } from '@/utils/config';
import { RootStackParamList } from '@/utils/types';

const EditScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const params = route.params as any;

  // Estados dos dados de entrada
  const [nomeMedicao, setNomeMedicao] = useState(params.nome_medicao);
  const [area, setArea] = useState(String(params.area));
  const [distRenques, setDistRenques] = useState(String(params.distRenques));
  const [numLinhasRenque, setNumLinhasRenque] = useState(String(params.numLinhasRenque));
  const [distLinhas, setDistLinhas] = useState(String(params.distLinhas));
  const [distArvores, setDistArvores] = useState(String(params.distArvores));
  
  // Estados das 5 parcelas (obrigatórias para medições completas)
  const [parcela1, setParcela1] = useState(params.parcelaPreliminar1 ? String(params.parcelaPreliminar1) : '');
  const [parcela2, setParcela2] = useState(params.parcelaPreliminar2 ? String(params.parcelaPreliminar2) : '');
  const [parcela3, setParcela3] = useState(params.parcelaPreliminar3 ? String(params.parcelaPreliminar3) : '');
  const [parcela4, setParcela4] = useState(params.parcelaPreliminar4 ? String(params.parcelaPreliminar4) : '');
  const [parcela5, setParcela5] = useState(params.parcelaPreliminar5 ? String(params.parcelaPreliminar5) : '');

  // Estados dos resultados calculados
  const [areaPorArvore, setAreaPorArvore] = useState<number | null>(null);
  const [densidadeArborea, setDensidadeArborea] = useState<number | null>(null);

  const isCompleto = params.status === 'completo';

  const handleDecimalInput = (texto: string, setter: (value: string) => void) => {
    if (texto.includes(',')) {
      alertarVirgula();
    }
    const valorLimpo = limparEntradaDecimal(texto);
    setter(valorLimpo);
  };
  

  const handleIntegerInput = (texto: string, setter: (value: string) => void) => {
    if (texto.includes(',')) {
      alertarVirgula();
    }
    const valorLimpo = limparEntradaInteira(texto);
    setter(valorLimpo);
  };

  useEffect(() => {
    if (numLinhasRenque === '1') {
      setDistLinhas(distRenques);
    }
  }, [numLinhasRenque, distRenques]);

  useEffect(() => {
    const preenchidos = area && distRenques && numLinhasRenque && distLinhas && distArvores;
    if (preenchidos) {
      const areaCalc = calcularAreaPorArvore(
        parseFloat(distRenques),
        parseFloat(distArvores),
        parseInt(numLinhasRenque),
        parseFloat(distLinhas)
      );
      const densidade = calcularDensidadeArborea(areaCalc);
      setAreaPorArvore(areaCalc);
      setDensidadeArborea(densidade);
    } else {
      setAreaPorArvore(null);
      setDensidadeArborea(null);
    }
  }, [area, distRenques, numLinhasRenque, distLinhas, distArvores]);

  const validarCamposObrigatorios = () => {
    if (!nomeMedicao.trim() || !area.trim() || !distRenques.trim() || !numLinhasRenque.trim() || !distLinhas.trim() || !distArvores.trim()) {
      Alert.alert('Campos Obrigatórios', 'Preencha todos os dados básicos da medição.');
      return false;
    }
    
    // As 5 parcelas são necessárias para a lógica de cálculo (que decide se precisa de mais)
    if (!parcela1 || !parcela2 || !parcela3 || !parcela4 || !parcela5) {
      Alert.alert('Dados Incompletos', 'Preencha as 5 parcelas preliminares para salvar ou recalcular.');
      return false;
    }

    return true;
  };

  const salvar = async () => {
    if (!validarCamposObrigatorios()) {
      return;
    }

    const erroPermitido = Config.erroPermitido;
    const areaFloat = parseFloat(area);
    const distRenquesFloat = parseFloat(distRenques);
    const numLinhasRenqueInt = parseInt(numLinhasRenque);
    const distLinhasFloat = parseFloat(distLinhas);
    const distArvoresFloat = parseFloat(distArvores);
    
    // FIX: Converter explicitamente para number | undefined para corresponder à assinatura de updateItem.
    const parcela1Int = parcela1 ? parseInt(parcela1) : undefined;
    const parcela2Int = parcela2 ? parseInt(parcela2) : undefined;
    const parcela3Int = parcela3 ? parseInt(parcela3) : undefined;
    const parcela4Int = parcela4 ? parseInt(parcela4) : undefined;
    const parcela5Int = parcela5 ? parseInt(parcela5) : undefined;
    
    
    if (areaPorArvore === null || densidadeArborea === null) {
        Alert.alert('Erro', 'Dados de plantio inválidos. Verifique os campos de distância.');
        return;
    }

    // A partir daqui, parcelasInt são number ou undefined.
    // A validação inicial garante que, se chegou até aqui, elas são number.
    
    // --- Lógica de Feedback Loop para Edição ---
    if (parcela1Int !== undefined && parcela2Int !== undefined && parcela3Int !== undefined && parcela4Int !== undefined && parcela5Int !== undefined) {
        
        const { areaTotal } = calcularDimensoesParcela(
          distArvoresFloat,
          distRenquesFloat,
          numLinhasRenqueInt,
          distLinhasFloat
        );

        const densidadesPreliminares = [
          calcularDensidadeParcela(parcela1Int, areaTotal),
          calcularDensidadeParcela(parcela2Int, areaTotal),
          calcularDensidadeParcela(parcela3Int, areaTotal),
          calcularDensidadeParcela(parcela4Int, areaTotal),
          calcularDensidadeParcela(parcela5Int, areaTotal),
        ];

        const numParcelasCalculado = calcularNumParcelas(
          areaFloat,
          areaTotal,
          densidadesPreliminares,
          erroPermitido
        );
        
        if (numParcelasCalculado > 5) {
            // Se precisar de mais parcelas, redireciona para a tela de Formulário/Feedback
            const plotsToDemarcate = numParcelasCalculado - 5;
            Alert.alert(
              'Ação Necessária',
              `A variabilidade da amostra requer ${plotsToDemarcate} parcela(s) extra(s) para atingir o erro permitido. Você será redirecionado para a etapa de feedback.`,
              [{ text: 'OK' }]
            );

            // Redireciona para o FormScreen com os dados para acionar o loop de feedback
            navigation.navigate('MainTabs', {
                screen: 'Form',
                params: {
                    id: params.id,
                    nome_medicao: nomeMedicao,
                    area: areaFloat,
                    distRenques: distRenquesFloat,
                    numLinhasRenque: numLinhasRenqueInt,
                    distLinhas: distLinhasFloat,
                    distArvores: distArvoresFloat,
                    erroPermitido: erroPermitido,
                    parcelaPreliminar1: parcela1Int,
                    parcelaPreliminar2: parcela2Int,
                    parcelaPreliminar3: parcela3Int,
                    parcelaPreliminar4: parcela4Int,
                    parcelaPreliminar5: parcela5Int,
                    status: 'incompleto', // Marca como incompleto para reentrar no fluxo
                    totalParcelasRequeridas: numParcelasCalculado, // Passa o total necessário para o FormScreen
                },
            });
            return;
        }
    }
    // --- Fim da Lógica de Feedback Loop ---


    try {
      // Se passou na validação ou não havia contagens, atualiza o item
      await updateItem(
        params.id,
        nomeMedicao,
        areaFloat,
        distRenquesFloat,
        numLinhasRenqueInt,
        distLinhasFloat,
        distArvoresFloat,
        erroPermitido,
        parcela1Int, 
        parcela2Int,
        parcela3Int,
        parcela4Int,
        parcela5Int
      );

      // Redireciona para a lista ou para o resultado, dependendo do status final
      const isCompleteAfterSave = parcela1Int !== undefined && parcela2Int !== undefined && parcela3Int !== undefined && parcela4Int !== undefined && parcela5Int !== undefined;
      
      if (isCompleteAfterSave) {
        // Redireciona para o ResultScreen com os dados recalculados
        const areaPorArvoreCalc = areaPorArvore!;
        const densidadeArboreaCalc = densidadeArborea!;
        const taxaOcupacaoSolo = calcularTaxaOcupacaoSolo(
          distRenquesFloat,
          numLinhasRenqueInt,
          distLinhasFloat
        );
        const totalArvores = calcularTotalArvores(areaFloat, densidadeArboreaCalc);
        const { dimensao1, dimensao2, areaTotal } = calcularDimensoesParcela(
          distArvoresFloat,
          distRenquesFloat,
          numLinhasRenqueInt,
          distLinhasFloat
        );
        const densidadesPreliminares = [
          calcularDensidadeParcela(parcela1Int!, areaTotal),
          calcularDensidadeParcela(parcela2Int!, areaTotal),
          calcularDensidadeParcela(parcela3Int!, areaTotal),
          calcularDensidadeParcela(parcela4Int!, areaTotal),
          calcularDensidadeParcela(parcela5Int!, areaTotal),
        ];
        
        const numParcelasFinal = 5; 

        const distanciaEntreParcelas = calcularDistanciaEntreParcelas(areaFloat, numParcelasFinal);
        const mediaParcelas = (parcela1Int! + parcela2Int! + parcela3Int! + parcela4Int! + parcela5Int!) / 5;
        const totalArvoresMonitoradas = calcularTotalArvoresMonitoradas(numParcelasFinal, mediaParcelas);
        const numArvoreParcela = calcularNumArvoresParcelas(areaTotal, areaPorArvoreCalc);

        navigation.navigate('Result', {
          nome_medicao: nomeMedicao,
          area: areaFloat,
          distRenques: distRenquesFloat,
          numLinhasRenque: numLinhasRenqueInt,
          distLinhas: distLinhasFloat,
          distArvores: distArvoresFloat,
          erroPermitido,
          parcelaPreliminar1: parcela1Int!,
          parcelaPreliminar2: parcela2Int!,
          parcelaPreliminar3: parcela3Int!,
          parcelaPreliminar4: parcela4Int!,
          parcelaPreliminar5: parcela5Int!,
          areaPorArvore: areaPorArvoreCalc,
          densidadeArborea: densidadeArboreaCalc,
          taxaOcupacaoSolo,
          totalArvores,
          dimensao1,
          dimensao2,
          areaTotal,
          densidadesPreliminares,
          numParcelasCalculado: numParcelasFinal,
          distanciaEntreParcelas,
          numArvoreParcela,
          totalArvoresMonitoradas,
        });

      } else {
        navigation.navigate('MainTabs', { screen: 'List' });
      }

    } catch (error) {
      console.error('Erro ao atualizar:', error);
      Alert.alert('Erro', 'Erro ao salvar alterações.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Editar Medição" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TextInput
          label="Nome da Medição"
          value={nomeMedicao}
          onChangeText={setNomeMedicao}
          style={styles.input}
        />

        <TextInput
          label="Área a ser inventariada (ha)"
          value={area}
          onChangeText={(text) => handleDecimalInput(text, setArea)}
          keyboardType="decimal-pad"
          style={styles.input}
        />

        <TextInput
          label="Distância entre renques (m)"
          value={distRenques}
          onChangeText={(text) => handleDecimalInput(text, setDistRenques)}
          keyboardType="decimal-pad"
          style={styles.input}
        />

        <TextInput
          label="Número de linhas no renque"
          value={numLinhasRenque}
          onChangeText={(text) => handleIntegerInput(text, setNumLinhasRenque)}
          keyboardType="number-pad"
          style={styles.input}
        />

        <TextInput
          label="Distância entre as linhas no renque (m)"
          value={distLinhas}
          onChangeText={(text) => {
            if (numLinhasRenque !== '1') {
              handleDecimalInput(text, setDistLinhas);
            }
          }}
          editable={numLinhasRenque !== '1'}
          keyboardType="decimal-pad"
          style={styles.input}
        />
        {numLinhasRenque === '1' && (
          <Text style={{ color: '#666', fontSize: 12, marginTop: -8, marginBottom: 8 }}>
            Preenchido automaticamente quando há apenas 1 linha
          </Text>
        )}

        <TextInput
          label="Distância entre as árvores na linha (m)"
          value={distArvores}
          onChangeText={(text) => handleDecimalInput(text, setDistArvores)}
          keyboardType="decimal-pad"
          style={styles.input}
        />

        {areaPorArvore !== null && (
          <>
            <TextInput label="Área por árvore (m²)" value={formatarNumeroBR(areaPorArvore)} editable={false} style={styles.input} />
            <TextInput label="Densidade arbórea (árv./ha)" value={formatarNumeroBR(densidadeArborea!)} editable={false} style={styles.input} />
          </>
        )}

        <Text style={styles.sectionTitle}>Parcelas Preliminares</Text>
        <Text style={{ color: '#666', marginBottom: 16 }}>
          Preencha as contagens das 5 parcelas preliminares para salvar ou recalcular:
        </Text>

        {[
          { label: 'Parcela Preliminar 1 (árvores)', value: parcela1, setter: setParcela1 },
          { label: 'Parcela Preliminar 2 (árvores)', value: parcela2, setter: setParcela2 },
          { label: 'Parcela Preliminar 3 (árvores)', value: parcela3, setter: setParcela3 },
          { label: 'Parcela Preliminar 4 (árvores)', value: parcela4, setter: setParcela4 },
          { label: 'Parcela Preliminar 5 (árvores)', value: parcela5, setter: setParcela5 },
        ].map((item, index) => (
          <TextInput
            key={index}
            label={item.label}
            keyboardType="number-pad"
            value={item.value}
            onChangeText={(text) => handleIntegerInput(text, item.setter)}
            style={styles.input}
            placeholder='Número de árvores'
          />
        ))}

        <TouchableOpacity onPress={salvar} style={styles.button}>
          <Text style={styles.buttonText}>
            Salvar Alterações / Recalcular
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditScreen;