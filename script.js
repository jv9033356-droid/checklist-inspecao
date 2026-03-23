// 1. DATA: Definição das Categorias
const CATEGORIAS = [
   { 
        id: 'agua', 
        name: '1. Água', 
        icon: 'droplets', 
        color: '#0ea5e9',
        items: [
            { id: 'predio_agua', label: 'Identificação do Prédio', type: 'select_predio' },
            { id: 'num_relogio_agua', label: 'Número do Relógio / Medidor', type: 'text' },
            { id: 'leitura_atual', label: 'Leitura Atual (M³)', type: 'number' },
            { id: 'foto_hidro', label: 'Foto do Hidrômetro ou Conta', type: 'file' }
        ]
    },
    { 
        id: 'luz', 
        name: '2. Energia', 
        icon: 'zap', 
        color: '#f59e0b',
        items: [
            { id: 'predio_luz', label: 'Identificação do Prédio', type: 'select_predio' },
            { id: 'num_relogio_luz', label: 'Número do Medidor de Energia', type: 'text' },
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
            { id: 'valor_diesel', label: 'Valor da compra (R$)', type: 'currency' }, 
            { id: 'nf_diesel', label: 'Digitar NF', type: 'text' }, 
            { id: 'foto_diesel', label: 'Foto da NF', type: 'file' }
        ]
    }, 
    { 
        id: 'gerador', 
        name: '4. Gerador', 
        icon: 'cog', 
        color: '#64748b',
        items: [
            { id: 'horimetro', label: 'Painel de Registro de Horas (h)', type: 'number' },
            { id: 'foto_horimetro', label: 'Foto do Horímetro', type: 'file' },
            { id: 'nivel_boia_diesel', label: 'Nível da Boia do Diesel', type: 'select_status' },
            { id: 'foto_boia_diesel', label: 'Foto da Boia/Nível', type: 'file' },
            { id: 'nivel_oleo_motor', label: 'Nível do Óleo do Motor', type: 'select_status' },
            { id: 'foto_oleo_motor', label: 'Foto da Vareta/Nível Óleo', type: 'file' },
            { id: 'voltagem_bateria', label: 'Voltagem da Bateria (V)', type: 'number' },
            { id: 'foto_voltagem', label: 'Foto do Voltímetro/Multímetro', type: 'file' },
            { id: 'temp_gerador', label: 'Temperatura do Gerador (°C)', type: 'number' },
            { id: 'foto_temp', label: 'Foto do Termômetro/Painel', type: 'file' }
        ]
    },
    { 
        id: 'manutencao', 
        name: '5. Manutenção', 
        icon: 'tool', 
        color: '#10b981',
        isSubmenu: true,
        subItems: [
            { id: 'manut_eletrica', name: '⚡ Manutenção Elétrica', color: '#fbbf24' },
            { id: 'manut_hidraulica', name: '💧 Manutenção Hidráulica', color: '#3b82f6' },
            { id: 'manut_geral', name: '🏢 Manutenção Geral', color: '#64748b' },
            { id: 'manut_preventiva', name: '🛠️ Preventiva', color: '#10b981' },
            { id: 'manut_corretiva', name: '🚨 Corretiva', color: '#ef4444' }
        ]
    },
];  

let respostas = {}; 
let nivelAtual = 'menu'; 
let rascunho = {}; // Aqui ficam as coisas antes de clicar em salvar

// 2. INICIALIZAÇÃO 
window.onload = () => {
    lucide.createIcons(); 
    document.getElementById('btn-iniciar').onclick = () => {
        const nome = document.getElementById('input-responsible').value;
        if (!nome) return alert("Por favor, preencha o campo Responsável antes de iniciar.");
        respostas['responsavel'] = nome; // Salva o nome do responsável
        showScreen('categories');
        renderCategories();
    };
}

document.getElementById('btn-voltar').onclick = () => {
    const tituloAtual = document.getElementById('titulo-categoria').innerText;
    const subCategoriasValidas = [
        '⚡ Manutenção Elétrica', 
        '💧 Manutenção Hidráulica', 
        '🏢 Manutenção Geral',    
        '🛠️ Preventiva',
        '🚨 Corretiva'
    ];

    if (subCategoriasValidas.includes(tituloAtual)) {
        const catManut = CATEGORIAS.find(c => c.id === 'manutencao');
        openSubmenu(catManut);
    } else {
        showScreen('categories');
        renderCategories();
    }
}; 

