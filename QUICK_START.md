# 🚀 Guia Rápido - Simulador Pix

## Iniciar em 3 passos

### 1️⃣ Instalar

```bash
npm install
```

### 2️⃣ Rodar

```bash
npm start
```

### 3️⃣ Acessar

Abra no navegador: **http://localhost:3000**

---

## 📱 Usando a Interface Web

1. **Preencha o formulário:**
   - ID da Transação: `pedido001`
   - Valor: `29.90`
   - Descrição: `Teste de cobrança`
   - (Outros campos são opcionais)

2. **Clique em "Criar Cobrança"**
   - Veja o QR Code gerado
   - Copie o código Pix se desejar

3. **Clique em "Simular Pagamento"**
   - Aguarde 2 segundos
   - Veja confirmação de pagamento

4. **Pronto!** 🎉
   - Status muda para PAGA
   - Link final liberado (se informou)

---

## 🔧 Testando com API (cURL)

### Criar Cobrança

```bash
curl -X PUT "http://localhost:3000/pix/v2/cob?txid=teste001" \
  -H "Content-Type: application/json" \
  -d '{
    "valor": {"original": "10.00"},
    "calendario": {"expiracao": 3600},
    "devedor": {"nome": "Maria Silva"},
    "infoAdicionais": [{"nome": "Info", "valor": "Teste"}]
  }'
```

### Simular Pagamento

```bash
curl -X POST http://localhost:3000/internal/simulate-pay \
  -H "Content-Type: application/json" \
  -d '{"txid": "teste001", "valor_pago": "10.00"}'
```

### Consultar Cobrança

```bash
curl http://localhost:3000/pix/v2/cob/teste001
```

---

## 📊 Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `PUT` | `/pix/v2/cob?txid=XXX` | Criar cobrança |
| `GET` | `/pix/v2/cob/:txid` | Consultar cobrança |
| `POST` | `/internal/simulate-pay` | Simular pagamento |
| `GET` | `/api` | Ver documentação API |
| `GET` | `/health` | Health check |

---

## 🎯 Exemplos de Uso

### Cobrança Simples

```json
{
  "valor": {"original": "5.00"},
  "calendario": {"expiracao": 3600}
}
```

### Cobrança Completa

```json
{
  "valor": {"original": "99.90"},
  "calendario": {"expiracao": 7200},
  "devedor": {
    "nome": "João da Silva",
    "cpf": "12345678900"
  },
  "infoAdicionais": [
    {"nome": "Produto", "valor": "Curso Online"}
  ],
  "link_final": "https://meusite.com/obrigado"
}
```

---

## ❓ Problemas Comuns

### Porta 3000 já em uso?

Altere a porta:
```bash
PORT=3001 npm start
```

### Banco não inicializa?

Verifique permissões na pasta `data/`

### API não responde?

Verifique se o servidor está rodando:
```bash
curl http://localhost:3000/health
```

---

## 📚 Documentação Completa

Veja **README.md** para documentação detalhada.

---

**Dica:** Abra o navegador em `http://localhost:3000` para a interface visual! 🎨
