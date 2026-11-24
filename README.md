# ðŸ¦ Simulador de API Pix - Banco Inter

Ambiente de simulaÃ§Ã£o completo que reproduz o comportamento da **API Pix do Banco Inter** sem necessidade de conta bancÃ¡ria real.

## ðŸŽ¯ CaracterÃ­sticas

- âœ… SimulaÃ§Ã£o completa da API Pix do Banco Inter
- âœ… CriaÃ§Ã£o de cobranÃ§as Pix dinÃ¢micas com QR Code
- âœ… GeraÃ§Ã£o de payload EMV (Copia e Cola)
- âœ… Sistema de webhook para notificaÃ§Ãµes
- âœ… Interface web amigÃ¡vel
- âœ… Banco de dados SQLite local
- âœ… SimulaÃ§Ã£o de pagamento
- âœ… LiberaÃ§Ã£o de link apÃ³s pagamento

## ðŸ“‹ Requisitos

- Node.js 18.x ou superior
- npm ou yarn

## ðŸš€ InstalaÃ§Ã£o e Uso

### 1. Instalar DependÃªncias

```bash
npm install
```

### 2. Iniciar o Servidor

```bash
npm start
```

O servidor estarÃ¡ disponÃ­vel em: **http://localhost:3000**

### 3. Acessar a Interface Web

Abra seu navegador e acesse:

```
http://localhost:3000
```

## ðŸ–¥ï¸ Interface Web

A interface web permite:

1. **Criar CobranÃ§a** - Preencher formulÃ¡rio com dados da cobranÃ§a
2. **Visualizar QR Code** - Ver o QR Code gerado e cÃ³digo copia-e-cola
3. **Simular Pagamento** - Testar o fluxo de pagamento
4. **Link Liberado** - Ver o link final apÃ³s confirmaÃ§Ã£o

### Fluxo de Uso

1. Preencha o formulÃ¡rio com:
   - ID da TransaÃ§Ã£o (txid)
   - Valor
   - DescriÃ§Ã£o (opcional)
   - Nome do Pagador (opcional)
   - CPF/CNPJ (opcional)
   - ExpiraÃ§Ã£o em segundos (padrÃ£o: 3600)
   - Link final para liberaÃ§Ã£o (opcional)

2. Clique em "Criar CobranÃ§a"

3. SerÃ¡ exibido:
   - QR Code gerado
   - CÃ³digo PIX Copia e Cola
   - Status da cobranÃ§a (ATIVA)

4. Clique em "Simular Pagamento"

5. Aguarde processamento e veja:
   - ConfirmaÃ§Ã£o de pagamento
   - Link final liberado (se informado)

## ðŸ”Œ API Endpoints

### AutenticaÃ§Ã£o

#### `POST /auth/token`
Gera token de acesso (mock)

