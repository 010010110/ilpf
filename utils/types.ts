export type RootStackParamList = {
  Form: undefined;
  List: undefined;
  About: undefined;
  Settings: undefined;
  MainTabs: {
  screen: keyof MainTabsParamList;
  params?: MainTabsParamList[keyof MainTabsParamList];
};
  Edit: {
    id: number;
    nome_medicao: string;
    area: number;
    distRenques: number;
    numLinhasRenque: number;
    distLinhas: number;
    distArvores: number;
    erroPermitido: number;
    parcelaPreliminar1: number;
    parcelaPreliminar2: number;
    parcelaPreliminar3: number;
    parcelaPreliminar4: number;
    parcelaPreliminar5: number;
    created_at?: string;
    updated_at?: string;
  };
  Result: {
    nome_medicao: string;
    area: number;
    distRenques: number;
    numLinhasRenque: number;
    distLinhas: number;
    distArvores: number;
    erroPermitido: number;
    parcelaPreliminar1: number;
    parcelaPreliminar2: number;
    parcelaPreliminar3: number;
    parcelaPreliminar4: number;
    parcelaPreliminar5: number;
    areaPorArvore: number;
    densidadeArborea: number;
    taxaOcupacaoSolo: number;
    totalArvores: number;
    dimensao1: number;
    dimensao2: number;
    areaTotal: number;
    densidadesPreliminares: number[];
    numParcelasCalculado: number;
    distanciaEntreParcelas: number;
    totalArvoresMonitoradas: number;
    numArvoreParcela: number;
    created_at?: string;
    updated_at?: string;
  };
};

export type MainTabsParamList = {
  List: undefined;
  Form: undefined;
  Result: {
    nome_medicao: string;
    area: number;
    distRenques: number;
    numLinhasRenque: number;
    distLinhas: number;
    distArvores: number;
    erroPermitido: number;
    parcelaPreliminar1: number;
    parcelaPreliminar2: number;
    parcelaPreliminar3: number;
    parcelaPreliminar4: number;
    parcelaPreliminar5: number;
    areaPorArvore: number;
    densidadeArborea: number;
    taxaOcupacaoSolo: number;
    totalArvores: number;
    dimensao1: number;
    dimensao2: number;
    areaTotal: number;
    densidadesPreliminares: number[];
    numParcelasCalculado: number;
    distanciaEntreParcelas: number;
    totalArvoresMonitoradas: number;
    numArvoreParcela: number;
  };
  About: undefined;
  Settings: undefined;
};

