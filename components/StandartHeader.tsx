import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '@/utils/colors';
import styles from '../styles/StandartHeeader.styles';

interface StandardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string; // Nome do ícone do MaterialCommunityIcons
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightActions?: HeaderAction[];
  backgroundColor?: string;
  titleColor?: string;
  iconColor?: string;
}

interface HeaderAction {
  icon: string;
  label?: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
}

const StandardHeader: React.FC<StandardHeaderProps> = ({
  title,
  subtitle,
  icon,
  showBackButton = false,
  onBackPress,
  rightActions = [],
  backgroundColor = colors.surface,
  titleColor = colors.text.primary,
  iconColor = colors.primary,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <Appbar.Header style={[styles.header, { backgroundColor }]}>
      <View style={styles.headerContent}>
        {/* Lado esquerdo - Back button (se necessário) */}
        {showBackButton && (
          <TouchableOpacity 
            onPress={handleBackPress}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons 
              name="chevron-left" 
              size={28} 
              color={iconColor} 
            />
          </TouchableOpacity>
        )}

        {/* Centro - Ícone, título e subtítulo */}
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            {icon && (
              <MaterialCommunityIcons 
                name={icon as any} 
                size={24} 
                color={iconColor} 
                style={styles.titleIcon} 
              />
            )}
            <View style={styles.titleTextContainer}>
              <Text style={[styles.title, { color: titleColor }]}>
                {title}
              </Text>
              {subtitle && (
                <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                  {subtitle}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Lado direito - Actions */}
        <View style={styles.actionsContainer}>
          {rightActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={action.onPress}
              style={[
                styles.actionButton,
                action.disabled && styles.actionButtonDisabled
              ]}
              disabled={action.disabled}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={action.icon as any}
                size={24}
                color={action.disabled ? colors.text.disabled : (action.color || iconColor)}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Appbar.Header>
  );
};

export default StandardHeader;


export const ListScreenHeader = () => (
  <StandardHeader
    title="Medições"
    icon="format-list-bulleted"
  />
);

export const FormScreenHeader = ({ isEditing = false }: { isEditing?: boolean }) => (
  <StandardHeader
    title={isEditing ? "Completar Medição" : "Nova Medição"}
    icon="clipboard-list"
    showBackButton={isEditing}
  />
);

export const ResultsScreenHeader = () => (
  <StandardHeader
    title="Resultados"
    icon="calculator-variant"
    showBackButton
  />
);

export const SettingsScreenHeader = () => (
  <StandardHeader
    title="Configurações"
    subtitle="Parâmetros e preferências"
    icon="cog"
  />
);

export const AboutScreenHeader = () => (
  <StandardHeader
    title="Sobre o Aplicativo"
    subtitle="Informações e créditos"
    icon="information-outline"
  />
);

export const EditScreenHeader = () => (
  <StandardHeader
    title="Editar Medição"
    icon="pencil"
    showBackButton
  />
);