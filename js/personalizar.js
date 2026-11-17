
import { apiFetch } from './api.js';

const selectModelo = document.getElementById('modelo-chapeu');
const imagemModelo = document.getElementById('imagem-modelo');
const precoModelo = document.getElementById('preco-modelo');
const listaAderecos = document.getElementById('lista-aderecos');
const mensagem = document.getElementById('mensagem-personalizacao');
const precoTotal = document.getElementById('preco-total');

let modelos = [];
let aderecos = [];

function formatarPreco(preco) {
    return Number(preco).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Carregar modelos de chapéu
async function carregarModelos() {
    try {
        modelos = await apiFetch('/items?tipo=CHAPEU_PRONTO');

        if (!Array.isArray(modelos)) {
            throw new Error('Formato de modelos inválido.');
        }

        selectModelo.replaceChildren();

        const opcaoInicial = document.createElement('option');
        opcaoInicial.value = '';
        opcaoInicial.textContent = 'Selecione um modelo';
        selectModelo.appendChild(opcaoInicial);

        if (modelos.length === 0) {
            opcaoInicial.textContent = 'Nenhum modelo disponível';
            return;
        }

        modelos.forEach((modelo) => {
            const opcao = document.createElement('option');

            opcao.value = modelo.id;
            opcao.textContent = `${modelo.nome} - ${formatarPreco(modelo.preco)}`;

            selectModelo.appendChild(opcao);
        });

    } catch (erro) {
        console.error('Erro ao carregar modelos:', erro);
        selectModelo.innerHTML = '<option value="">Erro ao carregar modelos</option>';
        mensagem.textContent = 'Não foi possível carregar os modelos.';
    }
}

// Atualizar modelo selecionado
function atualizarModelo() {
    const modeloSelecionado = modelos.find(
        (modelo) => String(modelo.id) === selectModelo.value
    );

    imagemModelo.replaceChildren();

    if (!modeloSelecionado) {
        precoModelo.textContent = '';
        atualizarPrecoTotal();
        return;
    }

    precoModelo.textContent = `Preço: ${formatarPreco(modeloSelecionado.preco)}`;

    if (modeloSelecionado.imagemUrl) {
        const imagem = document.createElement('img');

        imagem.src = modeloSelecionado.imagemUrl;
        imagem.alt = modeloSelecionado.nome;
        imagem.style.maxWidth = '250px';
        imagem.style.height = 'auto';

        imagemModelo.appendChild(imagem);
    }

    atualizarPrecoTotal();
}

// Carregar adereços
async function carregarAderecos() {
    try {
        aderecos = await apiFetch('/items?tipo=ITEM_MONTAGEM');

        if (!Array.isArray(aderecos)) {
            throw new Error('Formato de adereços inválido.');
        }

        listaAderecos.replaceChildren();

        if (aderecos.length === 0) {
            const aviso = document.createElement('p');
            aviso.textContent = 'Nenhum adereço disponível no momento.';
            listaAderecos.appendChild(aviso);
            return;
        }

        aderecos.forEach((adereco) => {
            const container = document.createElement('div');

            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.gap = '10px';
            container.style.marginBottom = '10px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'aderecos';
            checkbox.value = adereco.id;
            checkbox.id = `adereco-${adereco.id}`;

            checkbox.style.width = '20px';
            checkbox.style.height = '20px';
            checkbox.style.flexShrink = '0';
            checkbox.style.cursor = 'pointer';

            checkbox.addEventListener('change', atualizarPrecoTotal);

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.style.cursor = 'pointer';
            label.textContent = `${adereco.nome} - ${formatarPreco(adereco.preco)}`;

            container.append(checkbox, label);
            listaAderecos.appendChild(container);
        });

    } catch (erro) {
        console.error('Erro ao carregar adereços:', erro);
        listaAderecos.textContent = 'Não foi possível carregar os adereços.';
    }
}

// Calcular preço total
function atualizarPrecoTotal() {
    const modeloSelecionado = modelos.find(
        (modelo) => String(modelo.id) === selectModelo.value
    );

    let total = modeloSelecionado
        ? Number(modeloSelecionado.preco)
        : 0;

    const aderecosSelecionados = document.querySelectorAll(
        'input[name="aderecos"]:checked'
    );

    aderecosSelecionados.forEach((checkbox) => {
        const adereco = aderecos.find(
            (item) => String(item.id) === checkbox.value
        );

        if (adereco) {
            total += Number(adereco.preco);
        }
    });

    precoTotal.textContent = formatarPreco(total);
}

// Eventos
selectModelo.addEventListener('change', atualizarModelo);

// Inicialização
async function iniciarPersonalizacao() {
    await Promise.all([
        carregarModelos(),
        carregarAderecos()
    ]);

    atualizarPrecoTotal();
}

iniciarPersonalizacao();
