import express from 'express';
import { database } from '../database/db.js';
import { logPayment, logPortalAccess, getRecentPayments, getRecentAccesses, getStatistics } from '../services/logService.js';

const router = express.Router();

// Armazena callbacks de webhook registrados
const webhookCallbacks = [];

/**
 * POST /internal/simulate-pay
 * Simula o pagamento de uma cobranÃ§a
 */
router.post('/internal/simulate-pay', async (req, res) => {
  try {
    const { txid, valor_pago } = req.body;

    if (!txid) {
      return res.status(400).json({
        error: 'txid Ã© obrigatÃ³rio',
        message: 'Informe o txid da cobranÃ§a a ser paga'
      });
    }

    // Buscar cobranÃ§a
    const cobranca = await database.getCobrancaByTxid(txid);

    if (!cobranca) {
      return res.status(404).json({
        error: 'CobranÃ§a nÃ£o encontrada',
        message: `NÃ£o foi encontrada cobranÃ§a com txid: ${txid}`
      });
    }

    if (cobranca.status === 'PAGA') {
      return res.status(400).json({
        error: 'CobranÃ§a jÃ¡ paga',
        message: 'Esta cobranÃ§a jÃ¡ foi paga anteriormente'
      });
    }

    if (cobranca.status === 'CANCELADA') {
      return res.status(400).json({
        error: 'CobranÃ§a cancelada',
        message: 'NÃ£o Ã© possÃ­vel pagar uma cobranÃ§a cancelada'
      });
    }

    // Validar valor pago (se informado)
    if (valor_pago) {
      const valorPagoNum = parseFloat(valor_pago);
      if (valorPagoNum !== cobranca.valor) {
        return res.status(400).json({
          error: 'Valor incorreto',
          message: `Valor pago (${valorPagoNum}) diferente do valor da cobranÃ§a (${cobranca.valor})`
        });
      }
    }

    // Atualizar status para PAGA
    const paid_at = Math.floor(Date.now() / 1000);
    await database.updateStatus(txid, 'PAGA', paid_at);

    // Disparar webhook
    const webhookPayload = {
      pix: [{
        endToEndId: `E${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        txid: cobranca.txid,
        valor: cobranca.valor.toFixed(2),
        horario: new Date().toISOString(),
        infoPagador: 'Pagamento simulado',
        status: 'PAGA'
      }]
    };

    // Enviar para webhook configurado (se houver)
    await triggerWebhook(webhookPayload);

    // Registrar pagamento em arquivo de log
    logPayment({
      txid: cobranca.txid,
      valor_pago: cobranca.valor.toFixed(2),
      nome_pagador: cobranca.nome_pagador,
      cpf_cnpj: cobranca.cpf_cnpj,
      paid_at: new Date(paid_at * 1000).toISOString(),
      link_final: 'https://ARCKHÉ AI/'
    });

    res.json({
      success: true,
      message: 'Pagamento simulado com sucesso',
      txid: cobranca.txid,
      status: 'PAGA',
      valor_pago: cobranca.valor.toFixed(2),
      paid_at: new Date(paid_at * 1000).toISOString(),
      link_final: 'https://ARCKHÉ AI/',
      webhook_triggered: webhookCallbacks.length > 0
    });

  } catch (error) {
    console.error('Erro ao simular pagamento:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: error.message
    });
  }
});

/**
 * POST /internal/simulate-cancel
 * Simula o cancelamento de uma cobranÃ§a
 */
router.post('/internal/simulate-cancel', async (req, res) => {
  try {
    const { txid } = req.body;

    if (!txid) {
      return res.status(400).json({
        error: 'txid Ã© obrigatÃ³rio'
      });
    }

    const cobranca = await database.getCobrancaByTxid(txid);

    if (!cobranca) {
      return res.status(404).json({
        error: 'CobranÃ§a nÃ£o encontrada'
      });
    }

    if (cobranca.status !== 'ATIVA') {
      return res.status(400).json({
        error: 'Somente cobranÃ§as ATIVAS podem ser canceladas'
      });
    }

    await database.updateStatus(txid, 'CANCELADA');

    res.json({
      success: true,
      message: 'CobranÃ§a cancelada com sucesso',
      txid: cobranca.txid,
      status: 'CANCELADA'
    });

  } catch (error) {
    console.error('Erro ao cancelar cobranÃ§a:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: error.message
    });
  }
});

/**
 * POST /webhook/pix
 * Endpoint para receber webhooks (simulaÃ§Ã£o)
 */
router.post('/webhook/pix', (req, res) => {
  console.log('ðŸ“¢ Webhook recebido:', JSON.stringify(req.body, null, 2));

  // Registrar callback
  webhookCallbacks.push({
    timestamp: Date.now(),
    payload: req.body
  });

  res.status(200).json({
    received: true,
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /webhook/pix/history
 * HistÃ³rico de webhooks recebidos
 */
router.get('/webhook/pix/history', (req, res) => {
  res.json({
    total: webhookCallbacks.length,
    webhooks: webhookCallbacks.map(w => ({
      timestamp: new Date(w.timestamp).toISOString(),
      payload: w.payload
    }))
  });
});

/**
 * POST /internal/register-portal-access
 * Registra quando o usuÃ¡rio clica no link do portal
 */
router.post('/internal/register-portal-access', async (req, res) => {
  try {
    const { txid } = req.body;

    if (!txid) {
      return res.status(400).json({
        error: 'txid Ã© obrigatÃ³rio'
      });
    }

    // Buscar cobranÃ§a
    const cobranca = await database.getCobrancaByTxid(txid);

    if (!cobranca) {
      return res.status(404).json({
        error: 'CobranÃ§a nÃ£o encontrada'
      });
    }

    // Registrar acesso ao portal
    logPortalAccess({
      txid: cobranca.txid,
      valor: cobranca.valor.toFixed(2),
      portal_url: 'https://ARCKHÉ AI/',
      ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      user_agent: req.headers['user-agent']
    });

    res.json({
      success: true,
      message: 'Acesso ao portal registrado',
      portal_url: 'https://ARCKHÉ AI/'
    });

  } catch (error) {
    console.error('Erro ao registrar acesso:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: error.message
    });
  }
});

/**
 * GET /internal/logs/payments
 * Ver Ãºltimos pagamentos registrados
 */
router.get('/internal/logs/payments', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const payments = await getRecentPayments(limit);

    res.json({
      total: payments.length,
      payments
    });
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: error.message
    });
  }
});

/**
 * GET /internal/logs/accesses
 * Ver Ãºltimos acessos ao portal
 */
router.get('/internal/logs/accesses', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const accesses = await getRecentAccesses(limit);

    res.json({
      total: accesses.length,
      accesses
    });
  } catch (error) {
    console.error('Erro ao buscar acessos:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: error.message
    });
  }
});

/**
 * GET /internal/statistics
 * Ver estatÃ­sticas de pagamentos e acessos
 */
router.get('/internal/statistics', async (req, res) => {
  try {
    const stats = await getStatistics();

    if (!stats) {
      return res.status(500).json({
        error: 'Erro ao obter estatÃ­sticas'
      });
    }

    res.json(stats);
  } catch (error) {
    console.error('Erro ao obter estatÃ­sticas:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: error.message
    });
  }
});

/**
 * FunÃ§Ã£o auxiliar para disparar webhook
 */
async function triggerWebhook(payload) {
  // Simular disparo de webhook (apenas loga, nÃ£o envia HTTP request)
  console.log('ðŸ”” Webhook disparado:', JSON.stringify(payload, null, 2));

  // Adicionar ao histÃ³rico
  webhookCallbacks.push({
    timestamp: Date.now(),
    payload
  });

  // Em ambiente real, aqui faria um POST para a URL configurada
  // await fetch(webhookUrl, { method: 'POST', body: JSON.stringify(payload) });
}

export default router;
