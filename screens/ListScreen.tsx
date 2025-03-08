import React, { useState, useCallback } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Button, Text, Card, Divider, IconButton } from 'react-native-paper';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAllItems, deleteItem } from '../database/db';
import { RootStackParamList } from '@/utils/types';
import styles from '../styles/ListScreen.styles';
import colors from '@/utils/colors';
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
} from '../utils/calculos';

type InventoryItem = {
  id: number;
  nome_medicao: string;
  area: number;
  distRenques: number;
  numLinhasRenque: number;
  distLinhas: number;
  distArvores: number;
  erroPermitido: number;
  parcelaPreliminar1: number;
  parcelaPreliminar2: number;
  parcelaPreliminar3: number;
  parcelaPreliminar4: number;
  parcelaPreliminar5: number;
  created_at: string;
  updated_at: string;
};

const ListScreen = () => {
  const [data, setData] = useState<InventoryItem[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Função para buscar os dados do banco
  const fetchData = async () => {
    try {
      const items = (await getAllItems()) || [];
      setData(items);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  // Atualiza a lista sempre que a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // Função para excluir um item
  const handleDelete = (id: number) => {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja excluir este item?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(id);
              setData(data.filter(item => item.id !== id));
            } catch (error) {
              console.error('Erro ao excluir item:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const navigateToEdit = (item: InventoryItem) => {
    navigation.navigate('Edit', { ...item });
  };

  const navigateToResult = (item: InventoryItem) => {
    const areaPorArvore = calcularAreaPorArvore(
      item.distRenques,
      item.distArvores,
      item.numLinhasRenque,
      item.distLinhas
    );
    const densidadeArborea = calcularDensidadeArborea(areaPorArvore);
    const taxaOcupacaoSolo = calcularTaxaOcupacaoSolo(
      item.distRenques,
      item.numLinhasRenque,
      item.distLinhas
    );
    const totalArvores = calcularTotalArvores(item.area, densidadeArborea);
    const { dimensao1, dimensao2, areaTotal } = calcularDimensoesParcela(
      item.distArvores,
      item.distRenques,
      item.numLinhasRenque,
      item.distLinhas
    );
    const densidadesPreliminares = [
      calcularDensidadeParcela(item.parcelaPreliminar1, areaTotal),
      calcularDensidadeParcela(item.parcelaPreliminar2, areaTotal),
      calcularDensidadeParcela(item.parcelaPreliminar3, areaTotal),
      calcularDensidadeParcela(item.parcelaPreliminar4, areaTotal),
      calcularDensidadeParcela(item.parcelaPreliminar5, areaTotal),
    ];
    const numParcelasCalculado = calcularNumParcelas(
      item.area,
      areaTotal,
      densidadesPreliminares,
      item.erroPermitido
    );

    const distanciaEntreParcelas = calcularDistanciaEntreParcelas(
      item.area,
      numParcelasCalculado
    );

    const numArvoreParcela = calcularNumArvoresParcelas(areaTotal, areaPorArvore);

    const totalArvoresMonitoradas = calcularTotalArvoresMonitoradas(
      numParcelasCalculado,
      (item.parcelaPreliminar1 +
      item.parcelaPreliminar2 +
      item.parcelaPreliminar3 +
      item.parcelaPreliminar4 +
      item.parcelaPreliminar5) /
      5
    );

    navigation.navigate('Result', {
      ...item,
      areaPorArvore,
      densidadeArborea,
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
    });
  };

  return (
    <View style={styles.container}>
      {/* Botão para criar uma nova medição */}
      <Button mode="contained" onPress={() => navigation.navigate('Form')} style={styles.button}>
        Criar Novo
      </Button>

      {/* Lista de medições salvas */}
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Card style={styles.card} onPress={() => navigateToResult(item)}>
              <Card.Title
                title={`Medição: ${item.nome_medicao}`}
                titleStyle={{ color: colors.background }}
                right={() => (
                  <View style={{ flexDirection: 'row' }}>
                    {/* Ícone de Edição */}
                    <IconButton
                      icon="pencil" // Ícone de edição
                      iconColor={colors.primary}
                      onPress={() => navigateToEdit(item)}
                    />
                    {/* Ícone de Exclusão */}
                    <IconButton
                      icon="delete"
                      iconColor={colors.primary}
                      onPress={() => handleDelete(item.id)}
                    />
                  </View>
                )}
              />
              <Card.Content>
                <Text style={styles.cardText}>Área: {item.area.toFixed(2)} ha</Text>
                <Text style={styles.cardText}>Distância entre renques: {item.distRenques.toFixed(2)} m</Text>
                <Text style={styles.cardText}>Número de linhas no renque: {item.numLinhasRenque}</Text>
                <Text style={styles.cardText}>Distância entre linhas: {item.distLinhas.toFixed(2)} m</Text>
                <Text style={styles.cardText}>Distância entre árvores: {item.distArvores.toFixed(2)} m</Text>
                <Text style={styles.cardText}>Erro permitido: {item.erroPermitido}%</Text>
                <Text style={styles.cardText}>Criado em: {new Date(item.created_at).toLocaleDateString()}</Text>
              </Card.Content>
            </Card>
            <Divider style={styles.divider} />
          </View>
        )}
      />
    </View>
  );
};

export default ListScreen;