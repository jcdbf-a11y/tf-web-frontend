import { estaLogado, removerToken } from './auth.js';

const menu = document.getElementById('menu-principal');
const paginaAtual = window.location.pathname.split('/').pop().replace('.html', '');

function criarLink(texto, href) {
  const item = document.createElement('li');
  const link = document.createElement('a');
  link.textContent = texto;
  link.href = href;
  if (href.replace('.html', '') === paginaAtual) {
    link.setAttribute('aria-current', 'page');
  }
  item.append(link);
  return item;
}

if (menu && estaLogado()) {
  menu.append(criarLink('Cadastro de Produtos', 'cadastroProdutos.html'));

  const itemSair = criarLink('Sair', 'login.html');
  itemSair.querySelector('a').addEventListener('click', (evento) => {
    evento.preventDefault();
    removerToken();
    window.location.href = 'index.html';
  });
  menu.append(itemSair);
}