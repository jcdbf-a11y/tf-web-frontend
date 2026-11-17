
import { apiFetch } from './api.js';
import { salvarToken } from './auth.js';

const formulario = document.getElementById('form-login');
const mensagem = document.getElementById('mensagem-login');
const botaoEntrar = formulario.querySelector('button[type="submit"]');

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  mensagem.textContent = 'Verificando credenciais...';
  botaoEntrar.disabled = true;

  try {
    const resposta = await apiFetch('/adm/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        senha
      })
    });

    salvarToken(resposta.token);

    mensagem.textContent = 'Login realizado com sucesso!';

    window.location.href = 'cadastroProdutos.html';
  } catch (erro) {
    mensagem.textContent = erro.message || 'Não foi possível realizar o login.';
    botaoEntrar.disabled = false;
  }
});
