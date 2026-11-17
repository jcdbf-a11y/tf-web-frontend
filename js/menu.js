
import { estaLogado, removerToken } from './auth.js';

const menu = document.getElementById('menu-principal');

if (menu) {
  menu.replaceChildren();

  const paginaAtual = window.location.pathname
    .split('/')
    .pop()
    .replace('.html', '');

  function criarLink(texto, href) {
    const item = document.createElement('li');
    const link = document.createElement('a');

    link.textContent = texto;
    link.href = href;

    if (href.replace('.html', '') === paginaAtual) {
      link.setAttribute('aria-current', 'page');
    }

    item.appendChild(link);
    return item;
  }

  // Links disponíveis para todos os visitantes
  menu.appendChild(criarLink('Início', 'index.html'));
  menu.appendChild(criarLink('Catálogo', 'catalogo.html'));
  menu.appendChild(criarLink('Serviços', 'servicos.html'));
  menu.appendChild(criarLink('Personalize seu chapéu', 'personalizar.html'));

  // Links exclusivos do administrador
  if (estaLogado()) {
    menu.appendChild(
      criarLink('Cadastro de Produtos', 'cadastroProdutos.html')
    );

    const itemSair = criarLink('Sair', '#');
    const linkSair = itemSair.querySelector('a');

    linkSair.addEventListener('click', (evento) => {
      evento.preventDefault();

      removerToken();
      window.location.href = 'index.html';
    });

    menu.appendChild(itemSair);
  }
}
