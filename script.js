// 1. DATA: Onde definimos o que o app vai ter
const CATEGORIAS = [
    { 
        id: 'agua', 
        name: '1. Água', 
        icon: 'droplets', 
        color: '#0ea5e9',
        items: [
            { id: 'leitura_atual', label: 'Leitura Atual (M³)', type: 'number' },
            { id: 'foto_hidro', label: 'Foto do Hidrômetro ou Conta', type: 'file' }
        ]
    },
    // Deixe as outras como estão por enquanto, não vamos mexer nelas.

   { 
        id: 'luz', 
        name: '2. Energia', 
        icon: 'zap', 
        color: '#f59e0b',
        items: [
            { id: 'leitura_luz', label: 'Leitura Atual (KWh)', type: 'number' },
            { id: 'foto_luz', label: 'Foto do Medidor ou Conta', type: 'file' }
        ]
    },
    
   { 
    id: 'diesel', 
    name: '3. Óleo Diesel', 
    icon: 'fuel', 
    color: '#ef4444',
    items: [
        { id: 'nivel_diesel', label: 'Quantidade de Litros Comprados', type: 'text' },
        { id: 'valor_diesel', label: 'Valor da compra (R$)', type: 'text' }, 
        { id: 'nf_diesel', label: 'Digitar NF', type: 'text' }, // NOME ALTERADO  
        { id: 'foto_diesel', label: 'Foto da NF', type: 'file' }
    ]
}, 

   { 
    id: 'gerador', 
    name: '4. Gerador', 
    icon: 'cog', 
    color: '#64748b',
    items: [
        // 1. Horímetro
        { id: 'horimetro', label: 'Painel de Registro de Horas (h)', type: 'number' },
        { id: 'foto_horimetro', label: 'Foto do Horímetro', type: 'file' },

        // 2. Boia do Diesel
        { id: 'nivel_boia_diesel', label: 'Nível da Boia do Diesel', type: 'select_status' },
        { id: 'foto_boia_diesel', label: 'Foto da Boia/Nível', type: 'file' },

        // 3. Óleo do Motor
        { id: 'nivel_oleo_motor', label: 'Nível do Óleo do Motor', type: 'select_status' },
        { id: 'foto_oleo_motor', label: 'Foto da Vareta/Nível Óleo', type: 'file' },

        // 4. Bateria
        { id: 'voltagem_bateria', label: 'Voltagem da Bateria (V)', type: 'number' },
        { id: 'foto_voltagem', label: 'Foto do Voltímetro/Multímetro', type: 'file' },

        // 5. Temperatura
        { id: 'temp_gerador', label: 'Temperatura do Gerador (°C)', type: 'number' },
        { id: 'foto_temp', label: 'Foto do Termômetro/Painel', type: 'file' }
    ]
},

    { 
    id: 'manutencao', 
    name: '5. Manutenção', 
    icon: 'tool', 
    color: '#10b981',
    isSubmenu: true, // Indica que isso abre outro menu
    subItems: [
        { id: 'manut_eletrica', name: '⚡ Manutenção Elétrica', color: '#fbbf24' },
        { id: 'manut_hidraulica', name: '💧 Manutenção Hidráulica', color: '#3b82f6' },
        { id: 'manut_geral', name: '🏢 Manutenção Geral', color: '#64748b' },
        { id: 'manut_preventiva', name: '🛠️ Preventiva', color: '#10b981' },
        { id: 'manut_corretiva', name: '🚨 Corretiva', color: '#ef4444' }
    ]
},
];  

let respostas = {}; // Objeto para salvar o que o usuário digita
let nivelAtual = 'menu'; // Ajuda o botão voltar a saber onde você está

// 2. INICIALIZAÇÃO: Quando a página carrega
window.onload = () => {
    lucide.createIcons(); // Carrega os ícones iniciais
    
    // Configura o botão Iniciar
    document.getElementById('btn-iniciar').onclick = () => {
        const nome = document.getElementById('input-responsible').value;
        if (!nome) return alert("Por favor, preencha o campo Responsável antes de iniciar.");
        
        showScreen('categories');
        renderCategories();
    };
}

