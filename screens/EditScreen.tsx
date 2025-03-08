import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/utils/types';
import styles from '../styles/FormScreen.styles';
import { updateItem } from '../database/db';
import { calcularAreaPorArvore, calcularDensidadeArborea, calcularTaxaOcupacaoSolo, calcularTotalArvores, calcularDimensoesParcela, calcularDensidadeParcela, calcularNumParcelas, calcularDistanciaEntreParcelas, calcularTotalArvoresMonitoradas, calcularNumArvoresParcelas } from '@/utils/calculos';

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
  const [erroPermitido, setErroPermitido] = useState(route.params.erroPermitido.toString());
  const [parcelaPreliminar1, setParcelaPreliminar1] = useState(route.params.parcelaPreliminar1.toString());
  const [parcelaPreliminar2, setParcelaPreliminar2] = useState(route.params.parcelaPreliminar2.toString());
  const [parcelaPreliminar3, setParcelaPreliminar3] = useState(route.params.parcelaPreliminar3.toString());
  const [parcelaPreliminar4, setParcelaPreliminar4] = useState(route.params.parcelaPreliminar4.toString());
  const [parcelaPreliminar5, setParcelaPreliminar5] = useState(route.params.parcelaPreliminar5.toString());
  const [focusedField, setFocusedField] = useState<string | null>(null);

 const calculateResults = () => {
    const areaPorArvore = calcularAreaPorArvore(
      parseFloat(distRenques),
      parseFloat(distArvores),
      parseInt(numLinhasRenque),
      parseFloat(distLinhas)
    );

    const densidadeArborea = calcularDensidadeArborea(areaPorArvore);

    const taxaOcupacaoSolo = calcularTaxaOcupacaoSolo(
      parseFloat(distRenques),
      parseInt(numLinhasRenque),
      parseFloat(distLinhas)
    );

    const totalArvores = calcularTotalArvores(
      parseFloat(area),
      densidadeArborea
    );

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
      parseFloat(erroPermitido)
    );

    const distanciaEntreParcelas = calcularDistanciaEntreParcelas(
      parseFloat(area),
      numParcelasCalculado
    );

    const calculaMediaParcelas = (
      +parcelaPreliminar1 +
      +parcelaPreliminar2 +
      +parcelaPreliminar3 +
      +parcelaPreliminar4 +
      +parcelaPreliminar5) /
      5

    const totalArvoresMonitoradas = calcularTotalArvoresMonitoradas(
      numParcelasCalculado,
      calculaMediaParcelas
    );

    const numArvoreParcela = calcularNumArvoresParcelas(areaTotal, areaPorArvore);
    

    return {
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
    };
  };

  // Função para salvar os dados no banco e navegar para a tela de resultados
  const saveData = async () => {
    try {
      // Validação básica dos campos
      if (
        !nome_medicao ||
        !area ||
        !distRenques ||
        !numLinhasRenque ||
        !distLinhas ||
        !distArvores ||
        !erroPermitido ||
        !parcelaPreliminar1 ||
        !parcelaPreliminar2 ||
        !parcelaPreliminar3 ||
        !parcelaPreliminar4 ||
        !parcelaPreliminar5
      ) {
        alert('Preencha todos os campos obrigatórios.');
        return;
      }

      // Insere os dados no banco
      await updateItem(
        route.params.id,
        nome_medicao,
        parseFloat(area),
        parseFloat(distRenques),
        parseInt(numLinhasRenque),
        parseFloat(distLinhas),
        parseFloat(distArvores),
        parseFloat(erroPermitido),
        parseInt(parcelaPreliminar1),
        parseInt(parcelaPreliminar2),
        parseInt(parcelaPreliminar3),
        parseInt(parcelaPreliminar4),
        parseInt(parcelaPreliminar5)
      );

      // Calcula os resultados
      const results = calculateResults();

      // Navega para a tela de resultados
      navigation.navigate('Result', {
        nome_medicao,
        area: parseFloat(area),
        distRenques: parseFloat(distRenques),
        numLinhasRenque: parseInt(numLinhasRenque),
        distLinhas: parseFloat(distLinhas),
        distArvores: parseFloat(distArvores),
        erroPermitido: parseFloat(erroPermitido),
        parcelaPreliminar1: parseInt(parcelaPreliminar1),
        parcelaPreliminar2: parseInt(parcelaPreliminar2),
        parcelaPreliminar3: parseInt(parcelaPreliminar3),
        parcelaPreliminar4: parseInt(parcelaPreliminar4),
        parcelaPreliminar5: parseInt(parcelaPreliminar5),
        ...results,
      });
    } catch (error) {
      console.error('Erro ao atualizar os dados:', error);
      alert('Erro ao atualizar os dados.');
    }
  };

  useEffect(() => {
    if (numLinhasRenque === '1') {
      setDistLinhas(distRenques); // Define distLinhasRenque igual a distRenques
    }
  }, [numLinhasRenque, distRenques]);

  return (
    <ScrollView style={styles.container}>
      <View >
        <TextInput
          label="Nome da Medição"
          style={[
            styles.input,
            focusedField === 'nome_medicao' && styles.inputFocused,
          ]}
          value={nome_medicao}
          onChangeText={setNomeMedicao}
          onFocus={() => setFocusedField('nome_medicao')}
          onBlur={() => setFocusedField(null)}
        />
        <TextInput
          label="Área (ha)"
          style={[
            styles.input,
            focusedField === 'area' && styles.inputFocused,
          ]}
          value={area}
          keyboardType="decimal-pad"
          onChangeText={setArea}
          onFocus={() => setFocusedField('area')}
          onBlur={() => setFocusedField(null)}
        />
         <TextInput
        label="Número de linhas no renque"
        style={[
          styles.input,
          focusedField === 'numLinhasRenque' && styles.inputFocused,
        ]}
        value={numLinhasRenque}
        keyboardType="decimal-pad"
        onChangeText={setNumLinhasRenque}
        onFocus={() => setFocusedField('numLinhasRenque')}
        onBlur={() => setFocusedField(null)}
      />
      <TextInput
        label="Distância entre renques (m)"
        style={[
          styles.input,
          focusedField === 'distRenques' && styles.inputFocused,
        ]}
        value={distRenques}
        keyboardType="decimal-pad"
        onChangeText={setDistRenques}
        onFocus={() => setFocusedField('distRenques')}
        onBlur={() => setFocusedField(null)}
      />
      <TextInput
        label="Distância entre linhas (m)"
        style={[
          styles.input,
          focusedField === 'distLinhasRenque' && styles.inputFocused,
        ]}
        value={distLinhas}
        keyboardType="decimal-pad"
        onChangeText={(text) => {
          if (numLinhasRenque !== '1') setDistLinhas(text);
        }}
        editable={numLinhasRenque !== '1'} // Bloqueia edição manual se for 1
        onFocus={() => setFocusedField('distLinhasRenque')}
        onBlur={() => setFocusedField(null)}
      />
        <TextInput
          label="Distância entre árvores (m)"
          style={[
            styles.input,
            focusedField === 'distArvores' && styles.inputFocused,
          ]}
          value={distArvores}
          keyboardType="decimal-pad"
          onChangeText={setDistArvores}
          onFocus={() => setFocusedField('distArvores')}
          onBlur={() => setFocusedField(null)}
        />
        <TextInput
          label="Erro permitido (%)"
          style={[
            styles.input,
            focusedField === 'erroPermitido' && styles.inputFocused,
          ]}
          value={erroPermitido}
          keyboardType="decimal-pad"
          onChangeText={setErroPermitido}
          onFocus={() => setFocusedField('erroPermitido')}
          onBlur={() => setFocusedField(null)}
        />
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
            onFocus={() => setFocusedField(`parcelaPreliminar${index}`)}
            onBlur={() => setFocusedField(null)}
            style={[
              styles.input,
              focusedField === `parcelaPreliminar${index}` && styles.inputFocused,
            ]}
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
