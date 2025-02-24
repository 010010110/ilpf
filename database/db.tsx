import * as SQLite from 'expo-sqlite';

// Definição do tipo dos itens que serão armazenados no banco
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
  dataCriacao: string; // Data da criação em formato texto
  nomeMedicao: string | null; // Nome da medição, pode ser nulo
};

// Função para inicializar o banco de dados
const initDb = async (): Promise<void> => {
  const db = await SQLite.openDatabaseAsync('inventory.db');

  // Configurações iniciais e criação da tabela
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY NOT NULL,
      area DECIMAL NOT NULL,
      distRenques DECIMAL NOT NULL,
      numLinhasRenque INTEGER NOT NULL,
      distLinhas DECIMAL NOT NULL,
      distArvores DECIMAL NOT NULL,
      numArvores INTEGER NOT NULL,
      erroPermitido DECIMAL NOT NULL,
      numParcelas INTEGER NOT NULL,
      dataCriacao TEXT DEFAULT CURRENT_TIMESTAMP,
      nomeMedicao TEXT
    );
  `);
};

// Função para inserir um item no banco de dados
const insertItem = async (
  area: number,
  distRenques: number,
  numLinhasRenque: number,
  distLinhas: number,
  distArvores: number,
  numArvores: number,
  erroPermitido: number,
  numParcelas: number,
  nomeMedicao: string | null
): Promise<number> => {
  const db = await SQLite.openDatabaseAsync('inventory.db');

  const result = await db.runAsync(
    `INSERT INTO inventory 
      (area, distRenques, numLinhasRenque, distLinhas, distArvores, numArvores, erroPermitido, numParcelas, nomeMedicao) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    area, distRenques, numLinhasRenque, distLinhas, distArvores, numArvores, erroPermitido, numParcelas, nomeMedicao
  );

  return result.lastInsertRowId;
};

// Função para obter todos os itens do banco de dados
const getAllItems = async (): Promise<InventoryItem[]> => {
  const db = await SQLite.openDatabaseAsync('inventory.db');

  const allRows = await db.getAllAsync('SELECT * FROM inventory');

  return allRows as InventoryItem[];
};

// Função para atualizar o nome de uma medição pelo ID
const updateItem = async (id: number, nomeMedicao: string): Promise<void> => {
  const db = await SQLite.openDatabaseAsync('inventory.db');

  await db.runAsync(
    'UPDATE inventory SET nomeMedicao = ? WHERE id = ?',
    nomeMedicao, id
  );
};

// Função para deletar um item pelo ID
const deleteItem = async (id: number): Promise<void> => {
  const db = await SQLite.openDatabaseAsync('inventory.db');

  await db.runAsync(
    'DELETE FROM inventory WHERE id = ?',
    id
  );
};

// Função para obter o primeiro item da tabela
const getFirstItem = async (): Promise<InventoryItem | null> => {
  const db = await SQLite.openDatabaseAsync('inventory.db');

  const firstRow = await db.getFirstAsync('SELECT * FROM inventory');

  return firstRow ? (firstRow as InventoryItem) : null;
};

export { initDb, insertItem, getAllItems, updateItem, deleteItem, getFirstItem };
