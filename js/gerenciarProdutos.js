
import { apiFetch } from './api.js';
import { protegerPagina } from './auth.js';
import { exibirToast, removerToast } from './feedback.js';

import * as UC from 'https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@v1/web/uc-file-uploader-regular.min.js';

UC.defineComponents(UC);

protegerPagina();

// ==========================================
// ELEMENTOS DOS PRODUTOS
// ==========================================

const listaProdutos = document.getElementById('lista-produtos');
const mensagem = document.getElementById('mensagem-gerenciamento');

const secaoEdicao = document.getElementById('secao-edicao');
const formularioEdicao = document.getElementById('form-edicao');
const mensagemEdicao = document.getElementById('mensagem-edicao');

const inputId = document.getElementById('editar-id');
const inputNome = document.getElementById('editar-nome');
const inputDescricao = document.getElementById('editar-descricao');
const inputPreco = document.getElementById('editar-preco');
const inputEstoque = document.getElementById('editar-estoque');
const inputImagem = document.getElementById('editar-imagemUrl');
const inputTipo = document.getElementById('editar-tipo');

const previewImagem = document.getElementById('preview-imagem-edicao');
const statusUpload = document.getElementById('status-upload-edicao');

const botaoCancelar = document.getElementById('cancelar-edicao');

// ==========================================
// ELEMENTOS DO UPLOADCARE
// ==========================================

const contextoUploader = document.getElementById(
  'uploader-edicao-contexto'
);

const apiUploader = contextoUploader.getAPI();

let imagemOriginal = '';
let uploadPendente = false;
let uploadEmAndamento = false;

// Controle do Toast de carregamento da imagem
let toastUploadImagem = null;

function finalizarToastUpload() {
  if (toastUploadImagem !== null) {
    removerToast(toastUploadImagem);
    toastUploadImagem = null;
  }
}

// ==========================================
// ELEMENTOS DOS SERVIÇOS
// ==========================================

const listaServicos = document.getElementById('lista-servicos');
const mensagemServicos = document.getElementById('mensagem-servicos');

const secaoEdicaoServico = document.getElementById('secao-edicao-servico');
const formularioEdicaoServico = document.getElementById('form-edicao-servico');
const mensagemEdicaoServico = document.getElementById('mensagem-edicao-servico');

const inputServicoId = document.getElementById('editar-servico-id');
const inputServicoNome = document.getElementById('editar-servico-nome');
const inputServicoCaracteristicas = document.getElementById('editar-servico-caracteristicas');
const inputServicoPreco = document.getElementById('editar-servico-preco');

const botaoCancelarServico = document.getElementById('cancelar-edicao-servico');

// ==========================================
// VARIÁVEIS
// ==========================================

let produtos = [];
let servicos = [];

// ==========================================
// VALIDAÇÃO DOS CAMPOS OBRIGATÓRIOS
// ==========================================

function configurarAvisoCamposObrigatorios(formulario, mensagemAviso) {
  let avisoExibido = false;

  formulario.addEventListener('invalid', () => {
    if (!avisoExibido) {
      exibirToast(mensagemAviso, 'warning');
      avisoExibido = true;

      setTimeout(() => {
        avisoExibido = false;
      }, 1000);
    }
  }, true);
}

configurarAvisoCamposObrigatorios(
  formularioEdicao,
  'Preencha os campos obrigatórios do produto.'
);

configurarAvisoCamposObrigatorios(
  formularioEdicaoServico,
  'Preencha os campos obrigatórios do serviço.'
);

// ==========================================
// FORMATAÇÃO DE PREÇO
// ==========================================

