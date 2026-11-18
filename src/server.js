import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import pixRoutes from './routes/pixRoutes.js';
import simulatorRoutes from './routes/simulatorRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../public')));

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rotas da API
app.use('/', pixRoutes);
app.use('/', simulatorRoutes);

// Rota raiz
app.get('/api', (req, res) => {
  res.json({
    name: 'Simulador de API Pix - Banco Inter',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      authentication: {
        'POST /auth/token': 'Gerar token de acesso (mock)'
      },
      cobrancas: {
        'PUT /pix/v2/cob?txid=XXX': 'Criar cobrança com txid',
        'GET /pix/v2/cob/:txid': 'Consultar cobrança por txid',
        'GET /pix/v2/loc/:id': 'Consultar cobrança por location ID',
        'GET /pix/v2/cob': 'Listar todas as cobranças'
      },
      simulacao: {
        'POST /internal/simulate-pay': 'Simular pagamento de cobrança',
        'POST /internal/simulate-cancel': 'Simular cancelamento de cobrança'
      },
      webhook: {
        'POST /webhook/pix': 'Receber notificação de webhook',
        'GET /webhook/pix/history': 'Histórico de webhooks recebidos'
      }
    },
    documentation: 'Acesse / para a interface web'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// 404 handler para rotas de API
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    path: req.path
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║   🚀 Simulador de API Pix - Banco Inter             ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');
  console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
  console.log(`📱 Interface Web: http://localhost:${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/api`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health\n`);
  console.log('📝 Endpoints disponíveis:');
  console.log('   - PUT  /pix/v2/cob?txid=XXX');
  console.log('   - GET  /pix/v2/cob/:txid');
  console.log('   - GET  /pix/v2/loc/:id');
  console.log('   - POST /internal/simulate-pay');
  console.log('   - POST /webhook/pix\n');
  console.log('⌨️  Pressione Ctrl+C para parar o servidor\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Encerrando servidor...');
  process.exit(0);
});

export default app;