document.getElementById('btn-voltar').onclick = () => {
    // Pegamos o título que está aparecendo no topo da tela agora
    const tituloAtual = document.getElementById('titulo-categoria').innerText;
    
    // CORREÇÃO: Lista exata com "Manutenção" antes nos 3 primeiros itens
    const subCategoriasValidas = [
        '⚡ Manutenção Elétrica', 
        '💧 Manutenção Hidráulica', 
        '🏢 Manutenção Geral',    
        '🛠️ Preventiva',
        '🚨 Corretiva'
    ];

    // Agora o JavaScript vai achar o título certo!
    if (subCategoriasValidas.includes(tituloAtual)) {
        // Se estiver em uma dessas, volta para a tela 5. Manutenção
        const catManut = CATEGORIAS.find(c => c.id === 'manutencao');
        openSubmenu(catManut);
    } else {
        // Se for Água, Luz ou a própria tela 5. Manutenção, volta para o menu principal
        showScreen('categories');
        renderCategories();
    }
}; 

// 3. NAVEGAÇÃO: Troca de telas
function showScreen(screenId) {
    // Esconde todas as sections de main
    document.querySelectorAll('main > section').forEach(s => s.classList.add('hidden'));
    // Mostra a escolhida
    document.getElementById('screen-' + screenId).classList.remove('hidden');
}

function renderCategories() {
    const grid = document.getElementById('categories-grid');
    grid.innerHTML = ''; 

    CATEGORIAS.forEach(cat => {
        const card = document.createElement('div');
        card.className = "bg-[#1e293b] border border-[#334155] p-4 rounded-2xl flex items-center gap-4 cursor-pointer active:scale-95 transition-all";
        
        card.innerHTML = `
            <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="background: ${cat.color}20; color: ${cat.color}">
                <i data-lucide="${cat.icon}"></i>
            </div>
            <div class="flex-1">
                <h3 class="font-bold text-slate-100">${cat.name}</h3>
                <p class="text-xs text-slate-400">Clique para iniciar a verificação</p>
            </div>
        `;

        // AQUI ESTÁ O SEGREDO:
        card.onclick = () => {
            if (cat.subItems && cat.subItems.length > 0) {
                // Se for manutenção (tem sub-abas), abre o submenu
                openSubmenu(cat);
            } else {
                // Se for Água, Luz, etc (tem itens diretos), abre o openItems
                openItems(cat);
            }
        };

        grid.appendChild(card);
    });

    // Botão do Excel (mantém igual embaixo)
    renderBotaoExcel(grid);
 
    lucide.createIcons();
}

// Só para organizar, criei essa função pro botão do Excel não bagunçar o loop
function renderBotaoExcel(grid) {
    const cardExcel = document.createElement('div');
    cardExcel.className = "bg-emerald-500/10 border border-emerald-500/40 p-4 rounded-2xl flex items-center gap-4 cursor-pointer mt-6 active:scale-95 transition-all";
    cardExcel.innerHTML = `
        <div class="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-900">
            <i data-lucide="file-spreadsheet"></i>
        </div>
        <div class="flex-1">
            <h3 class="font-bold text-emerald-400">6. Exportar Excel</h3>
            <p class="text-xs text-emerald-500/60">Finalizar e baixar relatório</p>
        </div>
    `;
    cardExcel.onclick = generateExcel;
    grid.appendChild(cardExcel);
}