function formatarPreco(preco) {
  if (preco === null || preco === undefined || preco === '') {
    return 'Preço sob consulta';
  }

  return Number(preco).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// ==========================================
// UPLOADCARE NA EDIÇÃO
// ==========================================

// Quando uma imagem for selecionada
contextoUploader.addEventListener('file-added', () => {
  uploadPendente = true;

  statusUpload.textContent =
    'Imagem selecionada. Aguardando envio.';
});

// Quando o envio começar
contextoUploader.addEventListener('file-upload-start', () => {
  uploadEmAndamento = true;

  statusUpload.textContent =
    'Enviando imagem para o Uploadcare...';

  // Evita acumular Toasts se o evento for disparado novamente.
  finalizarToastUpload();

  toastUploadImagem = exibirToast(
    'Enviando nova imagem...',
    'loading'
  );
});

// Quando o envio terminar
contextoUploader.addEventListener('file-upload-success', (evento) => {
  const arquivo = evento.detail;

  finalizarToastUpload();

  uploadPendente = false;
  uploadEmAndamento = false;

  if (!arquivo?.cdnUrl) {
    statusUpload.textContent =
      'Não foi possível obter o endereço da imagem.';

    exibirToast(
      'Não foi possível obter o endereço da imagem.',
      'error'
    );

    return;
  }

  inputImagem.value = arquivo.cdnUrl;

  previewImagem.src = arquivo.cdnUrl;
  previewImagem.hidden = false;

  statusUpload.textContent =
    'Nova imagem enviada com sucesso!';

  exibirToast('Imagem enviada com sucesso!', 'success');
});

// Quando a URL da imagem mudar
contextoUploader.addEventListener('file-url-changed', (evento) => {
  const arquivo = evento.detail;

  if (arquivo?.cdnUrl) {
    finalizarToastUpload();

    inputImagem.value = arquivo.cdnUrl;

    previewImagem.src = arquivo.cdnUrl;
    previewImagem.hidden = false;

    uploadPendente = false;
    uploadEmAndamento = false;

    statusUpload.textContent =
      'Imagem atualizada com sucesso!';
  }
});

// Quando ocorrer um erro no upload
contextoUploader.addEventListener('file-upload-failed', () => {
  finalizarToastUpload();

  uploadPendente = false;
  uploadEmAndamento = false;

  inputImagem.value = imagemOriginal;

  if (imagemOriginal) {
    previewImagem.src = imagemOriginal;
    previewImagem.hidden = false;
  } else {
    previewImagem.hidden = true;
  }

  statusUpload.textContent =
    'Falha ao enviar imagem. Tente novamente.';

  exibirToast('Falha ao enviar imagem. Tente novamente.', 'error');
});

// Quando uma imagem for removida do uploader
contextoUploader.addEventListener('file-removed', () => {
  finalizarToastUpload();

  uploadPendente = false;
  uploadEmAndamento = false;

  inputImagem.value = imagemOriginal;

  if (imagemOriginal) {
    previewImagem.src = imagemOriginal;
    previewImagem.hidden = false;
  } else {
    previewImagem.hidden = true;
  }

  statusUpload.textContent =
    'Imagem original mantida. Selecione outra se desejar.';
});

// Limpar o uploader
function limparUploader() {
  finalizarToastUpload();

  apiUploader.removeAllFiles();

  imagemOriginal = '';
  uploadPendente = false;
  uploadEmAndamento = false;

  inputImagem.value = '';
  previewImagem.removeAttribute('src');
  previewImagem.hidden = true;

  statusUpload.textContent =
    'Selecione uma nova imagem somente se desejar substituir a atual.';
}

// ==========================================
// GERENCIAMENTO DE PRODUTOS
// ==========================================

// Criar cartão de produto
function criarCartao(produto) {
  const artigo = document.createElement('article');

  const titulo = document.createElement('h3');
  titulo.textContent = produto.nome;

  const imagem = document.createElement('img');
  imagem.src = produto.imagemUrl || 'https://picsum.photos/seed/produto/400/300';
  imagem.alt = produto.nome;
  imagem.width = 250;
  imagem.height = 180;

  const descricao = document.createElement('p');
  descricao.textContent = produto.descricao;

  const preco = document.createElement('p');
  preco.textContent = `Preço: ${formatarPreco(produto.preco)}`;

  const estoque = document.createElement('p');
  estoque.textContent = `Estoque: ${produto.estoque} unidades`;

  const tipo = document.createElement('p');
  tipo.textContent = produto.tipo === 'CHAPEU_PRONTO'
    ? 'Categoria: Chapéu pronto'
    : 'Categoria: Item para montagem';

  const botaoEditar = document.createElement('button');
  botaoEditar.type = 'button';
  botaoEditar.textContent = 'Editar';

  botaoEditar.addEventListener('click', () => {
    editarProduto(produto.id);
  });

  const botaoExcluir = document.createElement('button');
  botaoExcluir.type = 'button';
  botaoExcluir.textContent = 'Excluir';

  botaoExcluir.addEventListener('click', () => {
    excluirProduto(produto.id, produto.nome);
  });

  artigo.append(
    titulo,
    imagem,
    descricao,
    preco,
    estoque,
    tipo,
    botaoEditar,
    botaoExcluir
  );

  return artigo;
}

// Carregar produtos
async function carregarProdutos() {
  mensagem.textContent = 'Carregando produtos...';
  listaProdutos.replaceChildren();

  const toastCarregamento = exibirToast(
    'Carregando produtos...',
    'loading'
  );

  try {
    produtos = await apiFetch('/items');

    if (!Array.isArray(produtos)) {
      throw new Error('Formato de produtos inválido.');
    }

    if (produtos.length === 0) {
      mensagem.textContent = 'Nenhum produto cadastrado.';
      exibirToast('Nenhum produto cadastrado.', 'info');
      return;
    }

    produtos.forEach((produto) => {
      listaProdutos.appendChild(criarCartao(produto));
    });

    mensagem.textContent =
      `${produtos.length} produto(s) encontrado(s).`;

  } catch (erro) {
    console.error('Erro ao carregar produtos:', erro);

    mensagem.textContent =
      erro.message || 'Não foi possível carregar os produtos.';

    exibirToast(
      erro.message || 'Não foi possível carregar os produtos.',
      'error'
    );

  } finally {
    removerToast(toastCarregamento);
  }
}

// Editar produto
function editarProduto(id) {
  const produto = produtos.find(
    (item) => String(item.id) === String(id)
  );

  if (!produto) {
    mensagem.textContent = 'Produto não encontrado.';
    exibirToast('Produto não encontrado.', 'warning');
    return;
  }

  limparUploader();

  inputId.value = produto.id;
  inputNome.value = produto.nome;
  inputDescricao.value = produto.descricao;
  inputPreco.value = produto.preco;
  inputEstoque.value = produto.estoque;
  inputTipo.value = produto.tipo;

  imagemOriginal = produto.imagemUrl || '';
  inputImagem.value = imagemOriginal;

  if (imagemOriginal) {
    previewImagem.src = imagemOriginal;
    previewImagem.hidden = false;
  } else {
    previewImagem.hidden = true;
  }

  statusUpload.textContent = imagemOriginal
    ? 'Imagem atual carregada. Selecione outra somente se desejar substituí-la.'
    : 'Este produto ainda não possui imagem.';

  mensagemEdicao.textContent = '';
  secaoEdicao.hidden = false;

  secaoEdicao.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

// Salvar alterações do produto
formularioEdicao.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  if (uploadPendente || uploadEmAndamento) {
    mensagemEdicao.textContent =
      'Aguarde o envio da imagem terminar antes de salvar.';

    exibirToast(
      'Aguarde o envio da imagem terminar antes de salvar.',
      'warning'
    );

    return;
  }

  const id = inputId.value;

  const dados = {
    nome: inputNome.value.trim(),
    descricao: inputDescricao.value.trim(),
    preco: Number(inputPreco.value),
    estoque: Number(inputEstoque.value),
    imagemUrl: inputImagem.value.trim(),
    tipo: inputTipo.value
  };

  const botaoSalvar = formularioEdicao.querySelector(
    'button[type="submit"]'
  );

  botaoSalvar.disabled = true;
  mensagemEdicao.textContent = 'Salvando alterações...';

  const toastCarregamento = exibirToast(
    'Salvando alterações do produto...',
    'loading'
  );

  try {
    const resposta = await apiFetch(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados)
    });

    mensagemEdicao.textContent =
      `Produto "${resposta.nome}" atualizado com sucesso!`;

    exibirToast('Produto atualizado com sucesso!', 'success');

    secaoEdicao.hidden = true;
    formularioEdicao.reset();

    limparUploader();

    await carregarProdutos();

  } catch (erro) {
    console.error('Erro ao atualizar produto:', erro);

    mensagemEdicao.textContent =
      erro.message || 'Não foi possível atualizar o produto.';

    exibirToast(
      erro.message || 'Não foi possível atualizar o produto.',
      'error'
    );

  } finally {
    removerToast(toastCarregamento);
    botaoSalvar.disabled = false;
  }
});

