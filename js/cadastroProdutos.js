
import { apiFetch } from './api.js';
import { protegerPagina } from './auth.js';

protegerPagina();

// FORMULÁRIO DE ITENS
const formularioItem = document.getElementById('form-item');
const mensagemItem = document.getElementById('mensagem-item');

formularioItem.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const botao = formularioItem.querySelector('button[type="submit"]');

  const dados = {
    nome: document.getElementById('item-nome').value.trim(),
    descricao: document.getElementById('item-descricao').value.trim(),
    preco: Number(document.getElementById('item-preco').value),
    estoque: Number(document.getElementById('item-estoque').value),
    imagemUrl: document.getElementById('item-imagemUrl').value.trim(),
    tipo: document.getElementById('item-tipo').value
  };

  mensagemItem.textContent = 'Cadastrando item...';
  botao.disabled = true;

  try {
    const resposta = await apiFetch('/items', {
      method: 'POST',
      body: JSON.stringify(dados)
    });

    mensagemItem.textContent =
      `Item "${resposta.nome}" cadastrado com sucesso!`;

    formularioItem.reset();

  } catch (erro) {
    mensagemItem.textContent =
      erro.message || 'Erro ao cadastrar item.';
  } finally {
    botao.disabled = false;
  }
});


// FORMULÁRIO DE SERVIÇOS
const formularioServico = document.getElementById('form-servico');
const mensagemServico = document.getElementById('mensagem-servico');

formularioServico.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const botao = formularioServico.querySelector('button[type="submit"]');

  const valorPreco = document.getElementById(
    'servico-precoEstimado'
  ).value;

  const dados = {
    nome: document.getElementById('servico-nome').value.trim(),
    caracteristicas: document.getElementById(
      'servico-caracteristicas'
    ).value.trim(),
    precoEstimado: valorPreco === '' ? null : Number(valorPreco)
  };

  mensagemServico.textContent = 'Cadastrando serviço...';
  botao.disabled = true;

  try {
    const resposta = await apiFetch('/servicos', {
      method: 'POST',
      body: JSON.stringify(dados)
    });

    mensagemServico.textContent =
      `Serviço "${resposta.nome}" cadastrado com sucesso!`;

    formularioServico.reset();

  } catch (erro) {
    mensagemServico.textContent =
      erro.message || 'Erro ao cadastrar serviço.';
  } finally {
    botao.disabled = false;
  }
});
