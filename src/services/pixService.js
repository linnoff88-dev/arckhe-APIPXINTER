import QRCode from 'qrcode';

/**
 * Gera o payload PIX (Copia e Cola) no formato EMV
 * Este é um payload simplificado para simulaçêo
 */
export function generatePixPayload(txid, valor, descricao = 'Cobranca Pix') {
  // Campos do payload EMV Pix (simplificado para simulaçêo)
  const payload = [
    '000201', // Payload Format Indicator
    '010212', // Point of Initiation Method (dinâmico)

    // Merchant Account Information (ID 26 - Pix)
    '26',
    calculateFieldLength(
      '0014BR.GOV.BCB.PIX' +
      `01${String(txid.length).padStart(2, '0')}${txid}`
    ),
    '0014BR.GOV.BCB.PIX',
    `01${String(txid.length).padStart(2, '0')}${txid}`,

    '52040000', // Merchant Category Code
    '5303986',  // Transaction Currency (986 = BRL)

    // Transaction Amount
    `54${String(valor.toFixed(2).length).padStart(2, '0')}${valor.toFixed(2)}`,

    '5802BR', // Country Code
    '5913Simulador Pix', // Merchant Name
    '6009SAO PAULO', // Merchant City

    // Additional Data Field
    '62',
    calculateFieldLength(`05${String(txid.length).padStart(2, '0')}${txid}`),
    `05${String(txid.length).padStart(2, '0')}${txid}`,

    '6304' // CRC placeholder
  ].join('');

  // Calcular CRC16 (simplificado para simulaçêo - usa checksum fixo)
  const crc = 'ABCD'; // Em produçêo real, deve usar CRC16-CCITT

  return payload + crc;
}

/**
 * Calcula o tamanho do campo para o formato EMV
 */
function calculateFieldLength(content) {
  return String(content.length).padStart(2, '0') + content;
}

/**
 * Gera o QR Code em base64
 */
export async function generateQRCode(pixPayload) {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(pixPayload, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    throw new Error('Falha ao gerar QR Code');
  }
}

/**
 * Gera dados completos da cobrança Pix (payload + QR)
 */
export async function generatePixCobranca(txid, valor, descricao) {
  const pixPayload = generatePixPayload(txid, valor, descricao);
  const qrCodeBase64 = await generateQRCode(pixPayload);

  return {
    pixCopiaECola: pixPayload,
    qrCodeBase64: qrCodeBase64
  };
}

/**
 * Valida formato de CPF/CNPJ (simplificado)
 */
export function validateCpfCnpj(value) {
  const cleaned = value.replace(/\D/g, '');
  return cleaned.length === 11 || cleaned.length === 14;
}

/**
 * Formata valor para moeda brasileira
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}