// 3. NAVEGAÇÃO
function showScreen(screenId) {
    document.querySelectorAll('main > section').forEach(s => s.classList.add('hidden'));
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

        card.onclick = () => {
            if (cat.subItems && cat.subItems.length > 0) {
                openSubmenu(cat);
            } else {
                openItems(cat);
            }
        };
        grid.appendChild(card);
    });

    // --- NOVA ÁREA DE BOTÕES GERAIS (LADO A LADO) ---
    const areaAcoes = document.createElement('div');
    areaAcoes.className = "flex gap-3 mt-6 pb-10"; // 'flex' coloca um do lado do outro

    areaAcoes.innerHTML = `
        <button onclick="generateExcel()" class="flex-1 flex items-center justify-center gap-2 h-14 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-2xl active:scale-95 transition-all shadow-lg">
            <i data-lucide="file-spreadsheet" class="w-5 h-5"></i>
            <span class="text-xs font-black uppercase tracking-tighter">Excel Geral</span>
        </button>

        <button onclick="gerarPDFGeral()" class="flex-1 flex items-center justify-center gap-2 h-14 bg-red-500/10 border border-red-500/30 text-red-500 rounded-2xl active:scale-95 transition-all shadow-lg">
            <i data-lucide="file-text" class="w-5 h-5"></i>
            <span class="text-xs font-black uppercase tracking-tighter">PDF Completo</span>
        </button>
    `;

    grid.appendChild(areaAcoes);
    lucide.createIcons();
} 

function renderBotaoExcel(grid) {
    const cardExcel = document.createElement('div');
    // Mudei para inline-flex e defini uma largura máxima (w-48)
    cardExcel.className = "bg-emerald-500/10 border border-emerald-500/40 p-2 rounded-xl flex items-center gap-3 cursor-pointer mt-4 active:scale-95 transition-all w-fit px-4 mx-auto";
    cardExcel.innerHTML = `
        <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-900">
            <i data-lucide="file-spreadsheet" class="w-4 h-4"></i>
        </div>
        <span class="font-bold text-emerald-400 text-xs">Planilha Excel</span>
    `;
    cardExcel.onclick = generateExcel;
    grid.appendChild(cardExcel);
}

function renderBotaoPDF(grid) {
    const cardPDF = document.createElement('div');
    // Mesma lógica: w-fit (largura do conteúdo) e px-4 (espaçamento lateral)
    cardPDF.className = "bg-red-500/10 border border-red-500/40 p-2 rounded-xl flex items-center gap-3 cursor-pointer mt-2 active:scale-95 transition-all w-fit px-4 mx-auto";
    cardPDF.innerHTML = `
        <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white">
            <i data-lucide="file-text" class="w-4 h-4"></i>
        </div>
        <span class="font-bold text-red-400 text-xs">Exportar PDF</span>
    `;
    cardPDF.onclick = gerarPDF;
    grid.appendChild(cardPDF);
}

