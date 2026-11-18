
import { apiFetch } from './api.js';

const listaServicos = document.getElementById('lista-servicos');
const mensagem = document.getElementById('mensagem-servicos');

// Número temporário do WhatsApp
const WHATSAPP_NUMERO = '5538998445719';

function formatarPreco(preco) {
  if (preco === null || preco === undefined) {
    return 'Preço sob consulta';
  }

  return `Preço estimado: ${Number(preco).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })}`;
}

// Criar link para o WhatsApp
function criarBotaoWhatsApp(servico) {
  const botao = document.createElement('a');

  const textoMensagem =
    `Olá! Tenho interesse em contratar o serviço "${servico.nome}". ` +
    `Gostaria de obter mais informações e saber como posso contratá-lo.`;

  botao.href =
    `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(textoMensagem)}`;

  botao.textContent = 'Contratar pelo WhatsApp';
  botao.className = 'botao';
  botao.target = '_blank';
  botao.rel = 'noopener noreferrer';

  return botao;
}

// Criar cartão de serviço
function criarServico(servico) {
  const artigo = document.createElement('article');

  const titulo = document.createElement('h3');
  titulo.textContent = servico.nome;

  const caracteristicas = document.createElement('p');
  caracteristicas.textContent = servico.caracteristicas;

  const preco = document.createElement('p');
  preco.classList.add('preco');
  preco.textContent = formatarPreco(servico.precoEstimado);

  const botaoWhatsApp = criarBotaoWhatsApp(servico);

  artigo.append(
    titulo,
    caracteristicas,
    preco,
    botaoWhatsApp
  );

  return artigo;
}

// Carregar serviços
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