// Cancelar edição de produto
botaoCancelar.addEventListener('click', () => {
  formularioEdicao.reset();

  limparUploader();

  secaoEdicao.hidden = true;
  mensagemEdicao.textContent = '';
});

// Excluir produto
async function excluirProduto(id, nome) {
  const confirmar = window.confirm(
    `Tem certeza de que deseja excluir o produto "${nome}"? Esta ação não poderá ser desfeita.`
  );

  if (!confirmar) {
    return;
  }

  mensagem.textContent = `Excluindo "${nome}"...`;

  const toastCarregamento = exibirToast(
    `Excluindo produto "${nome}"...`,
    'loading'
  );

  try {
    await apiFetch(`/items/${id}`, {
      method: 'DELETE'
    });

    mensagem.textContent =
      `Produto "${nome}" excluído com sucesso!`;

    exibirToast('Produto excluído com sucesso!', 'success');

    if (inputId.value === String(id)) {
      formularioEdicao.reset();
      limparUploader();
      secaoEdicao.hidden = true;
    }

    await carregarProdutos();

  } catch (erro) {
    console.error('Erro ao excluir produto:', erro);

    mensagem.textContent =
      erro.message || 'Não foi possível excluir o produto.';

    exibirToast(
      erro.message || 'Não foi possível excluir o produto.',
      'error'
    );

  } finally {
    removerToast(toastCarregamento);
  }
}

