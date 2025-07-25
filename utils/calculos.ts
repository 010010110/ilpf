// Função para calcular a área por árvore
export const calcularAreaPorArvore = (
  distRenques: number,
  distArvores: number,
  numLinhasRenque: number,
  distLinhas: number
): number => {
  if (numLinhasRenque < 2) {
    return distRenques * distArvores;
  } else {
    return ((distRenques + distLinhas * (numLinhasRenque - 1)) * distArvores) / numLinhasRenque;
  }
};

// Função para calcular a densidade arbórea
export const calcularDensidadeArborea = (areaPorArvore: number): number => {
  return Math.round(10000 / areaPorArvore);
};

// Função para calcular a taxa de ocupação do solo
export const calcularTaxaOcupacaoSolo = (
  distRenques: number,
  numLinhasRenque: number,
  distLinhas: number
): number => {
  // Arredonda (100 / Distância entre renques) para 1 casa decimal
  const arredondado = Number((100 / distRenques).toFixed(1));

  // Calcula o restante da fórmula
  const taxaOcupacao =
    (arredondado * ((numLinhasRenque - 1) * distLinhas + 2) * 100) / 10000;

  // Arredonda para 1 casa decimal como indicado na fórmula
  return taxaOcupacao;
};

// Função para calcular o total de árvores
export const calcularTotalArvores = (area: number, densidadeArborea: number): number => {
  return area * densidadeArborea;
};

// Função para calcular as dimensões da parcela
export const calcularDimensoesParcela = (
  distArvores: number,
  distRenques: number,
  numLinhasRenque: number,
  distLinhas: number
): { dimensao1: number, dimensao2: number, areaTotal: number } => {
  const dimensao1 = 12 * distArvores;
  const dimensao2 = 2 * (distRenques + (distLinhas * (numLinhasRenque - 1)));
  const areaTotal = (dimensao1 * dimensao2);
  return { dimensao1, dimensao2, areaTotal };
};

// Função para calcular a densidade de uma parcela preliminar
export const calcularDensidadeParcela = (numArvoresParcela: number, areaParcela: number): number => {
  return Math.round((numArvoresParcela * 10000) / areaParcela);
};

// Função para calcular o número de parcelas a serem instaladas (D24)
export const calcularNumParcelas = (
  area: number,               // D8: Área em hectares
  areaParcela: number,        // G22: Área da parcela em m²
  densidadesPreliminares: number[], // G16:G20: Densidades das parcelas preliminares
  erroPermitido: number       // F24: Erro permitido (em %)
) => {
  // Calcula a média das densidades preliminares
  const mediaDensidades = densidadesPreliminares.reduce((sum, densidade) => sum + densidade, 0) / densidadesPreliminares.length;

  // Calcula o desvio padrão das densidades preliminares
  const desvioPadrao = Math.sqrt(
    densidadesPreliminares.map(d => Math.pow(d - mediaDensidades, 2)).reduce((sum, diff) => sum + diff, 0) / densidadesPreliminares.length
  );

  // Converte a área de hectares para m²
  const areaM2 = area * 10000;

  // Calcula a razão entre a área total e a área da parcela
  const areaRazao = areaM2 / areaParcela;

  // Calcula o numerador da fórmula: ((D8*10000/G22)*(DESVPAD(G16:G20)))^2
  const numerador = Math.pow(areaRazao * Math.ceil(desvioPadrao), 2);

  // Calcula o denominador:
  // Primeiro termo: (((D8*10000/G22)^2) * ((MÉDIA(G16:G20)*F24)^2))/4
  // Segundo termo: (D8*10000/G22) * (2 * DESVPAD(G16:G20))
  // OBS: Se F24 for informado como porcentagem (por exemplo, 10 para 10%), divida por 100.
  const denominador =
    (Math.pow(areaRazao, 2) * Math.pow(mediaDensidades * (erroPermitido / 100), 2)) / 4 +
    (areaRazao * (desvioPadrao * 2));

  // Calcula o número de parcelas
  let numParcelas = Math.ceil(numerador) / Math.ceil(denominador);

  // Aplica a condição mínima de parcelas
  if (numParcelas < 5) {
    numParcelas = 5;
  }

  // Arredonda para cima
  return Math.ceil(numParcelas);
};

export const calcularNumArvoresParcelas = (areaTotal: number, areaPorArvore: number): number => {
  return Math.round(areaTotal / areaPorArvore)
}

// Função para calcular a distância entre parcelas
export const calcularDistanciaEntreParcelas = (area: number, numParcelas: number): number => {
  return Math.sqrt((area * 10000) / numParcelas);
};

// Função para calcular o total de árvores monitoradas
export const calcularTotalArvoresMonitoradas = (
  numParcelas: number,
  mediaArvoresPorParcela: number
): number => {
  return Math.ceil(numParcelas * mediaArvoresPorParcela);
};