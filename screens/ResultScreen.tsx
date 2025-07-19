import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Card, Text, Divider } from 'react-native-paper';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/utils/types';
import styles from '../styles/ResultScreen.styles';
import { formatarNumeroBR } from '@/utils/Numberformatter';

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

const ResultScreen: React.FC = () => {
  const route = useRoute<ResultScreenRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const {
    nome_medicao,
    area,
    distRenques,
    numLinhasRenque,
    distLinhas,
    distArvores,
    erroPermitido,
    parcelaPreliminar1,
    parcelaPreliminar2,
    parcelaPreliminar3,
    parcelaPreliminar4,
    parcelaPreliminar5,
    areaPorArvore,
    densidadeArborea,
    taxaOcupacaoSolo,
    totalArvores,
    dimensao1,
    dimensao2,
    areaTotal,
    densidadesPreliminares,
    numParcelasCalculado,
    numArvoreParcela,
    distanciaEntreParcelas,
    totalArvoresMonitoradas,
  } = route.params;

  const parcelasPreliminares = [
    parcelaPreliminar1,
    parcelaPreliminar2,
    parcelaPreliminar3,
    parcelaPreliminar4,
    parcelaPreliminar5,
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.background}>
      <View style={styles.container}>
        {/* Botão para voltar à lista */}
        <Button mode="contained" onPress={() => navigation.navigate('List')} style={styles.button}>
          Voltar à Listagem
        </Button>

        {/* Card para Dados Inseridos */}
        <Card style={styles.card}>
          <Card.Title title="Dados Inseridos" titleStyle={[styles.cardTitle, { fontWeight: 'bold' }]} />
          <Card.Content>
            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.cardText, { fontWeight: 'bold' }]}>Nome da Medição:</Text>
              <Text style={styles.cardText}>{nome_medicao}</Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.cardText, { fontWeight: 'bold' }]}>Área:</Text>
              <Text style={styles.cardText}>{formatarNumeroBR(area)} ha</Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.cardText, { fontWeight: 'bold' }]}>Distância entre renques:</Text>
              <Text style={styles.cardText}>{formatarNumeroBR(distRenques)} m</Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.cardText, { fontWeight: 'bold' }]}>Número de linhas no renque:</Text>
              <Text style={styles.cardText}>{numLinhasRenque}</Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.cardText, { fontWeight: 'bold' }]}>Distância entre linhas:</Text>
              <Text style={styles.cardText}>{formatarNumeroBR(distLinhas)} m</Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.cardText, { fontWeight: 'bold' }]}>Distância entre árvores:</Text>
              <Text style={styles.cardText}>{formatarNumeroBR(distArvores)} m</Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.cardText, { fontWeight: 'bold' }]}>Erro permitido:</Text>
              <Text style={styles.cardText}>{formatarNumeroBR(erroPermitido)}%</Text>
            </View>
            {parcelasPreliminares.map((valor, index) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <Text style={[styles.cardText, { fontWeight: 'bold' }]}>{`Parcela Preliminar ${index + 1}:`}</Text>
                <Text style={styles.cardText}>{valor} árvores</Text>
              </View>
            ))}
          </Card.Content>
        </Card>


        <Divider style={styles.divider} />

        {/* Card para Dados Calculados */}
        <Card style={styles.cardCalculated}>
          <Card.Title title="Dados Calculados" titleStyle={[styles.cardTitleCalculated, { fontWeight: 'bold'}]} />
          <Card.Content>
            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.cardTextCalculated, { fontWeight: 'bold'}]}>Área por árvore:</Text>
              <Text style={styles.cardTextCalculated}>{formatarNumeroBR(areaPorArvore)} m²</Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.cardTextCalculated, { fontWeight: 'bold'}]}>Densidade arbórea:</Text>
              <Text style={styles.cardTextCalculated}>{formatarNumeroBR(densidadeArborea)} árvores/ha</Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.cardTextCalculated, { fontWeight: 'bold'}]}>Taxa de ocupação do solo:</Text>
              <Text style={styles.cardTextCalculated}>{formatarNumeroBR(100 * +taxaOcupacaoSolo)}%</Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.cardTextCalculated, { fontWeight: 'bold'}]}>Total de árvores:</Text>
              <Text style={styles.cardTextCalculated}>{formatarNumeroBR(totalArvores)}</Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.cardTextCalculated, { fontWeight: 'bold'}]}>Largura da parcela:</Text>
              <Text style={styles.cardTextCalculated}>{formatarNumeroBR(dimensao2)} m</Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.cardTextCalculated, { fontWeight: 'bold'}]}>Comprimento da parcela:</Text>
              <Text style={styles.cardTextCalculated}>{formatarNumeroBR(dimensao1)} m</Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.cardTextCalculated, { fontWeight: 'bold'}]}>Área da parcela:</Text>
              <Text style={styles.cardTextCalculated}>{formatarNumeroBR(areaTotal)} m²</Text>
            </View>
            {[1, 2, 3, 4, 5].map((n) => (
              <View key={n} style={{ marginBottom: 8 }}>
                <Text style={[styles.cardTextCalculated, { fontWeight: 'bold'}]}>{`Parcela ${n}:`}</Text>
                <Text style={styles.cardTextCalculated}>{formatarNumeroBR(densidadesPreliminares[n - 1])} árvores/ha</Text>
              </View>
            ))}
            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.cardTextCalculated, { fontWeight: 'bold'}]}>Número de parcelas calculadas:</Text>
              <Text style={styles.cardTextCalculated}>{numParcelasCalculado}</Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.cardTextCalculated, { fontWeight: 'bold'}]}>Número de árvores por parcela:</Text>
              <Text style={styles.cardTextCalculated}>{numArvoreParcela}</Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.cardTextCalculated, { fontWeight: 'bold'}]}>Distância entre parcelas:</Text>
              <Text style={styles.cardTextCalculated}>{formatarNumeroBR(distanciaEntreParcelas)} m</Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={[styles.cardTextCalculated, { fontWeight: 'bold'}]}>Total de árvores monitoradas:</Text>
              <Text style={styles.cardTextCalculated}>{totalArvoresMonitoradas}</Text>
            </View>
          </Card.Content>
        </Card>

      </View>
    </ScrollView>
  );
};

export default ResultScreen;