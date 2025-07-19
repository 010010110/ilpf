import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { insertItem } from '../database/db';
import { RootStackParamList } from '@/utils/types';
import styles from '../styles/FormScreen.styles';
import {
  calcularAreaPorArvore,
  calcularDensidadeArborea,
  calcularDensidadeParcela,
  calcularDimensoesParcela,
  calcularDistanciaEntreParcelas,
  calcularNumArvoresParcelas,
  calcularNumParcelas,
  calcularTaxaOcupacaoSolo,
  calcularTotalArvores,
  calcularTotalArvoresMonitoradas,
} from '@/utils/calculos';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Config } from '@/utils/config';
import { formatarNumeroBR } from '@/utils/Numberformatter';

const FormScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [nome_medicao, setNomeMedicao] = useState('');
  const [area, setArea] = useState('');
  const [distRenques, setDistRenques] = useState('');
  const [numLinhasRenque, setNumLinhasRenque] = useState('');
  const [distLinhas, setDistLinhas] = useState('');
  const [distArvores, setDistArvores] = useState('');

  const [areaPorArvore, setAreaPorArvore] = useState<number | null>(null);
  const [densidadeArborea, setDensidadeArborea] = useState<number | null>(null);
  const [etapa2Visivel, setEtapa2Visivel] = useState(false);

  const [parcelaPreliminar1, setParcelaPreliminar1] = useState('');
  const [parcelaPreliminar2, setParcelaPreliminar2] = useState('');
  const [parcelaPreliminar3, setParcelaPreliminar3] = useState('');
  const [parcelaPreliminar4, setParcelaPreliminar4] = useState('');
  const [parcelaPreliminar5, setParcelaPreliminar5] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Verifica se todos os campos da etapa 1 foram preenchidos
  useEffect(() => {
    const camposOk =
      nome_medicao &&
      area &&
      distRenques &&
      numLinhasRenque &&
      distLinhas &&
      distArvores;

    if (camposOk) {
      const areaCalculada = calcularAreaPorArvore(
        parseFloat(distRenques),
        parseFloat(distArvores),
        parseInt(numLinhasRenque),
        parseFloat(distLinhas)
      );
      const densidadeCalculada = calcularDensidadeArborea(areaCalculada);
      setAreaPorArvore(areaCalculada);
      setDensidadeArborea(densidadeCalculada);
      setEtapa2Visivel(true);
    } else {
      setEtapa2Visivel(false);
      setAreaPorArvore(null);
      setDensidadeArborea(null);
    }
  }, [nome_medicao, area, distRenques, numLinhasRenque, distLinhas, distArvores]);

  const saveData = async () => {
    const erroPermitido = Config.erroPermitido;

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

    await insertItem(
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
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <TextInput label="Nome da Medição" style={styles.input} value={nome_medicao} onChangeText={setNomeMedicao} />
        <TextInput label="Área (ha)" style={styles.input} value={area} keyboardType="decimal-pad" onChangeText={setArea} />
        <TextInput label="Distância entre renques (m)" style={styles.input} value={distRenques} keyboardType="decimal-pad" onChangeText={setDistRenques} />
        <TextInput label="Número de linhas no renque" style={styles.input} value={numLinhasRenque} keyboardType="decimal-pad" onChangeText={setNumLinhasRenque} />
        <TextInput label="Distância entre linhas (m)" style={styles.input} value={distLinhas} keyboardType="decimal-pad" onChangeText={setDistLinhas} />
        <TextInput label="Distância entre árvores (m)" style={styles.input} value={distArvores} keyboardType="decimal-pad" onChangeText={setDistArvores} />

        {etapa2Visivel && (
          <>
            <TextInput label="Área por árvore (m²)" style={styles.input} value={formatarNumeroBR(areaPorArvore) || ''} editable={false} />
            <TextInput label="Densidade arbórea (árv./ha)" style={styles.input} value={formatarNumeroBR(densidadeArborea) || ''} editable={false} />

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
          </>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default FormScreen;
