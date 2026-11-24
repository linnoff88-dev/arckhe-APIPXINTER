# ðŸŒ Portal ARCKHÉ Club e Sistema de Logs

## âœ… Implementado

Sistema completo de redirecionamento para o portal **ARCKHÉ Club** (https://ARCKHÉ AI/) com registro de pagamentos e acessos em arquivos.

---

## ðŸŽ¯ Funcionalidades Implementadas

### 1. ðŸ”— Link do Portal ApÃ³s Pagamento

Quando um pagamento Ã© confirmado:
- âœ… Aparece automaticamente o link para **https://ARCKHÉ AI/**
- âœ… BotÃ£o destacado e atrativo com design profissional
- âœ… Texto: "ðŸŽ‰ Acesso Liberado ao Portal! ðŸŒ Acessar Portal ARCKHÉ Club"

### 2. ðŸ“ Registro de Pagamentos

Todos os pagamentos sÃ£o automaticamente salvos em arquivos:

**Arquivos criados:**
- `logs/pagamentos.log` - JSON estruturado (para processamento)
- `logs/pagamentos_legivel.txt` - Formato legÃ­vel (para humanos)

**Dados registrados:**
- ðŸ“… Data e hora do pagamento
- ðŸ’µ Valor pago
- ðŸ†” ID da transaÃ§Ã£o (txid)
- ðŸ‘¤ Nome do pagador
- ðŸ“„ CPF/CNPJ
- ðŸ”— Link final liberado
- âœ… Status do pagamento

### 3. ðŸŒ Registro de Acessos ao Portal

Quando o usuÃ¡rio clica no link do portal:
- âœ… Acesso Ã© registrado antes de abrir o link
- âœ… Portal abre em nova aba automaticamente
- âœ… NotificaÃ§Ã£o visual "Abrindo portal..."

**Arquivos criados:**
- `logs/acessos_portal.log` - JSON estruturado
- `logs/acessos_portal_legivel.txt` - Formato legÃ­vel

**Dados registrados:**
- ðŸ“… Data e hora do acesso
- ðŸ†” ID da transaÃ§Ã£o
- ðŸ’µ Valor pago
- ðŸ”— URL do portal (https://ARCKHÉ AI/)
- ðŸŒ EndereÃ§o IP do usuÃ¡rio
- ðŸ’» User Agent (navegador/dispositivo)

---

## ðŸ“Š Novos Endpoints da API

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
  "portal_url": "https://ARCKHÉ AI/"
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
      "link_final": "https://ARCKHÉ AI/"
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
      "portal_url": "https://ARCKHÉ AI/",
      "ip": "::1",
      "user_agent": "Mozilla/5.0..."
    }
  ]
}
```

### 4. Ver EstatÃ­sticas

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

## ðŸ“ Estrutura de Arquivos de Log

### Formato JSON (processamento automatizado)

**`logs/pagamentos.log`:**
```json
{"timestamp":"2025-11-12T11:20:58.961Z","tipo":"PAGAMENTO_CONFIRMADO","txid":"testeportal001","valor":"49.90","nome_pagador":"Maria da Silva","cpf_cnpj":"98765432100","paid_at":"2025-11-12T11:20:58.000Z","link_final":"https://ARCKHÉ AI/"}
```

**`logs/acessos_portal.log`:**
```json
{"timestamp":"2025-11-12T11:21:20.604Z","tipo":"ACESSO_PORTAL","txid":"testeportal001","valor":"49.90","portal_url":"https://ARCKHÉ AI/","ip":"::1","user_agent":"curl/8.5.0"}
```

### Formato LegÃ­vel (visualizaÃ§Ã£o humana)

**`logs/pagamentos_legivel.txt`:**
```
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
ðŸ“… Data/Hora: 12/11/2025, 08:20:58
ðŸ’µ Valor: R$ 49.90
ðŸ†” ID TransaÃ§Ã£o: testeportal001
ðŸ‘¤ Pagador: Maria da Silva
ðŸ“„ CPF/CNPJ: 98765432100
ðŸ”— Link Final: https://ARCKHÉ AI/
âœ… Status: PAGO
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
```

**`logs/acessos_portal_legivel.txt`:**
```
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ðŸŒ ACESSO AO PORTAL
ðŸ“… Data/Hora: 12/11/2025, 08:21:20
ðŸ†” TransaÃ§Ã£o: testeportal001
ðŸ’µ Valor: R$ 49.90
ðŸ”— Portal: https://ARCKHÉ AI/
ðŸŒ IP: ::1
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
```

---

## ðŸŽ¨ Interface Web

### Tela de Sucesso ApÃ³s Pagamento

Quando o pagamento Ã© confirmado, a interface mostra:

1. **ConfirmaÃ§Ã£o de Pagamento:**
   - âœ… Ãcone de sucesso
   - ID da transaÃ§Ã£o
   - Valor pago
   - Data e hora

2. **Box do Portal (destaque):**
   - Fundo gradiente azul/roxo
   - TÃ­tulo: "ðŸŽ‰ Acesso Liberado ao Portal!"
   - DescriÃ§Ã£o: "Clique no botÃ£o abaixo para acessar o portal ARCKHÉ Club"
   - BotÃ£o branco estilizado: "ðŸŒ Acessar Portal ARCKHÉ Club â†’"
   - Nota: "O acesso serÃ¡ registrado quando vocÃª clicar no link"

3. **Comportamento ao Clicar:**
   - Registra acesso via API
   - Mostra notificaÃ§Ã£o: "Abrindo portal..."
   - Aguarda 500ms
   - Abre https://ARCKHÉ AI/ em nova aba

---

## ðŸ” Monitoramento e AnÃ¡lise

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

### Ver EstatÃ­sticas via API

```bash
curl http://localhost:3000/internal/statistics | python3 -m json.tool
```

---

## ðŸ“ˆ EstatÃ­sticas DisponÃ­veis

O endpoint `/internal/statistics` fornece:

- **Total de pagamentos** realizados
- **Total de acessos** ao portal
- **Valor total** arrecadado
- **Taxa de acesso** (% de pagantes que acessaram o portal)
- **Ãšltimos 5 pagamentos** registrados
- **Ãšltimos 5 acessos** ao portal

---

## ðŸ§ª Testando o Fluxo Completo

### 1. Criar CobranÃ§a

```bash
curl -X PUT "http://localhost:3000/pix/v2/cob?txid=teste001" \
  -H "Content-Type: application/json" \
  -d '{
    "valor": {"original": "10.00"},
    "devedor": {"nome": "JoÃ£o Silva", "cpf": "12345678900"},
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

