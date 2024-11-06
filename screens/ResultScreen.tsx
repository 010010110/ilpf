import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Card, Text, Divider } from 'react-native-paper';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/utils/types';
import styles from '../styles/ResultScreen.styles';
import { FlatList } from 'react-native-gesture-handler';

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;


const ResultScreen: React.FC = () => {
  const route = useRoute<ResultScreenRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  const {
    area,
    distRenques,
    numLinhasRenque,
    distLinhas,
    distArvores,
    numArvores,
    erroPermitido,
    numParcelas,
    areaPorArvore,
    densidadeArborea,
    larguraParcela,
    comprimentoParcela,
    areaParcela,
    numArvoresPorParcela,
  } = route.params;

  const areaSistemaM2 = area * 10000;
  const distanciaEntreParcelas = Math.sqrt(areaSistemaM2 / numParcelas);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.background}>
      <View style={styles.container}>
        {/* Botão para voltar à lista */}
        <Button mode="contained" onPress={() =>  navigation.navigate('List')} style={styles.button}>
          Voltar à Listagem
        </Button>

        {/* Card para Dados Inseridos */}
        <Card style={styles.card}>
          <Card.Title title="Dados Inseridos" titleStyle={styles.cardTitle} />
          <Card.Content>
            <Text style={styles.cardText}>Área: {area.toFixed(2)} ha</Text>
            <Text style={styles.cardText}>Distância entre renques: {distRenques.toFixed(2)} m</Text>
            <Text style={styles.cardText}>Número de linhas no renque: {numLinhasRenque}</Text>
            <Text style={styles.cardText}>Distância entre linhas: {distLinhas.toFixed(2)} m</Text>
            <Text style={styles.cardText}>Distância entre árvores: {distArvores.toFixed(2)} m</Text>
            <Text style={styles.cardText}>Número de árvores: {numArvores}</Text>
            <Text style={styles.cardText}>Erro permitido: {erroPermitido.toFixed(2)}%</Text>
            <Text style={styles.cardText}>Número de parcelas: {numParcelas}</Text>
          </Card.Content>
        </Card>

        <Divider style={styles.divider} />

        {/* Card para Dados Calculados */}
        <Card style={styles.cardCalculated}>
          <Card.Title title="Dados Calculados" titleStyle={styles.cardTitleCalculated} />
          <Card.Content>
            <Text style={styles.cardTextCalculated}>Área por árvore: {areaPorArvore.toFixed(2)} m²</Text>
            <Text style={styles.cardTextCalculated}>Densidade arbórea: {densidadeArborea.toFixed(2)} árvores/ha</Text>
            <Text style={styles.cardTextCalculated}>Largura da parcela: {larguraParcela.toFixed(2)} m</Text>
            <Text style={styles.cardTextCalculated}>Comprimento da parcela: {comprimentoParcela.toFixed(2)} m</Text>
            <Text style={styles.cardTextCalculated}>Área da parcela: {areaParcela.toFixed(2)} m²</Text>
            <Text style={styles.cardTextCalculated}>Número de árvores por parcela: {numArvoresPorParcela}</Text>
            <Text style={styles.cardTextCalculated}>Distância entre parcelas: {distanciaEntreParcelas.toFixed(2)} m</Text>
          </Card.Content>
        </Card>

      </View> 
    </ScrollView>
  );
};

export default ResultScreen;
