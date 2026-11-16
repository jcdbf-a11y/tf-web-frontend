const CHAVE_TOKEN = 'token';

export function salvarToken(token) {
  localStorage.setItem(CHAVE_TOKEN, token);
}

export function getToken() {
  return localStorage.getItem(CHAVE_TOKEN);
}

export function removerToken() {
  localStorage.removeItem(CHAVE_TOKEN);
}

export function estaLogado() {
  return Boolean(getToken());
}

export function protegerPagina() {
  if (!estaLogado()) {
    window.location.href = 'login.html';
  }
}