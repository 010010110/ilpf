import React from 'react';
import { ScrollView, View, Image, Linking, TouchableOpacity } from 'react-native';
import { Text, Card, Divider, Appbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../styles/About.styles';
import colors from '@/utils/colors';

const AboutScreen = () => {
  const openLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Erro ao abrir link:', error);
    }
  };

  const appVersion = "1.0.0"; // Versão do app
  const buildDate = "2024";

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="information-outline" size={24} color={colors.primary} style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Sobre o Aplicativo</Text>
        </View>
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Card do App */}
        <Card style={styles.appCard}>
          <View style={styles.appHeader}>
            <View style={styles.appIconContainer}>
              <MaterialCommunityIcons name="forest" size={60} color={colors.primary} />
            </View>
            <View style={styles.appInfo}>
              <Text style={styles.appTitle}>ILPF Inventário</Text>
              <Text style={styles.appSubtitle}>Integração Lavoura-Pecuária-Floresta</Text>
              <View style={styles.versionBadge}>
                <Text style={styles.versionText}>v{appVersion}</Text>
              </View>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <Text style={styles.appDescription}>
            Este aplicativo foi desenvolvido para fornecer uma solução prática e eficiente para o 
            inventário florestal em sistemas de Integração Lavoura-Pecuária-Floresta (ILPF), 
            facilitando o trabalho de pesquisadores, produtores e técnicos no campo.
          </Text>
        </Card>

        {/* Card de Recursos */}
        <Card style={styles.featuresCard}>
          <Text style={styles.sectionTitle}>
            <MaterialCommunityIcons name="star-outline" size={20} color={colors.primary} /> 
            {' '}Principais Recursos
          </Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="calculator-variant" size={20} color={colors.secondary} />
              <Text style={styles.featureText}>Cálculos automáticos de densidade arbórea</Text>
            </View>
            
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="chart-bar" size={20} color={colors.secondary} />
              <Text style={styles.featureText}>Resultados preliminares em tempo real</Text>
            </View>
            
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="map-marker-radius" size={20} color={colors.secondary} />
              <Text style={styles.featureText}>Dimensionamento de parcelas amostrais</Text>
            </View>
            
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="database" size={20} color={colors.secondary} />
              <Text style={styles.featureText}>Armazenamento local seguro</Text>
            </View>
            
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="clipboard-list" size={20} color={colors.secondary} />
              <Text style={styles.featureText}>Gestão de medições incompletas</Text>
            </View>
          </View>
        </Card>

        {/* Card da Equipe */}
        <Card style={styles.teamCard}>
          <Text style={styles.sectionTitle}>
            <MaterialCommunityIcons name="account-group" size={20} color={colors.primary} />
            {' '}Equipe de Desenvolvimento
          </Text>
          
          <View style={styles.teamMember}>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>Gabriel Carneiro de Arruda</Text>
              <Text style={styles.memberRole}>Desenvolvedor</Text>
            </View>
            <MaterialCommunityIcons name="code-tags" size={24} color={colors.accent} />
          </View>
          
          <Divider style={styles.divider} />
          
          <Text style={styles.supervisorTitle}>Orientação Acadêmica:</Text>
          
          <View style={styles.teamMember}>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>Profª. Dra. Alaine Margarete Guimarães</Text>
              <Text style={styles.memberRole}>Orientadora</Text>
            </View>
            <MaterialCommunityIcons name="school" size={24} color={colors.primary} />
          </View>
          
          <View style={styles.teamMember}>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>Prof. Dr. Vanderley Porfirio da Silva</Text>
              <Text style={styles.memberRole}>Orientador</Text>
            </View>
            <MaterialCommunityIcons name="school" size={24} color={colors.primary} />
          </View>
        </Card>

        {/* Card das Instituições */}
        <Card style={styles.institutionsCard}>
          <Text style={styles.sectionTitle}>
            <MaterialCommunityIcons name="domain" size={20} color={colors.primary} />
            {' '}Instituições Parceiras
          </Text>
          
          <TouchableOpacity 
            style={styles.institutionItem}
            onPress={() => openLink('https://www.uepg.br/')}
            activeOpacity={0.7}
          >
            <View style={styles.institutionLogo}>
              <MaterialCommunityIcons name="school" size={32} color={colors.primary} />
            </View>
            <View style={styles.institutionInfo}>
              <Text style={styles.institutionName}>UEPG</Text>
              <Text style={styles.institutionFullName}>Universidade Estadual de Ponta Grossa</Text>
              <Text style={styles.institutionDescription}>Ensino, pesquisa e extensão de qualidade</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.primary} />
          </TouchableOpacity>
          
          <Divider style={styles.divider} />
          
          <TouchableOpacity 
            style={styles.institutionItem}
            onPress={() => openLink('https://www.embrapa.br/')}
            activeOpacity={0.7}
          >
            <View style={styles.institutionLogo}>
              <MaterialCommunityIcons name="leaf" size={32} color={colors.success} />
            </View>
            <View style={styles.institutionInfo}>
              <Text style={styles.institutionName}>EMBRAPA</Text>
              <Text style={styles.institutionFullName}>Empresa Brasileira de Pesquisa Agropecuária</Text>
              <Text style={styles.institutionDescription}>Inovação e sustentabilidade para o agronegócio</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.success} />
          </TouchableOpacity>
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <MaterialCommunityIcons name="forest" size={16} color={colors.primary} />
          <Text style={styles.footerText}>
            Desenvolvido para a sustentabilidade rural
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;