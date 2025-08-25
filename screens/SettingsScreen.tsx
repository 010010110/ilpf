import React, { useEffect, useState } from 'react';
import { ScrollView, View, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Card, Switch, Divider, Appbar, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Config, setErroPermitido } from '@/utils/config';
import { resetDatabase } from '@/database/db';
import styles from '../styles/SettingsScreen.style';
import colors from '@/utils/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
  const navigation = useNavigation();
  
  // Estados das configurações
  const [valorErro, setValorErro] = useState('');
  const [carregado, setCarregado] = useState(false);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const [backupAutomatico, setBackupAutomatico] = useState(false);
  const [modoEscuro, setModoEscuro] = useState(false);
  const [validacaoRigida, setValidacaoRigida] = useState(true);

  // Carregar configurações salvas
  useEffect(() => {
    const carregarConfiguracoes = () => {
      setValorErro(Config.erroPermitido.toString());
      // Aqui você pode carregar outras configurações salvas
      setCarregado(true);
    };
    
    carregarConfiguracoes();
  }, []);

  // Salvar erro permitido
  const salvarErroPermitido = () => {
    const valorNumerico = parseFloat(valorErro.replace(',', '.'));

    if (!valorErro.trim()) {
      Alert.alert('Campo vazio', 'Digite um valor para erro permitido.');
      return;
    }

    if (isNaN(valorNumerico) || valorNumerico <= 0 || valorNumerico > 50) {
      Alert.alert(
        'Valor inválido', 
        'Digite um número entre 0,1 e 50,0 para o erro permitido.'
      );
      return;
    }

    setErroPermitido(valorNumerico);
    Alert.alert(
      'Sucesso', 
      `Erro permitido atualizado para ${valorNumerico}%`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  // Resetar banco de dados
  const confirmarResetBanco = () => {
    Alert.alert(
      'Resetar Banco de Dados',
      'Esta ação irá apagar TODAS as medições salvas e não pode ser desfeita. Tem certeza que deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'RESETAR', 
          style: 'destructive',
          onPress: executarResetBanco
        }
      ]
    );
  };

  const executarResetBanco = async () => {
    try {
      await resetDatabase();
      Alert.alert(
        'Sucesso',
        'Banco de dados resetado com sucesso. Todas as medições foram removidas.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Erro ao resetar banco:', error);
      Alert.alert('Erro', 'Não foi possível resetar o banco de dados. Tente novamente.');
    }
  };

  // Exportar dados (funcionalidade futura)
  const exportarDados = () => {
    Alert.alert(
      'Funcionalidade em Desenvolvimento',
      'A exportação de dados será implementada em uma versão futura do aplicativo.',
      [{ text: 'OK' }]
    );
  };

  // Restaurar padrões
  const restaurarPadroes = () => {
    Alert.alert(
      'Restaurar Configurações Padrão',
      'Isso irá restaurar todas as configurações para os valores padrão. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Restaurar', 
          onPress: () => {
            setValorErro('5');
            setErroPermitido(5);
            setNotificacoesAtivas(true);
            setBackupAutomatico(false);
            setModoEscuro(false);
            setValidacaoRigida(true);
            Alert.alert('Sucesso', 'Configurações restauradas para os valores padrão.');
          }
        }
      ]
    );
  };

  if (!carregado) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="cog" size={24} color={colors.primary} style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Configurações</Text>
        </View>
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Card de Parâmetros do Sistema */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="tune-variant" size={22} color={colors.primary} />
            <Text style={styles.cardTitle}>Parâmetros do Sistema</Text>
          </View>
          
          <View style={styles.cardContent}>
            <Text style={styles.inputLabel}>Erro Permitido (%)</Text>
            <TextInput
              value={valorErro}
              onChangeText={setValorErro}
              keyboardType="decimal-pad"
              mode="outlined"
              style={styles.textInput}
              placeholder="Ex: 5.0"
              right={<TextInput.Icon icon="percent" />}
            />
            <Text style={styles.helperText}>
              Define a margem de erro aceitável nos cálculos estatísticos (recomendado: 5%)
            </Text>
            
            <Button
              mode="contained"
              onPress={salvarErroPermitido}
              style={styles.saveButton}
              contentStyle={styles.saveButtonContent}
              labelStyle={styles.saveButtonText}
            >
              Salvar Alteração
            </Button>
          </View>
        </Card>

        {/* Card de Dados */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="database" size={22} color={colors.primary} />
            <Text style={styles.cardTitle}>Gerenciamento de Dados</Text>
          </View>
          
          <View style={styles.cardContent}>
            
            <TouchableOpacity style={styles.actionButton} onPress={exportarDados}>
              <MaterialCommunityIcons name="export" size={20} color={colors.primary} />
              <View style={styles.actionButtonContent}>
                <Text style={styles.actionButtonText}>Exportar Dados</Text>
                <Text style={styles.actionButtonDescription}>Salvar medições em arquivo externo</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.primary} />
            </TouchableOpacity>

            <Divider style={styles.divider} />

            <TouchableOpacity style={styles.actionButton} onPress={restaurarPadroes}>
              <MaterialCommunityIcons name="restore" size={20} color={colors.secondary} />
              <View style={styles.actionButtonContent}>
                <Text style={[styles.actionButtonText, { color: colors.secondary }]}>
                  Restaurar Padrões
                </Text>
                <Text style={styles.actionButtonDescription}>Voltar às configurações originais</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.secondary} />
            </TouchableOpacity>

            <Divider style={styles.divider} />

            <TouchableOpacity style={styles.dangerButton} onPress={confirmarResetBanco}>
              <MaterialCommunityIcons name="delete-forever" size={20} color={colors.error} />
              <View style={styles.actionButtonContent}>
                <Text style={[styles.actionButtonText, { color: colors.error }]}>
                  Resetar Banco de Dados
                </Text>
                <Text style={styles.actionButtonDescription}>
                  Remove TODAS as medições permanentemente
                </Text>
              </View>
              <MaterialCommunityIcons name="alert-circle" size={20} color={colors.error} />
            </TouchableOpacity>

          </View>
        </Card>

        {/* Footer com dica */}
        <View style={styles.footer}>
          <MaterialCommunityIcons name="lightbulb-outline" size={16} color={colors.secondary} />
          <Text style={styles.footerText}>
            As configurações são salvas automaticamente no dispositivo
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;