import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';


type InventoryItem = {
  id: number;
  nome_medicao: string;
  area: number;
  distRenques: number;
  numLinhasRenque: number;
  distLinhas: number;
  distArvores: number;
  erroPermitido: number;
  parcelaPreliminar1: number | null;
  parcelaPreliminar2: number | null;
  parcelaPreliminar3: number | null;
  parcelaPreliminar4: number | null;
  parcelaPreliminar5: number | null;
  status: 'incompleto' | 'completo'; // Novo campo para status
  created_at: string;
  updated_at: string;
};

const databaseName = 'v_0.2.0.db'; // Versão atualizada


const initDb = async (): Promise<void> => {
  try {
    const db = await SQLite.openDatabaseAsync(databaseName, { useNewConnection: true });
    if (!db) throw new Error('Falha ao abrir o banco de dados');


    await db.runAsync(`PRAGMA journal_mode = WAL;`);


    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY NOT NULL,
        nome_medicao TEXT NOT NULL,
        area REAL NOT NULL,
        distRenques REAL NOT NULL,
        numLinhasRenque INTEGER NOT NULL,
        distLinhas REAL NOT NULL,
        distArvores REAL NOT NULL,
        erroPermitido REAL NOT NULL,
        parcelaPreliminar1 INTEGER,
        parcelaPreliminar2 INTEGER,
        parcelaPreliminar3 INTEGER,
        parcelaPreliminar4 INTEGER,
        parcelaPreliminar5 INTEGER,
        status TEXT NOT NULL DEFAULT 'incompleto',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);


    try {
      await db.runAsync(`ALTER TABLE inventory ADD COLUMN status TEXT DEFAULT 'incompleto'`);
    } catch (error) {

    }


    await db.runAsync(`
      UPDATE inventory 
      SET status = 'completo' 
      WHERE parcelaPreliminar1 IS NOT NULL 
        AND parcelaPreliminar2 IS NOT NULL 
        AND parcelaPreliminar3 IS NOT NULL 
        AND parcelaPreliminar4 IS NOT NULL 
        AND parcelaPreliminar5 IS NOT NULL
        AND status != 'completo'
    `);

    console.log('Banco inicializado com sucesso.');
  } catch (error) {
    console.error('Erro ao inicializar o banco:', error);
  }
};


const resetDatabase = async () => {
  try {
    const dbPath = `${FileSystem.documentDirectory}SQLite/${databaseName}`;
    const fileInfo = await FileSystem.getInfoAsync(dbPath);

    if (fileInfo.exists) {
      await FileSystem.deleteAsync(dbPath);
      console.log('Banco de dados excluído com sucesso!');
    }

    await initDb();
    console.log('Banco de dados reiniciado com sucesso!');
  } catch (error) {
    console.error('Erro ao reiniciar o banco de dados:', error);
  }
};


