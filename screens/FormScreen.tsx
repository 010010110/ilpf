import React, { useState, useEffect } from 'react';
import { TextInput, ScrollView, Text, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { initDb, insertItem } from '../database/db';
import { RootStackParamList } from '@/utils/types';
import styles from '../styles/FormScreen.styles';
import colors from '@/utils/colors';

const FormScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  const [area, setArea] = useState('');
  const [distRenques, setDistRenques] = useState('');
  const [numLinhasRenque, setNumLinhasRenque] = useState('');
  const [distLinhas, setDistLinhas] = useState('');
  const [distArvores, setDistArvores] = useState('');
  const [numArvores, setNumArvores] = useState('');
  const [erroPermitido, setErroPermitido] = useState('');
  const [numParcelas, setNumParcelas] = useState('');
  // const [nomeMedicao, setNomeMedicao] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const setupDatabase = async () => {
      await initDb();
    };
    setupDatabase();
  }, []);

  const calculateResults = () => {
    const areaPorArvore = parseFloat(distRenques) * parseFloat(distArvores);
    const densidadeArborea = 10000 / areaPorArvore;
    const faixaAleia = parseFloat(distRenques);
    const faixaRenque = (parseInt(numLinhasRenque) - 1) * parseFloat(distLinhas);
    const larguraParcela = 2 * (faixaAleia + faixaRenque);
    const comprimentoParcela = parseFloat(distArvores) * 12;
    const areaParcela = larguraParcela * comprimentoParcela;
    const numArvoresPorParcela = (comprimentoParcela * 2 * parseInt(numLinhasRenque)) / parseFloat(distArvores);

    return {
      areaPorArvore,
      densidadeArborea,
      larguraParcela,
      comprimentoParcela,
      areaParcela,
      numArvoresPorParcela,
    };
  };

  const saveData = async () => {
    try {
      await insertItem(
        parseFloat(area),
        parseFloat(distRenques),
        parseInt(numLinhasRenque),
        parseFloat(distLinhas),
        parseFloat(distArvores),
        parseInt(numArvores),
        parseFloat(erroPermitido),
        parseInt(numParcelas),
      );
  
      const results = calculateResults();
  
      navigation.navigate('Result', {
        area: parseFloat(area),
        distRenques: parseFloat(distRenques),
        numLinhasRenque: parseInt(numLinhasRenque),
        distLinhas: parseFloat(distLinhas),
        distArvores: parseFloat(distArvores),
        numArvores: parseInt(numArvores),
        erroPermitido: parseFloat(erroPermitido),
        numParcelas: parseInt(numParcelas),
        ...results,
      });
    } catch (error) {
      console.error('Erro ao inserir dados:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* <TextInput
        placeholder="Nome da Medição"
        value={nomeMedicao}
        onChangeText={setNomeMedicao}
        onFocus={() => setFocusedField('nomeMedicao')}
        onBlur={() => setFocusedField(null)}
        style={[
          styles.input,
          focusedField === 'nomeMedicao' && styles.inputFocused
        ]}
        placeholderTextColor={colors.placeholder}
      /> */}
      <TextInput
        placeholder="Área (ha)"
        keyboardType="decimal-pad"
        value={area}
        onChangeText={setArea}
        onFocus={() => setFocusedField('area')}
        onBlur={() => setFocusedField(null)}
        style={[
          styles.input,
          focusedField === 'area' && styles.inputFocused
        ]}
        placeholderTextColor={colors.placeholder}
      />
      <TextInput
        placeholder="Distância entre renques (m)"
        keyboardType="decimal-pad"
        value={distRenques}
        onChangeText={setDistRenques}
        onFocus={() => setFocusedField('distRenques')}
        onBlur={() => setFocusedField(null)}
        style={[
          styles.input,
          focusedField === 'distRenques' && styles.inputFocused
        ]}
        placeholderTextColor={colors.placeholder}
      />
      <TextInput
        placeholder="Número de linhas no renque"
        keyboardType="number-pad"
        value={numLinhasRenque}
        onChangeText={setNumLinhasRenque}
        onFocus={() => setFocusedField('numLinhasRenque')}
        onBlur={() => setFocusedField(null)}
        style={[
          styles.input,
          focusedField === 'numLinhasRenque' && styles.inputFocused
        ]}
        placeholderTextColor={colors.placeholder}
      />
      <TextInput
        placeholder="Distância entre linhas (m)"
        keyboardType="decimal-pad"
        value={distLinhas}
        onChangeText={setDistLinhas}
        onFocus={() => setFocusedField('distLinhas')}
        onBlur={() => setFocusedField(null)}
        style={[
          styles.input,
          focusedField === 'distLinhas' && styles.inputFocused
        ]}
        placeholderTextColor={colors.placeholder}
      />
      <TextInput
        placeholder="Distância entre árvores (m)"
        keyboardType="decimal-pad"
        value={distArvores}
        onChangeText={setDistArvores}
        onFocus={() => setFocusedField('distArvores')}
        onBlur={() => setFocusedField(null)}
        style={[
          styles.input,
          focusedField === 'distArvores' && styles.inputFocused
        ]}
        placeholderTextColor={colors.placeholder}
      />
      <TextInput
        placeholder="Número de árvores"
        keyboardType="number-pad"
        value={numArvores}
        onChangeText={setNumArvores}
        onFocus={() => setFocusedField('numArvores')}
        onBlur={() => setFocusedField(null)}
        style={[
          styles.input,
          focusedField === 'numArvores' && styles.inputFocused
        ]}
        placeholderTextColor={colors.placeholder}
      />
      <TextInput
        placeholder="Erro permitido (%)"
        keyboardType="decimal-pad"
        value={erroPermitido}
        onChangeText={setErroPermitido}
        onFocus={() => setFocusedField('erroPermitido')}
        onBlur={() => setFocusedField(null)}
        style={[
          styles.input,
          focusedField === 'erroPermitido' && styles.inputFocused
        ]}
        placeholderTextColor={colors.placeholder}
      />
      <TextInput
        placeholder="Número de parcelas preliminares"
        keyboardType="number-pad"
        value={numParcelas}
        onChangeText={setNumParcelas}
        onFocus={() => setFocusedField('numParcelas')}
        onBlur={() => setFocusedField(null)}
        style={[
          styles.input,
          focusedField === 'numParcelas' && styles.inputFocused
        ]}
        placeholderTextColor={colors.placeholder}
      />
      
      <TouchableOpacity onPress={saveData} style={styles.button}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default FormScreen;