**Response:**
```json
{
  "access_token": "mock_token_123456",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### CobranÃ§as

#### `PUT /pix/v2/cob?txid={txid}`
Criar cobranÃ§a Pix

**Request:**
```json
{
  "calendario": {
    "expiracao": 3600
  },
  "devedor": {
    "nome": "JoÃ£o Silva",
    "cpf": "12345678900"
  },
  "valor": {
    "original": "29.90"
  },
  "infoAdicionais": [
    {
      "nome": "DescriÃ§Ã£o",
      "valor": "Pagamento de produto"
    }
  ],
  "link_final": "https://exemplo.com/sucesso"
}
```

**Response:**
```json
{
  "txid": "pedido123",
  "status": "ATIVA",
  "location": "http://localhost:3000/pix/v2/loc/uuid-123",
  "pixCopiaECola": "00020126...",
  "qrCodeImage": "data:image/png;base64,iVBORw0K...",
  "link_final": "https://exemplo.com/sucesso"
}
```

#### `GET /pix/v2/cob/:txid`
Consultar cobranÃ§a por txid

#### `GET /pix/v2/loc/:id`
Consultar cobranÃ§a por location ID

#### `GET /pix/v2/cob`
Listar todas as cobranÃ§as

### SimulaÃ§Ã£o

#### `POST /internal/simulate-pay`
Simular pagamento de uma cobranÃ§a

**Request:**
```json
{
  "txid": "pedido123",
  "valor_pago": "29.90"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pagamento simulado com sucesso",
  "txid": "pedido123",
  "status": "PAGA",
  "valor_pago": "29.90",
  "paid_at": "2025-11-12T11:06:13.000Z",
  "link_final": "https://exemplo.com/sucesso",
  "webhook_triggered": true
}
```

#### `POST /internal/simulate-cancel`
Simular cancelamento de cobranÃ§a

**Request:**
```json
{
  "txid": "pedido123"
}
```

### Webhook

#### `POST /webhook/pix`
Receber notificaÃ§Ãµes de webhook

#### `GET /webhook/pix/history`
Ver histÃ³rico de webhooks recebidos

## ðŸ“ Estrutura do Projeto

```
apipixinter/
â”œâ”€â”€ data/                      # Banco de dados SQLite
â”‚   â””â”€â”€ cobrancas.db
â”œâ”€â”€ doc/                       # DocumentaÃ§Ã£o
â”‚   â””â”€â”€ Relatorio_Simulador_Pix_BancoInter.md
â”œâ”€â”€ public/                    # Frontend
â”‚   â”œâ”€â”€ index.html            # Interface web
â”‚   â”œâ”€â”€ styles.css            # Estilos
â”‚   â””â”€â”€ app.js                # LÃ³gica do frontend
â”œâ”€â”€ src/                       # Backend
â”‚   â”œâ”€â”€ database/
â”‚   â”‚   â””â”€â”€ db.js             # ConfiguraÃ§Ã£o do banco
â”‚   â”œâ”€â”€ routes/
â”‚   â”‚   â”œâ”€â”€ pixRoutes.js      # Rotas da API Pix
â”‚   â”‚   â””â”€â”€ simulatorRoutes.js # Rotas de simulaÃ§Ã£o
â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â””â”€â”€ pixService.js     # ServiÃ§os Pix (QR, payload)
â”‚   â””â”€â”€ server.js             # Servidor Express
â”œâ”€â”€ package.json
â””â”€â”€ README.md
```

## ðŸ—„ï¸ Banco de Dados

O sistema usa SQLite com a seguinte estrutura:

### Tabela: `cobrancas`

| Campo          | Tipo      | DescriÃ§Ã£o                    |
|----------------|-----------|------------------------------|
| id             | TEXT      | UUID Ãºnico                   |
| txid           | TEXT      | ID da transaÃ§Ã£o (Ãºnico)      |
| valor          | REAL      | Valor da cobranÃ§a            |
| status         | TEXT      | ATIVA, PAGA, CANCELADA       |
| descricao      | TEXT      | DescriÃ§Ã£o da cobranÃ§a        |
| nome_pagador   | TEXT      | Nome do pagador              |
| cpf_cnpj       | TEXT      | CPF ou CNPJ                  |
| expiracao      | INTEGER   | Tempo de expiraÃ§Ã£o (seg)     |
| pixCopiaECola  | TEXT      | Payload EMV                  |
| qrCodeBase64   | TEXT      | QR Code em base64            |
| location       | TEXT      | URL da location              |
| link_final     | TEXT      | Link liberado apÃ³s pagamento |
| created_at     | INTEGER   | Timestamp de criaÃ§Ã£o         |
| paid_at        | INTEGER   | Timestamp de pagamento       |
| updated_at     | INTEGER   | Timestamp de atualizaÃ§Ã£o     |

## ðŸ§ª Testando com cURL

### Criar uma cobranÃ§a

```bash
curl -X PUT "http://localhost:3000/pix/v2/cob?txid=teste123" \
  -H "Content-Type: application/json" \
  -d '{
    "valor": {"original": "29.90"},
    "calendario": {"expiracao": 3600},
    "devedor": {"nome": "JoÃ£o Silva", "cpf": "12345678900"},
    "infoAdicionais": [{"nome": "DescriÃ§Ã£o", "valor": "Teste"}],
    "link_final": "https://exemplo.com/sucesso"
  }'
