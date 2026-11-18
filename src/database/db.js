import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../data/cobrancas.db');

// Criar conexão com o banco
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar com o banco de dados:', err.message);
  } else {
    console.log('✅ Conectado ao banco de dados SQLite');
    initDatabase();
  }
});

// Inicializar tabelas
function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS cobrancas (
      id TEXT PRIMARY KEY,
      txid TEXT UNIQUE NOT NULL,
      valor REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'ATIVA',
      descricao TEXT,
      nome_pagador TEXT,
      cpf_cnpj TEXT,
      expiracao INTEGER,
      pixCopiaECola TEXT,
      qrCodeBase64 TEXT,
      location TEXT,
      link_final TEXT,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      paid_at INTEGER,
      updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    )
  `, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela:', err.message);
    } else {
      console.log('✅ Tabela "cobrancas" pronta');
    }
  });
}

// Funções auxiliares para o banco de dados
export const database = {
  // Criar uma nova cobrança
  createCobranca: (cobranca) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO cobrancas (
          id, txid, valor, status, descricao, nome_pagador,
          cpf_cnpj, expiracao, pixCopiaECola, qrCodeBase64,
          location, link_final
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        cobranca.id,
        cobranca.txid,
        cobranca.valor,
        cobranca.status || 'ATIVA',
        cobranca.descricao,
        cobranca.nome_pagador,
        cobranca.cpf_cnpj,
        cobranca.expiracao,
        cobranca.pixCopiaECola,
        cobranca.qrCodeBase64,
        cobranca.location,
        cobranca.link_final
      ];

      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...cobranca });
      });
    });
  },

  // Buscar cobrança por txid
  getCobrancaByTxid: (txid) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM cobrancas WHERE txid = ?', [txid], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Buscar cobrança por ID (location)
  getCobrancaById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM cobrancas WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Atualizar status da cobrança
  updateStatus: (txid, status, paid_at = null) => {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE cobrancas
        SET status = ?, paid_at = ?, updated_at = strftime('%s', 'now')
        WHERE txid = ?
      `;

      db.run(sql, [status, paid_at, txid], function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });
  },

  // Listar todas as cobranças
  getAllCobrancas: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM cobrancas ORDER BY created_at DESC', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Fechar conexão
  close: () => {
    db.close((err) => {
      if (err) console.error('❌ Erro ao fechar banco:', err.message);
      else console.log('✅ Conexão com banco fechada');
    });
  }
};

export default db;
