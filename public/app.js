// Estado da aplicação
let currentCobranca = null;

// Elementos DOM
const screens = {
  form: document.getElementById('screen-form'),
  qrcode: document.getElementById('screen-qrcode'),
  success: document.getElementById('screen-success')
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  setupFormSubmit();
});

/**
 * Configurar submit do formulário
 */
function setupFormSubmit() {
  const form = document.getElementById('cobranca-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      txid: document.getElementById('txid').value.trim(),
      valor: parseFloat(document.getElementById('valor').value),
      descricao: document.getElementById('descricao').value.trim(),
      nome_pagador: document.getElementById('nome_pagador').value.trim(),
      cpf_cnpj: document.getElementById('cpf_cnpj').value.trim(),
      expiracao: parseInt(document.getElementById('expiracao').value) || 3600,
      link_final: document.getElementById('link_final').value.trim()
    };

    // Validações
    if (!formData.txid) {
      showToast('ID da transação é obrigatório', 'error');
      return;
    }

    if (!formData.valor || formData.valor <= 0) {
      showToast('Valor deve ser maior que zero', 'error');
      return;
    }

    try {
      await criarCobranca(formData);
    } catch (error) {
      showToast('Erro ao criar cobrança: ' + error.message, 'error');
    }
  });
}

/**
 * Criar cobrança via API
 */
async function criarCobranca(formData) {
  try {
    // Montar payload da API
    const payload = {
      calendario: {
        expiracao: formData.expiracao
      },
      devedor: {
        nome: formData.nome_pagador,
        cpf: formData.cpf_cnpj
      },
      valor: {
        original: formData.valor.toFixed(2)
      },
      chave: 'mock@bancointer.com.br',
      infoAdicionais: [
        {
          nome: 'Descrição',
          valor: formData.descricao || 'Cobrança Pix'
        }
      ],
      link_final: formData.link_final
    };

    // Chamar API
    const response = await fetch(`/pix/v2/cob?txid=${formData.txid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar cobrança');
    }

    const cobranca = await response.json();

    // Salvar estado
    currentCobranca = {
      ...cobranca,
      valor_formatado: formatCurrency(formData.valor)
    };

    // Mostrar tela de QR Code
    showQRCodeScreen(currentCobranca);
    showToast('Cobrança criada com sucesso!', 'success');

  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

/**
 * Exibir tela de QR Code
 */
function showQRCodeScreen(cobranca) {
  // Preencher dados
  document.getElementById('qr-image').src = cobranca.qrCodeImage;
  document.getElementById('display-txid').textContent = cobranca.txid;
  document.getElementById('display-valor').textContent = cobranca.valor_formatado;
  document.getElementById('display-descricao').textContent =
    cobranca.solicitacaoPagador || 'Cobrança Pix';
  document.getElementById('pix-copia-cola').value = cobranca.pixCopiaECola;

  // Trocar telas
  switchScreen('qrcode');
}

/**
 * Simular pagamento
 */
async function simularPagamento() {
  if (!currentCobranca) {
    showToast('Nenhuma cobrança ativa', 'error');
    return;
  }

  try {
    // Mostrar loading
    document.getElementById('loading-payment').style.display = 'block';
    document.getElementById('btn-pagar').disabled = true;

    // Aguardar 2 segundos para simular processamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Chamar API de simulação
    const response = await fetch('/internal/simulate-pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        txid: currentCobranca.txid,
        valor_pago: currentCobranca.valor.original
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao processar pagamento');
    }

    const resultado = await response.json();

    // Mostrar tela de sucesso
    showSuccessScreen(resultado);
    showToast('Pagamento confirmado!', 'success');

  } catch (error) {
    console.error('Erro:', error);
    showToast('Erro ao simular pagamento: ' + error.message, 'error');
    document.getElementById('loading-payment').style.display = 'none';
    document.getElementById('btn-pagar').disabled = false;
  }
}

/**
 * Exibir tela de sucesso
 */
function showSuccessScreen(resultado) {
  document.getElementById('success-txid').textContent = resultado.txid;
  document.getElementById('success-valor').textContent = formatCurrency(parseFloat(resultado.valor_pago));
  document.getElementById('success-data').textContent = new Date(resultado.paid_at).toLocaleString('pt-BR');

  // Mostrar link final se existir
  if (resultado.link_final) {
    const linkBox = document.getElementById('link-liberado');
    const linkUrl = document.getElementById('link-final-url');
    linkUrl.href = resultado.link_final;
    linkUrl.textContent = resultado.link_final;
    linkUrl.target = '_blank'; // Abrir em nova aba

    // Adicionar evento de clique para registrar acesso
    linkUrl.onclick = async (e) => {
      e.preventDefault();

      // Registrar acesso ao portal
      try {
        await fetch('/internal/register-portal-access', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            txid: resultado.txid
          })
        });

        console.log('✅ Acesso ao portal registrado');
        showToast('Abrindo portal...', 'success');

        // Aguardar um pouco e abrir o link
        setTimeout(() => {
          window.open(resultado.link_final, '_blank');
        }, 500);

      } catch (error) {
        console.error('Erro ao registrar acesso:', error);
        // Mesmo com erro, abrir o link
        window.open(resultado.link_final, '_blank');
      }
    };

    linkBox.style.display = 'block';
  }

  switchScreen('success');
}

/**
 * Voltar para o formulário
 */
function voltarFormulario() {
  // Limpar formulário
  document.getElementById('cobranca-form').reset();
  document.getElementById('expiracao').value = '3600';

  // Resetar estado
  currentCobranca = null;
  document.getElementById('loading-payment').style.display = 'none';
  document.getElementById('btn-pagar').disabled = false;
  document.getElementById('link-liberado').style.display = 'none';

  // Trocar tela
  switchScreen('form');
}

/**
 * Trocar entre telas
 */
function switchScreen(screenName) {
  Object.values(screens).forEach(screen => screen.classList.remove('active'));
  screens[screenName].classList.add('active');
}

/**
 * Copiar Pix Copia e Cola
 */
function copiarPixCopiaECola() {
  const input = document.getElementById('pix-copia-cola');
  input.select();
  input.setSelectionRange(0, 99999); // Para mobile

  try {
    document.execCommand('copy');
    showToast('Código copiado para área de transferência!', 'success');
  } catch (error) {
    // Fallback para navegadores modernos
    navigator.clipboard.writeText(input.value).then(() => {
      showToast('Código copiado para área de transferência!', 'success');
    }).catch(() => {
      showToast('Erro ao copiar código', 'error');
    });
  }
}

/**
 * Formatar valor para moeda
 */
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Exibir toast de notificação
 */
function showToast(message, type = 'success') {
  // Remover toasts anteriores
  const existingToasts = document.querySelectorAll('.toast');
  existingToasts.forEach(toast => toast.remove());

  // Criar novo toast
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  // Remover após 3 segundos
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Formatar CPF/CNPJ enquanto digita
 */
document.getElementById('cpf_cnpj')?.addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, '');

  if (value.length <= 11) {
    // CPF: 000.000.000-00
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    // CNPJ: 00.000.000/0000-00
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
  }

  e.target.value = value;
});

// Expor funções globalmente para uso no HTML
window.simularPagamento = simularPagamento;
window.voltarFormulario = voltarFormulario;
window.copiarPixCopiaECola = copiarPixCopiaECola;
