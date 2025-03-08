import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { insertItem } from '../database/db';
import { RootStackParamList } from '@/utils/types';
import styles from '../styles/FormScreen.styles';
import { calcularAreaPorArvore, calcularDensidadeArborea, calcularDensidadeParcela, calcularDimensoesParcela, calcularDistanciaEntreParcelas, calcularNumArvoresParcelas, calcularNumParcelas, calcularTaxaOcupacaoSolo, calcularTotalArvores, calcularTotalArvoresMonitoradas } from '@/utils/calculos';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const FormScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Estados para os campos do formulário
  const [nome_medicao, setNomeMedicao] = useState('');
  const [area, setArea] = useState('');
  const [distRenques, setDistRenques] = useState('');
  const [numLinhasRenque, setNumLinhasRenque] = useState('');
  const [distLinhas, setDistLinhas] = useState('');
  const [distArvores, setDistArvores] = useState('');
  const [erroPermitido, setErroPermitido] = useState('');
  const [parcelaPreliminar1, setParcelaPreliminar1] = useState('');
  const [parcelaPreliminar2, setParcelaPreliminar2] = useState('');
  const [parcelaPreliminar3, setParcelaPreliminar3] = useState('');
  const [parcelaPreliminar4, setParcelaPreliminar4] = useState('');
  const [parcelaPreliminar5, setParcelaPreliminar5] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Função para calcular os resultados
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
    const totalArvoresMonitoradas = calcularTotalArvoresMonitoradas(
      numParcelasCalculado,
      Math.round(
        (parseInt(parcelaPreliminar1) +
          parseInt(parcelaPreliminar2) +
          parseInt(parcelaPreliminar3) +
          parseInt(parcelaPreliminar4) +
          parseInt(parcelaPreliminar5)) /
          5
      )
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
      await insertItem(
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
      console.error('Erro ao salvar os dados:', error);
      alert('Erro ao salvar os dados.');
    }
  };

   useEffect(() => {
      if (numLinhasRenque === '1') {
        setDistLinhas(distRenques); // Define distLinhasRenque igual a distRenques
      }
    }, [numLinhasRenque, distRenques]);

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
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
        editable={numLinhasRenque !== '1'}
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
      </SafeAreaView>
    </ScrollView>
  );
};

export default FormScreen;