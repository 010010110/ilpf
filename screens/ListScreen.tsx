import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Text, Card, Divider, IconButton, FAB } from 'react-native-paper';
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
import StandardHeader from '@/components/StandartHeader';

// Usando o tipo do banco de dados que permite null nas parcelas
type InventoryItem = {
  id: number;
  nome_medicao: string;
  area: number;
  distRenques: number;
  numLinhasRenque: number;
  distLinhas: number;
  distArvores: number;
  erroPermitido: number;
  parcelaPreliminar1: number | null;
  parcelaPreliminar2: number | null;
  parcelaPreliminar3: number | null;
  parcelaPreliminar4: number | null;
  parcelaPreliminar5: number | null;
  status: 'incompleto' | 'completo';
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
    if (item.status === 'incompleto') {
      // Para itens incompletos, navegar para o formulário para continuar
      navigation.navigate('Form', { ...item });
    } else {
      // Para itens completos, navegar para edição normal
      navigation.navigate('Edit', { ...item });
    }
  };

  const navigateToResult = (item: InventoryItem) => {
    if (item.status === 'incompleto') {
      // Para itens incompletos, navegar para o formulário para continuar
      navigation.navigate('Form', { ...item });
      return;
    }

    // Verificar se todas as parcelas estão preenchidas antes de calcular
    if (!item.parcelaPreliminar1 || !item.parcelaPreliminar2 || !item.parcelaPreliminar3 || 
        !item.parcelaPreliminar4 || !item.parcelaPreliminar5) {
      // Se alguma parcela estiver null, tratar como incompleto
      navigation.navigate('Form', { ...item });
      return;
    }

    // Para itens completos, calcular e mostrar resultados
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
      parcelaPreliminar1: item.parcelaPreliminar1,
      parcelaPreliminar2: item.parcelaPreliminar2,
      parcelaPreliminar3: item.parcelaPreliminar3,
      parcelaPreliminar4: item.parcelaPreliminar4,
      parcelaPreliminar5: item.parcelaPreliminar5,
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

  const renderStatusChip = (item: InventoryItem) => {
    if (item.status === 'incompleto') {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <MaterialCommunityIcons 
            name="alert-circle" 
            size={16} 
            color="#ff6b35" 
            style={{ marginRight: 6 }}
          />
          <Text style={{ 
            color: '#ff6b35', 
            fontSize: 12, 
            fontWeight: 'bold',
            textTransform: 'uppercase' 
          }}>
            INCOMPLETO
          </Text>
        </View>
      );
    }
    
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        <MaterialCommunityIcons 
          name="check-circle" 
          size={16} 
          color="#4caf50" 
          style={{ marginRight: 6 }}
        />
        <Text style={{ 
          color: '#4caf50', 
          fontSize: 12, 
          fontWeight: 'bold',
          textTransform: 'uppercase' 
        }}>
          COMPLETO
        </Text>
      </View>
    );
  };

  const getCardStyle = (item: InventoryItem) => {
    switch (item.status) {
      case 'incompleto':
        return styles.cardIncomplete;
      case 'completo':
        return styles.cardComplete;
      default:
        return styles.card;
    }
  };

  const headerActions = [
    {
      icon: 'refresh',
      label: 'Atualizar',
      onPress: fetchData,
    }
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
       <StandardHeader
        title="Medições"
        subtitle={`${data.length} ${data.length === 1 ? 'medição' : 'medições'} salva${data.length === 1 ? '' : 's'}`}
        icon="format-list-bulleted"
        rightActions={headerActions}
      />
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
              <Card style={getCardStyle(item)} onPress={() => navigateToResult(item)}>
                <Card.Title
                  title={item.nome_medicao}
                  subtitle={`Criado em: ${new Date(item.created_at).toLocaleDateString()}`}
                  titleStyle={{ 
                    fontWeight: 'bold', 
                    fontSize: 20, 
                    color: item.status === 'incompleto' ? '#e65100' : colors.primary 
                  }}
                  subtitleStyle={{ 
                    color: item.status === 'incompleto' ? '#bf360c' : colors.primary 
                  }}
                />
                <Card.Content>
                  <View style={styles.row}>
                    <Text style={[styles.label, { 
                      color: item.status === 'incompleto' ? '#e65100' : styles.label.color 
                    }]}>Área:</Text>
                    <Text style={[styles.value, { 
                      color: item.status === 'incompleto' ? '#bf360c' : styles.value.color 
                    }]}>{formatarNumeroBR(item.area)} ha</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={[styles.label, { 
                      color: item.status === 'incompleto' ? '#e65100' : styles.label.color 
                    }]}>Renques:</Text>
                    <Text style={[styles.value, { 
                      color: item.status === 'incompleto' ? '#bf360c' : styles.value.color 
                    }]}>{formatarNumeroBR(item.distRenques)} m</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={[styles.label, { 
                      color: item.status === 'incompleto' ? '#e65100' : styles.label.color 
                    }]}>Linhas/renque:</Text>
                    <Text style={[styles.value, { 
                      color: item.status === 'incompleto' ? '#bf360c' : styles.value.color 
                    }]}>{item.numLinhasRenque}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={[styles.label, { 
                      color: item.status === 'incompleto' ? '#e65100' : styles.label.color 
                    }]}>Erro permitido:</Text>
                    <Text style={[styles.value, { 
                      color: item.status === 'incompleto' ? '#bf360c' : styles.value.color 
                    }]}>{formatarNumeroBR(item.erroPermitido)}%</Text>
                  </View>
                  
                  {renderStatusChip(item)}
                </Card.Content>
                <Card.Actions style={{ justifyContent: 'flex-start' }}>
                  <IconButton
                    icon={item.status === 'incompleto' ? 'play-circle-outline' : 'pencil-outline'}
                    iconColor={item.status === 'incompleto' ? '#ff6b35' : colors.primary}
                    containerColor="transparent"
                    onPress={() => navigateToEdit(item)}
                    accessibilityLabel={item.status === 'incompleto' ? 'Continuar medição' : 'Editar medição'}
                  />
                  <IconButton
                    icon="trash-can-outline"
                    iconColor={item.status === 'incompleto' ? '#ff6b35' : colors.primary}
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