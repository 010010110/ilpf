import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { TextInput, Text, HelperText } from 'react-native-paper';
import { 
  validarCampoFormulario, 
  alertarVirgulaNaoPermitida,
  VALIDATION_CONSTANTS,
  validarRange
} from '../utils/inputValidation';

interface ValidatedTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  tipoValidacao?: 'decimal' | 'inteiro';
  obrigatorio?: boolean;
  minValue?: number;
  maxValue?: number;
  placeholder?: string;
  style?: any;
  disabled?: boolean;
  mode?: 'flat' | 'outlined';
  [key: string]: any; // Para passar outras props do TextInput
}

const ValidatedTextInput: React.FC<ValidatedTextInputProps> = ({
  label,
  value,
  onChangeText,
  tipoValidacao = 'decimal',
  obrigatorio = false,
  minValue,
  maxValue,
  placeholder,
  style,
  disabled = false,
  mode = 'outlined',
  ...otherProps
}) => {
  const [erro, setErro] = useState<string>('');
  const [foiTocado, setFoiTocado] = useState(false);


  useEffect(() => {
    if (foiTocado && value) {
      validarCampo(value);
    }
  }, [value, foiTocado]);

  const validarCampo = (valorInput: string) => {

    if (valorInput.includes(',')) {
      setErro('Use ponto (.) para decimais, não vírgula (,)');
      return false;
    }


    const { valido, mensagemErro } = validarCampoFormulario(
      label,
      valorInput,
      tipoValidacao
    );

    if (!valido && mensagemErro) {
      setErro(mensagemErro);
      return false;
    }


    if (valido && valorInput && (minValue !== undefined || maxValue !== undefined)) {
      const numeroValor = parseFloat(valorInput);
      const rangeValidation = validarRange(
        numeroValor,
        minValue || 0,
        maxValue || Infinity,
        label
      );
      
      if (!rangeValidation.valido) {
        setErro(rangeValidation.mensagemErro || '');
        return false;
      }
    }


    if (obrigatorio && !valorInput.trim()) {
      setErro(`${label} é obrigatório`);
      return false;
    }

    setErro('');
    return true;
  };

  const handleChangeText = (texto: string) => {
    setFoiTocado(true);


    if (texto.includes(',')) {
      alertarVirgulaNaoPermitida();

      texto = texto.replace(/,/g, '.');
    }


    const { valorLimpo } = validarCampoFormulario(label, texto, tipoValidacao);
    
    onChangeText(valorLimpo);
  };

  const handleBlur = () => {
    setFoiTocado(true);
    if (value) {
      validarCampo(value);
    }
  };

  return (
    <View style={style}>
      <TextInput
        label={label + (obrigatorio ? ' *' : '')}
        value={value}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        mode={mode}
        error={!!erro}
        disabled={disabled}
        placeholder={placeholder}
        keyboardType={tipoValidacao === 'inteiro' ? 'number-pad' : 'decimal-pad'}
        {...otherProps}
      />
      
      {erro && (
        <HelperText type="error" visible={!!erro}>
          {erro}
        </HelperText>
      )}
      
      {!erro && placeholder && (
        <HelperText type="info" visible={!value && !foiTocado}>
          {placeholder}
        </HelperText>
      )}
    </View>
  );
};

export default ValidatedTextInput;


export const AreaInput = (props: ValidatedTextInputProps) => (
  <ValidatedTextInput
    {...props}
    tipoValidacao="decimal"
    minValue={0.01}
    maxValue={VALIDATION_CONSTANTS.MAX_AREA}
    placeholder={props.placeholder || "Ex: 10.5"}
  />
);

export const DistanciaInput = (props: ValidatedTextInputProps) => (
  <ValidatedTextInput
    {...props}
    tipoValidacao="decimal"
    minValue={0.1}
    maxValue={VALIDATION_CONSTANTS.MAX_DISTANCE}
    placeholder={props.placeholder || "Ex: 15.0"}
  />
);

export const LinhasInput = (props: ValidatedTextInputProps) => (
  <ValidatedTextInput
    {...props}
    tipoValidacao="inteiro"
    minValue={1}
    maxValue={VALIDATION_CONSTANTS.MAX_LINES}
    placeholder={props.placeholder || "Ex: 2"}
  />
);

export const ContadorInput = (props: ValidatedTextInputProps) => (
  <ValidatedTextInput
    {...props}
    tipoValidacao="inteiro"
    minValue={0}
    maxValue={999}
    placeholder={props.placeholder || "Ex: 23"}
  />
);