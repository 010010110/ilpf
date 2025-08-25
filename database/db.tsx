import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

// Definição do tipo dos itens que serão armazenados no banco
type InventoryItem = {
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
  created_at: string;
  updated_at: string;
};

const databaseName = 'v_0.1.1.db';

// Função para inicializar o banco de dados
const initDb = async (): Promise<void> => {
  try {
    const db = await SQLite.openDatabaseAsync(databaseName, { useNewConnection: true });
    if (!db) throw new Error('Falha ao abrir o banco de dados');

    // Define o modo do journal
    await db.runAsync(`PRAGMA journal_mode = WAL;`);

    // Cria a tabela "inventory"
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
        parcelaPreliminar1 INTEGER NOT NULL,
        parcelaPreliminar2 INTEGER NOT NULL,
        parcelaPreliminar3 INTEGER NOT NULL,
        parcelaPreliminar4 INTEGER NOT NULL,
        parcelaPreliminar5 INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Banco inicializado com sucesso.');
  } catch (error) {
    console.error('Erro ao inicializar o banco:', error);
  }
};

// Função para reiniciar o banco de dados (remover e recriar)
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

// Função para inserir um item no banco de dados
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
      (nome_medicao, area, distRenques, numLinhasRenque, distLinhas, distArvores, erroPermitido, parcelaPreliminar1, parcelaPreliminar2, parcelaPreliminar3, parcelaPreliminar4, parcelaPreliminar5, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
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

// Função para obter todos os itens do banco de dados
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

// Função para atualizar um item pelo ID
const updateItem = async (
  id: number,
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
): Promise<void> => {
  try {
    const db = await SQLite.openDatabaseAsync(databaseName, { useNewConnection: true });

    console.log('[updateItem] Verificando se item existe:', id);
    const existing = await db.getFirstAsync('SELECT * FROM inventory WHERE id = ?', [id]);
    if (!existing) {
      console.warn(`[updateItem] Item com ID ${id} não encontrado`);
      throw new Error(`Item com ID ${id} não encontrado.`);
    }

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
        parcelaPreliminar1,
        parcelaPreliminar2,
        parcelaPreliminar3,
        parcelaPreliminar4,
        parcelaPreliminar5,
        id,
      ]
    );

    console.log('[updateItem] Atualização concluída com sucesso');
  } catch (error) {
    console.error('[updateItem] Erro ao executar UPDATE:', error);
    throw error;
  }
};


// Função para deletar um item pelo ID
const deleteItem = async (id: number): Promise<void> => {
  const db = await SQLite.openDatabaseAsync(databaseName, { useNewConnection: true });
  await db.runAsync('DELETE FROM inventory WHERE id = ?', [id]);
};

// Função para obter o primeiro item da tabela
const getFirstItem = async (): Promise<InventoryItem | null> => {
  const db = await SQLite.openDatabaseAsync(databaseName, { useNewConnection: true });
  const firstRow = await db.getFirstAsync('SELECT * FROM inventory');
  return firstRow ? (firstRow as InventoryItem) : null;
};

export { initDb, insertItem, getAllItems, updateItem, deleteItem, getFirstItem, resetDatabase };