// ==========================================
// GERENCIAMENTO DE SERVIÇOS
// ==========================================

// Criar cartão de serviço
function criarCartaoServico(servico) {
  const artigo = document.createElement('article');

  const titulo = document.createElement('h3');
  titulo.textContent = servico.nome;

  const caracteristicas = document.createElement('p');
  caracteristicas.textContent = servico.caracteristicas;

  const preco = document.createElement('p');
  preco.textContent = `Preço: ${formatarPreco(servico.precoEstimado)}`;

  const botaoEditar = document.createElement('button');
  botaoEditar.type = 'button';
  botaoEditar.textContent = 'Editar';

  botaoEditar.addEventListener('click', () => {
    editarServico(servico.id);
  });

  const botaoExcluir = document.createElement('button');
  botaoExcluir.type = 'button';
  botaoExcluir.textContent = 'Excluir';

  botaoExcluir.addEventListener('click', () => {
    excluirServico(servico.id, servico.nome);
  });

  artigo.append(
    titulo,
    caracteristicas,
    preco,
    botaoEditar,
    botaoExcluir
  );

  return artigo;
}

// Carregar serviços
async function carregarServicos() {
  mensagemServicos.textContent = 'Carregando serviços...';
  listaServicos.replaceChildren();

  const toastCarregamento = exibirToast(
    'Carregando serviços...',
    'loading'
  );

  try {
    servicos = await apiFetch('/servicos');

    if (!Array.isArray(servicos)) {
      throw new Error('Formato de serviços inválido.');
    }

    if (servicos.length === 0) {
      mensagemServicos.textContent = 'Nenhum serviço cadastrado.';
      exibirToast('Nenhum serviço cadastrado.', 'info');
      return;
    }

    servicos.forEach((servico) => {
      listaServicos.appendChild(criarCartaoServico(servico));
    });

    mensagemServicos.textContent =
      `${servicos.length} serviço(s) encontrado(s).`;

  } catch (erro) {
    console.error('Erro ao carregar serviços:', erro);

    mensagemServicos.textContent =
      erro.message || 'Não foi possível carregar os serviços.';

    exibirToast(
      erro.message || 'Não foi possível carregar os serviços.',
      'error'
    );

  } finally {
    removerToast(toastCarregamento);
  }
}

// Editar serviço
function editarServico(id) {
  const servico = servicos.find(
    (item) => String(item.id) === String(id)
  );

  if (!servico) {
    mensagemServicos.textContent = 'Serviço não encontrado.';
    exibirToast('Serviço não encontrado.', 'warning');
    return;
  }

  inputServicoId.value = servico.id;
  inputServicoNome.value = servico.nome;
  inputServicoCaracteristicas.value = servico.caracteristicas;
  inputServicoPreco.value = servico.precoEstimado ?? '';

  mensagemEdicaoServico.textContent = '';
  secaoEdicaoServico.hidden = false;

  secaoEdicaoServico.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

// Salvar alterações do serviço
formularioEdicaoServico.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const id = inputServicoId.value;

  const dados = {
    nome: inputServicoNome.value.trim(),
    caracteristicas: inputServicoCaracteristicas.value.trim(),
    precoEstimado: inputServicoPreco.value.trim() === ''
      ? null
      : Number(inputServicoPreco.value)
  };

  const botaoSalvar = formularioEdicaoServico.querySelector(
    'button[type="submit"]'
  );

  botaoSalvar.disabled = true;
  mensagemEdicaoServico.textContent = 'Salvando alterações...';

  const toastCarregamento = exibirToast(
    'Salvando alterações do serviço...',
    'loading'
  );

  try {
    const resposta = await apiFetch(`/servicos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados)
    });

    mensagemEdicaoServico.textContent =
      `Serviço "${resposta.nome}" atualizado com sucesso!`;

    exibirToast('Serviço atualizado com sucesso!', 'success');

    secaoEdicaoServico.hidden = true;
    formularioEdicaoServico.reset();

    await carregarServicos();

  } catch (erro) {
    console.error('Erro ao atualizar serviço:', erro);

    mensagemEdicaoServico.textContent =
      erro.message || 'Não foi possível atualizar o serviço.';

    exibirToast(
      erro.message || 'Não foi possível atualizar o serviço.',
      'error'
    );

  } finally {
    removerToast(toastCarregamento);
    botaoSalvar.disabled = false;
  }
});

// Cancelar edição de serviço
botaoCancelarServico.addEventListener('click', () => {
  formularioEdicaoServico.reset();

  secaoEdicaoServico.hidden = true;
  mensagemEdicaoServico.textContent = '';
});

// Excluir serviço
async function excluirServico(id, nome) {
  const confirmar = window.confirm(
    `Tem certeza de que deseja excluir o serviço "${nome}"? Esta ação não poderá ser desfeita.`
  );

  if (!confirmar) {
    return;
  }

  mensagemServicos.textContent = `Excluindo "${nome}"...`;

  const toastCarregamento = exibirToast(
    `Excluindo serviço "${nome}"...`,
    'loading'
  );

  try {
    await apiFetch(`/servicos/${id}`, {
      method: 'DELETE'
    });

    mensagemServicos.textContent =
      `Serviço "${nome}" excluído com sucesso!`;

    exibirToast('Serviço excluído com sucesso!', 'success');

    if (inputServicoId.value === String(id)) {
      formularioEdicaoServico.reset();
      secaoEdicaoServico.hidden = true;
    }

    await carregarServicos();

  } catch (erro) {
    console.error('Erro ao excluir serviço:', erro);

    mensagemServicos.textContent =
      erro.message || 'Não foi possível excluir o serviço.';

    exibirToast(
      erro.message || 'Não foi possível excluir o serviço.',
      'error'
    );

  } finally {
    removerToast(toastCarregamento);
  }
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

carregarProdutos();
carregarServicos();
