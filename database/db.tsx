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
};

// Função para inicializar o banco de dados
const initDb = async (): Promise<void> => {
  const db = await SQLite.openDatabaseAsync('inventory.db');

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
      numParcelas INTEGER NOT NULL
    );
  `);
};

const insertItem = async (
  area: number,
  distRenques: number,
  numLinhasRenque: number,
  distLinhas: number,
  distArvores: number,
  numArvores: number,
  erroPermitido: number,
  numParcelas: number
): Promise<number> => {
  const db = await SQLite.openDatabaseAsync('inventory.db');
  
  const result = await db.runAsync(
    `INSERT INTO inventory 
      (area, distRenques, numLinhasRenque, distLinhas, distArvores, numArvores, erroPermitido, numParcelas) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    area, distRenques, numLinhasRenque, distLinhas, distArvores, numArvores, erroPermitido, numParcelas
  );

  return result.lastInsertRowId;
};

const getAllItems = async (): Promise<InventoryItem[]> => {
  const db = await SQLite.openDatabaseAsync('inventory.db');
  
  const allRows = await db.getAllAsync('SELECT * FROM inventory');

  return allRows as InventoryItem[];
};

const updateItem = async (id: number, newIntValue: number): Promise<void> => {
  const db = await SQLite.openDatabaseAsync('inventory.db');
  await db.runAsync(
    'UPDATE inventory SET intValue = ? WHERE id = ?',
    newIntValue, id
  );
};

const deleteItem = async (id: number): Promise<void> => {
  const db = await SQLite.openDatabaseAsync('inventory.db');

  await db.runAsync(
    'DELETE FROM inventory WHERE id = ?',
    id
  );
};

const getFirstItem = async (): Promise<InventoryItem | null> => {
  const db = await SQLite.openDatabaseAsync('inventory.db');

  const firstRow = await db.getFirstAsync('SELECT * FROM inventory');

  return firstRow ? (firstRow as InventoryItem) : null;
};

export { initDb, insertItem, getAllItems, updateItem, deleteItem, getFirstItem };