function openItems(cat) {
    if (nivelAtual !== 'submenu') nivelAtual = 'menu';
    
    showScreen('items'); 
    document.getElementById('titulo-categoria').innerText = cat.name;
    
    const lista = document.getElementById('lista-itens');
    lista.innerHTML = ''; 

    cat.items.forEach(pergunta => {
        const div = document.createElement('div');
        div.className = "bg-[#1e293b] p-4 rounded-xl border border-[#334155] mb-4 shadow-sm";
        
        let conteudoInput = "";

        if (pergunta.type === 'file' || pergunta.label.toLowerCase().includes('foto')) {
            conteudoInput = `
                <div class="flex items-center justify-center w-full mt-2">
                    <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#334155] rounded-xl cursor-pointer hover:bg-[#2d3a4f] transition-all bg-[#0f172a]/50">
                        <i data-lucide="camera" class="w-8 h-8 text-orange-400 mb-2"></i>
                        <span class="text-xs text-slate-400 font-medium text-center px-2">Capturar Registro Fotográfico</span>
                        <input type="file" class="hidden" accept="image/*" capture="environment" onchange="mostraPreviewDaFoto(this, '${pergunta.id}')">
                    </label>
                </div>
                <div id="visualizacao-${pergunta.id}" class="mt-3 ${respostas[pergunta.id] ? '' : 'hidden'} p-2 bg-[#0f172a] rounded-lg border border-[#334155]">
                    <img src="${respostas[pergunta.id] || ''}" class="w-full h-auto max-h-60 object-cover rounded-md border-2 border-emerald-500">
                </div>`;
        } 
        else if (pergunta.type === 'select_predio') {
            conteudoInput = `
                <div class="relative mt-2">
                    <select onchange="rascunho['${pergunta.id}'] = this.value" class="w-full bg-[#0f172a] border-2 border-[#3b82f6] rounded-xl p-4 text-slate-100 focus:outline-none appearance-none pr-10 cursor-pointer text-sm font-medium transition-all">
                        <option value="">Selecione o Prédio...</option>
                        <option value="P1/MIXKAR" ${respostas[pergunta.id] === 'P1/MIXKAR' ? 'selected' : ''}>🏢 P1 / MIXKAR</option>
                        <option value="P2/SOUZA" ${respostas[pergunta.id] === 'P2/SOUZA' ? 'selected' : ''}>🏢 P2 / SOUZA</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#3b82f6]">
                        <i data-lucide="building-2" class="w-5 h-5"></i>
                    </div>
                </div>`;
        } 
        else if (pergunta.type === 'select_status' || pergunta.label.toLowerCase().includes('nível') || pergunta.label.toLowerCase().includes('boia')) {
            conteudoInput = `
                <div class="relative mt-2">
                    <select onchange="rascunho['${pergunta.id}'] = this.value" class="w-full bg-[#0f172a] border-2 border-[#f59e0b] rounded-xl p-4 text-slate-100 focus:outline-none appearance-none pr-10 cursor-pointer text-sm font-medium transition-all">
                        <option value="">Selecione o status...</option>
                        <option value="OK" ${respostas[pergunta.id] === 'OK' ? 'selected' : ''}>✅ OK / Normal</option>
                        <option value="Baixo" ${respostas[pergunta.id] === 'Baixo' ? 'selected' : ''}>⚠️ Baixo / Repor</option>
                        <option value="Crítico" ${respostas[pergunta.id] === 'Crítico' ? 'selected' : ''}>🚨 Crítico</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#f59e0b]">
                        <i data-lucide="chevron-down" class="w-5 h-5"></i>
                    </div>
                </div>`;
        }
        else if (pergunta.type === 'currency') {
            conteudoInput = `
                <input type="text" id="${pergunta.id}" value="${respostas[pergunta.id] || ''}" onfocus="aplicarMascaraMoeda(this)" oninput="rascunho['${pergunta.id}'] = this.value" placeholder="R$ 0,00" class="w-full bg-[#0f172a] border border-[#334155] rounded-xl p-4 text-slate-100 mt-2 font-medium">`;
        }
        else {
            conteudoInput = `
                <input type="${pergunta.type || 'text'}" id="${pergunta.id}" value="${respostas[pergunta.id] || ''}" oninput="rascunho['${pergunta.id}'] = this.value" placeholder="Toque para digitar..." class="w-full bg-[#0f172a] border border-[#334155] rounded-xl p-4 text-slate-100 mt-2 font-medium">`;
        }
        
        div.innerHTML = `<p class="text-[11px] font-black text-slate-400 mb-1 uppercase tracking-widest flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>${pergunta.label}</p>${conteudoInput}`;
        lista.appendChild(div);
    });

    const footer = document.createElement('div');
    footer.className = "flex gap-3 mt-8 sticky bottom-0 bg-[#0f172a]/95 py-4 border-t border-[#334155] z-50 justify-center backdrop-blur-sm";
    footer.innerHTML = `
        <button id="btn-voltar-footer" class="flex items-center justify-center w-14 h-14 bg-transparent border-2 border-[#f59e0b] text-[#f59e0b] rounded-2xl active:scale-90 transition-all">
            <i data-lucide="arrow-left" class="w-7 h-7"></i>
        </button>
        <button id="btn-salvar-footer" class="flex-1 flex items-center justify-center h-14 bg-emerald-500 text-slate-900 rounded-2xl active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
            <i data-lucide="save" class="w-7 h-7"></i>
        </button>
        <button id="btn-pdf-footer" class="flex-1 flex items-center justify-center h-14 bg-red-500 text-white rounded-2xl active:scale-95 transition-all shadow-lg shadow-red-500/20">
            <i data-lucide="file-text" class="w-7 h-7"></i>
        </button>
    `;
    lista.appendChild(footer);
    lucide.createIcons();

    document.getElementById('btn-voltar-footer').onclick = () => {
        rascunho = {}; 
        if (cat.parentId === 'manutencao') {
            const catManut = CATEGORIAS.find(c => c.id === 'manutencao');
            openSubmenu(catManut);
        } else {
            showScreen('categories');
            renderCategories();
        }
    };

    document.getElementById('btn-salvar-footer').onclick = function() {
        respostas = { ...respostas, ...rascunho };
        const originalContent = this.innerHTML;
        this.innerHTML = '<i data-lucide="check" class="w-7 h-7"></i>';
        this.classList.replace('bg-emerald-500', 'bg-blue-500');
        lucide.createIcons();
        setTimeout(() => {
            this.innerHTML = originalContent;
            this.classList.replace('bg-blue-500', 'bg-emerald-500');
            lucide.createIcons();
        }, 1500); 
    };

    // AQUI ESTAVA O ERRO: Mudei de 'cat' para 'cat.id' para a função reconhecer o PDF
    document.getElementById('btn-pdf-footer').onclick = () => {
        gerarPDF(cat.id); 
    };
} 