function openItems(cat) {
    if (nivelAtual !== 'itens-manutencao') nivelAtual = 'menu'; // <--- Adicione isso
    showScreen('items');
    // ... resto do seu código igual ...
    showScreen('items'); 
    document.getElementById('titulo-categoria').innerText = cat.name;
    
    const lista = document.getElementById('lista-itens');
    lista.innerHTML = ''; 

    cat.items.forEach(pergunta => {
        const div = document.createElement('div');
        div.className = "bg-[#1e293b] p-4 rounded-xl border border-[#334155] mb-4";
        
        let conteudoInput = "";

       // 1. FOTOS (VERSÃO ATUALIZADA PARA CÂMERA)
        if (pergunta.type === 'file') {
            conteudoInput = `
                <label class="flex flex-col items-center justify-center gap-2 w-full py-4 bg-[#0f172a] border border-dashed border-[#475569] rounded-lg cursor-pointer active:bg-amber-500/10 transition-all">
                    <i data-lucide="camera" class="text-amber-500"></i>
                    <span class="text-xs text-slate-400">Capturar Registro Fotográfico</span>
                    <input type="file" 
                           accept="image/*" 
                           capture="environment" 
                           class="hidden" 
                           onchange="mostraPreviewDaFoto(this, '${pergunta.id}')">
                </label>
                <div id="visualizacao-${pergunta.id}" class="mt-3 hidden p-2 bg-[#0f172a] rounded-lg border border-[#334155]">
                    <p class="text-[10px] text-emerald-500 mb-1">✅ Imagem carregada</p>
                    <img src="" class="w-full h-auto max-h-60 object-cover rounded-md border-2 border-emerald-500">
                </div>`;
        }
        // 2. STATUS DO GERADOR (OK/BAIXO/CRÍTICO)
        else if (pergunta.type === 'select_status') {
            conteudoInput = `
                <select class="w-full bg-[#0f172a] border border-[#334155] p-3 rounded-lg text-sm text-white outline-none focus:border-amber-500"
                        onchange="respostas['${pergunta.id}'] = this.value">
                    <option value="">Selecione...</option>
                    <option value="OK">✅ OK / Normal</option>
                    <option value="Baixo">⚠️ Baixo / Repor</option>
                    <option value="Crítico">🚨 Crítico / Falha</option>
                </select>`;
        }
        // 3. TIPO DE MANUTENÇÃO
        else if (pergunta.type === 'select_tipo') {
            conteudoInput = `
                <select class="w-full bg-[#0f172a] border border-[#334155] p-3 rounded-lg text-sm text-white outline-none focus:border-amber-500"
                        onchange="respostas['${pergunta.id}'] = this.value">
                    <option value="">Selecione o tipo...</option>
                    <option value="Preventiva">🛠️ Preventiva (Rotina)</option>
                    <option value="Corretiva">🚨 Corretiva (Reparo)</option>
                    <option value="Preditiva">🔍 Preditiva (Análise)</option>
                </select>`;
        }
        // 4. SETOR DA MANUTENÇÃO
        else if (pergunta.type === 'select_setor') {
            conteudoInput = `
                <select class="w-full bg-[#0f172a] border border-[#334155] p-3 rounded-lg text-sm text-white outline-none focus:border-amber-500"
                        onchange="respostas['${pergunta.id}'] = this.value">
                    <option value="">Selecione o setor...</option>
                    <option value="Elétrica">⚡ Elétrica</option>
                    <option value="Hidráulica">💧 Hidráulica</option>
                    <option value="Mecânica">⚙️ Mecânica</option>
                    <option value="Geral/Civil">🏢 Geral / Civil</option>
                </select>`;
        }
        // 5. TEXTO E DINHEIRO
        else if (pergunta.type === 'text') {
            if (pergunta.id.includes('valor')) {
                conteudoInput = `<input type="text" placeholder="R$ 0,00" class="w-full bg-[#0f172a] border border-[#334155] p-3 rounded-lg text-sm text-white outline-none focus:border-amber-500" oninput="formatarMoeda(this, '${pergunta.id}')">`;
            } else {
                conteudoInput = `<textarea placeholder="Digite os detalhes..." class="w-full bg-[#0f172a] border border-[#334155] p-3 rounded-lg text-sm text-white outline-none focus:border-amber-500" oninput="respostas['${pergunta.id}'] = this.value"></textarea>`;
            }
        }
        // 6. NÚMEROS
        else {
            conteudoInput = `<input type="number" placeholder="Digite o valor..." class="w-full bg-[#0f172a] border border-[#334155] p-3 rounded-lg text-sm text-white outline-none focus:border-amber-500" oninput="respostas['${pergunta.id}'] = this.value">`;
        }

        div.innerHTML = `<p class="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">${pergunta.label}</p>${conteudoInput}`;
        lista.appendChild(div);
    });
    lucide.createIcons();
} 

