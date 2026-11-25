import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { database } from '../database/db.js';
import { generatePixCobranca } from '../services/pixService.js';

const router = express.Router();

/**
 * POST /auth/token
 * Gera token mock (simulaçêo)
 */
router.post('/auth/token', (req, res) => {
  res.json({
    access_token: `mock_token_${Date.now()}`,
    token_type: 'Bearer',
    expires_in: 3600
  });
});

/**
 * PUT /pix/v2/cob
 * Criar cobrança Pix com txid
 */
router.put('/pix/v2/cob', async (req, res) => {
  try {
    const { txid } = req.query;

    if (!txid) {
      return res.status(400).json({
        error: 'txid é obrigatório',
        message: 'Informe o txid na query string'
      });
    }

    const { valor, calendario, devedor, infoAdicionais, link_final } = req.body;

    if (!valor || !valor.original) {
      return res.status(400).json({
        error: 'valor.original é obrigatório',
        message: 'Informe o valor da cobrança'
      });
    }

    // Verificar se já existe cobrança com este txid
    const existente = await database.getCobrancaByTxid(txid);
    if (existente) {
      return res.status(409).json({
        error: 'Cobrança já existe',
        message: `Já existe uma cobrança com o txid: ${txid}`
      });
    }

    // Gerar ID único para a cobrança
    const cobrancaId = uuidv4();

    // Gerar payload Pix e QR Code
    const descricao = infoAdicionais?.[0]?.valor || 'Cobrança Pix';
    const valorNumerico = parseFloat(valor.original);

    const { pixCopiaECola, qrCodeBase64 } = await generatePixCobranca(
      txid,
      valorNumerico,
      descricao
    );

    // Criar location URL
    const location = `${req.protocol}://${req.get('host')}/pix/v2/loc/${cobrancaId}`;

    // Salvar no banco
    const cobranca = {
      id: cobrancaId,
      txid,
      valor: valorNumerico,
      status: 'ATIVA',
      descricao,
      nome_pagador: devedor?.nome || null,
      cpf_cnpj: devedor?.cpf || devedor?.cnpj || null,
      expiracao: calendario?.expiracao || 3600,
      pixCopiaECola,
      qrCodeBase64,
      location,
      link_final: link_final || null
    };

    await database.createCobranca(cobranca);

    // Resposta no formato do Banco Inter
    res.status(201).json({
      calendario: {
        criacao: new Date().toISOString(),
        expiracao: calendario?.expiracao || 3600
      },
      txid,
      revisao: 0,
      loc: {
        id: cobrancaId,
        location,
        tipoCob: 'cob'
      },
      location,
      status: 'ATIVA',
      devedor: devedor || {},
      valor: {
        original: valor.original
      },
      chave: 'mock@bancointer.com.br',
      solicitacaoPagador: descricao,
      infoAdicionais: infoAdicionais || [],
      pixCopiaECola,
      qrCodeImage: qrCodeBase64
    });

  } catch (error) {
    console.error('Erro ao criar cobrança:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: error.message
    });
  }
});

/**
 * GET /pix/v2/cob/:txid
 * Consultar cobrança por txid
 */
router.get('/pix/v2/cob/:txid', async (req, res) => {
  try {
    const { txid } = req.params;

    const cobranca = await database.getCobrancaByTxid(txid);

    if (!cobranca) {
      return res.status(404).json({
        error: 'Cobrança nêo encontrada',
        message: `Nêo foi encontrada cobrança com txid: ${txid}`
      });
    }

    res.json({
      calendario: {
        criacao: new Date(cobranca.created_at * 1000).toISOString(),
        expiracao: cobranca.expiracao
      },
      txid: cobranca.txid,
      revisao: 0,
      loc: {
        id: cobranca.id,
        location: cobranca.location,
        tipoCob: 'cob'
      },
      location: cobranca.location,
      status: cobranca.status,
      devedor: {
        nome: cobranca.nome_pagador,
        cpf: cobranca.cpf_cnpj
      },
      valor: {
        original: cobranca.valor.toFixed(2)
      },
      chave: 'mock@bancointer.com.br',
      solicitacaoPagador: cobranca.descricao,
      pixCopiaECola: cobranca.pixCopiaECola,
      qrCodeImage: cobranca.qrCodeBase64,
      link_final: cobranca.link_final
    });

  } catch (error) {
    console.error('Erro ao consultar cobrança:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: error.message
    });
  }
});

/**
 * GET /pix/v2/loc/:id
 * Consultar cobrança por location ID
 */
router.get('/pix/v2/loc/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const cobranca = await database.getCobrancaById(id);

    if (!cobranca) {
      return res.status(404).json({
        error: 'Location nêo encontrado',
        message: `Nêo foi encontrado location com id: ${id}`
      });
    }

    res.json({
      calendario: {
        criacao: new Date(cobranca.created_at * 1000).toISOString(),
        expiracao: cobranca.expiracao
      },
      txid: cobranca.txid,
      revisao: 0,
      loc: {
        id: cobranca.id,
        location: cobranca.location,
        tipoCob: 'cob'
      },
      location: cobranca.location,
      status: cobranca.status,
      devedor: {
        nome: cobranca.nome_pagador,
        cpf: cobranca.cpf_cnpj
      },
      valor: {
        original: cobranca.valor.toFixed(2)
      },
      chave: 'mock@bancointer.com.br',
      solicitacaoPagador: cobranca.descricao,
      pixCopiaECola: cobranca.pixCopiaECola,
      qrCodeImage: cobranca.qrCodeBase64,
      link_final: cobranca.link_final
    });

  } catch (error) {
    console.error('Erro ao consultar location:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: error.message
    });
  }
});

/**
 * GET /pix/v2/cob
 * Listar todas as cobranças
 */
router.get('/pix/v2/cob', async (req, res) => {
  try {
    const cobrancas = await database.getAllCobrancas();

    res.json({
      parametros: {
        inicio: new Date().toISOString(),
        fim: new Date().toISOString(),
        paginacao: {
          paginaAtual: 0,
          itensPorPagina: cobrancas.length,
          quantidadeDePaginas: 1,
          quantidadeTotalDeItens: cobrancas.length
        }
      },
      cobs: cobrancas.map(cob => ({
        calendario: {
          criacao: new Date(cob.created_at * 1000).toISOString(),
          expiracao: cob.expiracao
        },
        txid: cob.txid,
        revisao: 0,
        status: cob.status,
        valor: {
          original: cob.valor.toFixed(2)
        },
        chave: 'mock@bancointer.com.br'
      }))
    });

  } catch (error) {
    console.error('Erro ao listar cobranças:', error);
    res.status(500).json({
      error: 'Erro interno',
      message: error.message
    });
  }
});

export default router;
