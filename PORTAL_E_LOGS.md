# ê°Å¸ÅÂ Portal ARCKHê Club e Sistema de Logs

## ê¢Åâ¦ Implementado

Sistema completo de redirecionamento para o portal **ARCKHê Club** (https://ARCKHê AI/) com registro de pagamentos e acessos em arquivos.

---

## ê°Å¸Å½Â¯ Funcionalidades Implementadas

### 1. ê°Å¸ââ Link do Portal ApêÂ³s Pagamento

Quando um pagamento êÂ© confirmado:
- ê¢Åâ¦ Aparece automaticamente o link para **https://ARCKHê AI/**
- ê¢Åâ¦ BotêÂ£o destacado e atrativo com design profissional
- ê¢Åâ¦ Texto: "ê°Å¸Å½â° Acesso Liberado ao Portal! ê°Å¸ÅÂ Acessar Portal ARCKHê Club"

### 2. ê°Å¸âÂ Registro de Pagamentos

Todos os pagamentos sêÂ£o automaticamente salvos em arquivos:

**Arquivos criados:**
- `logs/pagamentos.log` - JSON estruturado (para processamento)
- `logs/pagamentos_legivel.txt` - Formato legêÂ­vel (para humanos)

**Dados registrados:**
- ê°Å¸ââ¦ Data e hora do pagamento
- ê°Å¸âÂµ Valor pago
- ê°Å¸â â ID da transaêÂ§êÂ£o (txid)
- ê°Å¸âÂ¤ Nome do pagador
- ê°Å¸ââ CPF/CNPJ
- ê°Å¸ââ Link final liberado
- ê¢Åâ¦ Status do pagamento

### 3. ê°Å¸ÅÂ Registro de Acessos ao Portal

Quando o usuêÂ¡rio clica no link do portal:
- ê¢Åâ¦ Acesso êÂ© registrado antes de abrir o link
- ê¢Åâ¦ Portal abre em nova aba automaticamente
- ê¢Åâ¦ NotificaêÂ§êÂ£o visual "Abrindo portal..."

**Arquivos criados:**
- `logs/acessos_portal.log` - JSON estruturado
- `logs/acessos_portal_legivel.txt` - Formato legêÂ­vel

**Dados registrados:**
- ê°Å¸ââ¦ Data e hora do acesso
- ê°Å¸â â ID da transaêÂ§êÂ£o
- ê°Å¸âÂµ Valor pago
- ê°Å¸ââ URL do portal (https://ARCKHê AI/)
- ê°Å¸ÅÂ EndereêÂ§o IP do usuêÂ¡rio
- ê°Å¸âÂ» User Agent (navegador/dispositivo)

---

## ê°Å¸âÅ  Novos Endpoints da API

### 1. Registrar Acesso ao Portal

```bash
POST /internal/register-portal-access
Content-Type: application/json

{
  "txid": "pedido123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Acesso ao portal registrado",
  "portal_url": "https://ARCKHê AI/"
}
```

### 2. Ver Pagamentos Registrados

```bash
GET /internal/logs/payments?limit=50
```

**Response:**
```json
{
  "total": 1,
  "payments": [
    {
      "timestamp": "2025-11-12T11:20:58.961Z",
      "tipo": "PAGAMENTO_CONFIRMADO",
      "txid": "testeportal001",
      "valor": "49.90",
      "nome_pagador": "Maria da Silva",
      "cpf_cnpj": "98765432100",
      "paid_at": "2025-11-12T11:20:58.000Z",
      "link_final": "https://ARCKHê AI/"
    }
  ]
}
```

### 3. Ver Acessos ao Portal

```bash
GET /internal/logs/accesses?limit=50
```

**Response:**
```json
{
  "total": 1,
  "accesses": [
    {
      "timestamp": "2025-11-12T11:21:20.604Z",
      "tipo": "ACESSO_PORTAL",
      "txid": "testeportal001",
      "valor": "49.90",
      "portal_url": "https://ARCKHê AI/",
      "ip": "::1",
      "user_agent": "Mozilla/5.0..."
    }
  ]
}
```

### 4. Ver EstatêÂ­sticas

```bash
GET /internal/statistics
```

**Response:**
```json
{
  "total_pagamentos": 1,
  "total_acessos": 1,
  "valor_total": "49.90",
  "taxa_acesso": "100.0%",
  "ultimos_pagamentos": [...],
  "ultimos_acessos": [...]
}
```

---

## ê°Å¸âÂ Estrutura de Arquivos de Log

### Formato JSON (processamento automatizado)

**`logs/pagamentos.log`:**
```json
{"timestamp":"2025-11-12T11:20:58.961Z","tipo":"PAGAMENTO_CONFIRMADO","txid":"testeportal001","valor":"49.90","nome_pagador":"Maria da Silva","cpf_cnpj":"98765432100","paid_at":"2025-11-12T11:20:58.000Z","link_final":"https://ARCKHê AI/"}
```

**`logs/acessos_portal.log`:**
```json
{"timestamp":"2025-11-12T11:21:20.604Z","tipo":"ACESSO_PORTAL","txid":"testeportal001","valor":"49.90","portal_url":"https://ARCKHê AI/","ip":"::1","user_agent":"curl/8.5.0"}
```

### Formato LegêÂ­vel (visualizaêÂ§êÂ£o humana)

**`logs/pagamentos_legivel.txt`:**
```
ê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Â
ê°Å¸ââ¦ Data/Hora: 12/11/2025, 08:20:58
ê°Å¸âÂµ Valor: R$ 49.90
ê°Å¸â â ID TransaêÂ§êÂ£o: testeportal001
ê°Å¸âÂ¤ Pagador: Maria da Silva
ê°Å¸ââ CPF/CNPJ: 98765432100
ê°Å¸ââ Link Final: https://ARCKHê AI/
ê¢Åâ¦ Status: PAGO
ê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Âê¢â¢Â
```

**`logs/acessos_portal_legivel.txt`:**
```
ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬
ê°Å¸ÅÂ ACESSO AO PORTAL
ê°Å¸ââ¦ Data/Hora: 12/11/2025, 08:21:20
ê°Å¸â â TransaêÂ§êÂ£o: testeportal001
ê°Å¸âÂµ Valor: R$ 49.90
ê°Å¸ââ Portal: https://ARCKHê AI/
ê°Å¸ÅÂ IP: ::1
ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬ê¢ââ¬
```

---

## ê°Å¸Å½Â¨ Interface Web

### Tela de Sucesso ApêÂ³s Pagamento

Quando o pagamento êÂ© confirmado, a interface mostra:

1. **ConfirmaêÂ§êÂ£o de Pagamento:**
   - ê¢Åâ¦ êÂcone de sucesso
   - ID da transaêÂ§êÂ£o
   - Valor pago
   - Data e hora

2. **Box do Portal (destaque):**
   - Fundo gradiente azul/roxo
   - TêÂ­tulo: "ê°Å¸Å½â° Acesso Liberado ao Portal!"
   - DescriêÂ§êÂ£o: "Clique no botêÂ£o abaixo para acessar o portal ARCKHê Club"
   - BotêÂ£o branco estilizado: "ê°Å¸ÅÂ Acessar Portal ARCKHê Club ê¢â â"
   - Nota: "O acesso serêÂ¡ registrado quando vocêÂª clicar no link"

3. **Comportamento ao Clicar:**
   - Registra acesso via API
   - Mostra notificaêÂ§êÂ£o: "Abrindo portal..."
   - Aguarda 500ms
   - Abre https://ARCKHê AI/ em nova aba

---

## ê°Å¸âÂ Monitoramento e AnêÂ¡lise

### Ver Logs em Tempo Real

```bash
# Pagamentos
tail -f logs/pagamentos_legivel.txt

# Acessos ao portal
tail -f logs/acessos_portal_legivel.txt
```

### Contar Pagamentos

```bash
wc -l logs/pagamentos.log
```

### Contar Acessos

```bash
wc -l logs/acessos_portal.log
```

### Ver EstatêÂ­sticas via API

```bash
curl http://localhost:3000/internal/statistics | python3 -m json.tool
```

---

## ê°Å¸âË EstatêÂ­sticas DisponêÂ­veis

O endpoint `/internal/statistics` fornece:

- **Total de pagamentos** realizados
- **Total de acessos** ao portal
- **Valor total** arrecadado
- **Taxa de acesso** (% de pagantes que acessaram o portal)
- **êÅ¡ltimos 5 pagamentos** registrados
- **êÅ¡ltimos 5 acessos** ao portal

---

## ê°Å¸Â§Âª Testando o Fluxo Completo

### 1. Criar CobranêÂ§a

```bash
curl -X PUT "http://localhost:3000/pix/v2/cob?txid=teste001" \
  -H "Content-Type: application/json" \
  -d '{
    "valor": {"original": "10.00"},
    "devedor": {"nome": "JoêÂ£o Silva", "cpf": "12345678900"},
    "infoAdicionais": [{"nome": "Produto", "valor": "Acesso Portal"}]
  }'
```

### 2. Simular Pagamento

```bash
curl -X POST http://localhost:3000/internal/simulate-pay \
  -H "Content-Type: application/json" \
  -d '{"txid": "teste001", "valor_pago": "10.00"}'
```

### 3. Simular Clique no Portal

```bash
curl -X POST http://localhost:3000/internal/register-portal-access \
  -H "Content-Type: application/json" \
  -d '{"txid": "teste001"}'
```

### 4. Verificar Logs

```bash
# Ver pagamentos
cat logs/pagamentos_legivel.txt

# Ver acessos
cat logs/acessos_portal_legivel.txt

# Ver estatêÂ­sticas
curl http://localhost:3000/internal/statistics
```

---

## ê¢ÅÂ¨ Recursos Especiais

### 1. Logs Duplos

Cada evento êÂ© salvo em **dois formatos**:
- **JSON** para processamento automatizado
- **LegêÂ­vel** para visualizaêÂ§êÂ£o humana

### 2. InformaêÂ§êÂµes Completas

Registra nêÂ£o apenas o pagamento, mas tambêÂ©m:
- Quem pagou (nome, CPF/CNPJ)
- Quando pagou
- Quando acessou o portal
- De onde acessou (IP)
- Com qual dispositivo (User Agent)

### 3. EstatêÂ­sticas AutomêÂ¡ticas

Taxa de conversêÂ£o calculada automaticamente:
- 100% = todos que pagaram acessaram o portal
- < 100% = alguns pagaram mas nêÂ£o acessaram

### 4. Rastreamento Completo

Cada transaêÂ§êÂ£o pode ser rastreada do inêÂ­cio ao fim:
1. CobranêÂ§a criada
2. Pagamento realizado ê¢â â **REGISTRADO**
3. Link do portal exibido
4. UsuêÂ¡rio clica no link ê¢â â **REGISTRADO**
5. Portal aberto

---

## ê°Å¸Å½Â¯ Casos de Uso

### 1. Auditoria

Verificar quem pagou e acessou o portal:
```bash
curl http://localhost:3000/internal/logs/payments
curl http://localhost:3000/internal/logs/accesses
```

### 2. AnêÂ¡lise de ConversêÂ£o

Verificar taxa de acesso:
```bash
curl http://localhost:3000/internal/statistics
# Olhar o campo "taxa_acesso"
```

### 3. RelatêÂ³rios

Gerar relatêÂ³rios a partir dos arquivos JSON:
```bash
# Pagamentos do dia
grep "2025-11-12" logs/pagamentos.log

# Acessos de um usuêÂ¡rio especêÂ­fico
grep "txid123" logs/acessos_portal.log
```

---

## ê°Å¸âÂ Privacidade e SeguranêÂ§a

- ê¢Åâ¦ IPs sêÂ£o registrados apenas para auditoria
- ê¢Åâ¦ Logs armazenados localmente (nêÂ£o enviados externamente)
- ê¢Åâ¦ CPF/CNPJ opcionais
- ê¢Åâ¦ Dados podem ser anonimizados se necessêÂ¡rio

---

## ê°Å¸âÂ Resumo

**O que acontece apêÂ³s o pagamento:**

1. ê¢Åâ¦ Pagamento registrado em arquivo
2. ê¢Åâ¦ Link https://ARCKHê AI/ liberado e exibido
3. ê¢Åâ¦ UsuêÂ¡rio clica no link
4. ê¢Åâ¦ Acesso registrado em arquivo
5. ê¢Åâ¦ Portal aberto em nova aba
6. ê¢Åâ¦ EstatêÂ­sticas atualizadas automaticamente

**Tudo registrado, rastreado e disponêÂ­vel para anêÂ¡lise!** ê°Å¸âÅ 

---

**Status:** ê¢Åâ¦ 100% Implementado e Testado
**Link do Portal:** https://ARCKHê AI/
**Logs:** Pasta `/logs` do projeto