```

### Consultar cobranÃ§a

```bash
curl http://localhost:3000/pix/v2/cob/teste123
```

### Simular pagamento

```bash
curl -X POST http://localhost:3000/internal/simulate-pay \
  -H "Content-Type: application/json" \
  -d '{"txid": "teste123", "valor_pago": "29.90"}'
```

## ðŸ”’ SeguranÃ§a

Este Ã© um **ambiente de simulaÃ§Ã£o** para testes. RecomendaÃ§Ãµes:

- âš ï¸ NÃƒO usar credenciais reais
- âš ï¸ NÃƒO processar pagamentos reais
- âš ï¸ Usar valores pequenos para testes (ex: R$ 0,01)
- âš ï¸ Proteger com senha se publicado
- âš ï¸ NÃ£o expor em produÃ§Ã£o

## ðŸ”„ MigraÃ§Ã£o para API Real

Para usar a API oficial do Banco Inter:

1. Criar conta PJ no Banco Inter
2. Gerar `client_id`, `client_secret` e certificado digital
3. Substituir endpoints mock pelos reais:
   - `https://cdpj.partners.bancointer.com.br`
4. Implementar autenticaÃ§Ã£o OAuth2
5. Configurar webhook real
6. Manter a estrutura de dados existente

## ðŸ“ Status de CobranÃ§a

- **ATIVA** - CobranÃ§a criada e aguardando pagamento
- **PAGA** - Pagamento confirmado
- **CANCELADA** - CobranÃ§a cancelada

## ðŸŽ¨ Interface

A interface web possui:

- Design responsivo
- FormulÃ¡rio de cadastro intuitivo
- ExibiÃ§Ã£o clara do QR Code
- CÃ³digo copia-e-cola funcional
- Feedback visual de status
- NotificaÃ§Ãµes toast
- AnimaÃ§Ãµes suaves

## ðŸ› Debug

Ver logs do servidor:
```bash
npm start
```

Logs incluem:
- RequisiÃ§Ãµes HTTP
- CriaÃ§Ã£o de cobranÃ§as
- SimulaÃ§Ã£o de pagamentos
- Disparos de webhook

## ðŸ“Š Funcionalidades Implementadas

- [x] Endpoint `/pix/v2/cob?txid=` criado
- [x] GeraÃ§Ã£o de `pixCopiaECola` e QR Base64
- [x] SimulaÃ§Ã£o de pagamento `/internal/simulate-pay`
- [x] Webhook funcional `/webhook/pix`
- [x] AtualizaÃ§Ã£o automÃ¡tica de status
- [x] LiberaÃ§Ã£o de `link_final`
- [x] Interface web completa
- [x] Banco de dados SQLite
- [x] Consulta de cobranÃ§as
- [x] HistÃ³rico de webhooks

## ðŸ¤ ContribuiÃ§Ã£o

Este Ã© um projeto de simulaÃ§Ã£o para testes. Sinta-se livre para:

- Reportar bugs
- Sugerir melhorias
- Fazer fork do projeto
- Adaptar para suas necessidades

## ðŸ“„ LicenÃ§a

ISC

## ðŸ‘¨â€ðŸ’» Autor

Projeto criado para simular a API Pix do Banco Inter para fins de desenvolvimento e testes.

---

**âš ï¸ IMPORTANTE:** Este Ã© um simulador para fins educacionais e de teste. NÃ£o processar transaÃ§Ãµes reais.

---

Projeto adaptado da comunidade ARCKHÉ TDS - Marca Arckhe