import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Appbar, TextInput, Text } from 'react-native-paper';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/FormScreen.styles';
import { updateItem } from '../database/db';
import {
  calcularAreaPorArvore,
  calcularDensidadeArborea,
  calcularTaxaOcupacaoSolo,
  calcularTotalArvores,
  calcularDimensoesParcela,
  calcularDensidadeParcela,
  calcularNumParcelas,
  calcularDistanciaEntreParcelas,
  calcularTotalArvoresMonitoradas,
  calcularNumArvoresParcelas,
} from '@/utils/calculos';
import { formatarNumeroBR } from '@/utils/Numberformatter';
import { Config } from '@/utils/config';
import { RootStackParamList } from '@/utils/types';

const EditScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const params = route.params as any;

  const [nome, setNome] = useState(params.nome_medicao);
  const [area, setArea] = useState(String(params.area));
  const [renques, setRenques] = useState(String(params.distRenques));
  const [linhasRenque, setLinhasRenque] = useState(String(params.numLinhasRenque));
  const [distLinhas, setDistLinhas] = useState(String(params.distLinhas));
  const [distArvores, setDistArvores] = useState(String(params.distArvores));
  const [parcela1, setParcela1] = useState(String(params.parcelaPreliminar1));
  const [parcela2, setParcela2] = useState(String(params.parcelaPreliminar2));
  const [parcela3, setParcela3] = useState(String(params.parcelaPreliminar3));
  const [parcela4, setParcela4] = useState(String(params.parcelaPreliminar4));
  const [parcela5, setParcela5] = useState(String(params.parcelaPreliminar5));

  const [areaPorArvore, setAreaPorArvore] = useState<number | null>(null);
  const [densidadeArborea, setDensidadeArborea] = useState<number | null>(null);

  useEffect(() => {
    if (linhasRenque === '1') {
      setDistLinhas(renques);
    }
  }, [linhasRenque, renques]);

  useEffect(() => {
    const preenchidos = area && renques && linhasRenque && distLinhas && distArvores;
    if (preenchidos) {
      const areaCalc = calcularAreaPorArvore(
        parseFloat(renques),
        parseFloat(distArvores),
        parseInt(linhasRenque),
        parseFloat(distLinhas)
      );
      const densidade = calcularDensidadeArborea(areaCalc);
      setAreaPorArvore(areaCalc);
      setDensidadeArborea(densidade);
    } else {
      setAreaPorArvore(null);
      setDensidadeArborea(null);
    }
  }, [area, renques, linhasRenque, distLinhas, distArvores]);

  const salvar = async () => {
    const erroPermitido = Config.erroPermitido;
    try {

      console.log('Valores enviados para updateItem:', {
        id: params.id,
        nome,
        area: parseFloat(area),
        renques: parseFloat(renques),
        linhasRenque: parseInt(linhasRenque),
        distLinhas: parseFloat(distLinhas),
        distArvores: parseFloat(distArvores),
        erroPermitido,
        parcela1: parseInt(parcela1),
        parcela2: parseInt(parcela2),
        parcela3: parseInt(parcela3),
        parcela4: parseInt(parcela4),
        parcela5: parseInt(parcela5),
      });


      await updateItem(
        params.id,
        nome,
        parseFloat(area),
        parseFloat(renques),
        parseInt(linhasRenque),
        parseFloat(distLinhas),
        parseFloat(distArvores),
        erroPermitido,
        parseInt(parcela1),
        parseInt(parcela2),
        parseInt(parcela3),
        parseInt(parcela4),
        parseInt(parcela5)
      );

      const areaPorArvoreCalc = areaPorArvore!;
      const densidadeArboreaCalc = densidadeArborea!;
      const taxaOcupacaoSolo = calcularTaxaOcupacaoSolo(
        parseFloat(renques),
        parseInt(linhasRenque),
        parseFloat(distLinhas)
      );
      const totalArvores = calcularTotalArvores(parseFloat(area), densidadeArboreaCalc);
      const { dimensao1, dimensao2, areaTotal } = calcularDimensoesParcela(
        parseFloat(distArvores),
        parseFloat(renques),
        parseInt(linhasRenque),
        parseFloat(distLinhas)
      );
      const densidadesPreliminares = [
        calcularDensidadeParcela(+parcela1, areaTotal),
        calcularDensidadeParcela(+parcela2, areaTotal),
        calcularDensidadeParcela(+parcela3, areaTotal),
        calcularDensidadeParcela(+parcela4, areaTotal),
        calcularDensidadeParcela(+parcela5, areaTotal),
      ];
      const numParcelasCalculado = calcularNumParcelas(
        parseFloat(area),
        areaTotal,
        densidadesPreliminares,
        erroPermitido
      );
      const distanciaEntreParcelas = calcularDistanciaEntreParcelas(parseFloat(area), numParcelasCalculado);
      const mediaParcelas = (parseInt(parcela1) + parseInt(parcela2) + parseInt(parcela3) + parseInt(parcela4) + parseInt(parcela5)) / 5;
      const totalArvoresMonitoradas = calcularTotalArvoresMonitoradas(numParcelasCalculado, mediaParcelas);
      const numArvoreParcela = calcularNumArvoresParcelas(areaTotal, areaPorArvoreCalc);

      navigation.navigate('MainTabs', {
        screen: 'Result', 
        params: {
        nome_medicao: nome,
        area: parseFloat(area),
        distRenques: parseFloat(renques),
        numLinhasRenque: parseInt(linhasRenque),
        distLinhas: parseFloat(distLinhas),
        distArvores: parseFloat(distArvores),
        erroPermitido,
        parcelaPreliminar1: parseInt(parcela1),
        parcelaPreliminar2: parseInt(parcela2),
        parcelaPreliminar3: parseInt(parcela3),
        parcelaPreliminar4: parseInt(parcela4),
        parcelaPreliminar5: parseInt(parcela5),
        areaPorArvore: areaPorArvoreCalc,
        densidadeArborea: densidadeArboreaCalc,
        taxaOcupacaoSolo,
        totalArvores,
        dimensao1,
        dimensao2,
        areaTotal,
        densidadesPreliminares,
        numParcelasCalculado,
        distanciaEntreParcelas,
        numArvoreParcela,
        totalArvoresMonitoradas,
        },
      });
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao salvar alterações.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Editar Medição" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TextInput label="Nome da Medição" value={nome} onChangeText={setNome} style={styles.input} />
        <TextInput label="Área (ha)" value={area} onChangeText={setArea} style={styles.input} keyboardType="number-pad" />
        <TextInput label="Distância entre renques (m)" value={renques} onChangeText={setRenques} style={styles.input}  keyboardType="number-pad"/>
        <TextInput label="Número de linhas no renque" value={linhasRenque} onChangeText={setLinhasRenque} style={styles.input} keyboardType="number-pad"/>
        <TextInput
          label="Distância entre linhas (m)"
          value={distLinhas}
          keyboardType="number-pad"
          onChangeText={(text) => linhasRenque !== '1' && setDistLinhas(text)}
          editable={linhasRenque !== '1'}
          style={styles.input}
        />
        <TextInput label="Distância entre árvores (m)" value={distArvores} onChangeText={setDistArvores} style={styles.input} keyboardType="number-pad"/>

        {areaPorArvore !== null && (
          <>
            <TextInput label="Área por árvore (m²)" value={formatarNumeroBR(areaPorArvore)} editable={false} style={styles.input} />
            <TextInput label="Densidade arbórea (árv./ha)" value={formatarNumeroBR(densidadeArborea!)} editable={false} style={styles.input} />
          </>
        )}

        {[1, 2, 3, 4, 5].map((i) => (
          <TextInput
            key={i}
            label={`Parcela Preliminar ${i} (árvores)`}
            keyboardType="number-pad"
            value={
              i === 1 ? parcela1 :
                i === 2 ? parcela2 :
                  i === 3 ? parcela3 :
                    i === 4 ? parcela4 :
                      parcela5
            }
            onChangeText={
              i === 1 ? setParcela1 :
                i === 2 ? setParcela2 :
                  i === 3 ? setParcela3 :
                    i === 4 ? setParcela4 :
                      setParcela5
            }
            style={styles.input}
          />
        ))}

        <TouchableOpacity onPress={salvar} style={styles.button}>
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditScreen;