// Função auxiliar para o rodapé (para não poluir a openItems)
function renderRodapeItens(lista) {
    const footer = document.createElement('div');
    footer.className = "flex gap-3 mt-8 sticky bottom-0 bg-[#0f172a]/95 py-4 border-t border-[#334155] z-50 justify-center backdrop-blur-sm";
    footer.innerHTML = `
        <button id="btn-voltar-footer" class="flex items-center justify-center w-14 h-14 bg-transparent border-2 border-[#f59e0b] text-[#f59e0b] rounded-2xl active:scale-90 transition-all">
            <i data-lucide="arrow-left" class="w-7 h-7"></i>
        </button>
        <button id="btn-salvar-footer" class="flex-1 flex items-center justify-center h-14 bg-emerald-500 text-slate-900 rounded-2xl active:scale-95 transition-all shadow-lg shadow-emerald-500/20">
            <i data-lucide="save" class="w-7 h-7"></i>
        </button>
        <button id="btn-pdf-footer" class="flex-1 flex items-center justify-center h-14 bg-red-500 text-white rounded-2xl active:scale-95 transition-all shadow-lg shadow-red-500/20">
            <i data-lucide="file-text" class="w-7 h-7"></i>
        </button>
    `;
    lista.appendChild(footer);

    document.getElementById('btn-voltar-footer').onclick = () => {
        if (nivelAtual === 'submenu') {
            const catManut = CATEGORIAS.find(c => c.id === 'manutencao');
            openSubmenu(catManut);
        } else {
            showScreen('categories');
            renderCategories();
        }
    };
    
    document.getElementById('btn-salvar-footer').onclick = () => alert("Progresso salvo localmente!");
    document.getElementById('btn-pdf-footer').onclick = gerarPDF;
} 

