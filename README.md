# ê°Å¸ÂÂ¦ Simulador de API Pix - Banco Inter

Ambiente de simulaêÂ§êÂ£o completo que reproduz o comportamento da **API Pix do Banco Inter** sem necessidade de conta bancêÂ¡ria real.

## ê°Å¸Å½Â¯ CaracterêÂ­sticas

- ê¢Åâ¦ SimulaêÂ§êÂ£o completa da API Pix do Banco Inter
- ê¢Åâ¦ CriaêÂ§êÂ£o de cobranêÂ§as Pix dinêÂ¢micas com QR Code
- ê¢Åâ¦ GeraêÂ§êÂ£o de payload EMV (Copia e Cola)
- ê¢Åâ¦ Sistema de webhook para notificaêÂ§êÂµes
- ê¢Åâ¦ Interface web amigêÂ¡vel
- ê¢Åâ¦ Banco de dados SQLite local
- ê¢Åâ¦ SimulaêÂ§êÂ£o de pagamento
- ê¢Åâ¦ LiberaêÂ§êÂ£o de link apêÂ³s pagamento

## ê°Å¸ââ¹ Requisitos

- Node.js 18.x ou superior
- npm ou yarn

## ê°Å¸Å¡â¬ InstalaêÂ§êÂ£o e Uso

### 1. Instalar DependêÂªncias

```bash
npm install
```

### 2. Iniciar o Servidor

```bash
npm start
```

O servidor estarêÂ¡ disponêÂ­vel em: **http://localhost:3000**

### 3. Acessar a Interface Web

Abra seu navegador e acesse:

```
http://localhost:3000
```

## ê°Å¸âÂ¥ê¯Â¸Â Interface Web

A interface web permite:

1. **Criar CobranêÂ§a** - Preencher formulêÂ¡rio com dados da cobranêÂ§a
2. **Visualizar QR Code** - Ver o QR Code gerado e cêÂ³digo copia-e-cola
3. **Simular Pagamento** - Testar o fluxo de pagamento
4. **Link Liberado** - Ver o link final apêÂ³s confirmaêÂ§êÂ£o

### Fluxo de Uso

1. Preencha o formulêÂ¡rio com:
   - ID da TransaêÂ§êÂ£o (txid)
   - Valor
   - DescriêÂ§êÂ£o (opcional)
   - Nome do Pagador (opcional)
   - CPF/CNPJ (opcional)
   - ExpiraêÂ§êÂ£o em segundos (padrêÂ£o: 3600)
   - Link final para liberaêÂ§êÂ£o (opcional)

2. Clique em "Criar CobranêÂ§a"

3. SerêÂ¡ exibido:
   - QR Code gerado
   - CêÂ³digo PIX Copia e Cola
   - Status da cobranêÂ§a (ATIVA)

4. Clique em "Simular Pagamento"

5. Aguarde processamento e veja:
   - ConfirmaêÂ§êÂ£o de pagamento
   - Link final liberado (se informado)

## ê°Å¸âÅ API Endpoints

### AutenticaêÂ§êÂ£o

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

### CobranêÂ§as

#### `PUT /pix/v2/cob?txid={txid}`
Criar cobranêÂ§a Pix

