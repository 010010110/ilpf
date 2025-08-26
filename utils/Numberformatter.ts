import { Alert } from "react-native";

export function formatarNumeroBR(numero: number | null) {
  if(numero === null) return ''
  const partes = numero.toFixed(2).split('.');
  const inteiro = partes[0];
  const decimal = partes[1];

  const inteiroFormatado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${inteiroFormatado},${decimal}`;
}

export function formatarNumeroBRNoDecimal(numero: number | null) {
  if(numero === null) return ''
  const partes = numero.toFixed(2).split('.');
  const inteiro = partes[0];
  const decimal = partes[1];

  const inteiroFormatado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${inteiroFormatado}`;
}

 export function limparEntradaDecimal(valor: string): string {
    let limpo = valor.replace(/[^\d.]/g, '');
    const partes = limpo.split('.');
    if (partes.length > 2) {
      limpo = partes[0] + '.' + partes.slice(1).join('');
    }
    if (partes.length === 2 && partes[1].length > 2) {
      limpo = partes[0] + '.' + partes[1].substring(0, 2);
    }
    return limpo;
  };

  export function limparEntradaInteira(valor: string): string {
    return valor.replace(/[^\d]/g, '');
  };

  export function alertarVirgula() {
    Alert.alert(
      'Formato Numérico',
      'Use ponto (.) para separar decimais.\n\nExemplo correto: 15.5\nExemplo incorreto: 15,5',
      [{ text: 'Entendi' }]
    );
  };