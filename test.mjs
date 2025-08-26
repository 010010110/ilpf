export const calcularNumParcelas = (
  area,               // D8: Área em hectares
  areaParcela,        // G22: Área da parcela em m²
  densidadesPreliminares, // G16:G20: Densidades das parcelas preliminares
  erroPermitido       // F24: Erro permitido (em %)
) => {

  const mediaDensidades = densidadesPreliminares.reduce((sum, densidade) => sum + densidade, 0) / densidadesPreliminares.length;


  const desvioPadrao = Math.sqrt(
    densidadesPreliminares.map(d => Math.pow(d - mediaDensidades, 2)).reduce((sum, diff) => sum + diff, 0) / densidadesPreliminares.length
  );


  const areaM2 = area * 10000;


  const areaRazao = areaM2 / areaParcela;


  const numerador = Math.pow(areaRazao * Math.ceil(desvioPadrao), 2);





  const denominador =
    (Math.pow(areaRazao, 2) * Math.pow(mediaDensidades * (erroPermitido / 100), 2)) / 4 +
    (areaRazao * (desvioPadrao * 2));


  let numParcelas = Math.ceil(numerador) / Math.ceil(denominador);


  if (numParcelas < 5) {
    numParcelas = 5;
  }


  return Math.ceil(numParcelas);
};

export const calcularTaxaOcupacaoSolo = (
  distRenques,
  numLinhasRenque,
  distLinhas
) => {

  const arredondado = Number((100 / distRenques).toFixed(1));


  const taxaOcupacao =
    (arredondado * ((numLinhasRenque - 1) * distLinhas + 2) * 100) / 10000;


  return Number(taxaOcupacao.toFixed(1));
};



const res = calcularNumParcelas(parseFloat('1180'), 1584.00,  [126, 152, 145, 126, 139], parseFloat('5'))

console.log(res)