const insertPreliminaryItem = async (
  nome_medicao: string,
  area: number,
  distRenques: number,
  numLinhasRenque: number,
  distLinhas: number,
  distArvores: number,
  erroPermitido: number
): Promise<number> => {
  const db = await SQLite.openDatabaseAsync(databaseName, { useNewConnection: true });

  const result = await db.runAsync(
    `INSERT INTO inventory 
      (nome_medicao, area, distRenques, numLinhasRenque, distLinhas, distArvores, erroPermitido, status, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'incompleto', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [
      nome_medicao,
      area,
      distRenques,
      numLinhasRenque,
      distLinhas,
      distArvores,
      erroPermitido,
    ]
  );

  return result.lastInsertRowId;
};


const insertItem = async (
  nome_medicao: string,
  area: number,
  distRenques: number,
  numLinhasRenque: number,
  distLinhas: number,
  distArvores: number,
  erroPermitido: number,
  parcelaPreliminar1: number,
  parcelaPreliminar2: number,
  parcelaPreliminar3: number,
  parcelaPreliminar4: number,
  parcelaPreliminar5: number
): Promise<number> => {
  const db = await SQLite.openDatabaseAsync(databaseName, { useNewConnection: true });

  const result = await db.runAsync(
    `INSERT INTO inventory 
      (nome_medicao, area, distRenques, numLinhasRenque, distLinhas, distArvores, erroPermitido, parcelaPreliminar1, parcelaPreliminar2, parcelaPreliminar3, parcelaPreliminar4, parcelaPreliminar5, status, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [
      nome_medicao,
      area,
      distRenques,
      numLinhasRenque,
      distLinhas,
      distArvores,
      erroPermitido,
      parcelaPreliminar1,
      parcelaPreliminar2,
      parcelaPreliminar3,
      parcelaPreliminar4,
      parcelaPreliminar5,
    ]
  );

  return result.lastInsertRowId;
};


const completeItem = async (
  id: number,
  parcelaPreliminar1: number,
  parcelaPreliminar2: number,
  parcelaPreliminar3: number,
  parcelaPreliminar4: number,
  parcelaPreliminar5: number
): Promise<void> => {
  try {
    const db = await SQLite.openDatabaseAsync(databaseName, { useNewConnection: true });

    console.log('[completeItem] Verificando se item existe:', id);
    const existing = await db.getFirstAsync('SELECT * FROM inventory WHERE id = ?', [id]);
    if (!existing) {
      console.warn(`[completeItem] Item com ID ${id} não encontrado`);
      throw new Error(`Item com ID ${id} não encontrado.`);
    }

    console.log('[completeItem] Executando UPDATE para completar item:', id);
    await db.runAsync(
      `UPDATE inventory SET 
        parcelaPreliminar1 = ?, 
        parcelaPreliminar2 = ?, 
        parcelaPreliminar3 = ?, 
        parcelaPreliminar4 = ?, 
        parcelaPreliminar5 = ?, 
        status = 'completo',
        updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?`,
      [
        parcelaPreliminar1,
        parcelaPreliminar2,
        parcelaPreliminar3,
        parcelaPreliminar4,
        parcelaPreliminar5,
        id,
      ]
    );

    console.log('[completeItem] Item completado com sucesso');
  } catch (error) {
    console.error('[completeItem] Erro ao completar item:', error);
    throw error;
  }
};


const getAllItems = async (): Promise<InventoryItem[]> => {
  try {
    const db = await SQLite.openDatabaseAsync(databaseName, { useNewConnection: true });
    const allRows = await db.getAllAsync('SELECT * FROM inventory ORDER BY created_at DESC');
    return allRows as InventoryItem[];
  } catch (error) {
    console.error('[getAllItems] Erro ao acessar banco:', error);
    throw error;
  }
};


const updateItem = async (
  id: number,
  nome_medicao: string,
  area: number,
  distRenques: number,
  numLinhasRenque: number,
  distLinhas: number,
  distArvores: number,
  erroPermitido: number,
  parcelaPreliminar1?: number,
  parcelaPreliminar2?: number,
  parcelaPreliminar3?: number,
  parcelaPreliminar4?: number,
  parcelaPreliminar5?: number
): Promise<void> => {
  try {
    const db = await SQLite.openDatabaseAsync(databaseName, { useNewConnection: true });

    console.log('[updateItem] Verificando se item existe:', id);
    const existing = await db.getFirstAsync('SELECT * FROM inventory WHERE id = ?', [id]);
    if (!existing) {
      console.warn(`[updateItem] Item com ID ${id} não encontrado`);
      throw new Error(`Item com ID ${id} não encontrado.`);
    }


    const hasAllParcelas = parcelaPreliminar1 !== undefined && 
                          parcelaPreliminar2 !== undefined && 
                          parcelaPreliminar3 !== undefined && 
                          parcelaPreliminar4 !== undefined && 
                          parcelaPreliminar5 !== undefined;
    
    const status = hasAllParcelas ? 'completo' : 'incompleto';

    console.log('[updateItem] Executando UPDATE para ID:', id);
    await db.runAsync(
      `UPDATE inventory SET 
        nome_medicao = ?, 
        area = ?, 
        distRenques = ?, 
        numLinhasRenque = ?, 
        distLinhas = ?, 
        distArvores = ?, 
        erroPermitido = ?, 
        parcelaPreliminar1 = ?, 
        parcelaPreliminar2 = ?, 
        parcelaPreliminar3 = ?, 
        parcelaPreliminar4 = ?, 
        parcelaPreliminar5 = ?, 
        status = ?,
        updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?`,
      [
        nome_medicao,
        area,
        distRenques,
        numLinhasRenque,
        distLinhas,
        distArvores,
        erroPermitido,
        parcelaPreliminar1 || null,
        parcelaPreliminar2 || null,
        parcelaPreliminar3 || null,
        parcelaPreliminar4 || null,
        parcelaPreliminar5 || null,
        status,
        id,
      ]
    );

    console.log('[updateItem] Atualização concluída com sucesso');
  } catch (error) {
    console.error('[updateItem] Erro ao executar UPDATE:', error);
    throw error;
  }
};


const deleteItem = async (id: number): Promise<void> => {
  const db = await SQLite.openDatabaseAsync(databaseName, { useNewConnection: true });
  await db.runAsync('DELETE FROM inventory WHERE id = ?', [id]);
};


const getFirstItem = async (): Promise<InventoryItem | null> => {
  const db = await SQLite.openDatabaseAsync(databaseName, { useNewConnection: true });
  const firstRow = await db.getFirstAsync('SELECT * FROM inventory');
  return firstRow ? (firstRow as InventoryItem) : null;
};


const getItemById = async (id: number): Promise<InventoryItem | null> => {
  const db = await SQLite.openDatabaseAsync(databaseName, { useNewConnection: true });
  const item = await db.getFirstAsync('SELECT * FROM inventory WHERE id = ?', [id]);
  return item ? (item as InventoryItem) : null;
};

export { 
  initDb, 
  insertItem, 
  insertPreliminaryItem,
  completeItem,
  getAllItems, 
  updateItem, 
  deleteItem, 
  getFirstItem, 
  getItemById,
  resetDatabase 
};