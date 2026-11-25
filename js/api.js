
const API_URL = 'https://tf-web-tema.vercel.app';

export class ApiError extends Error {
  constructor(mensagem, status, dados = null) {
    super(mensagem);

    this.name = 'ApiError';
    this.status = status;
    this.dados = dados;
  }
}

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    ...options.headers
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const resposta = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    let dados = null;

    if (resposta.status !== 204) {
      const tipoConteudo = resposta.headers.get('content-type');

      if (tipoConteudo && tipoConteudo.includes('application/json')) {
        dados = await resposta.json();
      } else {
        dados = await resposta.text();
      }
    }

    if (!resposta.ok) {
      let mensagem = dados?.mensagem || dados?.erro;

      if (!mensagem && typeof dados === 'string' && dados.trim()) {
        mensagem = dados;
      }

      if (!mensagem) {
        switch (resposta.status) {
          case 401:
            mensagem = 'Não autenticado. Verifique suas credenciais ou faça login novamente.';
            break;

          case 403:
            mensagem = 'Você não tem permissão para realizar esta ação.';
            break;

          case 404:
            mensagem = 'O recurso solicitado não foi encontrado.';
            break;

          default:
            mensagem = `Erro na requisição: HTTP ${resposta.status}`;
        }
      }

      throw new ApiError(mensagem, resposta.status, dados);
    }

    return dados;

  } catch (erro) {
    console.error('Erro ao comunicar com a API:', erro);
    throw erro;
  }
}
