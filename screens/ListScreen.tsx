import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Text, Card, Divider, IconButton, FAB, Appbar } from 'react-native-paper';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAllItems, deleteItem, initDb } from '../database/db';
import { RootStackParamList } from '@/utils/types';
import styles from '../styles/ListScreen.styles';
import colors from '@/utils/colors';
import EmptyIllustration from '../assets/images/empty.svg';
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
import { formatarNumeroBR } from '@/utils/Numberformatter';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

  const [dbReady, setDbReady] = useState(false);

// Executa initDb apenas uma vez ao montar a tela
useEffect(() => {
  const startDb = async () => {
    try {
      await initDb();
      setDbReady(true);
    } catch (e) {
      console.error('Erro ao iniciar DB na ListScreen:', e);
    }
  };
  startDb();
}, []);

  // Carrega os dados da base
  const fetchData = async () => {
    try {
      const items = await getAllItems() || [];
      setData(items);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useFocusEffect(
  useCallback(() => {
    if (dbReady) {
      fetchData();
    }
  }, [dbReady])
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
        item.parcelaPreliminar5) / 5
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
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#666" style={{ marginRight: 8 }} />
          <Text style={{
            fontSize: 25,
            color: '#666',
            fontFamily: 'Roboto-Medium',
            letterSpacing: 0.5,
            fontWeight: 'bold'
          }}>
            Medições
          </Text>
        </View>
      </Appbar.Header>

      <View style={styles.container}>
        {/* Botão flutuante para criar nova medição */}
        <FAB
          icon="plus"
          onPress={() => navigation.navigate('Form')}
          style={styles.fab}
          color="#fff"
        />
        {/* Lista de medições ou mensagem de vazio */}
        <FlatList
          data={data}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 32 }}>
              <Text style={{ textAlign: 'center', color: '#666', marginBottom: 16 }}>
                Você ainda não criou nenhuma medição. Clique no botão "+" para adicionar!
              </Text>
              <EmptyIllustration width={300} height={300} />
            </View>
          }
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              <Card style={styles.card} onPress={() => navigateToResult(item)}>
                <Card.Title
                  title={item.nome_medicao}
                  subtitle={`Criado em: ${new Date(item.created_at).toLocaleDateString()}`}
                  titleStyle={{ fontWeight: 'bold', fontSize: 25, color: colors.primary }}
                  subtitleStyle={{ color: colors.background }}
                />
                <Card.Content>
                  <View style={styles.row}>
                    <Text style={styles.label}>Área:</Text>
                    <Text style={styles.value}>{formatarNumeroBR(item.area)} ha</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Renques:</Text>
                    <Text style={styles.value}>{formatarNumeroBR(item.distRenques)} m</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Linhas/renque:</Text>
                    <Text style={styles.value}>{item.numLinhasRenque}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Erro permitido:</Text>
                    <Text style={styles.value}>{formatarNumeroBR(item.erroPermitido)}%</Text>
                  </View>
                </Card.Content>
                <Card.Actions style={{ justifyContent: 'flex-end' }}>
                  <IconButton
                    icon="pencil-outline"
                    iconColor={colors.primary}
                    containerColor="transparent"
                    onPress={() => navigateToEdit(item)}
                    accessibilityLabel="Editar medição"
                  />
                  <IconButton
                    icon="trash-can-outline"
                    iconColor={colors.primary}
                    containerColor="transparent"
                    onPress={() => handleDelete(item.id)}
                    accessibilityLabel="Deletar medição"
                  />
                </Card.Actions>
              </Card>
              <Divider style={styles.divider} />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default ListScreen;
