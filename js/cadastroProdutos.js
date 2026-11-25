
import { apiFetch } from './api.js';
import { protegerPagina } from './auth.js';
import { exibirToast, removerToast } from './feedback.js';

// Uploadcare
import * as UC from 'https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@v1/web/uc-file-uploader-regular.min.js';

UC.defineComponents(UC);

protegerPagina();

// ==========================================
// VALIDAÇÃO DOS CAMPOS OBRIGATÓRIOS
// ==========================================

function configurarAvisoCamposObrigatorios(formulario, mensagem) {
  let avisoExibido = false;

  formulario.addEventListener('invalid', () => {
    if (!avisoExibido) {
      exibirToast(mensagem, 'warning');
      avisoExibido = true;

      setTimeout(() => {
        avisoExibido = false;
      }, 1000);
    }
  }, true);
}

// ==========================================
// UPLOADCARE
// ==========================================

const contextoUploader = document.getElementById('uploader-contexto');

const inputImagem = document.getElementById('item-imagemUrl');
const previewImagem = document.getElementById('preview-imagem-item');
const statusUpload = document.getElementById('status-uploadcare');

let uploadEmAndamento = false;

// Quando uma imagem for selecionada
contextoUploader.addEventListener('file-added', () => {
  inputImagem.value = '';
  previewImagem.hidden = true;

  statusUpload.textContent = 'Imagem selecionada. Aguardando envio.';
});

// Quando o upload começar
contextoUploader.addEventListener('file-upload-start', () => {
  uploadEmAndamento = true;

  statusUpload.textContent = 'Enviando imagem para o Uploadcare...';
});

// Quando o upload terminar
contextoUploader.addEventListener('file-upload-success', (evento) => {
  const arquivo = evento.detail;

  if (!arquivo.cdnUrl) {
    statusUpload.textContent =
      'Não foi possível obter o endereço da imagem.';

    exibirToast('Não foi possível obter o endereço da imagem.', 'error');

    return;
  }

  inputImagem.value = arquivo.cdnUrl;

  previewImagem.src = arquivo.cdnUrl;
  previewImagem.hidden = false;

  uploadEmAndamento = false;

  statusUpload.textContent = 'Imagem enviada com sucesso!';

  exibirToast('Imagem enviada com sucesso!', 'success');
});

// Quando a URL da imagem mudar
contextoUploader.addEventListener('file-url-changed', (evento) => {
  const arquivo = evento.detail;

  if (arquivo.cdnUrl) {
    inputImagem.value = arquivo.cdnUrl;

    previewImagem.src = arquivo.cdnUrl;
    previewImagem.hidden = false;

    statusUpload.textContent = 'Imagem atualizada com sucesso!';
  }
});

// Quando o upload falhar
contextoUploader.addEventListener('file-upload-failed', () => {
  uploadEmAndamento = false;

  inputImagem.value = '';
  previewImagem.hidden = true;

  statusUpload.textContent =
    'Falha ao enviar imagem. Tente novamente.';

  exibirToast('Falha ao enviar imagem. Tente novamente.', 'error');
});

// Quando a imagem for removida
contextoUploader.addEventListener('file-removed', () => {
  inputImagem.value = '';
  previewImagem.hidden = true;

  uploadEmAndamento = false;

  statusUpload.textContent = 'Nenhuma imagem selecionada.';
});

// ==========================================
// FORMULÁRIO DE ITENS
// ==========================================

const formularioItem = document.getElementById('form-item');
const mensagemItem = document.getElementById('mensagem-item');

configurarAvisoCamposObrigatorios(
  formularioItem,
  'Preencha os campos obrigatórios do produto.'
);

formularioItem.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  if (uploadEmAndamento) {
    mensagemItem.textContent =
      'Aguarde o envio da imagem terminar.';

    exibirToast('Aguarde o envio da imagem terminar.', 'warning');

    return;
  }

  const botao = formularioItem.querySelector(
    'button[type="submit"]'
  );

  const dados = {
    nome: document.getElementById('item-nome').value.trim(),

    descricao: document.getElementById('item-descricao').value.trim(),

    preco: Number(document.getElementById('item-preco').value),

    estoque: Number(document.getElementById('item-estoque').value),

    imagemUrl: inputImagem.value.trim(),

    tipo: document.getElementById('item-tipo').value
  };

  mensagemItem.textContent = 'Cadastrando item...';
  botao.disabled = true;

  const toastCarregamento = exibirToast(
    'Cadastrando produto...',
    'loading'
  );

  try {
    const resposta = await apiFetch('/items', {
      method: 'POST',
      body: JSON.stringify(dados)
    });

    mensagemItem.textContent =
      `Item "${resposta.nome}" cadastrado com sucesso!`;

    exibirToast('Produto cadastrado com sucesso!', 'success');

    formularioItem.reset();

    inputImagem.value = '';
    previewImagem.hidden = true;

    statusUpload.textContent =
      'Selecione uma imagem de até 8 MB.';

  } catch (erro) {
    console.error('Erro ao cadastrar item:', erro);

    mensagemItem.textContent =
      erro.message || 'Erro ao cadastrar item.';

    exibirToast(
      erro.message || 'Erro ao cadastrar produto.',
      'error'
    );

  } finally {
    removerToast(toastCarregamento);
    botao.disabled = false;
  }
});

// ==========================================
// FORMULÁRIO DE SERVIÇOS
// ==========================================

const formularioServico = document.getElementById('form-servico');
const mensagemServico = document.getElementById('mensagem-servico');

configurarAvisoCamposObrigatorios(
  formularioServico,
  'Preencha os campos obrigatórios do serviço.'
);

formularioServico.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const botao = formularioServico.querySelector(
    'button[type="submit"]'
  );

  const valorPreco = document.getElementById(
    'servico-precoEstimado'
  ).value;

  const dados = {
    nome: document.getElementById('servico-nome').value.trim(),

    caracteristicas: document.getElementById(
      'servico-caracteristicas'
    ).value.trim(),

    precoEstimado: valorPreco === ''
      ? null
      : Number(valorPreco)
  };

  mensagemServico.textContent = 'Cadastrando serviço...';
  botao.disabled = true;

  const toastCarregamento = exibirToast(
    'Cadastrando serviço...',
    'loading'
  );

  try {
    const resposta = await apiFetch('/servicos', {
      method: 'POST',
      body: JSON.stringify(dados)
    });

    mensagemServico.textContent =
      `Serviço "${resposta.nome}" cadastrado com sucesso!`;

    exibirToast('Serviço cadastrado com sucesso!', 'success');

    formularioServico.reset();

  } catch (erro) {
    console.error('Erro ao cadastrar serviço:', erro);

    mensagemServico.textContent =
      erro.message || 'Erro ao cadastrar serviço.';

    exibirToast(
      erro.message || 'Erro ao cadastrar serviço.',
      'error'
    );

  } finally {
    removerToast(toastCarregamento);
    botao.disabled = false;
  }
});
