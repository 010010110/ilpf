export default {
  // Cores principais
  primary: '#2E7D32',        // Verde escuro principal - botões, títulos importantes
  primaryLight: '#4CAF50',   // Verde médio - estados hover, highlights
  primaryDark: '#1B5E20',    // Verde muito escuro - textos importantes, borders
  
  // Cores secundárias
  secondary: '#8BC34A',      // Verde claro - elementos secundários
  secondaryLight: '#DCEDC8', // Verde muito claro - backgrounds suaves
  
  // Cores de apoio (tons terrosos)
  accent: '#FF8F00',         // Laranja - alertas, atenção
  accentLight: '#FFE0B2',    // Laranja claro - backgrounds de alerta
  
  warning: '#F57C00',        // Amarelo alaranjado - avisos
  warningLight: '#FFF3E0',   // Amarelo claro - background de avisos
  
  error: '#D32F2F',          // Vermelho - erros
  errorLight: '#FFEBEE',     // Vermelho claro - background de erros
  
  success: '#388E3C',        // Verde de sucesso
  successLight: '#E8F5E8',   // Verde claro de sucesso
  
  // Cores neutras
  background: '#FAFAFA',     // Cinza muito claro - fundo principal
  surface: '#FFFFFF',        // Branco - cards, superfícies elevadas
  surfaceVariant: '#F5F5F5', // Cinza claro - superfícies alternativas
  
  // Cores de texto
  onPrimary: '#FFFFFF',      // Texto sobre cores primárias
  onSecondary: '#000000',    // Texto sobre cores secundárias
  onBackground: '#212121',   // Texto principal sobre fundo
  onSurface: '#212121',      // Texto sobre superfícies
  
  text: {
    primary: '#212121',      // Texto principal - preto quase
    secondary: '#757575',    // Texto secundário - cinza médio
    disabled: '#BDBDBD',     // Texto desabilitado - cinza claro
    hint: '#9E9E9E',         // Texto de dica - cinza
  },
  
  // Cores de borda e divisores
  border: '#E0E0E0',         // Bordas padrão
  borderLight: '#F0F0F0',    // Bordas suaves
  divider: '#EEEEEE',        // Divisores
  
  // Estados especiais
  incomplete: {
    background: '#FFF8E1',   // Fundo para itens incompletos
    border: '#FF8F00',       // Borda para itens incompletos
    text: '#E65100',         // Texto para itens incompletos
  },
  
  complete: {
    background: '#E8F5E8',   // Fundo para itens completos  
    border: '#4CAF50',       // Borda para itens completos
    text: '#2E7D32',         // Texto para itens completos
  },
  
  // Gradientes
  gradients: {
    primary: ['#2E7D32', '#4CAF50'],     // Gradiente verde principal
    secondary: ['#8BC34A', '#DCEDC8'],   // Gradiente verde secundário
    accent: ['#FF8F00', '#FFE0B2'],      // Gradiente laranja
  },
  
  // Sombras e elevações
  shadow: {
    light: 'rgba(0, 0, 0, 0.08)',   // Sombra leve
    medium: 'rgba(0, 0, 0, 0.16)',  // Sombra média
    dark: 'rgba(0, 0, 0, 0.24)',    // Sombra escura
  },
  
  // Transparências
  overlay: {
    light: 'rgba(255, 255, 255, 0.9)',  // Overlay claro
    dark: 'rgba(0, 0, 0, 0.5)',         // Overlay escuro
  },
};

// Função utilitária para obter cor com opacidade
export const withOpacity = (color: string, opacity: number): string => {
  // Remove # se presente
  const hex = color.replace('#', '');
  
  // Converte para RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Função para obter cor baseada no tema (preparação para dark mode futuro)
export const getThemeColor = (colorKey: string, isDark = false): string => {
  // Por enquanto retorna apenas light mode
  // No futuro pode ser expandido para dark mode
  return colorKey;
};