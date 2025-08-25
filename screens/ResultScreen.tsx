import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Appbar } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import styles from '../styles/ResultScreen.styles';
import { formatarNumeroBR, formatarNumeroBRNoDecimal } from '@/utils/Numberformatter';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const ResultScreen = () => {
  const route = useRoute();

  const params = route.params || {};
  const {
    nome_medicao,
    areaPorArvore,
    densidadeArborea,
    totalArvores,
    dimensao1,
    dimensao2,
    areaTotal,
    densidadesPreliminares,
    numParcelasCalculado,
    numArvoreParcela,
    distanciaEntreParcelas,
    totalArvoresMonitoradas,
    taxaOcupacaoSolo
  } = params as any;

  const dadosValidos = areaPorArvore && densidadeArborea;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="calculator-variant" size={24} color="#666" style={{ marginRight: 8 }} />
          <Text style={{
            fontSize: 25,
            color: '#666',
            fontFamily: 'Roboto-Medium',
            letterSpacing: 0.5,
            fontWeight: 'bold'
          }}>
            Resultados
          </Text>
        </View>
      </Appbar.Header>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {!dadosValidos ? (
          <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 16, color: '#666' }}>
            Nenhum resultado disponível. Por favor, selecione uma medição válida.
          </Text>
        ) : (
          <>

            <Text style={styles.sectionTitle}>{nome_medicao}</Text>

            <Text style={styles.sectionTitle}>Resumo Geral</Text>
            <View style={styles.resultRow}>
              <Text style={styles.label}>Área por árvore:</Text>
              <Text>{formatarNumeroBR(areaPorArvore)} m²</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.label}>Densidade arbórea:</Text>
              <Text>{densidadeArborea} árvores/ha</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.label}>Taxa de ocupação do solo:</Text>
              <Text>{formatarNumeroBR(taxaOcupacaoSolo)}%</Text>
            </View>
            <Text style={styles.sectionTitle}>Parcela</Text>
            <View style={styles.resultRow}>
              <Text style={styles.label}>Largura:</Text>
              <Text>{formatarNumeroBR(dimensao2)} m</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.label}>Comprimento:</Text>
              <Text>{formatarNumeroBR(dimensao1)} m</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.label}>Área:</Text>
              <Text>{formatarNumeroBR(areaTotal)} m²</Text>
            </View>
            <Text style={styles.sectionTitle}>Totais</Text>
            <View style={styles.resultRow}>
              <Text style={styles.label}>Parcelas calculadas:</Text>
              <Text>{numParcelasCalculado}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.label}>Árvores por parcela:</Text>
              <Text>{numArvoreParcela}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.label}>Distância entre parcelas:</Text>
              <Text>{formatarNumeroBR(distanciaEntreParcelas)} m</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.label}>Árvores monitoradas:</Text>
              <Text>{totalArvoresMonitoradas}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.label}>Total estimado de árvores:</Text>
              <Text>{formatarNumeroBRNoDecimal(totalArvores)}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResultScreen;