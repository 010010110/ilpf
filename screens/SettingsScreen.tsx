import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button, Text, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Config, setErroPermitido } from '@/utils/config';
import styles from '../styles/FormScreen.styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
	const navigation = useNavigation();
	const [valorErro, setValorErro] = useState('');
	const [carregado, setCarregado] = useState(false);

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
		<SafeAreaView style={{ flex: 1 }}>

			{/* <View style={styles.container}> */}
				<Appbar.Header>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<MaterialCommunityIcons name="cog" size={24} color="#666" style={{ marginRight: 8 }} />
						<Text style={{
							fontSize: 25,
							color: '#666',
							fontFamily: 'Roboto-Medium',
							letterSpacing: 0.5,
							fontWeight: 'bold'
						}}>
							Configurações
						</Text>
					</View>
				</Appbar.Header>

				<ScrollView contentContainerStyle={{ padding: 16 }}>
					<Text style={styles.sectionTitle}>Parâmetros do sistema</Text>

					<TextInput
						style={styles.input}
						label="Erro permitido (%)"
						value={valorErro}
						keyboardType="number-pad"
						onChangeText={(text) => setValorErro(text)}
					/>

					<Button
						mode="contained"
						onPress={salvar}
						style={styles.button}
					>
						Salvar
					</Button>
				</ScrollView>
			{/* </View> */}
		</SafeAreaView>
	);
};

export default SettingsScreen;
