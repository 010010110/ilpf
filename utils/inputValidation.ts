import React from 'react';
import { Alert } from 'react-native';

export const validarEntradaNumericaDecimal = (valor: string): string => {
  let valorLimpo = valor.replace(/[^\d.]/g, '');
  
  valorLimpo = valorLimpo.replace(/,/g, '');
  
  const partes = valorLimpo.split('.');
  if (partes.length > 2) {
    valorLimpo = partes[0] + '.' + partes.slice(1).join('');
  }
  
  if (partes.length === 2 && partes[1].length > 2) {
    valorLimpo = partes[0] + '.' + partes[1].substring(0, 2);
  }
  
  return valorLimpo;
};

export const validarEntradaNumericaInteira = (valor: string): string => {
  return valor.replace(/[^\d]/g, '');
};

export const isNumeroValido = (valor: string): boolean => {
  if (!valor.trim()) return false;
  const numero = parseFloat(valor);
  return !isNaN(numero) && numero > 0;
};

export const isInteiroValido = (valor: string): boolean => {
  if (!valor.trim()) return false;
  const numero = parseInt(valor);
  return !isNaN(numero) && numero > 0 && Number.isInteger(Number(valor));
};

export const alertarVirgulaNaoPermitida = () => {
  Alert.alert(
    'Formato Numérico',
    'Use ponto (.) para separar decimais, não vírgula (,).\n\nExemplo: 15.5 em vez de 15,5',
    [{ text: 'OK' }]
  );
};

export const validarCampoFormulario = (
  nomeCampo: string,
  valor: string,
  tipoValidacao: 'decimal' | 'inteiro' = 'decimal'
): { valido: boolean; valorLimpo: string; mensagemErro?: string } => {
  
  if (valor.includes(',')) {
    return {
      valido: false,
      valorLimpo: valor.replace(',', '.'),
      mensagemErro: 'Use ponto (.) para decimais, não vírgula (,)'
    };
  }
  
  let valorLimpo: string;
  let valido: boolean;
  let mensagemErro: string | undefined;
  
  if (tipoValidacao === 'inteiro') {
    valorLimpo = validarEntradaNumericaInteira(valor);
    valido = isInteiroValido(valorLimpo);
    if (!valido && valorLimpo) {
      mensagemErro = `${nomeCampo} deve ser um número inteiro maior que zero`;
    }
  } else {
    valorLimpo = validarEntradaNumericaDecimal(valor);
    valido = isNumeroValido(valorLimpo);
    if (!valido && valorLimpo) {
      mensagemErro = `${nomeCampo} deve ser um número maior que zero`;
    }
  }
  
  return { valido: valido || !valorLimpo, valorLimpo, mensagemErro };
};

export const formatarNumeroParaExibicao = (numero: number): string => {
  return numero.toString();
};

export const converterEntradaParaNumero = (valor: string): number | null => {
  if (!valor.trim()) return null;
  
  const valorLimpo = valor.replace(',', '.');
  const numero = parseFloat(valorLimpo);
  
  return isNaN(numero) ? null : numero;
};

export const useInputValidado = (
  valorInicial: string = '',
  tipoValidacao: 'decimal' | 'inteiro' = 'decimal'
) => {
  const [valor, setValor] = React.useState(valorInicial);
  const [erro, setErro] = React.useState<string>('');
  
  const alterarValor = (novoValor: string, nomeCampo: string = 'Campo') => {
    const { valido, valorLimpo, mensagemErro } = validarCampoFormulario(
      nomeCampo, 
      novoValor, 
      tipoValidacao
    );
    
    setValor(valorLimpo);
    setErro(mensagemErro || '');
    
    return { valido, valorLimpo };
  };
  
  return {
    valor,
    erro,
    alterarValor,
    temErro: !!erro,
    valorNumerico: converterEntradaParaNumero(valor)
  };
};

export const VALIDATION_CONSTANTS = {
  MAX_DECIMAL_PLACES: 2,
  MIN_VALUE: 0.01,
  MAX_AREA: 10000,
  MAX_DISTANCE: 1000,
  MAX_LINES: 20,
  MIN_ERROR_PERCENT: 0.1,
  MAX_ERROR_PERCENT: 50,
};

export const validarRange = (
  valor: number,
  min: number,
  max: number,
  nomeCampo: string
): { valido: boolean; mensagemErro?: string } => {
  if (valor < min || valor > max) {
    return {
      valido: false,
      mensagemErro: `${nomeCampo} deve estar entre ${min} e ${max}`
    };
  }
  return { valido: true };
};