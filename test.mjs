export const calcularNumParcelas = (
  area,               // D8: Área em hectares
  areaParcela,        // G22: Área da parcela em m²
  densidadesPreliminares, // G16:G20: Densidades das parcelas preliminares
  erroPermitido       // F24: Erro permitido (em %)
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

export const calcularTaxaOcupacaoSolo = (
  distRenques,
  numLinhasRenque,
  distLinhas
) => {
  // Arredonda (100 / Distância entre renques) para 1 casa decimal
  const arredondado = Number((100 / distRenques).toFixed(1));

  // Calcula o restante da fórmula
  const taxaOcupacao =
    (arredondado * ((numLinhasRenque - 1) * distLinhas + 2) * 100) / 10000;

  // Arredonda para 1 casa decimal como indicado na fórmula
  return Number(taxaOcupacao.toFixed(1));
};

// const res2 = calcularTaxaOcupacaoSolo(22.00, 1, 3)

const res = calcularNumParcelas(parseFloat('1180'), 1584.00,  [126, 152, 145, 126, 139], parseFloat('5'))

console.log(res)