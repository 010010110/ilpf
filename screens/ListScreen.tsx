import React, { useState, useCallback } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Button, Text, Card, Divider, IconButton } from 'react-native-paper';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAllItems, deleteItem } from '../database/db';
import { calcularAreaPorArvore, calcularDensidadeArborea, calcularDimensoesParcela, calcularNumArvoresPorParcela } from '../utils/calculos';
import { RootStackParamList } from '@/utils/types';
import styles from '../styles/ListScreen.styles';
import colors from '@/utils/colors';

type InventoryItem = {
  id: number;
  area: number;
  distRenques: number;
  numLinhasRenque: number;
  distLinhas: number;
  distArvores: number;
  numArvores: number;
  erroPermitido: number;
  numParcelas: number;
};

const ListScreen = () => {
  const [data, setData] = useState<InventoryItem[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const fetchData = async () => {
    try {
      const items = await getAllItems();
      setData(items);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

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

  const navigateToResult = (item: InventoryItem) => {
    const areaPorArvore = calcularAreaPorArvore(item);
    const densidadeArborea = calcularDensidadeArborea(item);
    const { larguraParcela, comprimentoParcela, areaParcela } = calcularDimensoesParcela(item);
    const numArvoresPorParcela = calcularNumArvoresPorParcela(item);

    navigation.navigate('Result', {
      ...item,
      areaPorArvore,
      densidadeArborea,
      larguraParcela,
      comprimentoParcela,
      areaParcela,
      numArvoresPorParcela,
    });
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={() => navigation.navigate('Form')} style={styles.button}>
        Criar Novo
      </Button>

      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Card style={styles.card} onPress={() => navigateToResult(item)}>
              <Card.Title
                title={`Área: ${item.area} ha`}
                titleStyle={{ color: colors.background }}
                right={() => (
                  <IconButton
                    icon="delete"
                    iconColor='#859B48'
                    onPress={() => handleDelete(item.id)}
                  />
                )}
              />
              <Card.Content>
                <Text style={styles.cardText}>Distância entre renques: {item.distRenques} m</Text>
                <Text style={styles.cardText}>Número de linhas no renque: {item.numLinhasRenque}</Text>
                <Text style={styles.cardText}>Distância entre linhas: {item.distLinhas} m</Text>
                <Text style={styles.cardText}>Distância entre árvores: {item.distArvores} m</Text>
                <Text style={styles.cardText}>Número de árvores: {item.numArvores}</Text>
                <Text style={styles.cardText}>Erro permitido: {item.erroPermitido}%</Text>
                <Text style={styles.cardText}>Número de parcelas: {item.numParcelas}</Text>
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