# Ver estatÃ­sticas
curl http://localhost:3000/internal/statistics
```

---

## âœ¨ Recursos Especiais

### 1. Logs Duplos

Cada evento Ã© salvo em **dois formatos**:
- **JSON** para processamento automatizado
- **LegÃ­vel** para visualizaÃ§Ã£o humana

### 2. InformaÃ§Ãµes Completas

Registra nÃ£o apenas o pagamento, mas tambÃ©m:
- Quem pagou (nome, CPF/CNPJ)
- Quando pagou
- Quando acessou o portal
- De onde acessou (IP)
- Com qual dispositivo (User Agent)

### 3. EstatÃ­sticas AutomÃ¡ticas

Taxa de conversÃ£o calculada automaticamente:
- 100% = todos que pagaram acessaram o portal
- < 100% = alguns pagaram mas nÃ£o acessaram

### 4. Rastreamento Completo

Cada transaÃ§Ã£o pode ser rastreada do inÃ­cio ao fim:
1. CobranÃ§a criada
2. Pagamento realizado â†’ **REGISTRADO**
3. Link do portal exibido
4. UsuÃ¡rio clica no link â†’ **REGISTRADO**
5. Portal aberto

---

## ðŸŽ¯ Casos de Uso

### 1. Auditoria

Verificar quem pagou e acessou o portal:
```bash
curl http://localhost:3000/internal/logs/payments
curl http://localhost:3000/internal/logs/accesses
```

### 2. AnÃ¡lise de ConversÃ£o

Verificar taxa de acesso:
```bash
curl http://localhost:3000/internal/statistics
# Olhar o campo "taxa_acesso"
```

### 3. RelatÃ³rios

Gerar relatÃ³rios a partir dos arquivos JSON:
```bash
# Pagamentos do dia
grep "2025-11-12" logs/pagamentos.log

# Acessos de um usuÃ¡rio especÃ­fico
grep "txid123" logs/acessos_portal.log
```

---

## ðŸ” Privacidade e SeguranÃ§a

- âœ… IPs sÃ£o registrados apenas para auditoria
- âœ… Logs armazenados localmente (nÃ£o enviados externamente)
- âœ… CPF/CNPJ opcionais
- âœ… Dados podem ser anonimizados se necessÃ¡rio

---

## ðŸ“ Resumo

**O que acontece apÃ³s o pagamento:**

1. âœ… Pagamento registrado em arquivo
2. âœ… Link https://ARCKHÉ AI/ liberado e exibido
3. âœ… UsuÃ¡rio clica no link
4. âœ… Acesso registrado em arquivo
5. âœ… Portal aberto em nova aba
6. âœ… EstatÃ­sticas atualizadas automaticamente

**Tudo registrado, rastreado e disponÃ­vel para anÃ¡lise!** ðŸ“Š

---

**Status:** âœ… 100% Implementado e Testado
**Link do Portal:** https://ARCKHÉ AI/
**Logs:** Pasta `/logs` do projeto
