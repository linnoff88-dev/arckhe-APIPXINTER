# Relatório de Instruçêo -- Simulador Pix (Banco Inter)

## 🎯 Objetivo

Criar um ambiente de simulaçêo que reproduz o comportamento da **API Pix
do Banco Inter** (cobrança via `txid`, QR dinâmico, webhook de
confirmaçêo) sem conta bancária, e também uma interface web para
cadastrar cobranças, gerar QR, simular pagamento e liberar um link.

------------------------------------------------------------------------

## 🏗 Arquitetura Geral

Componentes principais:

1.  **Frontend Web** -- formulário de cadastro e exibiçêo do QR.\
2.  **Backend API simulador** -- reproduz os endpoints do Banco Inter.\
3.  **Banco de dados local** -- armazena cobranças (`txid`, valor,
    status, QR etc.).\
4.  **Serviço de simulaçêo de liquidaçêo** -- marca pagamentos como
    realizados.\
5.  **Gerador de QR** -- cria imagens a partir do payload Pix.\
6.  **Webhook receptor** -- simula notificaçêo automática de pagamento.

**Fluxo:** cadastro → criaçêo da cobrança → exibiçêo do QR → simulaçêo
de pagamento → webhook → liberaçêo do link.

------------------------------------------------------------------------

## 🗄 Modelagem de Dados

Tabela `cobrancas`:

  Campo                  Tipo        Descriçêo
  ---------------------- ----------- ------------------------------
  id                     UUID        Identificador interno
  txid                   String      ID único da cobrança
  valor                  Decimal     Valor original
  status                 String      `ATIVA`, `PAGA`, `CANCELADA`
  pixCopiaECola          Text        Payload EMV Pix
  qrCodeBase64           Text        QR gerado (imagem base64)
  link_final             String      URL liberada após pagamento
  created_at / paid_at   Timestamp   Datas de criaçêo e pagamento

------------------------------------------------------------------------

## 🧩 API Simulada

Endpoints principais:

  Método   Endpoint                   Funçêo
  -------- -------------------------- -------------------------
  `POST`   `/auth/token`              Gera token mock
  `PUT`    `/pix/v2/cob?txid=`        Cria cobrança
  `GET`    `/pix/v2/loc/{id}`         Consulta cobrança
  `POST`   `/internal/simulate-pay`   Simula pagamento
  `POST`   `/webhook/pix`             Endpoint de notificaçêo

Exemplo de resposta `/pix/v2/cob`:

``` json
{
  "txid": "pedido1234",
  "status": "ATIVA",
  "location": "https://mock-bank.local/pix/v2/loc/loc-98765",
  "pixCopiaECola": "00020126...6304ABCD",
  "qrCodeImage": "data:image/png;base64,iVBORw0K..."
}
```

------------------------------------------------------------------------

## 💻 Interface Web

### 1. Cadastro

Campos: valor, descriçêo, nome do pagador, CPF/CNPJ, expiraçêo, link
final.\
Ao salvar → chama `/pix/v2/cob?txid=` → abre tela de QR.

### 2. Tela do QR

Mostra o QR, código copia-e-cola e status `ATIVA`.\
Botêo "Simular Pagamento" chama `/internal/simulate-pay`.

### 3. Aguardando confirmaçêo

Status muda para `PAGA` após webhook → exibe **link_final** liberado.

------------------------------------------------------------------------

## 🔄 Simulaçêo de Liquidaçêo

A liquidaçêo pode ser feita de três modos:

1.  **Manual:** botêo "Simular Pagamento" no front.\
2.  **Automático:** job interno que paga após X minutos.\
3.  **Externo:** `POST /internal/simulate-pay` com corpo:

``` json
{ "txid": "pedido1234", "valor_pago": "29.90" }
```

------------------------------------------------------------------------

## 🔒 Segurança e Boas Práticas

-   Nêo usar credenciais reais.\
-   Proteger interface com senha se publicada.\
-   Usar QR falso ou valores pequenos (ex.: R\$0,01).\
-   Registrar logs e status no banco.\
-   Testar idempotência e expiraçêo.

------------------------------------------------------------------------

## 🚀 Migraçêo Futura (Banco Inter real)

Para usar a API oficial: 1. Criar conta PJ no Inter.\
2. Gerar `client_id`, `client_secret` e certificado digital.\
3. Substituir o mock pelos endpoints reais.\
4. Manter o mesmo fluxo e estrutura de dados.

------------------------------------------------------------------------

## ✅ Checklist de Implementaçêo

-   [x] Endpoint `/pix/v2/cob?txid=` criado\
-   [x] Geraçêo de `pixCopiaECola` e QR Base64\
-   [x] Simulaçêo de pagamento `/internal/simulate-pay`\
-   [x] Webhook funcional `/webhook/pix`\
-   [x] Atualizaçêo automática de status\
-   [x] Liberaçêo de `link_final`

------------------------------------------------------------------------

## 🧠 Observações finais

O simulador permite testar o comportamento de cobrança Pix dinâmica sem
custos nem riscos.\
Quando desejar usar a versêo real do Banco Inter, basta substituir os
endpoints --- o sistema e a lógica permanecem iguais.
