import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, '../../logs');
const paymentsLogFile = path.join(logsDir, 'pagamentos.log');
const accessLogFile = path.join(logsDir, 'acessos_portal.log');

// Criar diretório de logs se não existir
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('✅ Diretório de logs criado');
}

/**
 * Formata timestamp para log
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Registra pagamento confirmado
 */
export function logPayment(paymentData) {
  const logEntry = {
    timestamp: getTimestamp(),
    tipo: 'PAGAMENTO_CONFIRMADO',
    txid: paymentData.txid,
    valor: paymentData.valor_pago,
    nome_pagador: paymentData.nome_pagador || 'Não informado',
    cpf_cnpj: paymentData.cpf_cnpj || 'Não informado',
    paid_at: paymentData.paid_at,
    link_final: paymentData.link_final || 'N/A'
  };

  const logLine = JSON.stringify(logEntry) + '\n';

  fs.appendFile(paymentsLogFile, logLine, (err) => {
    if (err) {
      console.error('❌ Erro ao registrar pagamento:', err);
    } else {
      console.log(`💰 Pagamento registrado: ${paymentData.txid} - R$ ${paymentData.valor_pago}`);
    }
  });

  // Também criar uma versão legível
  const readableLog = `
═══════════════════════════════════════════════════
📅 Data/Hora: ${new Date(logEntry.timestamp).toLocaleString('pt-BR')}
💵 Valor: R$ ${logEntry.valor}
🆔 ID Transação: ${logEntry.txid}
👤 Pagador: ${logEntry.nome_pagador}
📄 CPF/CNPJ: ${logEntry.cpf_cnpj}
🔗 Link Final: ${logEntry.link_final}
✅ Status: PAGO
═══════════════════════════════════════════════════
`;

  const readableLogFile = path.join(logsDir, 'pagamentos_legivel.txt');
  fs.appendFile(readableLogFile, readableLog, (err) => {
    if (err) console.error('❌ Erro ao salvar log legível:', err);
  });

  return logEntry;
}

/**
 * Registra acesso ao portal
 */
export function logPortalAccess(accessData) {
  const logEntry = {
    timestamp: getTimestamp(),
    tipo: 'ACESSO_PORTAL',
    txid: accessData.txid,
    valor: accessData.valor,
    portal_url: accessData.portal_url,
    ip: accessData.ip || 'N/A',
    user_agent: accessData.user_agent || 'N/A'
  };

  const logLine = JSON.stringify(logEntry) + '\n';

  fs.appendFile(accessLogFile, logLine, (err) => {
    if (err) {
      console.error('❌ Erro ao registrar acesso:', err);
    } else {
      console.log(`🌐 Acesso ao portal registrado: ${accessData.txid} -> ${accessData.portal_url}`);
    }
  });

  // Versão legível
  const readableLog = `
─────────────────────────────────────────────────────
🌐 ACESSO AO PORTAL
📅 Data/Hora: ${new Date(logEntry.timestamp).toLocaleString('pt-BR')}
🆔 Transação: ${logEntry.txid}
💵 Valor: R$ ${logEntry.valor}
🔗 Portal: ${logEntry.portal_url}
🌍 IP: ${logEntry.ip}
─────────────────────────────────────────────────────
`;

  const readableLogFile = path.join(logsDir, 'acessos_portal_legivel.txt');
  fs.appendFile(readableLogFile, readableLog, (err) => {
    if (err) console.error('❌ Erro ao salvar log legível de acesso:', err);
  });

  return logEntry;
}

/**
 * Ler últimos pagamentos
 */
export function getRecentPayments(limit = 10) {
  return new Promise((resolve, reject) => {
    fs.readFile(paymentsLogFile, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve([]); // Arquivo não existe ainda
        } else {
          reject(err);
        }
        return;
      }

      const lines = data.trim().split('\n').filter(line => line);
      const payments = lines
        .map(line => {
          try {
            return JSON.parse(line);
          } catch (e) {
            return null;
          }
        })
        .filter(p => p !== null)
        .slice(-limit)
        .reverse();

      resolve(payments);
    });
  });
}

/**
 * Ler últimos acessos ao portal
 */
export function getRecentAccesses(limit = 10) {
  return new Promise((resolve, reject) => {
    fs.readFile(accessLogFile, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve([]);
        } else {
          reject(err);
        }
        return;
      }

      const lines = data.trim().split('\n').filter(line => line);
      const accesses = lines
        .map(line => {
          try {
            return JSON.parse(line);
          } catch (e) {
            return null;
          }
        })
        .filter(a => a !== null)
        .slice(-limit)
        .reverse();

      resolve(accesses);
    });
  });
}

/**
 * Obter estatísticas
 */
export async function getStatistics() {
  try {
    const payments = await getRecentPayments(1000);
    const accesses = await getRecentAccesses(1000);

    const totalPagamentos = payments.length;
    const totalAcessos = accesses.length;
    const valorTotal = payments.reduce((sum, p) => sum + parseFloat(p.valor || 0), 0);

    return {
      total_pagamentos: totalPagamentos,
      total_acessos: totalAcessos,
      valor_total: valorTotal.toFixed(2),
      taxa_acesso: totalPagamentos > 0
        ? ((totalAcessos / totalPagamentos) * 100).toFixed(1) + '%'
        : '0%',
      ultimos_pagamentos: payments.slice(0, 5),
      ultimos_acessos: accesses.slice(0, 5)
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return null;
  }
}
