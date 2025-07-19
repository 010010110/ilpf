import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Config, setErroPermitido } from '@/utils/config';
import styles from '../styles/FormScreen.styles';

const SettingsScreen = () => {
	const navigation = useNavigation();
	const [valorErro, setValorErro] = useState('');
	const [carregado, setCarregado] = useState(false);
	const [focusedField, setFocusedField] = useState<string | null>(null);


	useEffect(() => {
		setValorErro(Config.erroPermitido.toString());
		setCarregado(true);
	}, []);

	const salvar = () => {
		const valorNumerico = parseFloat(valorErro.replace(',', '.'));

		if (!valorErro.trim()) {
			Alert.alert('Campo vazio', 'Digite um valor para erro permitido.');
			return;
		}

		if (isNaN(valorNumerico) || valorNumerico <= 0) {
			Alert.alert('Valor inválido', 'Digite um número maior que zero.');
			return;
		}

		setErroPermitido(valorNumerico);
		Alert.alert('Sucesso', `Erro permitido atualizado para ${valorNumerico}%`);
		navigation.goBack();
	};

	if (!carregado) return null;

	return (
		<View style={styles.container}>
			<Text>Configurações</Text>

			<TextInput
				label="Erro permitido (%)"
				value={valorErro}
				style={[styles.input, focusedField === 'erroPermitido' && styles.inputFocused]}
				onChangeText={setValorErro}
				// keyboardType="numeric"
				returnKeyType="done"
			/>

			<Button mode="contained" onPress={salvar} style={styles.button}>
				Salvar
			</Button>
		</View>
	);
};

export default SettingsScreen;
