
const API_URL = 'https://tf-web-tema.vercel.app';

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
      const mensagem =
        dados?.mensagem ||
        dados?.erro ||
        (typeof dados === 'string' ? dados : null) ||
        `Erro na requisição: ${resposta.status}`;

      throw new Error(mensagem);
    }

    return dados;
  } catch (erro) {
    console.error('Erro ao comunicar com a API:', erro);
    throw erro;
  }
}
