import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Card, Text, Divider } from 'react-native-paper';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/utils/types';
import styles from '../styles/ResultScreen.styles';

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

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.background}>
      <View style={styles.container}>
        {/* Botão para voltar à lista */}
        <Button mode="contained" onPress={() => navigation.navigate('List')} style={styles.button}>
          Voltar à Listagem
        </Button>

        {/* Card para Dados Inseridos */}
        <Card style={styles.card}>
          <Card.Title title="Dados Inseridos" titleStyle={styles.cardTitle} />
          <Card.Content>
            <Text style={styles.cardText}>Nome da Medição: {nome_medicao}</Text>
            <Text style={styles.cardText}>Área: {area.toFixed(2)} ha</Text>
            <Text style={styles.cardText}>Distância entre renques: {distRenques.toFixed(2)} m</Text>
            <Text style={styles.cardText}>Número de linhas no renque: {numLinhasRenque}</Text>
            <Text style={styles.cardText}>Distância entre linhas: {distLinhas.toFixed(2)} m</Text>
            <Text style={styles.cardText}>Distância entre árvores: {distArvores.toFixed(2)} m</Text>
            <Text style={styles.cardText}>Erro permitido: {erroPermitido}%</Text>
            <Text style={styles.cardText}>Parcela Preliminar 1: {parcelaPreliminar1} árvores</Text>
            <Text style={styles.cardText}>Parcela Preliminar 2: {parcelaPreliminar2} árvores</Text>
            <Text style={styles.cardText}>Parcela Preliminar 3: {parcelaPreliminar3} árvores</Text>
            <Text style={styles.cardText}>Parcela Preliminar 4: {parcelaPreliminar4} árvores</Text>
            <Text style={styles.cardText}>Parcela Preliminar 5: {parcelaPreliminar5} árvores</Text>
          </Card.Content>
        </Card>

        <Divider style={styles.divider} />

        {/* Card para Dados Calculados */}
        <Card style={styles.cardCalculated}>
          <Card.Title title="Dados Calculados" titleStyle={styles.cardTitleCalculated} />
          <Card.Content>
            <Text style={styles.cardTextCalculated}>Área por árvore: {areaPorArvore.toFixed(2)} m²</Text>
            <Text style={styles.cardTextCalculated}>Densidade arbórea: {densidadeArborea.toFixed(2)} árvores/ha</Text>
            <Text style={styles.cardTextCalculated}>Taxa de ocupação do solo: {100 * +taxaOcupacaoSolo}%</Text>
            <Text style={styles.cardTextCalculated}>Total de árvores: {totalArvores}</Text>
            <Text style={styles.cardTextCalculated}>Largura da parcela: {dimensao2.toFixed(2)} m</Text>
            <Text style={styles.cardTextCalculated}>Comprimento da parcela: {dimensao1.toFixed(2)} m</Text>
            <Text style={styles.cardTextCalculated}>Área da parcela: {areaTotal.toFixed(2)} m²</Text>
            <Text style={styles.cardTextCalculated}>Parcela 1: {densidadesPreliminares[0]} árvores/ha</Text>
            <Text style={styles.cardTextCalculated}>Parcela 2: {densidadesPreliminares[1]} árvores/ha</Text>
            <Text style={styles.cardTextCalculated}>Parcela 3: {densidadesPreliminares[2]} árvores/ha</Text>
            <Text style={styles.cardTextCalculated}>Parcela 4: {densidadesPreliminares[3]} árvores/ha</Text>
            <Text style={styles.cardTextCalculated}>Parcela 5: {densidadesPreliminares[4]} árvores/ha</Text>
            <Text style={styles.cardTextCalculated}>Número de parcelas calculadas: {numParcelasCalculado}</Text>
            <Text style={styles.cardTextCalculated}>Número de arvóres por parcela: {numArvoreParcela}</Text>
            <Text style={styles.cardTextCalculated}>Distância entre parcelas: {distanciaEntreParcelas.toFixed(2)} m</Text>
            <Text style={styles.cardTextCalculated}>Total de árvores monitoradas: {totalArvoresMonitoradas}</Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

export default ResultScreen;