async function generateExcel() {
    if (Object.keys(respostas).length === 0) {
        return alert("Nenhum dado registrado. Por favor, realize a inspeção antes de exportar.");
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório');

    // Configura as colunas
    worksheet.columns = [
        { header: 'ITEM', key: 'item', width: 30 },
        { header: 'RESPOSTA', key: 'valor', width: 40 },
        { header: 'FOTO', key: 'foto', width: 20 }
    ];

    let rowIndex = 2;

    for (const [id, valor] of Object.entries(respostas)) {
        if (!valor) continue;

        // Se for FOTO (Base64)
        if (typeof valor === 'string' && valor.startsWith('data:image')) {
            const imageId = workbook.addImage({
                base64: valor,
                extension: 'png',
            });

            worksheet.getRow(rowIndex).height = 90;
            worksheet.getCell(`A${rowIndex}`).value = id.toUpperCase().replace(/_/g, ' ');
            worksheet.getCell(`B${rowIndex}`).value = "Ver imagem";

            worksheet.addImage(imageId, {
                tl: { col: 2, row: rowIndex - 1 },
                ext: { width: 110, height: 110 }
            });
        } 
        // Se for TEXTO ou NÚMERO
        else {
            worksheet.addRow({ 
                item: id.toUpperCase().replace(/_/g, ' '), 
                valor: valor 
            });
        }
        rowIndex++;
    }

    // Salva o arquivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Relatorio_Inspecao.xlsx`;
    a.click();
}

// Função extra para mostrar a foto assim que o usuário escolher
function mostraPreviewDaFoto(inputDoArquivo, idDoCampo) {
    const areaDeVisualizacao = document.getElementById(`visualizacao-${idDoCampo}`);
    const elementoDaImagem = areaDeVisualizacao.querySelector('img');
    
    // Verifica se tem algum arquivo selecionado
    if (inputDoArquivo.files && inputDoArquivo.files[0]) {
        // Objeto que "lê" o arquivo
        const leitor = new FileReader();
        
        // O que acontece quando o leitor terminar de ler
        leitor.onload = function(evento) {
            // Coloca o resultado da leitura (a foto) na imagem
            elementoDaImagem.src = evento.target.result;
            // Mostra a área de visualização (remove o hidden)
            areaDeVisualizacao.classList.remove('hidden');
            
            // Dica de mestre: Vamos guardar esse resultado nas respostas
            respostas[idDoCampo] = evento.target.result; // Foto salva em formato de texto (base64)
            console.log("Foto guardada nas respostas para: " + idDoCampo);
        }
        
        // Começa a ler o arquivo de fato
        leitor.readAsDataURL(inputDoArquivo.files[0]);
    }
} 

// Adicionamos o idDoCampo como parâmetro
function formatarMoeda(input, idDoCampo) {
    let valor = input.value;

    valor = valor.replace(/\D/g, "");
    valor = (valor / 100).toFixed(2) + "";
    valor = valor.replace(".", ",");
    valor = valor.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    valor = valor.replace(/(\d)(\d{3}),/g, "$1.$2,");

    input.value = "R$ " + valor;

    // A MÁGICA: Agora ele salva no ID certo (seja valor_conta ou valor_luz)
    respostas[idDoCampo] = valor;
} 

function openSubmenu(cat) {
    nivelAtual = 'submenu';
    showScreen('items'); // Usa a mesma tela de itens
    document.getElementById('titulo-categoria').innerText = cat.name;
    
    const lista = document.getElementById('lista-itens');
    lista.innerHTML = ''; 

    cat.subItems.forEach(sub => {
        const btn = document.createElement('div');
        btn.className = "flex items-center gap-4 bg-[#1e293b] p-6 rounded-2xl border border-[#334155] mb-4 cursor-pointer active:scale-95 transition-all";
        btn.onclick = () => openManutencaoEspecifica(sub);
        
        btn.innerHTML = `
            <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background: ${sub.color}20">
                <div class="w-3 h-3 rounded-full" style="background: ${sub.color}"></div>
            </div>
            <span class="text-white font-medium">${sub.name}</span>
        `;
        lista.appendChild(btn);
    });
}

function openManutencaoEspecifica(sub) {
    nivelAtual = 'itens-manutencao'; 
    
    document.getElementById('titulo-categoria').innerText = sub.name;
    const lista = document.getElementById('lista-itens');
    lista.innerHTML = '';

    // ORDEM ATUALIZADA:
    // 1º Equipamento/Produto
    // 2º Descrição do Serviço
    const campos = [
        { id: `${sub.id}_produto`, label: 'Equipamento / Produto (Ex: Torneira, Disjuntor)', type: 'text' },
        { id: `${sub.id}_desc`, label: 'Descrição do Serviço (O que foi feito?)', type: 'text' },
        { id: `${sub.id}_foto_1`, label: 'Foto do Problema (Antes)', type: 'file' },
        { id: `${sub.id}_foto_2`, label: 'Foto do Serviço (Depois)', type: 'file' }
    ];

    // Chama a função para renderizar na tela
    openItems({ name: sub.name, items: campos });
} 
