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
   - ID da Transaçêo: `pedido001`
   - Valor: `29.90`
   - Descriçêo: `Teste de cobrança`
   - (Outros campos sêo opcionais)

2. **Clique em "Criar Cobrança"**
   - Veja o QR Code gerado
   - Copie o código Pix se desejar

3. **Clique em "Simular Pagamento"**
   - Aguarde 2 segundos
   - Veja confirmaçêo de pagamento

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

| Método | Endpoint | Descriçêo |
|--------|----------|-----------|
| `PUT` | `/pix/v2/cob?txid=XXX` | Criar cobrança |
| `GET` | `/pix/v2/cob/:txid` | Consultar cobrança |
| `POST` | `/internal/simulate-pay` | Simular pagamento |
| `GET` | `/api` | Ver documentaçêo API |
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
    "nome": "Joêo da Silva",
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

### Banco nêo inicializa?

Verifique permissões na pasta `data/`

### API nêo responde?

Verifique se o servidor está rodando:
```bash
curl http://localhost:3000/health
```

---

## 📚 Documentaçêo Completa

Veja **README.md** para documentaçêo detalhada.

---

**Dica:** Abra o navegador em `http://localhost:3000` para a interface visual! 🎨
