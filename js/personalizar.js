
import { apiFetch } from './api.js';

const selectModelo = document.getElementById('modelo-chapeu');
const selectTamanho = document.getElementById('tamanho-chapeu');

const imagemModelo = document.getElementById('imagem-modelo');
const precoModelo = document.getElementById('preco-modelo');

const listaAderecos = document.getElementById('lista-aderecos');

const mensagem = document.getElementById('mensagem-personalizacao');
const precoTotal = document.getElementById('preco-total');

const resumo = document.getElementById('resumo-personalizacao');
const botaoFinalizar = document.getElementById('finalizar-personalizacao');

// WhatsApp temporário
const WHATSAPP_NUMERO = '5538998445719';

let modelos = [];
let aderecos = [];

function formatarPreco(preco) {
    return Number(preco).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Retornar modelo selecionado
function obterModeloSelecionado() {
    return modelos.find(
        (modelo) => String(modelo.id) === selectModelo.value
    );
}

// Retornar adereços selecionados
function obterAderecosSelecionados() {
    const checkboxes = document.querySelectorAll(
        'input[name="aderecos"]:checked'
    );

    return Array.from(checkboxes)
        .map((checkbox) => {
            return aderecos.find(
                (item) => String(item.id) === checkbox.value
            );
        })
        .filter(Boolean);
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
            opcao.textContent =
                `${modelo.nome} - ${formatarPreco(modelo.preco)}`;

            selectModelo.appendChild(opcao);
        });

    } catch (erro) {
        console.error('Erro ao carregar modelos:', erro);

        selectModelo.innerHTML =
            '<option value="">Erro ao carregar modelos</option>';

        mensagem.textContent =
            'Não foi possível carregar os modelos.';
    }
}

// Atualizar modelo selecionado
function atualizarModelo() {
    const modeloSelecionado = obterModeloSelecionado();

    imagemModelo.replaceChildren();

    if (!modeloSelecionado) {
        precoModelo.textContent = '';
        atualizarResumo();
        return;
    }

    precoModelo.textContent =
        `Preço: ${formatarPreco(modeloSelecionado.preco)}`;

    if (modeloSelecionado.imagemUrl) {
        const imagem = document.createElement('img');

        imagem.src = modeloSelecionado.imagemUrl;
        imagem.alt = modeloSelecionado.nome;
        imagem.style.maxWidth = '250px';
        imagem.style.height = 'auto';

        imagemModelo.appendChild(imagem);
    }

    atualizarResumo();
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

            aviso.textContent =
                'Nenhum adereço disponível no momento.';

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

            checkbox.addEventListener('change', atualizarResumo);

            const label = document.createElement('label');

            label.htmlFor = checkbox.id;
            label.style.cursor = 'pointer';

            label.textContent =
                `${adereco.nome} - ${formatarPreco(adereco.preco)}`;

            container.append(checkbox, label);
            listaAderecos.appendChild(container);
        });

    } catch (erro) {
        console.error('Erro ao carregar adereços:', erro);

        listaAderecos.textContent =
            'Não foi possível carregar os adereços.';
    }
}

// Atualizar resumo e preço
function atualizarResumo() {
    const modelo = obterModeloSelecionado();
    const tamanho = selectTamanho.value;
    const aderecosSelecionados = obterAderecosSelecionados();

    let total = 0;

    resumo.replaceChildren();

    if (!modelo) {
        const aviso = document.createElement('p');

        aviso.textContent =
            'Escolha um modelo para visualizar seu resumo.';

        resumo.appendChild(aviso);
    } else {
        total += Number(modelo.preco);

        const nomeModelo = document.createElement('p');
        nomeModelo.textContent = `Modelo: ${modelo.nome}`;

        const tamanhoSelecionado = document.createElement('p');
        tamanhoSelecionado.textContent =
            `Tamanho: ${tamanho || 'Não selecionado'}`;

        resumo.append(nomeModelo, tamanhoSelecionado);

        const tituloAderecos = document.createElement('p');
        tituloAderecos.textContent = 'Adereços selecionados:';

        resumo.appendChild(tituloAderecos);

        if (aderecosSelecionados.length === 0) {
            const nenhum = document.createElement('p');
            nenhum.textContent = 'Nenhum adereço selecionado.';

            resumo.appendChild(nenhum);
        }

        aderecosSelecionados.forEach((adereco) => {
            const item = document.createElement('p');

            item.textContent =
                `${adereco.nome}: ${formatarPreco(adereco.preco)}`;

            resumo.appendChild(item);

            total += Number(adereco.preco);
        });
    }

    precoTotal.textContent = formatarPreco(total);
}

// Gerar mensagem e abrir WhatsApp
function finalizarPersonalizacao() {
    const modelo = obterModeloSelecionado();
    const tamanho = selectTamanho.value;

    const aderecosSelecionados = obterAderecosSelecionados();

    if (!modelo) {
        mensagem.textContent =
            'Selecione um modelo de chapéu.';

        return;
    }

    if (!tamanho) {
        mensagem.textContent =
            'Selecione o tamanho do chapéu.';

        return;
    }

    let total = Number(modelo.preco);

    let textoMensagem =
        'Olá! Gostaria de solicitar um chapéu personalizado.\n\n';

    textoMensagem += `*Modelo:* ${modelo.nome}\n`;
    textoMensagem += `*Tamanho:* ${tamanho}\n`;
    textoMensagem += `*Preço do modelo:* ${formatarPreco(modelo.preco)}\n`;

    textoMensagem += '\n*Adereços selecionados:*\n';

    if (aderecosSelecionados.length === 0) {
        textoMensagem += 'Nenhum adereço selecionado.\n';
    } else {
        aderecosSelecionados.forEach((adereco) => {
            textoMensagem +=
                `- ${adereco.nome}: ${formatarPreco(adereco.preco)}\n`;

            total += Number(adereco.preco);
        });
    }

    textoMensagem +=
        `\n*Preço total estimado:* ${formatarPreco(total)}`;

    textoMensagem +=
        '\n\nGostaria de mais informações sobre a disponibilidade e a encomenda.';

    const linkWhatsApp =
        `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(textoMensagem)}`;

    window.open(linkWhatsApp, '_blank', 'noopener,noreferrer');

    mensagem.textContent =
        'Solicitação preparada! Finalize o envio pelo WhatsApp.';
}

// Eventos
selectModelo.addEventListener('change', atualizarModelo);

selectTamanho.addEventListener('change', atualizarResumo);

botaoFinalizar.addEventListener(
    'click',
    finalizarPersonalizacao
);

// Inicialização
async function iniciarPersonalizacao() {
    await Promise.all([
        carregarModelos(),
        carregarAderecos()
    ]);

    atualizarResumo();
}

iniciarPersonalizacao();
