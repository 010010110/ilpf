import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { insertItem, insertPreliminaryItem, completeItem } from '../database/db';
import { RootStackParamList } from '@/utils/types';
import styles from '../styles/FormScreen.styles';
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
import { Appbar, TextInput, Card, Checkbox } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Config } from '@/utils/config';
import { formatarNumeroBR } from '@/utils/Numberformatter';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '@/utils/colors';
import StandardHeader from '@/components/StandartHeader';

type Etapa = 'dados_basicos' | 'resultados_preliminares' | 'contagem_parcelas';

const FormScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const params = route.params as any;

  // Estados de controle
  const [medicaoId, setMedicaoId] = useState<number | null>(params?.id || null);
  const [isEditingIncomplete, setIsEditingIncomplete] = useState(!!params?.id && params?.status === 'incompleto');
  const [etapaAtual, setEtapaAtual] = useState<Etapa>(() => {
    if (params?.id && params?.status === 'incompleto') {
      return 'resultados_preliminares';
    }
    return 'dados_basicos';
  });
  const [instrucoesAceitas, setInstrucoesAceitas] = useState(false);

  // Estados dos dados básicos
  const [nome_medicao, setNomeMedicao] = useState(params?.nome_medicao || '');
  const [area, setArea] = useState(params?.area ? String(params.area) : '');
  const [distRenques, setDistRenques] = useState(params?.distRenques ? String(params.distRenques) : '');
  const [numLinhasRenque, setNumLinhasRenque] = useState(params?.numLinhasRenque ? String(params.numLinhasRenque) : '');
  const [distLinhas, setDistLinhas] = useState(params?.distLinhas ? String(params.distLinhas) : '');
  const [distArvores, setDistArvores] = useState(params?.distArvores ? String(params.distArvores) : '');

  // Estados dos resultados calculados
  const [areaPorArvore, setAreaPorArvore] = useState<number | null>(null);
  const [densidadeArborea, setDensidadeArborea] = useState<number | null>(null);
  const [taxaOcupacaoSolo, setTaxaOcupacaoSolo] = useState<number | null>(null);
  const [dimensoesParcela, setDimensoesParcela] = useState<{
    dimensao1: number;
    dimensao2: number;
    areaTotal: number;
  } | null>(null);
  const [numArvoreParcela, setNumArvoreParcela] = useState<number | null>(null);

  // Estados das parcelas preliminares
  const [parcelaPreliminar1, setParcelaPreliminar1] = useState(params?.parcelaPreliminar1 ? String(params.parcelaPreliminar1) : '');
  const [parcelaPreliminar2, setParcelaPreliminar2] = useState(params?.parcelaPreliminar2 ? String(params.parcelaPreliminar2) : '');
  const [parcelaPreliminar3, setParcelaPreliminar3] = useState(params?.parcelaPreliminar3 ? String(params.parcelaPreliminar3) : '');
  const [parcelaPreliminar4, setParcelaPreliminar4] = useState(params?.parcelaPreliminar4 ? String(params.parcelaPreliminar4) : '');
  const [parcelaPreliminar5, setParcelaPreliminar5] = useState(params?.parcelaPreliminar5 ? String(params.parcelaPreliminar5) : '');

  // Efeito para calcular quando linha única
  useEffect(() => {
    if (numLinhasRenque === '1') {
      setDistLinhas(distRenques);
    }
  }, [numLinhasRenque, distRenques]);

  // Efeito para carregar dados se estiver editando uma medição incompleta
  useEffect(() => {
    if (isEditingIncomplete && params) {
      // Forçar o cálculo dos resultados preliminares
      if (params.area && params.distRenques && params.numLinhasRenque && params.distLinhas && params.distArvores) {
        calcularResultadosPreliminares();
      }
    }
  }, [isEditingIncomplete, area, distRenques, numLinhasRenque, distLinhas, distArvores]);

  // Função para calcular resultados preliminares
  const calcularResultadosPreliminares = () => {
    if (!area || !distRenques || !numLinhasRenque || !distLinhas || !distArvores) {
      return;
    }

    try {
      const areaCalculada = calcularAreaPorArvore(
        parseFloat(distRenques),
        parseFloat(distArvores),
        parseInt(numLinhasRenque),
        parseFloat(distLinhas)
      );
      const densidadeCalculada = calcularDensidadeArborea(areaCalculada);
      const taxaCalculada = calcularTaxaOcupacaoSolo(
        parseFloat(distRenques),
        parseInt(numLinhasRenque),
        parseFloat(distLinhas)
      );
      const dimensoes = calcularDimensoesParcela(
        parseFloat(distArvores),
        parseFloat(distRenques),
        parseInt(numLinhasRenque),
        parseFloat(distLinhas)
      );
      const arvoresPorParcela = calcularNumArvoresParcelas(dimensoes.areaTotal, areaCalculada);

      setAreaPorArvore(areaCalculada);
      setDensidadeArborea(densidadeCalculada);
      setTaxaOcupacaoSolo(taxaCalculada);
      setDimensoesParcela(dimensoes);
      setNumArvoreParcela(arvoresPorParcela);
    } catch (error) {
      console.error('Erro ao calcular resultados preliminares:', error);
      Alert.alert('Erro', 'Erro nos cálculos. Verifique os dados inseridos.');
    }
  };

  // Validação dos campos obrigatórios da primeira etapa
  const validarDadosBasicos = () => {
    if (!nome_medicao.trim()) {
      Alert.alert('Campo obrigatório', 'Preencha o nome da medição.');
      return false;
    }
    if (!area.trim()) {
      Alert.alert('Campo obrigatório', 'Preencha a área.');
      return false;
    }
    if (!distRenques.trim()) {
      Alert.alert('Campo obrigatório', 'Preencha a distância entre renques.');
      return false;
    }
    if (!numLinhasRenque.trim()) {
      Alert.alert('Campo obrigatório', 'Preencha o número de linhas no renque.');
      return false;
    }
    if (!distLinhas.trim()) {
      Alert.alert('Campo obrigatório', 'Preencha a distância entre linhas.');
      return false;
    }
    if (!distArvores.trim()) {
      Alert.alert('Campo obrigatório', 'Preencha a distância entre árvores.');
      return false;
    }
    
    // Validação de valores numéricos
    if (isNaN(parseFloat(area)) || parseFloat(area) <= 0) {
      Alert.alert('Valor inválido', 'A área deve ser um número maior que zero.');
      return false;
    }
    if (isNaN(parseFloat(distRenques)) || parseFloat(distRenques) <= 0) {
      Alert.alert('Valor inválido', 'A distância entre renques deve ser um número maior que zero.');
      return false;
    }
    if (isNaN(parseInt(numLinhasRenque)) || parseInt(numLinhasRenque) <= 0) {
      Alert.alert('Valor inválido', 'O número de linhas no renque deve ser um número maior que zero.');
      return false;
    }
    if (isNaN(parseFloat(distLinhas)) || parseFloat(distLinhas) <= 0) {
      Alert.alert('Valor inválido', 'A distância entre linhas deve ser um número maior que zero.');
      return false;
    }
    if (isNaN(parseFloat(distArvores)) || parseFloat(distArvores) <= 0) {
      Alert.alert('Valor inválido', 'A distância entre árvores deve ser um número maior que zero.');
      return false;
    }
    
    return true;
  };

  // Função para avançar para resultados preliminares
  const avancarParaResultados = async () => {
    if (!validarDadosBasicos()) {
      return;
    }

    calcularResultadosPreliminares();

    try {
      // Salvar dados preliminares se não estiver editando
      if (!isEditingIncomplete) {
        const erroPermitido = Config.erroPermitido;
        const novoId = await insertPreliminaryItem(
          nome_medicao.trim(),
          parseFloat(area),
          parseFloat(distRenques),
          parseInt(numLinhasRenque),
          parseFloat(distLinhas),
          parseFloat(distArvores),
          erroPermitido
        );
        setMedicaoId(novoId);
        setIsEditingIncomplete(true);
      }

      setEtapaAtual('resultados_preliminares');
    } catch (error) {
      console.error('Erro ao salvar dados preliminares:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados preliminares. Tente novamente.');
    }
  };

  // Função para avançar para contagem de parcelas
  const avancarParaContagem = () => {
    if (!instrucoesAceitas) {
      Alert.alert('Instruções', 'Você deve ler e aceitar as instruções para continuar.');
      return;
    }
    setEtapaAtual('contagem_parcelas');
  };

  // Função para voltar para dados básicos
  const voltarParaDadosBasicos = () => {
    setEtapaAtual('dados_basicos');
    setInstrucoesAceitas(false);
  };

  // Função para voltar para resultados preliminares
  const voltarParaResultados = () => {
    setEtapaAtual('resultados_preliminares');
  };

  // Validação das parcelas
  const validarParcelas = () => {
    const parcelas = [parcelaPreliminar1, parcelaPreliminar2, parcelaPreliminar3, parcelaPreliminar4, parcelaPreliminar5];
    
    for (let i = 0; i < parcelas.length; i++) {
      if (!parcelas[i].trim()) {
        Alert.alert('Campo obrigatório', `Preencha a parcela preliminar ${i + 1}.`);
        return false;
      }
      if (isNaN(parseInt(parcelas[i])) || parseInt(parcelas[i]) < 0) {
        Alert.alert('Valor inválido', `A parcela preliminar ${i + 1} deve ser um número maior ou igual a zero.`);
        return false;
      }
    }
    
    return true;
  };

  // Função para salvar dados finais
  const salvarDados = async () => {
    if (!validarParcelas()) {
      return;
    }

    try {
      const erroPermitido = Config.erroPermitido;

      if (medicaoId) {
        // Completar medição existente
        await completeItem(
          medicaoId,
          parseInt(parcelaPreliminar1),
          parseInt(parcelaPreliminar2),
          parseInt(parcelaPreliminar3),
          parseInt(parcelaPreliminar4),
          parseInt(parcelaPreliminar5)
        );
      } else {
        // Criar nova medição completa (fallback)
        await insertItem(
          nome_medicao.trim(),
          parseFloat(area),
          parseFloat(distRenques),
          parseInt(numLinhasRenque),
          parseFloat(distLinhas),
          parseFloat(distArvores),
          erroPermitido,
          parseInt(parcelaPreliminar1),
          parseInt(parcelaPreliminar2),
          parseInt(parcelaPreliminar3),
          parseInt(parcelaPreliminar4),
          parseInt(parcelaPreliminar5)
        );
      }

      // Calcular todos os resultados finais
      const areaPorArvoreCalc = areaPorArvore!;
      const densidadeArboreaCalc = densidadeArborea!;
      const totalArvores = calcularTotalArvores(parseFloat(area), densidadeArboreaCalc);
      const { dimensao1, dimensao2, areaTotal } = dimensoesParcela!;

      const densidadesPreliminares = [
        calcularDensidadeParcela(parseInt(parcelaPreliminar1), areaTotal),
        calcularDensidadeParcela(parseInt(parcelaPreliminar2), areaTotal),
        calcularDensidadeParcela(parseInt(parcelaPreliminar3), areaTotal),
        calcularDensidadeParcela(parseInt(parcelaPreliminar4), areaTotal),
        calcularDensidadeParcela(parseInt(parcelaPreliminar5), areaTotal),
      ];

      const numParcelasCalculado = calcularNumParcelas(
        parseFloat(area),
        areaTotal,
        densidadesPreliminares,
        erroPermitido
      );

      const distanciaEntreParcelas = calcularDistanciaEntreParcelas(
        parseFloat(area),
        numParcelasCalculado
      );

      const mediaParcelas = Math.round(
        (parseInt(parcelaPreliminar1) +
          parseInt(parcelaPreliminar2) +
          parseInt(parcelaPreliminar3) +
          parseInt(parcelaPreliminar4) +
          parseInt(parcelaPreliminar5)) / 5
      );

      const totalArvoresMonitoradas = calcularTotalArvoresMonitoradas(
        numParcelasCalculado,
        mediaParcelas
      );

      // Navegar para resultados finais
      navigation.navigate('Result', {
        nome_medicao: nome_medicao.trim(),
        area: parseFloat(area),
        distRenques: parseFloat(distRenques),
        numLinhasRenque: parseInt(numLinhasRenque),
        distLinhas: parseFloat(distLinhas),
        distArvores: parseFloat(distArvores),
        erroPermitido,
        parcelaPreliminar1: parseInt(parcelaPreliminar1),
        parcelaPreliminar2: parseInt(parcelaPreliminar2),
        parcelaPreliminar3: parseInt(parcelaPreliminar3),
        parcelaPreliminar4: parseInt(parcelaPreliminar4),
        parcelaPreliminar5: parseInt(parcelaPreliminar5),
        areaPorArvore: areaPorArvoreCalc,
        densidadeArborea: densidadeArboreaCalc,
        taxaOcupacaoSolo: taxaOcupacaoSolo!,
        totalArvores,
        dimensao1,
        dimensao2,
        areaTotal,
        densidadesPreliminares,
        numParcelasCalculado,
        distanciaEntreParcelas,
        numArvoreParcela: numArvoreParcela!,
        totalArvoresMonitoradas,
      });

      // Limpar formulário
      resetFormulario();

    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar os dados. Tente novamente.');
    }
  };

  // Função para resetar formulário
  const resetFormulario = () => {
    setNomeMedicao('');
    setArea('');
    setDistRenques('');
    setNumLinhasRenque('');
    setDistLinhas('');
    setDistArvores('');
    setParcelaPreliminar1('');
    setParcelaPreliminar2('');
    setParcelaPreliminar3('');
    setParcelaPreliminar4('');
    setParcelaPreliminar5('');
    setEtapaAtual('dados_basicos');
    setInstrucoesAceitas(false);
    setAreaPorArvore(null);
    setDensidadeArborea(null);
    setTaxaOcupacaoSolo(null);
    setDimensoesParcela(null);
    setNumArvoreParcela(null);
    setMedicaoId(null);
    setIsEditingIncomplete(false);
  };

  // Renderizar indicador de etapas
  const renderIndicadorEtapas = () => {
    const etapas = [
      { id: 'dados_basicos', nome: 'Dados Básicos', numero: 1 },
      { id: 'resultados_preliminares', nome: 'Resultados', numero: 2 },
      { id: 'contagem_parcelas', nome: 'Contagem', numero: 3 }
    ];

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
        {etapas.map((etapa, index) => (
          <React.Fragment key={etapa.id}>
            <View style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: etapaAtual === etapa.id ? '#859B48' : '#e0e0e0',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{
                color: etapaAtual === etapa.id ? 'white' : '#666',
                fontWeight: 'bold',
                fontSize: 12
              }}>
                {etapa.numero}
              </Text>
            </View>
            {index < etapas.length - 1 && (
              <View style={{
                width: 40,
                height: 2,
                backgroundColor: '#e0e0e0',
                marginHorizontal: 8
              }} />
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  // Renderizar etapa de dados básicos
  const renderDadosBasicos = () => (
    <>
      <Text style={styles.sectionTitle}>Dados Básicos da Área</Text>
      <Text style={{ color: '#666', marginBottom: 16 }}>
        Preencha as informações básicas da área a ser inventariada:
      </Text>

      <TextInput
        label="Nome da Medição"
        value={nome_medicao}
        onChangeText={setNomeMedicao}
        style={styles.input}
      />

      <TextInput
        label="Área a ser inventariada (ha)"
        value={area}
        onChangeText={setArea}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TextInput
        label="Distância entre renques (m)"
        value={distRenques}
        onChangeText={setDistRenques}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TextInput
        label="Número de linhas no renque"
        value={numLinhasRenque}
        onChangeText={setNumLinhasRenque}
        keyboardType="number-pad"
        style={styles.input}
      />

      <TextInput
        label="Distância entre as linhas no renque (m)"
        value={distLinhas}
        onChangeText={(text) => numLinhasRenque !== '1' && setDistLinhas(text)}
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
        onChangeText={setDistArvores}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TouchableOpacity onPress={avancarParaResultados} style={styles.button}>
        <Text style={styles.buttonText}>Calcular e Avançar</Text>
      </TouchableOpacity>
    </>
  );

  // Renderizar etapa de resultados preliminares
  const renderResultadosPreliminares = () => {
    // Validação de segurança - se os cálculos ainda não foram feitos, recalcular
    if (!areaPorArvore || !densidadeArborea || !taxaOcupacaoSolo || !dimensoesParcela || !numArvoreParcela) {
      // Tentar recalcular se temos todos os dados necessários
      if (area && distRenques && numLinhasRenque && distLinhas && distArvores) {
        calcularResultadosPreliminares();
      }
      
      // Se ainda não temos os resultados, mostrar loading
      if (!areaPorArvore || !dimensoesParcela) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
            <Text style={{ color: colors.text.secondary, textAlign: 'center', marginBottom: 16 }}>
              Calculando resultados preliminares...
            </Text>
            <TouchableOpacity 
              onPress={() => calcularResultadosPreliminares()}
              style={[styles.buttonSecondary, { marginTop: 16 }]}
            >
              <Text style={styles.buttonTextOutlined}>Recalcular</Text>
            </TouchableOpacity>
          </View>
        );
      }
    }

    return (
      <>
        <Text style={styles.sectionTitle}>Resultados Preliminares</Text>
        <Text style={{ color: '#666', marginBottom: 16 }}>
          Baseado nos dados informados, estes são os parâmetros calculados:
        </Text>

        <Card style={{ marginBottom: 16, padding: 16, backgroundColor: '#f8f9fa' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#859B48' }}>
            Parâmetros de Plantio
          </Text>

          <View style={styles.resultRow}>
            <Text style={styles.label}>Área média por árvore:</Text>
            <Text style={{ fontWeight: 'bold' }}>{formatarNumeroBR(areaPorArvore)} m²</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.label}>Densidade de plantio:</Text>
            <Text style={{ fontWeight: 'bold' }}>{densidadeArborea} árvores/ha</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.label}>Taxa de ocupação do solo:</Text>
            <Text style={{ fontWeight: 'bold' }}>{formatarNumeroBR(taxaOcupacaoSolo)}%</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.label}>Árvores por parcela amostral:</Text>
            <Text style={{ fontWeight: 'bold' }}>{numArvoreParcela}</Text>
          </View>
        </Card>

        <Card style={{ marginBottom: 16, padding: 16, backgroundColor: '#f8f9fa' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#859B48' }}>
            Dimensões da Parcela Amostral
          </Text>

          <View style={styles.resultRow}>
            <Text style={styles.label}>Largura:</Text>
            <Text style={{ fontWeight: 'bold' }}>{formatarNumeroBR(dimensoesParcela.dimensao2)} m</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.label}>Comprimento:</Text>
            <Text style={{ fontWeight: 'bold' }}>{formatarNumeroBR(dimensoesParcela.dimensao1)} m</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.label}>Área:</Text>
            <Text style={{ fontWeight: 'bold' }}>{formatarNumeroBR(dimensoesParcela.areaTotal)} m²</Text>
          </View>
        </Card>

        <Card style={{ marginBottom: 16, padding: 16, backgroundColor: '#fff3cd', borderLeftWidth: 4, borderLeftColor: '#ffc107' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#856404' }}>
            📋 Instruções para o Trabalho de Campo
          </Text>

          <Text style={{ marginBottom: 8, color: '#856404', lineHeight: 20 }}>
            Para continuar com o inventário florestal, siga estas etapas:
          </Text>

          <Text style={{ marginBottom: 6, color: '#856404' }}>
            1️⃣ Vá ao campo e demarque <Text style={{ fontWeight: 'bold' }}>5 parcelas preliminares</Text>
          </Text>

          <Text style={{ marginBottom: 6, color: '#856404' }}>
            2️⃣ Cada parcela deve ter <Text style={{ fontWeight: 'bold' }}>{formatarNumeroBR(dimensoesParcela.dimensao1)} m × {formatarNumeroBR(dimensoesParcela.dimensao2)} m</Text>
          </Text>

          <Text style={{ marginBottom: 6, color: '#856404' }}>
            3️⃣ Conte <Text style={{ fontWeight: 'bold' }}>todas as árvores</Text> presentes em cada parcela
          </Text>

          <Text style={{ marginBottom: 6, color: '#856404' }}>
            4️⃣ Anote as contagens e retorne ao app para inserir os dados
          </Text>

          <Text style={{ marginBottom: 12, color: '#856404' }}>
            5️⃣ O sistema calculará automaticamente o número ideal de parcelas definitivas
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <Checkbox
              status={instrucoesAceitas ? 'checked' : 'unchecked'}
              onPress={() => setInstrucoesAceitas(!instrucoesAceitas)}
              color="#ffc107"
            />
            <Text style={{ marginLeft: 8, color: '#856404', flex: 1 }}>
              Li e compreendi as instruções. Estou pronto para ir ao campo.
            </Text>
          </View>
        </Card>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
          <TouchableOpacity
            onPress={voltarParaDadosBasicos}
            style={[styles.button, { backgroundColor: '#6c757d', flex: 1 }]}
          >
            <Text style={styles.buttonText}>← Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={avancarParaContagem}
            style={[
              styles.button,
              { 
                flex: 1,
                backgroundColor: instrucoesAceitas ? '#859B48' : '#cccccc'
              }
            ]}
            disabled={!instrucoesAceitas}
          >
            <Text style={[styles.buttonText, { color: instrucoesAceitas ? 'white' : '#666' }]}>
              Prosseguir →
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  // Renderizar etapa de contagem de parcelas
  const renderContagemParcelas = () => (
    <>
      <Text style={styles.sectionTitle}>Contagem das Parcelas Preliminares</Text>
      <Text style={{ color: '#666', marginBottom: 16 }}>
        Insira o número de árvores contadas em cada uma das 5 parcelas preliminares:
      </Text>

      {[1, 2, 3, 4, 5].map((numero) => (
        <TextInput
          key={numero}
          label={`Parcela Preliminar ${numero} (número de árvores)`}
          value={
            numero === 1 ? parcelaPreliminar1 :
            numero === 2 ? parcelaPreliminar2 :
            numero === 3 ? parcelaPreliminar3 :
            numero === 4 ? parcelaPreliminar4 :
            parcelaPreliminar5
          }
          onChangeText={
            numero === 1 ? setParcelaPreliminar1 :
            numero === 2 ? setParcelaPreliminar2 :
            numero === 3 ? setParcelaPreliminar3 :
            numero === 4 ? setParcelaPreliminar4 :
            setParcelaPreliminar5
          }
          keyboardType="number-pad"
          style={styles.input}

          placeholder="Ex: 8"
        />
      ))}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
        <TouchableOpacity
          onPress={voltarParaResultados}
          style={[styles.button, { backgroundColor: '#6c757d', flex: 1 }]}
        >
          <Text style={styles.buttonText}>← Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={salvarDados}
          style={[styles.button, { flex: 1 }]}
        >
          <Text style={styles.buttonText}>Finalizar Inventário</Text>
        </TouchableOpacity>
      </View>
    </>
  );
    const getHeaderTitle = () => {
    if (isEditingIncomplete) {
      return "Completar Medição";
    }
    
    switch (etapaAtual) {
      case 'dados_basicos':
        return "Nova Medição";
      case 'resultados_preliminares':
        return "Resultados Preliminares";
      case 'contagem_parcelas':
        return "Contagem das Parcelas";
      default:
        return "Nova Medição";
    }
  };

  const getHeaderSubtitle = () => {
    switch (etapaAtual) {
      case 'dados_basicos':
        return "Informações básicas";
      case 'resultados_preliminares':
        return "Cálculos preliminares";
      case 'contagem_parcelas':
        return "Contagem final";
      default:
        return undefined;
    }
  };

  const getHeaderIcon = () => {
    switch (etapaAtual) {
      case 'dados_basicos':
        return "clipboard-edit";
      case 'resultados_preliminares':
        return "calculator-variant";
      case 'contagem_parcelas':
        return "counter";
      default:
        return "clipboard-list";
    }
  };
  const headerActions = [
      {
        icon: 'help-circle-outline',
        label: 'Ajuda',
        onPress: () => {
          Alert.alert('Ajuda', 'Para realizar o preenchimeneto do formulario de forma mais intuitiva, ele foi separado nas seguintes etapas, 1) preencher as informações basicas sobre a área a ser invventariada, 2) deve ler com atenção as instruções e realizar as etapas descritas nela, 3) deve finalizar de preencher as informações com os dados obtidos atravez da etapa anterior');
        },
      }
    ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header Padronizado */}
      <StandardHeader
        title={getHeaderTitle()}
        subtitle={getHeaderSubtitle()}
        icon={getHeaderIcon()}
        rightActions={headerActions}
      />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {renderIndicadorEtapas()}
        
        {etapaAtual === 'dados_basicos' && renderDadosBasicos()}
        {etapaAtual === 'resultados_preliminares' && renderResultadosPreliminares()}
        {etapaAtual === 'contagem_parcelas' && renderContagemParcelas()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FormScreen;