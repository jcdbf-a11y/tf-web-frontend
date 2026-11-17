
import { apiFetch } from './api.js';

const listaServicos = document.getElementById('lista-servicos');
const mensagem = document.getElementById('mensagem-servicos');

function formatarPreco(preco) {
  if (preco === null || preco === undefined) {
    return 'Preço sob consulta';
  }

  return `Preço estimado: ${Number(preco).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })}`;
}

function criarServico(servico) {
  const artigo = document.createElement('article');

  const titulo = document.createElement('h3');
  titulo.textContent = servico.nome;

  const caracteristicas = document.createElement('p');
  caracteristicas.textContent = servico.caracteristicas;

  const preco = document.createElement('p');
  preco.classList.add('preco');
  preco.textContent = formatarPreco(servico.precoEstimado);

  artigo.append(titulo, caracteristicas, preco);

  return artigo;
}

async function carregarServicos() {
  mensagem.textContent = 'Carregando serviços...';

  listaServicos.replaceChildren();

  try {
    const servicos = await apiFetch('/servicos');

    if (!Array.isArray(servicos)) {
      throw new Error('A API retornou um formato inesperado.');
    }

    if (servicos.length === 0) {
      mensagem.textContent = 'Nenhum serviço cadastrado no momento.';
      return;
    }

    servicos.forEach((servico) => {
      listaServicos.appendChild(criarServico(servico));
    });

    mensagem.textContent =
      `${servicos.length} serviço(s) encontrado(s).`;

  } catch (erro) {
    console.error('Erro ao carregar serviços:', erro);

    mensagem.textContent =
      'Não foi possível carregar os serviços. Tente novamente mais tarde.';
  }
}

carregarServicos();
