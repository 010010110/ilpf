export const Config = {
  erroPermitido: 5, // valor padrão
};

export const setErroPermitido = (novoValor: number) => {
  Config.erroPermitido = novoValor;
};