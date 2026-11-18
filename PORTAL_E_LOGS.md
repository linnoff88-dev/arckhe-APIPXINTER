# 🌐 Portal Inema Club e Sistema de Logs

## ✅ Implementado

Sistema completo de redirecionamento para o portal **Inema Club** (https://inema.club/) com registro de pagamentos e acessos em arquivos.

---

## 🎯 Funcionalidades Implementadas

### 1. 🔗 Link do Portal Após Pagamento

Quando um pagamento é confirmado:
- ✅ Aparece automaticamente o link para **https://inema.club/**
- ✅ Botão destacado e atrativo com design profissional
- ✅ Texto: "🎉 Acesso Liberado ao Portal! 🌐 Acessar Portal Inema Club"

### 2. 📝 Registro de Pagamentos

Todos os pagamentos são automaticamente salvos em arquivos:

**Arquivos criados:**
- `logs/pagamentos.log` - JSON estruturado (para processamento)
- `logs/pagamentos_legivel.txt` - Formato legível (para humanos)

**Dados registrados:**
- 📅 Data e hora do pagamento
- 💵 Valor pago
- 🆔 ID da transação (txid)
- 👤 Nome do pagador
- 📄 CPF/CNPJ
- 🔗 Link final liberado
- ✅ Status do pagamento

### 3. 🌐 Registro de Acessos ao Portal

Quando o usuário clica no link do portal:
- ✅ Acesso é registrado antes de abrir o link
- ✅ Portal abre em nova aba automaticamente
- ✅ Notificação visual "Abrindo portal..."

**Arquivos criados:**
- `logs/acessos_portal.log` - JSON estruturado
- `logs/acessos_portal_legivel.txt` - Formato legível

**Dados registrados:**
- 📅 Data e hora do acesso
- 🆔 ID da transação
- 💵 Valor pago
- 🔗 URL do portal (https://inema.club/)
- 🌍 Endereço IP do usuário
- 💻 User Agent (navegador/dispositivo)

---

## 📊 Novos Endpoints da API

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
  "portal_url": "https://inema.club/"
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
      "link_final": "https://inema.club/"
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
      "portal_url": "https://inema.club/",
      "ip": "::1",
      "user_agent": "Mozilla/5.0..."
    }
  ]
}
```

### 4. Ver Estatísticas

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

## 📁 Estrutura de Arquivos de Log

### Formato JSON (processamento automatizado)

**`logs/pagamentos.log`:**
```json
{"timestamp":"2025-11-12T11:20:58.961Z","tipo":"PAGAMENTO_CONFIRMADO","txid":"testeportal001","valor":"49.90","nome_pagador":"Maria da Silva","cpf_cnpj":"98765432100","paid_at":"2025-11-12T11:20:58.000Z","link_final":"https://inema.club/"}
```

**`logs/acessos_portal.log`:**
```json
{"timestamp":"2025-11-12T11:21:20.604Z","tipo":"ACESSO_PORTAL","txid":"testeportal001","valor":"49.90","portal_url":"https://inema.club/","ip":"::1","user_agent":"curl/8.5.0"}
```

### Formato Legível (visualização humana)

**`logs/pagamentos_legivel.txt`:**
```
═══════════════════════════════════════════════════
📅 Data/Hora: 12/11/2025, 08:20:58
💵 Valor: R$ 49.90
🆔 ID Transação: testeportal001
👤 Pagador: Maria da Silva
📄 CPF/CNPJ: 98765432100
🔗 Link Final: https://inema.club/
✅ Status: PAGO
═══════════════════════════════════════════════════
```

**`logs/acessos_portal_legivel.txt`:**
```
─────────────────────────────────────────────────────
🌐 ACESSO AO PORTAL
📅 Data/Hora: 12/11/2025, 08:21:20
🆔 Transação: testeportal001
💵 Valor: R$ 49.90
🔗 Portal: https://inema.club/
🌍 IP: ::1
─────────────────────────────────────────────────────
```

---

## 🎨 Interface Web

### Tela de Sucesso Após Pagamento

Quando o pagamento é confirmado, a interface mostra:

1. **Confirmação de Pagamento:**
   - ✅ Ícone de sucesso
   - ID da transação
   - Valor pago
   - Data e hora

2. **Box do Portal (destaque):**
   - Fundo gradiente azul/roxo
   - Título: "🎉 Acesso Liberado ao Portal!"
   - Descrição: "Clique no botão abaixo para acessar o portal Inema Club"
   - Botão branco estilizado: "🌐 Acessar Portal Inema Club →"
   - Nota: "O acesso será registrado quando você clicar no link"

3. **Comportamento ao Clicar:**
   - Registra acesso via API
   - Mostra notificação: "Abrindo portal..."
   - Aguarda 500ms
   - Abre https://inema.club/ em nova aba

---

## 🔍 Monitoramento e Análise

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

### Ver Estatísticas via API

```bash
curl http://localhost:3000/internal/statistics | python3 -m json.tool
```

---

## 📈 Estatísticas Disponíveis

O endpoint `/internal/statistics` fornece:

- **Total de pagamentos** realizados
- **Total de acessos** ao portal
- **Valor total** arrecadado
- **Taxa de acesso** (% de pagantes que acessaram o portal)
- **Últimos 5 pagamentos** registrados
- **Últimos 5 acessos** ao portal

---

## 🧪 Testando o Fluxo Completo

### 1. Criar Cobrança

```bash
curl -X PUT "http://localhost:3000/pix/v2/cob?txid=teste001" \
  -H "Content-Type: application/json" \
  -d '{
    "valor": {"original": "10.00"},
    "devedor": {"nome": "João Silva", "cpf": "12345678900"},
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