// GERAÇÃO DO EXCEL
async function generateExcel() {
    if (Object.keys(respostas).length <= 1) { // Verifica se só tem o nome do responsável
        return alert("Nenhum dado registrado. Por favor, realize a inspeção antes de exportar.");
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório');

    worksheet.columns = [
        { header: 'ITEM', key: 'item', width: 35 },
        { header: 'RESPOSTA', key: 'valor', width: 45 },
        { header: 'FOTO', key: 'foto', width: 25 }
    ];

    let rowIndex = 2;
    for (const [id, valor] of Object.entries(respostas)) {
        if (!valor) continue;

        if (typeof valor === 'string' && valor.startsWith('data:image')) {
            const imageId = workbook.addImage({
                base64: valor,
                extension: 'png',
            });
            worksheet.getRow(rowIndex).height = 90;
            worksheet.getCell(`A${rowIndex}`).value = id.toUpperCase().replace(/_/g, ' ');
            worksheet.getCell(`B${rowIndex}`).value = "Foto em anexo";
            worksheet.addImage(imageId, {
                tl: { col: 2, row: rowIndex - 1 },
                ext: { width: 110, height: 110 }
            });
        } else {
            worksheet.addRow({ 
                item: id.toUpperCase().replace(/_/g, ' '), 
                valor: valor 
            });
        }
        rowIndex++;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Relatorio_Inspecao.xlsx`;
    a.click();
}

// UTILITÁRIOS: Moeda e Foto
function formatarMoeda(input, idDoCampo) {
    let valor = input.value.replace(/\D/g, "");
    valor = (valor / 100).toFixed(2) + "";
    valor = valor.replace(".", ",");
    valor = valor.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    valor = valor.replace(/(\d)(\d{3}),/g, "$1.$2,");
    input.value = "R$ " + valor;
    respostas[idDoCampo] = input.value; 
}

function mostraPreviewDaFoto(inputDoArquivo, idDoCampo) {
    const areaDeVisualizacao = document.getElementById(`visualizacao-${idDoCampo}`);
    const elementoDaImagem = areaDeVisualizacao.querySelector('img');

    if (inputDoArquivo.files && inputDoArquivo.files[0]) {
        const leitor = new FileReader();
        
        leitor.onload = function(evento) {
            // 1. Mostra a foto na tela na hora
            elementoDaImagem.src = evento.target.result;
            areaDeVisualizacao.classList.remove('hidden');
            
            // 2. SALVA A IMAGEM (Isso aqui é o que faz subir pro PDF/Excel)
            respostas[idDoCampo] = evento.target.result; 
            console.log(`Foto salva no campo: ${idDoCampo}`); // Para teste
        };
        
        leitor.readAsDataURL(inputDoArquivo.files[0]);
    }
} 

function openSubmenu(cat) {
    nivelAtual = 'submenu';
    showScreen('items'); 
    document.getElementById('titulo-categoria').innerText = cat.name;
    
    const lista = document.getElementById('lista-itens');
    lista.innerHTML = ''; 

    // Renderiza Elétrica, Hidráulica, etc.
    cat.subItems.forEach(sub => {
        const card = document.createElement('div');
        card.className = "bg-[#1e293b] border border-[#334155] p-4 rounded-2xl flex items-center gap-4 cursor-pointer mb-3 active:scale-95 transition-all";
        card.innerHTML = `
            <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/20 text-blue-400">
                <i data-lucide="wrench" class="w-5 h-5"></i>
            </div>
            <div class="flex-1">
                <h3 class="font-bold text-slate-100 text-sm">${sub.name}</h3>
            </div>
        `;
        card.onclick = () => {
            // Se for uma subcategoria de manutenção, abre os campos específicos dela
            openManutencaoEspecifica(sub);
        };
        lista.appendChild(card);
    });

    // Rodapé para voltar ao MENU PRINCIPAL
    const footer = document.createElement('div');
    footer.className = "flex flex-col items-center gap-2 mt-8 sticky bottom-0 bg-[#0f172a]/95 py-4 border-t border-[#334155] z-50 backdrop-blur-sm";
    footer.innerHTML = `
        <button id="btn-voltar-principal" class="flex items-center justify-center w-12 h-12 bg-transparent border-2 border-[#f59e0b] text-[#f59e0b] rounded-xl active:scale-95 transition-all">
            <i data-lucide="arrow-left" class="w-6 h-6"></i>
        </button>
        <span class="text-slate-500 text-[10px] font-bold uppercase">Voltar ao Menu Principal</span>
    `;
    lista.appendChild(footer);
    lucide.createIcons();
    
    document.getElementById('btn-voltar-principal').onclick = () => {
        showScreen('categories');
        renderCategories();
    };
}

function openManutencaoEspecifica(sub) {
    nivelAtual = 'itens-manutencao'; 
    document.getElementById('titulo-categoria').innerText = sub.name;
    
    const campos = [
        { id: `${sub.id}_produto`, label: 'Equipamento / Produto', type: 'text' },
        { id: `${sub.id}_desc`, label: 'Descrição do Serviço', type: 'text' },
        // NOVO CAMPO ADICIONADO ABAIXO:
        { id: `${sub.id}_obs`, label: 'Observações / Pendências', type: 'text' }, 
        { id: `${sub.id}_foto_1`, label: 'Foto (Antes)', type: 'file' },
        { id: `${sub.id}_foto_2`, label: 'Foto (Depois)', type: 'file' }
    ];

    // Mantém a lógica do parentId que já resolvemos para o botão voltar
    openItems({ 
        id: sub.id, 
        name: sub.name, 
        items: campos, 
        parentId: 'manutencao' 
    });
}

// Exemplo para o PDF (faça igual no Excel)
function renderBotaoPDF(grid) {
    const cardPDF = document.createElement('div');
    cardPDF.className = "bg-red-500/10 border border-red-500/40 p-2 rounded-xl flex items-center gap-3 cursor-pointer mt-2 active:scale-95 transition-all w-full max-w-[250px] mx-auto";
    cardPDF.innerHTML = `
        <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white">
            <i data-lucide="file-text" class="w-4 h-4"></i>
        </div>
        <span class="font-bold text-red-400 text-xs">Exportar PDF</span>
    `;
    cardPDF.onclick = gerarPDF;
    grid.appendChild(cardPDF);
}

function gerarPDF(categoriaId) {
    // Busca a categoria correta para saber o nome dela
    const categoria = CATEGORIAS.find(c => c.id === categoriaId) || { name: "Relatório", items: [] };
    
    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.width = '700px'; 
    element.style.background = 'white';
    element.style.color = 'black';

    const dataAtual = new Date().toLocaleDateString();
    const responsavel = respostas['responsavel'] || "Não informado";

    // MONTAGEM DO LAYOUT IGUAL AO DO JOÃO (AZUL ESCURO)
    let html = `
        <div style="border: 2px solid #1e293b; border-radius: 8px; overflow: hidden; font-family: Arial, sans-serif;">
            <div style="background: #1e293b; color: white; padding: 15px; text-align: center;">
                <h1 style="margin: 0; font-size: 20px; text-transform: uppercase;">Relatório de Inspeção</h1>
                <p style="margin: 5px 0; font-size: 16px;">CATEGORIA: ${categoria.name.toUpperCase()}</p>
                <p style="margin: 0; font-size: 12px;">Responsável: ${responsavel} | Data: ${dataAtual}</p>
            </div>
            <div style="padding: 20px;">
    `;

    // LÓGICA PARA PEGAR TEXTOS E FOTOS
    // Percorremos os itens que pertencem a essa categoria específica
    const itensDaCategoria = categoria.items || [];
    
    itensDaCategoria.forEach(item => {
        const valor = respostas[item.id];
        if (valor) {
            if (item.type !== 'file' && !valor.startsWith('data:image')) {
                // Se for texto, coloca na linha com a label cinza
                html += `
                    <div style="margin-bottom: 12px; display: flex; border-bottom: 1px solid #eee; padding: 8px 0; align-items: center;">
                        <div style="width: 250px; font-weight: bold; color: #64748b; font-size: 11px; text-transform: uppercase;">${item.label}:</div>
                        <div style="flex: 1; font-size: 14px; color: #000;">${valor}</div>
                    </div>`;
            } else {
                // Se for foto, coloca a imagem grande
                html += `
                    <div style="margin-top: 15px; margin-bottom: 20px;">
                        <p style="font-weight: bold; color: #64748b; font-size: 11px; text-transform: uppercase; margin-bottom: 8px;">${item.label}:</p>
                        <img src="${valor}" style="width: 100%; max-width: 500px; border-radius: 8px; border: 1px solid #ddd; display: block;">
                    </div>`;
            }
        }
    });

    // FECHAMENTO DO HTML
    html += `</div></div>`;
    element.innerHTML = html;
    document.body.appendChild(element);

    const opt = {
        margin: 10,
        filename: `Relatorio_${categoria.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // GERA O BLOB E ABRE O COMPARTILHAMENTO
    html2pdf().set(opt).from(element).outputPdf('blob').then(async (pdfBlob) => {
        const nomeArquivo = `Relatorio_${categoria.id}_${dataAtual.replace(/\//g, '-')}.pdf`;
        const file = new File([pdfBlob], nomeArquivo, { type: 'application/pdf' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: 'Relatório de Inspeção' }).catch(() => {});
        } else {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = nomeArquivo;
            link.click();
        }
        document.body.removeChild(element);
    });
}

async function gerarPDFGeral() {
    const element = document.createElement('div');
    element.style.width = '700px';
    element.style.background = 'white';
    element.style.fontFamily = 'Arial, sans-serif';

    const dataAtual = new Date().toLocaleDateString();
    const responsavel = respostas['responsavel'] || "Não informado";

    // Cabeçalho Principal (Azul Escuro)
    let html = `
        <div style="background: #1e293b; color: white; padding: 25px; text-align: center;">
            <h1 style="margin: 0; font-size: 22px; text-transform: uppercase;">Relatório de Inspeção Completo</h1>
            <p style="margin: 10px 0 0; font-size: 14px;">Responsável: ${responsavel} | Data: ${dataAtual}</p>
        </div>
        <div style="padding: 20px;">
    `;

    CATEGORIAS.forEach(cat => {
        // Filtra apenas o que tem resposta para não sair folha em branco
        const itensComResposta = (cat.items || []).filter(item => respostas[item.id]);

        if (itensComResposta.length > 0) {
            html += `
                <div style="margin-top: 25px; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; page-break-inside: avoid;">
                    <div style="background: #f1f5f9; padding: 10px 20px; border-bottom: 2px solid #1e293b;">
                        <h2 style="margin: 0; font-size: 14px; color: #1e293b; text-transform: uppercase;">${cat.name}</h2>
                    </div>
                    <div style="padding: 15px;">
            `;

            itensComResposta.forEach(item => {
                const valor = respostas[item.id];
                
                if (valor && valor.toString().startsWith('data:image')) {
                    // FOTO (Garantindo que apareça inteira)
                    html += `
                        <div style="margin-bottom: 20px;">
                            <p style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">${item.label}:</p>
                            <img src="${valor}" style="width: 100%; max-height: 400px; object-fit: contain; border-radius: 5px; border: 1px solid #eee;">
                        </div>`;
                } else if (valor) {
                    // TEXTO (Alinhado e com R$ se houver)
                    html += `
                        <div style="display: flex; border-bottom: 1px solid #f1f5f9; padding: 8px 0; align-items: center;">
                            <div style="width: 250px; font-weight: bold; color: #64748b; font-size: 10px; text-transform: uppercase;">${item.label}:</div>
                            <div style="flex: 1; font-size: 13px; color: #000; font-weight: 500;">${valor}</div>
                        </div>`;
                }
            });

            html += `</div></div>`;
        }
    });

    html += `</div>`;
    element.innerHTML = html;
    document.body.appendChild(element);

    const opt = {
        margin: 10,
        filename: `Relatorio_Completo_${dataAtual.replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // --- AQUI É ONDE A MÁGICA DO COMPARTILHAMENTO ACONTECE ---
    html2pdf().set(opt).from(element).outputPdf('blob').then(async (pdfBlob) => {
        const nomeArquivo = `Relatorio_Completo_${dataAtual.replace(/\//g, '-')}.pdf`;
        const file = new File([pdfBlob], nomeArquivo, { type: 'application/pdf' });

        // Tenta abrir a tela de compartilhar do celular/PC
        if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'Relatório Completo',
                text: 'Segue o relatório de inspeção completo.'
            }).catch((err) => console.log("Usuário cancelou ou erro:", err));
        } else {
            // Se o navegador não suportar compartilhar (tipo PC antigo), ele baixa normal
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = nomeArquivo;
            link.click();
        }
        document.body.removeChild(element);
    });
}  

function aplicarMascaraMoeda(input) {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = (value / 100).toLocaleString('pt-BR', {
            style: 'currency', 
            currency: 'BRL'
        });
        e.target.value = value;
        rascunho[input.id] = value; // Salva com o R$ no rascunho
    });
}  