**Request:**
```json
{
  "calendario": {
    "expiracao": 3600
  },
  "devedor": {
    "nome": "JoêÂ£o Silva",
    "cpf": "12345678900"
  },
  "valor": {
    "original": "29.90"
  },
  "infoAdicionais": [
    {
      "nome": "DescriêÂ§êÂ£o",
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
Consultar cobranêÂ§a por txid

#### `GET /pix/v2/loc/:id`
Consultar cobranêÂ§a por location ID

#### `GET /pix/v2/cob`
Listar todas as cobranêÂ§as

### SimulaêÂ§êÂ£o

#### `POST /internal/simulate-pay`
Simular pagamento de uma cobranêÂ§a

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
Simular cancelamento de cobranêÂ§a

**Request:**
```json
{
  "txid": "pedido123"
}
```

### Webhook

#### `POST /webhook/pix`
Receber notificaêÂ§êÂµes de webhook

#### `GET /webhook/pix/history`
Ver histêÂ³rico de webhooks recebidos

## ê°Å¸âÂ Estrutura do Projeto

```
apipixinter/
ê¢âÅê¢ââ¬ê¢ââ¬ data/                      # Banco de dados SQLite
ê¢ââ   ê¢ââê¢ââ¬ê¢ââ¬ cobrancas.db
ê¢âÅê¢ââ¬ê¢ââ¬ doc/                       # DocumentaêÂ§êÂ£o
ê¢ââ   ê¢ââê¢ââ¬ê¢ââ¬ Relatorio_Simulador_Pix_BancoInter.md
ê¢âÅê¢ââ¬ê¢ââ¬ public/                    # Frontend
ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ index.html            # Interface web
ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ styles.css            # Estilos
ê¢ââ   ê¢ââê¢ââ¬ê¢ââ¬ app.js                # LêÂ³gica do frontend
ê¢âÅê¢ââ¬ê¢ââ¬ src/                       # Backend
ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ database/
ê¢ââ   ê¢ââ   ê¢ââê¢ââ¬ê¢ââ¬ db.js             # ConfiguraêÂ§êÂ£o do banco
ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ routes/
ê¢ââ   ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ pixRoutes.js      # Rotas da API Pix
ê¢ââ   ê¢ââ   ê¢ââê¢ââ¬ê¢ââ¬ simulatorRoutes.js # Rotas de simulaêÂ§êÂ£o
ê¢ââ   ê¢âÅê¢ââ¬ê¢ââ¬ services/
ê¢ââ   ê¢ââ   ê¢ââê¢ââ¬ê¢ââ¬ pixService.js     # ServiêÂ§os Pix (QR, payload)
ê¢ââ   ê¢ââê¢ââ¬ê¢ââ¬ server.js             # Servidor Express
ê¢âÅê¢ââ¬ê¢ââ¬ package.json
ê¢ââê¢ââ¬ê¢ââ¬ README.md
```

## ê°Å¸ââê¯Â¸Â Banco de Dados

O sistema usa SQLite com a seguinte estrutura:

### Tabela: `cobrancas`

| Campo          | Tipo      | DescriêÂ§êÂ£o                    |
|----------------|-----------|------------------------------|
| id             | TEXT      | UUID êÂºnico                   |
| txid           | TEXT      | ID da transaêÂ§êÂ£o (êÂºnico)      |
| valor          | REAL      | Valor da cobranêÂ§a            |
| status         | TEXT      | ATIVA, PAGA, CANCELADA       |
| descricao      | TEXT      | DescriêÂ§êÂ£o da cobranêÂ§a        |
| nome_pagador   | TEXT      | Nome do pagador              |
| cpf_cnpj       | TEXT      | CPF ou CNPJ                  |
| expiracao      | INTEGER   | Tempo de expiraêÂ§êÂ£o (seg)     |
| pixCopiaECola  | TEXT      | Payload EMV                  |
| qrCodeBase64   | TEXT      | QR Code em base64            |
| location       | TEXT      | URL da location              |
| link_final     | TEXT      | Link liberado apêÂ³s pagamento |
| created_at     | INTEGER   | Timestamp de criaêÂ§êÂ£o         |
| paid_at        | INTEGER   | Timestamp de pagamento       |
| updated_at     | INTEGER   | Timestamp de atualizaêÂ§êÂ£o     |

## ê°Å¸Â§Âª Testando com cURL

### Criar uma cobranêÂ§a

```bash
curl -X PUT "http://localhost:3000/pix/v2/cob?txid=teste123" \
  -H "Content-Type: application/json" \
  -d '{
    "valor": {"original": "29.90"},
    "calendario": {"expiracao": 3600},
    "devedor": {"nome": "JoêÂ£o Silva", "cpf": "12345678900"},
    "infoAdicionais": [{"nome": "DescriêÂ§êÂ£o", "valor": "Teste"}],
    "link_final": "https://exemplo.com/sucesso"
  }'