# Ver estatísticas
curl http://localhost:3000/internal/statistics
```

---

## ✨ Recursos Especiais

### 1. Logs Duplos

Cada evento é salvo em **dois formatos**:
- **JSON** para processamento automatizado
- **Legível** para visualização humana

### 2. Informações Completas

Registra não apenas o pagamento, mas também:
- Quem pagou (nome, CPF/CNPJ)
- Quando pagou
- Quando acessou o portal
- De onde acessou (IP)
- Com qual dispositivo (User Agent)

### 3. Estatísticas Automáticas

Taxa de conversão calculada automaticamente:
- 100% = todos que pagaram acessaram o portal
- < 100% = alguns pagaram mas não acessaram

### 4. Rastreamento Completo

Cada transação pode ser rastreada do início ao fim:
1. Cobrança criada
2. Pagamento realizado → **REGISTRADO**
3. Link do portal exibido
4. Usuário clica no link → **REGISTRADO**
5. Portal aberto

---

## 🎯 Casos de Uso

### 1. Auditoria

Verificar quem pagou e acessou o portal:
```bash
curl http://localhost:3000/internal/logs/payments
curl http://localhost:3000/internal/logs/accesses
```

### 2. Análise de Conversão

Verificar taxa de acesso:
```bash
curl http://localhost:3000/internal/statistics
# Olhar o campo "taxa_acesso"
```

### 3. Relatórios

Gerar relatórios a partir dos arquivos JSON:
```bash
# Pagamentos do dia
grep "2025-11-12" logs/pagamentos.log

# Acessos de um usuário específico
grep "txid123" logs/acessos_portal.log
```

---

## 🔐 Privacidade e Segurança

- ✅ IPs são registrados apenas para auditoria
- ✅ Logs armazenados localmente (não enviados externamente)
- ✅ CPF/CNPJ opcionais
- ✅ Dados podem ser anonimizados se necessário

---

## 📝 Resumo

**O que acontece após o pagamento:**

1. ✅ Pagamento registrado em arquivo
2. ✅ Link https://inema.club/ liberado e exibido
3. ✅ Usuário clica no link
4. ✅ Acesso registrado em arquivo
5. ✅ Portal aberto em nova aba
6. ✅ Estatísticas atualizadas automaticamente

**Tudo registrado, rastreado e disponível para análise!** 📊

---

**Status:** ✅ 100% Implementado e Testado
**Link do Portal:** https://inema.club/
**Logs:** Pasta `/logs` do projeto
