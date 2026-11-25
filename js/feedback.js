
const TIPOS_VALIDOS = ['success', 'error', 'warning', 'info', 'loading'];

let contadorToasts = 0;

function obterContainer() {
  let container = document.getElementById('toast-container');

  if (!container) {
    container = document.createElement('div');

    container.id = 'toast-container';
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'false');

    document.body.appendChild(container);
  }

  return container;
}

export function exibirToast(mensagem, tipo = 'info', duracao = 4000) {
  const tipoFinal = TIPOS_VALIDOS.includes(tipo) ? tipo : 'info';
  const container = obterContainer();

  const id = `toast-${++contadorToasts}`;

  const toast = document.createElement('div');
  toast.id = id;
  toast.className = `toast toast-${tipoFinal}`;
  toast.setAttribute('role', tipoFinal === 'error' ? 'alert' : 'status');

  const icones = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'i',
    loading: '⟳'
  };

  const icone = document.createElement('span');
  icone.className = 'toast-icone';
  icone.textContent = icones[tipoFinal];

  const texto = document.createElement('span');
  texto.className = 'toast-mensagem';
  texto.textContent = mensagem;

  toast.append(icone, texto);
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('toast-visivel');
  });

  if (tipoFinal !== 'loading' && duracao > 0) {
    setTimeout(() => {
      removerToast(id);
    }, duracao);
  }

  return id;
}

export function removerToast(id) {
  const toast = document.getElementById(id);

  if (!toast) {
    return;
  }

  toast.classList.remove('toast-visivel');
  toast.classList.add('toast-removendo');

  setTimeout(() => {
    toast.remove();
  }, 250);
}