```

### Consultar cobranêÂ§a

```bash
curl http://localhost:3000/pix/v2/cob/teste123
```

### Simular pagamento

```bash
curl -X POST http://localhost:3000/internal/simulate-pay \
  -H "Content-Type: application/json" \
  -d '{"txid": "teste123", "valor_pago": "29.90"}'
```

## ê°Å¸ââ SeguranêÂ§a

Este êÂ© um **ambiente de simulaêÂ§êÂ£o** para testes. RecomendaêÂ§êÂµes:

- ê¢Å¡Â ê¯Â¸Â NêÆO usar credenciais reais
- ê¢Å¡Â ê¯Â¸Â NêÆO processar pagamentos reais
- ê¢Å¡Â ê¯Â¸Â Usar valores pequenos para testes (ex: R$ 0,01)
- ê¢Å¡Â ê¯Â¸Â Proteger com senha se publicado
- ê¢Å¡Â ê¯Â¸Â NêÂ£o expor em produêÂ§êÂ£o

## ê°Å¸ââ MigraêÂ§êÂ£o para API Real

Para usar a API oficial do Banco Inter:

1. Criar conta PJ no Banco Inter
2. Gerar `client_id`, `client_secret` e certificado digital
3. Substituir endpoints mock pelos reais:
   - `https://cdpj.partners.bancointer.com.br`
4. Implementar autenticaêÂ§êÂ£o OAuth2
5. Configurar webhook real
6. Manter a estrutura de dados existente

## ê°Å¸âÂ Status de CobranêÂ§a

- **ATIVA** - CobranêÂ§a criada e aguardando pagamento
- **PAGA** - Pagamento confirmado
- **CANCELADA** - CobranêÂ§a cancelada

## ê°Å¸Å½Â¨ Interface

A interface web possui:

- Design responsivo
- FormulêÂ¡rio de cadastro intuitivo
- ExibiêÂ§êÂ£o clara do QR Code
- CêÂ³digo copia-e-cola funcional
- Feedback visual de status
- NotificaêÂ§êÂµes toast
- AnimaêÂ§êÂµes suaves

## ê°Å¸Ââº Debug

Ver logs do servidor:
```bash
npm start
```

Logs incluem:
- RequisiêÂ§êÂµes HTTP
- CriaêÂ§êÂ£o de cobranêÂ§as
- SimulaêÂ§êÂ£o de pagamentos
- Disparos de webhook

## ê°Å¸âÅ  Funcionalidades Implementadas

- [x] Endpoint `/pix/v2/cob?txid=` criado
- [x] GeraêÂ§êÂ£o de `pixCopiaECola` e QR Base64
- [x] SimulaêÂ§êÂ£o de pagamento `/internal/simulate-pay`
- [x] Webhook funcional `/webhook/pix`
- [x] AtualizaêÂ§êÂ£o automêÂ¡tica de status
- [x] LiberaêÂ§êÂ£o de `link_final`
- [x] Interface web completa
- [x] Banco de dados SQLite
- [x] Consulta de cobranêÂ§as
- [x] HistêÂ³rico de webhooks

## ê°Å¸Â¤Â ContribuiêÂ§êÂ£o

Este êÂ© um projeto de simulaêÂ§êÂ£o para testes. Sinta-se livre para:

- Reportar bugs
- Sugerir melhorias
- Fazer fork do projeto
- Adaptar para suas necessidades

## ê°Å¸ââ LicenêÂ§a

ISC

## ê°Å¸âÂ¨ê¢â¬Âê°Å¸âÂ» Autor

Projeto criado para simular a API Pix do Banco Inter para fins de desenvolvimento e testes.

---

**ê¢Å¡Â ê¯Â¸Â IMPORTANTE:** Este êÂ© um simulador para fins educacionais e de teste. NêÂ£o processar transaêÂ§êÂµes reais.

---

Projeto adaptado da comunidade ARCKHê TDS - ARCKHÉe