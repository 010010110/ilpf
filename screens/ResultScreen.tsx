import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import styles, { textStyles } from '../styles/ResultScreen.styles';
import { formatarNumeroBR, formatarNumeroBRNoDecimal } from '@/utils/Numberformatter';
import { SafeAreaView } from 'react-native-safe-area-context';
import StandardHeader from '@/components/StandartHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '@/utils/colors';

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
    taxaOcupacaoSolo,
    created_at
  } = params as any;

  const dadosValidos = areaPorArvore && densidadeArborea;

  return (
    <SafeAreaView style={styles.container}>
      <StandardHeader
        title="Resultados"
        subtitle={nome_medicao || "Análise da medição"}
        icon="calculator-variant"
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {!dadosValidos ? (
          <View style={styles.noDataContainer}>
            <View style={styles.noDataIconContainer}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={64}
                color={colors.text.secondary}
              />
            </View>
            <Text style={textStyles.noDataText}>
              Nenhum resultado disponível. Por favor, selecione uma medição válida.
            </Text>
          </View>
        ) : (
          <>
            {/* Nome da medição */}
            {nome_medicao && (
              <View style={styles.measurementHeader}>
                <Text style={textStyles.measurementName}>{nome_medicao}</Text>
                {created_at && (
                  <Text style={textStyles.measurementDate}>
                    Criado em: {new Date(created_at).toLocaleDateString()}
                  </Text>
                )}
              </View>
            )}

            {/* Seção Resumo Geral */}
            <Text style={[textStyles.sectionTitle, textStyles.sectionTitleFirst]}>
              Resumo Geral
            </Text>
            <View style={[styles.resultCard, styles.resultCardHighlight]}>
              <View style={styles.resultRow}>
                <Text style={textStyles.label}>Área por árvore:</Text>
                <Text style={textStyles.value}>{formatarNumeroBR(areaPorArvore)} m²</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={textStyles.label}>Densidade arbórea:</Text>
                <Text style={textStyles.value}>{densidadeArborea} árvores/ha</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={textStyles.label}>Taxa de ocupação do solo:</Text>
                <Text style={textStyles.value}>{formatarNumeroBR(taxaOcupacaoSolo)}%</Text>
              </View>
            </View>


            {/* Seção Parcela */}
            <Text style={textStyles.sectionTitle}>Parcela</Text>

            <View style={[styles.resultCard, styles.resultCardHighlight]}>
              <View style={styles.resultRow}>
                <Text style={textStyles.label}>Largura:</Text>
                <Text style={textStyles.value}>{formatarNumeroBR(dimensao2)} m</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={textStyles.label}>Comprimento:</Text>
                <Text style={textStyles.value}>{formatarNumeroBR(dimensao1)} m</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={textStyles.label}>Área:</Text>
                <Text style={textStyles.value}>{formatarNumeroBR(areaTotal)} m²</Text>
              </View>
            </View>

            {/* Seção Totais */}
            <Text style={textStyles.sectionTitle}>Totais</Text>

            <View style={[styles.resultCard, styles.resultCardHighlight]}>
              <View style={styles.resultRow}>
                <Text style={textStyles.label}>Parcelas calculadas:</Text>
                <Text style={textStyles.value}>{numParcelasCalculado}</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={textStyles.label}>Árvores por parcela:</Text>
                <Text style={textStyles.value}>{numArvoreParcela}</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={textStyles.label}>Distância entre parcelas:</Text>
                <Text style={textStyles.value}>{formatarNumeroBR(distanciaEntreParcelas)} m</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={textStyles.label}>Árvores à serem medidas:</Text>
                <Text style={textStyles.value}>{totalArvoresMonitoradas}</Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={textStyles.label}>Total estimado de árvores:</Text>
                <Text style={textStyles.value}>{formatarNumeroBRNoDecimal(totalArvores)}</Text>
              </View>
            </View>

            {/* Divisor */}
            <View style={styles.dividerContainer} />

            {/* Badge de status */}
            <View style={styles.badge}>
              <Text style={textStyles.badgeText}>Cálculo Concluído</Text>
            </View>

          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResultScreen;