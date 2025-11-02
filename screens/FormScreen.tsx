import React, { useEffect, useState, useCallback } from 'react';
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
import { alertarVirgula, formatarNumeroBR, limparEntradaDecimal, limparEntradaInteira } from '@/utils/Numberformatter';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '@/utils/colors';
import StandardHeader from '@/components/StandartHeader';

type Etapa = 'dados_basicos' | 'resultados_preliminares' | 'contagem_parcelas' | 'extra_plots_needed';

const FormScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const params = route.params as any;

  const [medicaoId, setMedicaoId] = useState<number | null>(params?.id || null);
  const [isEditingIncomplete, setIsEditingIncomplete] = useState(!!params?.id && params?.status === 'incompleto');
  const [etapaAtual, setEtapaAtual] = useState<Etapa>(() => {
    // Se vier do EditScreen com totalParcelasRequeridas > 5, vai direto para a contagem
    if (params?.id && params?.totalParcelasRequeridas && params.totalParcelasRequeridas > 5) {
      return 'contagem_parcelas';
    }
    if (params?.id && params?.status === 'incompleto') {
      return 'resultados_preliminares';
    }
    return 'dados_basicos';
  });
  const [instrucoesAceitas, setInstrucoesAceitas] = useState(false);

  // Estados para dados básicos
  const [nome_medicao, setNomeMedicao] = useState(params?.nome_medicao || '');
  const [area, setArea] = useState(params?.area ? String(params.area) : '');
  const [distRenques, setDistRenques] = useState(params?.distRenques ? String(params.distRenques) : '');
  const [numLinhasRenque, setNumLinhasRenque] = useState(params?.numLinhasRenque ? String(params.numLinhasRenque) : '');
  const [distLinhas, setDistLinhas] = useState(params?.distLinhas ? String(params.distLinhas) : '');
  const [distArvores, setDistArvores] = useState(params?.distArvores ? String(params.distArvores) : '');

  // Estados para resultados preliminares
  const [areaPorArvore, setAreaPorArvore] = useState<number | null>(null);
  const [densidadeArborea, setDensidadeArborea] = useState<number | null>(null);
  const [taxaOcupacaoSolo, setTaxaOcupacaoSolo] = useState<number | null>(null);
  const [dimensoesParcela, setDimensoesParcela] = useState<{
    dimensao1: number;
    dimensao2: number;
    areaTotal: number;
  } | null>(null);
  const [numArvoreParcela, setNumArvoreParcela] = useState<number | null>(null);

  // Estados para contagem (5 fixas + extras dinâmicas)
  const [parcelaPreliminar1, setParcelaPreliminar1] = useState(params?.parcelaPreliminar1 ? String(params.parcelaPreliminar1) : '');
  const [parcelaPreliminar2, setParcelaPreliminar2] = useState(params?.parcelaPreliminar2 ? String(params.parcelaPreliminar2) : '');
  const [parcelaPreliminar3, setParcelaPreliminar3] = useState(params?.parcelaPreliminar3 ? String(params.parcelaPreliminar3) : '');
  const [parcelaPreliminar4, setParcelaPreliminar4] = useState(params?.parcelaPreliminar4 ? String(params.parcelaPreliminar4) : '');
  const [parcelaPreliminar5, setParcelaPreliminar5] = useState(params?.parcelaPreliminar5 ? String(params.parcelaPreliminar5) : '');
  
  // Inicializa o total de parcelas a serem preenchidas, aceitando o valor da rota
  const [totalParcelasRequeridas, setTotalParcelasRequeridas] = useState(params?.totalParcelasRequeridas || 5); 
  
  // Define o número de campos extras baseados no total requerido da rota
  const initialExtraPlotsCount = (params?.totalParcelasRequeridas > 5 && params.totalParcelasRequeridas) 
    ? params.totalParcelasRequeridas - 5 
    : 0;
  
  // Como o usuário precisa preencher as contagens extras, inicializamos vazias
  const [contagensParcelasExtras, setContagensParcelasExtras] = useState<string[]>(
      Array(initialExtraPlotsCount).fill('')
  );

  // Estado para feedback loop (usado após o primeiro cálculo)
  const [plotsNeededData, setPlotsNeededData] = useState<{
    numNeeded: number;
    dimensao1: number;
    dimensao2: number;
    areaTotal: number;
    erroPermitido: number;
  } | null>(null);


  // Funções de manipulação de input
  const handleDecimalInput = useCallback((texto: string, setter: (value: string) => void) => {
    if (texto.includes(',')) {
      alertarVirgula();
      setter('');
      return;
    }
    const valorLimpo = limparEntradaDecimal(texto);
    setter(valorLimpo);
  }, []);

  const handleIntegerInput = useCallback((texto: string, setter: (value: string) => void) => {
    if (texto.includes(',')) {
      alertarVirgula();
      setter('');
      return;
    }
    const valorLimpo = limparEntradaInteira(texto);
    setter(valorLimpo);
  }, []);

  const handleExtraPlotInput = (text: string, index: number) => {
    const valorLimpo = limparEntradaInteira(text.includes(',') ? text.replace(',', '.') : text);
    setContagensParcelasExtras(prev => {
        const newArray = [...prev];
        newArray[index] = valorLimpo;
        return newArray;
    });
  };

  // Efeitos de inicialização e cálculo preliminar
  useEffect(() => {
    if (numLinhasRenque === '1') {
      setDistLinhas(distRenques);
    }
  }, [numLinhasRenque, distRenques]);

  useEffect(() => {
    if (isEditingIncomplete && params) {
      if (params.area && params.distRenques && params.numLinhasRenque && params.distLinhas && params.distArvores) {
        calcularResultadosPreliminares();
      }
    }
  }, [isEditingIncomplete, area, distRenques, numLinhasRenque, distLinhas, distArvores]);

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

  const validarDadosBasicos = useCallback(() => {
    if (!nome_medicao.trim()) {
      Alert.alert('Campo obrigatório', 'Preencha o nome da medição.');
      return false;
    }
    if (!area.trim() || isNaN(parseFloat(area)) || parseFloat(area) <= 0) {
      Alert.alert('Valor inválido', 'A Área deve ser um número maior que zero.');
      return false;
    }
    if (!distRenques.trim() || isNaN(parseFloat(distRenques)) || parseFloat(distRenques) <= 0) {
      Alert.alert('Valor inválido', 'A Distância entre renques deve ser um número maior que zero.');
      return false;
    }
    if (!numLinhasRenque.trim() || isNaN(parseInt(numLinhasRenque)) || parseInt(numLinhasRenque) <= 0) {
      Alert.alert('Valor inválido', 'O Número de linhas no renque deve ser um número inteiro maior que zero.');
      return false;
    }
    if (!distLinhas.trim() || isNaN(parseFloat(distLinhas)) || parseFloat(distLinhas) <= 0) {
      Alert.alert('Valor inválido', 'A Distância entre linhas deve ser um número maior que zero.');
      return false;
    }
    if (!distArvores.trim() || isNaN(parseFloat(distArvores)) || parseFloat(distArvores) <= 0) {
      Alert.alert('Valor inválido', 'A Distância entre árvores deve ser um número maior que zero.');
      return false;
    }
    return true;
  }, [nome_medicao, area, distRenques, numLinhasRenque, distLinhas, distArvores]);

  const avancarParaResultados = async () => {
    if (!validarDadosBasicos()) {
      return;
    }

    calcularResultadosPreliminares();

    try {
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

  const avancarParaContagem = () => {
    if (!instrucoesAceitas) {
      Alert.alert('Instruções', 'Você deve ler e aceitar as instruções para continuar.');
      return;
    }
    setEtapaAtual('contagem_parcelas');
    // Se não veio de um loop de feedback, volta para 5
    if (totalParcelasRequeridas <= 5) {
        setTotalParcelasRequeridas(5); 
        setContagensParcelasExtras(Array(0).fill(''));
    }
  };

  const voltarParaDadosBasicos = () => {
    setEtapaAtual('dados_basicos');
    setInstrucoesAceitas(false);
    setPlotsNeededData(null);
  };

  const voltarParaResultados = () => {
    setEtapaAtual('resultados_preliminares');
    setInstrucoesAceitas(false);
    setPlotsNeededData(null);
  };
  
  const retornarParaContagem = () => {
    if (!instrucoesAceitas) {
        Alert.alert('Instruções', 'Você deve marcar que compreendeu as instruções para continuar.');
        return;
    }
    
    if (plotsNeededData && plotsNeededData.numNeeded > 5) {
        setTotalParcelasRequeridas(plotsNeededData.numNeeded);
        setContagensParcelasExtras(Array(plotsNeededData.numNeeded - 5).fill('')); // Cria novos campos vazios
        setEtapaAtual('contagem_parcelas');
        setInstrucoesAceitas(false); // Reinicia para a próxima iteração
        setPlotsNeededData(null);
    }
  };


  const validarParcelas = (plots: (string | number)[]) => {
    if (plots.length !== totalParcelasRequeridas) {
        Alert.alert('Erro de preenchimento', `Por favor, preencha as ${totalParcelasRequeridas} parcelas.`);
        return false;
    }
    
    for (let i = 0; i < plots.length; i++) {
        const value = plots[i];
        if (typeof value === 'string' && !value.trim()) {
            Alert.alert('Campo obrigatório', `Preencha a parcela ${i + 1}.`);
            return false;
        }
        const valorNumerico = typeof value === 'string' ? parseInt(value) : value;
        if (isNaN(valorNumerico) || valorNumerico < 0) {
            Alert.alert('Valor inválido', `A parcela ${i + 1} deve ser um número maior ou igual a zero.`);
            return false;
        }
    }

    return true;
  };


  const salvarDados = async () => {
    
    // 1. Coletar e validar todos os dados de contagem
    const contagens = [
      parcelaPreliminar1, parcelaPreliminar2, parcelaPreliminar3, parcelaPreliminar4, parcelaPreliminar5,
      ...contagensParcelasExtras
    ].slice(0, totalParcelasRequeridas);

    if (!validarParcelas(contagens)) {
      return;
    }

    const contagensInt: number[] = contagens.map(c => parseInt(c));
    const areaFloat = parseFloat(area);
    const erroPermitido = Config.erroPermitido;

    if (!dimensoesParcela || !areaPorArvore || !densidadeArborea || !taxaOcupacaoSolo || !numArvoreParcela) {
        Alert.alert('Erro', 'Os resultados preliminares não foram calculados. Tente voltar para a etapa anterior.');
        return;
    }
    
    const { dimensao1, dimensao2, areaTotal } = dimensoesParcela;
    const areaPorArvoreCalc = areaPorArvore;
    const densidadeArboreaCalc = densidadeArborea;
    const taxaOcupacaoSoloCalc = taxaOcupacaoSolo;

    // A. Lógica da Primeira Iteração (somente com 5 parcelas)
    if (totalParcelasRequeridas === 5) {
        const contagensIniciais = contagensInt.slice(0, 5);

        const densidadesPreliminares = contagensIniciais.map(c => calcularDensidadeParcela(c, areaTotal));

        const numParcelasCalculado = calcularNumParcelas(
            areaFloat,
            areaTotal,
            densidadesPreliminares,
            erroPermitido
        );

        if (numParcelasCalculado > 5) {
            // Feedback loop: Mais parcelas necessárias
            setPlotsNeededData({
                numNeeded: numParcelasCalculado,
                dimensao1,
                dimensao2,
                areaTotal,
                erroPermitido,
            });
            setEtapaAtual('extra_plots_needed');
            setInstrucoesAceitas(false); 
            return; 
        }
        
        // Se for <= 5, procede com o salvamento usando as 5 parcelas
    }

    // B. Lógica da Segunda Iteração ou Finalização Imediata (totalParcelasRequeridas >= 5)
    
    // 1. Recalcular a média das contagens usando TODAS as parcelas
    const mediaParcelas = contagensInt.reduce((sum, c) => sum + c, 0) / contagensInt.length;

    // O numParcelasCalculado usado para o cálculo final é o total de parcelas contadas
    const numParcelasFinal = totalParcelasRequeridas;
    
    // 2. O banco de dados só salva 5 parcelas. Salvamos as 5 primeiras contagens ou a média (caso não haja 5)
    const p1 = contagensInt[0] ?? Math.round(mediaParcelas);
    const p2 = contagensInt[1] ?? Math.round(mediaParcelas);
    const p3 = contagensInt[2] ?? Math.round(mediaParcelas);
    const p4 = contagensInt[3] ?? Math.round(mediaParcelas);
    const p5 = contagensInt[4] ?? Math.round(mediaParcelas);


    // 3. Salvar no banco
    try {
        if (medicaoId) {
            await completeItem(
                medicaoId,
                p1,
                p2,
                p3,
                p4,
                p5
            );
        } else {
            await insertItem(
                nome_medicao.trim(),
                areaFloat,
                parseFloat(distRenques),
                parseInt(numLinhasRenque),
                parseFloat(distLinhas),
                parseFloat(distArvores),
                erroPermitido,
                p1,
                p2,
                p3,
                p4,
                p5
            );
        }
    } catch (error) {
        console.error("Erro ao salvar no banco:", error);
        Alert.alert('Erro', 'Ocorreu um erro ao salvar os dados no banco de dados. Tente novamente.');
        return;
    }


    // 4. Preparar dados para ResultScreen
    const distanciaEntreParcelas = calcularDistanciaEntreParcelas(
        areaFloat,
        numParcelasFinal
    );

    const totalArvores = calcularTotalArvores(areaFloat, densidadeArboreaCalc);

    // Recalcula as densidades preliminares com base em TODAS as contagens
    const densidadesPreliminaresFinais = contagensInt.map(c => calcularDensidadeParcela(c, areaTotal));

    const totalArvoresMonitoradas = calcularTotalArvoresMonitoradas(
        numParcelasFinal,
        mediaParcelas
    );

    navigation.navigate('Result', {
        nome_medicao: nome_medicao.trim(),
        area: areaFloat,
        distRenques: parseFloat(distRenques),
        numLinhasRenque: parseInt(numLinhasRenque),
        distLinhas: parseFloat(distLinhas),
        distArvores: parseFloat(distArvores),
        erroPermitido,
        // Passa os valores salvos no banco para o ResultScreen
        parcelaPreliminar1: p1,
        parcelaPreliminar2: p2,
        parcelaPreliminar3: p3,
        parcelaPreliminar4: p4,
        parcelaPreliminar5: p5, 
        areaPorArvore: areaPorArvoreCalc,
        densidadeArborea: densidadeArboreaCalc,
        taxaOcupacaoSolo: taxaOcupacaoSoloCalc,
        totalArvores,
        dimensao1,
        dimensao2,
        areaTotal,
        densidadesPreliminares: densidadesPreliminaresFinais, 
        numParcelasCalculado: numParcelasFinal,
        distanciaEntreParcelas,
        numArvoreParcela: numArvoreParcela!,
        totalArvoresMonitoradas,
    });

    resetFormulario();
  };

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
    setContagensParcelasExtras([]);
    setTotalParcelasRequeridas(5);
    setEtapaAtual('dados_basicos');
    setInstrucoesAceitas(false);
    setAreaPorArvore(null);
    setDensidadeArborea(null);
    setTaxaOcupacaoSolo(null);
    setDimensoesParcela(null);
    setNumArvoreParcela(null);
    setMedicaoId(null);
    setIsEditingIncomplete(false);
    setPlotsNeededData(null);
  };

  const renderIndicadorEtapas = () => {
    const etapas = [
      { id: 'dados_basicos', nome: 'Dados Básicos', numero: 1 },
      { id: 'resultados_preliminares', nome: 'Resultados', numero: 2 },
      { id: 'contagem_parcelas', nome: 'Contagem', numero: 3 }
    ];

    const currentStepIndex = etapas.findIndex(e => e.id === etapaAtual);

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
        {etapas.map((etapa, index) => (
          <React.Fragment key={etapa.id}>
            <View style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: index <= currentStepIndex ? colors.secondary : '#e0e0e0',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{
                color: index <= currentStepIndex ? 'white' : '#666',
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
                backgroundColor: index < currentStepIndex ? colors.secondary : '#e0e0e0',
                marginHorizontal: 8
              }} />
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

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

      <TouchableOpacity onPress={avancarParaResultados} style={styles.button}>
        <Text style={styles.buttonText}>Calcular e Avançar</Text>
      </TouchableOpacity>
    </>
  );

  const renderResultadosPreliminares = () => {
    if (!areaPorArvore || !densidadeArborea || !taxaOcupacaoSolo || !dimensoesParcela || !numArvoreParcela) {
        // Recalcula se o usuário voltou para essa tela sem os resultados no estado
        useEffect(() => {
            calcularResultadosPreliminares();
        }, []); 

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
    
    return (
      <>
        <Text style={styles.sectionTitle}>Resultados Preliminares</Text>
        <Text style={{ color: '#666', marginBottom: 16 }}>
          Baseado nos dados informados, estes são os parâmetros calculados:
        </Text>

        <Card style={{ marginBottom: 16, padding: 16, backgroundColor: colors.secondaryLight }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: colors.primary }}>
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

        <Card style={{ marginBottom: 16, padding: 16, backgroundColor: colors.secondaryLight }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: colors.primary }}>
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

        <Card style={{ marginBottom: 16, padding: 16, backgroundColor: colors.warningLight, borderLeftWidth: 4, borderLeftColor: colors.accent }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: colors.accent }}>
            📋 Instruções para o Trabalho de Campo
          </Text>

          <Text style={{ marginBottom: 8, color: colors.accent, lineHeight: 20 }}>
            Para continuar com o inventário florestal, siga estas etapas:
          </Text>

          <Text style={{ marginBottom: 6, color: colors.accent }}>
            1️⃣ Vá ao campo e demarque <Text style={{ fontWeight: 'bold' }}>5 parcelas preliminares</Text>
          </Text>

          <Text style={{ marginBottom: 6, color: colors.accent }}>
            2️⃣ Cada parcela deve ter <Text style={{ fontWeight: 'bold' }}>{formatarNumeroBR(dimensoesParcela.dimensao1)} m × {formatarNumeroBR(dimensoesParcela.dimensao2)} m</Text>
          </Text>

          <Text style={{ marginBottom: 6, color: colors.accent }}>
            3️⃣ Conte <Text style={{ fontWeight: 'bold' }}>todas as árvores</Text> presentes em cada parcela
          </Text>

          <Text style={{ marginBottom: 6, color: colors.accent }}>
            4️⃣ Anote as contagens e retorne ao app para inserir os dados
          </Text>

          <Text style={{ marginBottom: 12, color: colors.accent }}>
            5️⃣ O sistema calculará automaticamente o número ideal de parcelas definitivas
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <Checkbox
              status={instrucoesAceitas ? 'checked' : 'unchecked'}
              onPress={() => setInstrucoesAceitas(!instrucoesAceitas)}
              color={colors.accent}
            />
            <Text style={{ marginLeft: 8, color: colors.accent, flex: 1 }}>
              Li e compreendi as instruções. Estou pronto para ir ao campo.
            </Text>
          </View>
        </Card>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
          <TouchableOpacity
            onPress={voltarParaDadosBasicos}
            style={[styles.button, { backgroundColor: colors.text.secondary, flex: 1 }]}
          >
            <Text style={styles.buttonText}>← Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={avancarParaContagem}
            style={[
              styles.button,
              {
                flex: 1,
                backgroundColor: instrucoesAceitas ? colors.primary : colors.text.disabled
              }
            ]}
            disabled={!instrucoesAceitas}
          >
            <Text style={[styles.buttonText, { color: instrucoesAceitas ? colors.onPrimary : colors.onPrimary }]}>
              Prosseguir →
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderContagemParcelas = () => {
    const totalInputs = Array.from({ length: totalParcelasRequeridas }, (_, i) => i + 1);

    return (
      <>
        <Text style={styles.sectionTitle}>Contagem das Parcelas Preliminares</Text>
        <Text style={{ color: '#666', marginBottom: 16 }}>
          Insira o número de árvores contadas em cada uma das {totalParcelasRequeridas} parcela(s):
        </Text>

        {totalInputs.map((numero) => {
          const index = numero - 1;
          
          let value = '';
          let setter = (text: string) => {};
          
          if (numero === 1) { value = parcelaPreliminar1; setter = setParcelaPreliminar1; }
          else if (numero === 2) { value = parcelaPreliminar2; setter = setParcelaPreliminar2; }
          else if (numero === 3) { value = parcelaPreliminar3; setter = setParcelaPreliminar3; }
          else if (numero === 4) { value = parcelaPreliminar4; setter = setParcelaPreliminar4; }
          else if (numero === 5) { value = parcelaPreliminar5; setter = setParcelaPreliminar5; }
          else { 
            // Para parcelas extras, usamos o estado dinâmico `contagensParcelasExtras`
            value = contagensParcelasExtras[index - 5] || '';
            setter = (text: string) => handleExtraPlotInput(text, index - 5);
          }

          // Se veio do EditScreen (isEditingIncomplete), as 5 primeiras parcelas já estão preenchidas.
          const isExtraPlot = numero > 5;
          const isFirstTime = totalParcelasRequeridas === 5 && !isEditingIncomplete;


          return (
            <TextInput
              key={numero}
              label={`Parcela ${numero} (número de árvores)`}
              value={value}
              onChangeText={setter}
              keyboardType="number-pad"
              style={styles.input}
              placeholder="Ex: 8"
              // Se não é a primeira vez e não é uma parcela extra, o campo deve estar preenchido (se veio do EditScreen) e pode ser editado
              // Caso contrário, o campo é sempre editável.
            />
          );
        })}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
          <TouchableOpacity
            onPress={voltarParaResultados}
            style={[styles.button, { backgroundColor: colors.text.secondary, flex: 1 }]}
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
  };
  
  const renderExtraPlotsNeeded = () => {
    if (!plotsNeededData) return null;

    const plotsToDemarcate = plotsNeededData.numNeeded - 5;
    
    // Formatando as dimensões para exibição no padrão BR
    const dim1Formatted = formatarNumeroBR(plotsNeededData.dimensao1);
    const dim2Formatted = formatarNumeroBR(plotsNeededData.dimensao2);

    return (
      <>
        <Text style={[styles.sectionTitle, { color: colors.error }]}>Atenção: Mais Parcelas Necessárias!</Text>
        <Text style={{ color: colors.text.primary, marginBottom: 16 }}>
          A análise estatística inicial indica que a variabilidade da área de estudo não atendeu ao Erro Permitido ({formatarNumeroBR(plotsNeededData.erroPermitido)}%). 
          Para concluir o inventário com a precisão desejada, você precisará amostrar mais parcelas.
        </Text>

        <Card style={{ marginBottom: 16, padding: 16, backgroundColor: colors.errorLight, borderLeftWidth: 4, borderLeftColor: colors.error }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: colors.error }}>
            📋 Instruções Adicionais
          </Text>

          <Text style={{ marginBottom: 8, color: colors.error, lineHeight: 20 }}>
            Para concluir o inventário florestal, retorne ao campo e demarque mais <Text style={{ fontWeight: 'bold' }}>{plotsToDemarcate}</Text> parcela{plotsToDemarcate > 1 ? 's' : ''} extra{plotsToDemarcate > 1 ? 's' : ''}.
          </Text>

          <Text style={{ marginBottom: 8, color: colors.error, lineHeight: 20 }}>
            A(s) parcela(s) extra(s) deve{plotsToDemarcate > 1 ? 'm' : ''} ter as dimensões de <Text style={{ fontWeight: 'bold' }}>{dim1Formatted} m x {dim2Formatted} m</Text>.
          </Text>

          <Text style={{ marginBottom: 8, color: colors.error, lineHeight: 20 }}>
            Conte <Text style={{ fontWeight: 'bold' }}>todas as árvores</Text> presentes em cada parcela extra.
          </Text>

          <Text style={{ marginBottom: 16, color: colors.error, lineHeight: 20 }}>
            Anote a(s) contagem(ens) e retorne ao app para inserir os dados.
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <Checkbox
              status={instrucoesAceitas ? 'checked' : 'unchecked'}
              onPress={() => setInstrucoesAceitas(!instrucoesAceitas)}
              color={colors.error}
            />
            <Text style={{ marginLeft: 8, color: colors.error, flex: 1 }}>
              Li e compreendi as instruções. Estou pronto para retornar ao campo.
            </Text>
          </View>
        </Card>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
          <TouchableOpacity
            onPress={voltarParaResultados}
            style={[styles.button, { backgroundColor: colors.text.secondary, flex: 1 }]}
          >
            <Text style={styles.buttonText}>← Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={retornarParaContagem}
            style={[
              styles.button,
              {
                flex: 1,
                backgroundColor: instrucoesAceitas ? colors.primary : colors.text.disabled
              }
            ]}
            disabled={!instrucoesAceitas}
          >
            <Text style={[styles.buttonText, { color: instrucoesAceitas ? colors.onPrimary : colors.onPrimary }]}>
              Continuar no App →
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };


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
      case 'extra_plots_needed': 
        return "Parcelas Adicionais";
      default:
        return "Nova Medição";
    }
  };

  const getHeaderSubtitle = () => {
    if (etapaAtual === 'extra_plots_needed') {
      const plotsToDemarcate = plotsNeededData?.numNeeded ? plotsNeededData.numNeeded - 5 : 0;
      return `Necessárias mais ${plotsToDemarcate} parcela(s)`;
    }
    switch (etapaAtual) {
      case 'dados_basicos':
        return "Informações básicas";
      case 'resultados_preliminares':
        return "Cálculos preliminares";
      case 'contagem_parcelas':
        return `Contagem das ${totalParcelasRequeridas} parcelas`;
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
      case 'extra_plots_needed': 
        return "alert-rhombus"; 
      default:
        return "clipboard-list";
    }
  };

  const headerActions = [
    {
      icon: 'help-circle-outline',
      label: 'Ajuda',
      onPress: () => {
        Alert.alert(
          'Ajuda',
          'Para realizar o preenchimento do formulário de forma mais intuitiva ele foi separado nas seguintes etapas:\n\n1) Preencher as informações básicas sobre a área a ser inventariada.\n2) Ler com atenção as instruções e realizar as etapas descritas.\n3) Finalizar o preenchimento das informações com os dados obtidos na etapa anterior.'
        );
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
        showBackButton={etapaAtual !== 'dados_basicos'}
        onBackPress={etapaAtual === 'extra_plots_needed' ? voltarParaResultados : navigation.goBack}
        rightActions={headerActions}
      />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {etapaAtual !== 'extra_plots_needed' && renderIndicadorEtapas()}

        {etapaAtual === 'dados_basicos' && renderDadosBasicos()}
        {etapaAtual === 'resultados_preliminares' && renderResultadosPreliminares()}
        {etapaAtual === 'contagem_parcelas' && renderContagemParcelas()}
        {etapaAtual === 'extra_plots_needed' && renderExtraPlotsNeeded()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FormScreen;