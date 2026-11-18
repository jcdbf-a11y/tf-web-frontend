
import { apiFetch } from './api.js';

const formFiltro = document.getElementById('form-filtro');
const filtroTipo = document.getElementById('filtro-tipo');

const listaChapeus = document.getElementById('lista-chapeus');
const listaMontagem = document.getElementById('lista-montagem');

const secaoChapeus = document.getElementById('secao-chapeus');
const secaoMontagem = document.getElementById('secao-montagem');

const mensagem = document.getElementById('mensagem-catalogo');

// Número temporário do WhatsApp
const WHATSAPP_NUMERO = '5538998445719';

function formatarPreco(preco) {
  return Number(preco).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// Criar botão de interesse pelo WhatsApp
function criarBotaoWhatsApp(produto) {
  const botao = document.createElement('a');

  const textoMensagem =
    `Olá! Tenho interesse no chapéu "${produto.nome}", ` +
    `anunciado por ${formatarPreco(produto.preco)}. ` +
    `Gostaria de saber mais sobre disponibilidade e compra.`;

  botao.href =
    `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(textoMensagem)}`;

  botao.textContent = 'Tenho interesse neste chapéu';
  botao.className = 'botao';
  botao.target = '_blank';
  botao.rel = 'noopener noreferrer';

  return botao;
}

// Criar cartão de produto
function criarProduto(produto) {
  const artigo = document.createElement('article');

  const titulo = document.createElement('h3');
  titulo.textContent = produto.nome;

  const imagem = document.createElement('img');
  imagem.src = produto.imagemUrl || 'https://picsum.photos/seed/produto/400/300';
  imagem.alt = produto.nome;
  imagem.width = 400;
  imagem.height = 300;

  const descricao = document.createElement('p');
  descricao.textContent = produto.descricao;

  const preco = document.createElement('p');
  preco.classList.add('preco');
  preco.textContent = `Preço: ${formatarPreco(produto.preco)}`;

  const estoque = document.createElement('p');
  estoque.textContent = `Estoque: ${produto.estoque} unidades`;

  artigo.append(titulo, imagem, descricao, preco, estoque);

  // Botão de WhatsApp somente para chapéus prontos
  if (produto.tipo === 'CHAPEU_PRONTO') {
    const botaoWhatsApp = criarBotaoWhatsApp(produto);
    artigo.appendChild(botaoWhatsApp);
  }

  return artigo;
}

// Limpar catálogo
function limparCatalogo() {
  listaChapeus.replaceChildren();
  listaMontagem.replaceChildren();
}

// Carregar produtos
async function carregarProdutos(tipo = '') {
  mensagem.textContent = 'Carregando produtos...';

  limparCatalogo();

  secaoChapeus.hidden = false;
  secaoMontagem.hidden = false;

  try {
    let endpoint = '/items';

    if (tipo) {
      endpoint += `?tipo=${encodeURIComponent(tipo)}`;
    }

    const produtos = await apiFetch(endpoint);

    if (!Array.isArray(produtos)) {
      throw new Error('A API retornou um formato inesperado.');
    }

    if (produtos.length === 0) {
      mensagem.textContent = 'Nenhum produto encontrado.';
      return;
    }

    produtos.forEach((produto) => {
      const card = criarProduto(produto);

      if (produto.tipo === 'CHAPEU_PRONTO') {
        listaChapeus.appendChild(card);
      } else if (produto.tipo === 'ITEM_MONTAGEM') {
        listaMontagem.appendChild(card);
      }
    });

    if (tipo === 'CHAPEU_PRONTO') {
      secaoMontagem.hidden = true;
    }

    if (tipo === 'ITEM_MONTAGEM') {
      secaoChapeus.hidden = true;
    }

    mensagem.textContent =
      `${produtos.length} produto(s) encontrado(s).`;

  } catch (erro) {
    console.error(erro);

    mensagem.textContent =
      'Não foi possível carregar os produtos. Tente novamente mais tarde.';
  }
}

// Filtro de produtos
formFiltro.addEventListener('submit', (evento) => {
  evento.preventDefault();

  carregarProdutos(filtroTipo.value);
});

// Inicialização
carregarProdutos();
