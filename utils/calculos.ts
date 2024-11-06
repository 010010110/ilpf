type InventoryItem = {
  id: number;
  area: number;
  distRenques: number;
  numLinhasRenque: number;
  distLinhas: number;
  distArvores: number;
  numArvores: number;
  erroPermitido: number;
  numParcelas: number;
};

export const calcularAreaPorArvore = (item: InventoryItem): number => {
  return item.distRenques * item.distArvores;
};

export const calcularDensidadeArborea = (item: InventoryItem): number => {
  const areaPorArvore = calcularAreaPorArvore(item);
  return 10000 / areaPorArvore;
};

export const calcularDimensoesParcela = (item: InventoryItem): { larguraParcela: number, comprimentoParcela: number, areaParcela: number } => {
  const larguraParcela = 2 * (item.distRenques + (item.numLinhasRenque - 1) * item.distLinhas);
  const comprimentoParcela = item.distArvores * 12;
  const areaParcela = larguraParcela * comprimentoParcela;
  return { larguraParcela, comprimentoParcela, areaParcela };
};

export const calcularNumArvoresPorParcela = (item: InventoryItem): number => {
  const { comprimentoParcela } = calcularDimensoesParcela(item);
  return (comprimentoParcela * 2 * item.numLinhasRenque) / item.distArvores;
};