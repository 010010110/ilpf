import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/utils/types';
import styles from '../styles/FormScreen.styles';
import { updateItem } from '../database/db';
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
} from '@/utils/calculos';
import { Config } from '@/utils/config';

type EditScreenRouteProp = RouteProp<RootStackParamList, 'Edit'>;

const EditScreen: React.FC = () => {
  const route = useRoute<EditScreenRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [nome_medicao, setNomeMedicao] = useState(route.params.nome_medicao);
  const [area, setArea] = useState(route.params.area.toString());
  const [distRenques, setDistRenques] = useState(route.params.distRenques.toString());
  const [numLinhasRenque, setNumLinhasRenque] = useState(route.params.numLinhasRenque.toString());
  const [distLinhas, setDistLinhas] = useState(route.params.distLinhas.toString());
  const [distArvores, setDistArvores] = useState(route.params.distArvores.toString());

  const [parcelaPreliminar1, setParcelaPreliminar1] = useState(route.params.parcelaPreliminar1.toString());
  const [parcelaPreliminar2, setParcelaPreliminar2] = useState(route.params.parcelaPreliminar2.toString());
  const [parcelaPreliminar3, setParcelaPreliminar3] = useState(route.params.parcelaPreliminar3.toString());
  const [parcelaPreliminar4, setParcelaPreliminar4] = useState(route.params.parcelaPreliminar4.toString());
  const [parcelaPreliminar5, setParcelaPreliminar5] = useState(route.params.parcelaPreliminar5.toString());
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [areaPorArvore, setAreaPorArvore] = useState<number | null>(null);
  const [densidadeArborea, setDensidadeArborea] = useState<number | null>(null);

  useEffect(() => {
    if (numLinhasRenque === '1') {
      setDistLinhas(distRenques);
    }
  }, [numLinhasRenque, distRenques]);

  useEffect(() => {
    const camposPreenchidos =
      distRenques &&
      distArvores &&
      numLinhasRenque &&
      distLinhas;

    if (camposPreenchidos) {
      const areaCalc = calcularAreaPorArvore(
        parseFloat(distRenques),
        parseFloat(distArvores),
        parseInt(numLinhasRenque),
        parseFloat(distLinhas)
      );
      const densidade = calcularDensidadeArborea(areaCalc);
      setAreaPorArvore(areaCalc);
      setDensidadeArborea(densidade);
    } else {
      setAreaPorArvore(null);
      setDensidadeArborea(null);
    }
  }, [distRenques, distArvores, numLinhasRenque, distLinhas]);

  const saveData = async () => {
    try {
      if (
        !nome_medicao ||
        !area ||
        !distRenques ||
        !numLinhasRenque ||
        !distLinhas ||
        !distArvores ||
        !parcelaPreliminar1 ||
        !parcelaPreliminar2 ||
        !parcelaPreliminar3 ||
        !parcelaPreliminar4 ||
        !parcelaPreliminar5
      ) {
        alert('Preencha todos os campos obrigatórios.');
        return;
      }

      const erroPermitido = Config.erroPermitido;

      await updateItem(
        route.params.id,
        nome_medicao,
        parseFloat(area),
        parseFloat(distRenques),
        parseInt(numLinhasRenque),
        parseFloat(distLinhas),
        parseFloat(distArvores),
        erroPermitido,
        parseInt(parcelaPreliminar1),
        parseInt(parcelaPreliminar2),
        parseInt(parcelaPreliminar3),
        parseInt(parcelaPreliminar4),
        parseInt(parcelaPreliminar5)
      );

      const areaPorArvoreCalc = areaPorArvore!;
      const densidadeArboreaCalc = densidadeArborea!;
      const taxaOcupacaoSolo = calcularTaxaOcupacaoSolo(
        parseFloat(distRenques),
        parseInt(numLinhasRenque),
        parseFloat(distLinhas)
      );
      const totalArvores = calcularTotalArvores(parseFloat(area), densidadeArboreaCalc);
      const { dimensao1, dimensao2, areaTotal } = calcularDimensoesParcela(
        parseFloat(distArvores),
        parseFloat(distRenques),
        parseInt(numLinhasRenque),
        parseFloat(distLinhas)
      );
      const densidadesPreliminares = [
        calcularDensidadeParcela(+parcelaPreliminar1, areaTotal),
        calcularDensidadeParcela(+parcelaPreliminar2, areaTotal),
        calcularDensidadeParcela(+parcelaPreliminar3, areaTotal),
        calcularDensidadeParcela(+parcelaPreliminar4, areaTotal),
        calcularDensidadeParcela(+parcelaPreliminar5, areaTotal),
      ];
      const numParcelasCalculado = calcularNumParcelas(
        parseFloat(area),
        areaTotal,
        densidadesPreliminares,
        erroPermitido
      );
      const distanciaEntreParcelas = calcularDistanciaEntreParcelas(
        parseFloat(area),
        numParcelasCalculado
      );
      const calculaMediaParcelas =
        (+parcelaPreliminar1 +
          +parcelaPreliminar2 +
          +parcelaPreliminar3 +
          +parcelaPreliminar4 +
          +parcelaPreliminar5) /
        5;
      const totalArvoresMonitoradas = calcularTotalArvoresMonitoradas(
        numParcelasCalculado,
        calculaMediaParcelas
      );
      const numArvoreParcela = calcularNumArvoresParcelas(areaTotal, areaPorArvoreCalc);

      navigation.navigate('Result', {
        nome_medicao,
        area: parseFloat(area),
        distRenques: parseFloat(distRenques),
        numLinhasRenque: parseInt(numLinhasRenque),
        distLinhas: parseFloat(distLinhas),
        distArvores: parseFloat(distArvores),
        erroPermitido,
        parcelaPreliminar1: parseInt(parcelaPreliminar1),
        parcelaPreliminar2: parseInt(parcelaPreliminar2),
        parcelaPreliminar3: parseInt(parcelaPreliminar3),
        parcelaPreliminar4: parseInt(parcelaPreliminar4),
        parcelaPreliminar5: parseInt(parcelaPreliminar5),
        areaPorArvore: areaPorArvoreCalc,
        densidadeArborea: densidadeArboreaCalc,
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
    } catch (error) {
      console.error('Erro ao atualizar os dados:', error);
      alert('Erro ao atualizar os dados.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <TextInput label="Nome da Medição" style={styles.input} value={nome_medicao} onChangeText={setNomeMedicao} />
        <TextInput label="Área (ha)" style={styles.input} value={area} keyboardType="decimal-pad" onChangeText={setArea} />
        <TextInput label="Número de linhas no renque" style={styles.input} value={numLinhasRenque} keyboardType="decimal-pad" onChangeText={setNumLinhasRenque} />
        <TextInput label="Distância entre renques (m)" style={styles.input} value={distRenques} keyboardType="decimal-pad" onChangeText={setDistRenques} />
        <TextInput
          label="Distância entre linhas (m)"
          style={styles.input}
          value={distLinhas}
          keyboardType="decimal-pad"
          onChangeText={(text) => {
            if (numLinhasRenque !== '1') setDistLinhas(text);
          }}
          editable={numLinhasRenque !== '1'}
        />
        <TextInput label="Distância entre árvores (m)" style={styles.input} value={distArvores} keyboardType="decimal-pad" onChangeText={setDistArvores} />

        {areaPorArvore !== null && (
          <>
            <TextInput label="Área por árvore (m²)" value={areaPorArvore.toFixed(2)} editable={false} style={styles.input} />
            <TextInput label="Densidade arbórea (árv./ha)" value={densidadeArborea?.toFixed(2) || ''} editable={false} style={styles.input} />
          </>
        )}

        {[1, 2, 3, 4, 5].map((index) => (
          <TextInput
            key={index}
            label={`Parcela Preliminar ${index} (árvores)`}
            keyboardType="number-pad"
            value={
              index === 1
                ? parcelaPreliminar1
                : index === 2
                ? parcelaPreliminar2
                : index === 3
                ? parcelaPreliminar3
                : index === 4
                ? parcelaPreliminar4
                : parcelaPreliminar5
            }
            onChangeText={
              index === 1
                ? setParcelaPreliminar1
                : index === 2
                ? setParcelaPreliminar2
                : index === 3
                ? setParcelaPreliminar3
                : index === 4
                ? setParcelaPreliminar4
                : setParcelaPreliminar5
            }
            style={styles.input}
          />
        ))}

        <TouchableOpacity onPress={saveData} style={styles.button}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditScreen;
