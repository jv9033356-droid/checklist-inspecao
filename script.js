// 1. DATA: Definição das Categorias
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

    renderBotaoExcel(grid); // Mantém apenas o Excel aqui
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
    // Define se volta para o menu ou para o submenu de manutenção
    if (nivelAtual !== 'submenu') nivelAtual = 'menu';
    
    showScreen('items'); 
    document.getElementById('titulo-categoria').innerText = cat.name;
    
    const lista = document.getElementById('lista-itens');
    lista.innerHTML = ''; 

    // 1. GERADOR DE CAMPOS (O coração do formulário)
    cat.items.forEach(pergunta => {
        const div = document.createElement('div');
        div.className = "bg-[#1e293b] p-4 rounded-xl border border-[#334155] mb-4 shadow-sm";
        
        let conteudoInput = "";

        // REGRA PARA FOTOS
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
        // REGRA PARA SELECT (GERADOR: NÍVEL/BOIA) COM SETINHA E BORDA LARANJA
        else if (pergunta.type === 'select_status' || pergunta.label.toLowerCase().includes('nível') || pergunta.label.toLowerCase().includes('boia')) {
            conteudoInput = `
                <div class="relative mt-2">
                    <select onchange="respostas['${pergunta.id}'] = this.value" class="w-full bg-[#0f172a] border-2 border-[#f59e0b] rounded-xl p-4 text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#f59e0b] appearance-none pr-10 cursor-pointer text-sm font-medium transition-all">
                        <option value="">Selecione...</option>
                        <option value="OK" ${respostas[pergunta.id] === 'OK' ? 'selected' : ''}>✅ OK / Normal</option>
                        <option value="Baixo" ${respostas[pergunta.id] === 'Baixo' ? 'selected' : ''}>⚠️ Baixo / Repor</option>
                        <option value="Crítico" ${respostas[pergunta.id] === 'Crítico' ? 'selected' : ''}>🚨 Crítico</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[#f59e0b]">
                        <i data-lucide="chevron-down" class="w-5 h-5"></i>
                    </div>
                </div>`;
        }
        // REGRA PARA STATUS DE MANUTENÇÃO (BOTÕES OK, MÉDIO, CRÍTICO)
        else if (pergunta.type === 'status') {
            conteudoInput = `
                <div class="grid grid-cols-3 gap-2 mt-2">
                    <button onclick="respostas['${pergunta.id}'] = 'OK'" class="py-3 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold uppercase">OK</button>
                    <button onclick="respostas['${pergunta.id}'] = 'Médio'" class="py-3 rounded-lg bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 text-[10px] font-bold uppercase">Médio</button>
                    <button onclick="respostas['${pergunta.id}'] = 'Crítico'" class="py-3 rounded-lg bg-red-500/10 text-red-500 border border-red-500/30 text-[10px] font-bold uppercase">Crítico</button>
                </div>`;
        }
        // INPUTS NORMAIS (ÁGUA, LUZ, DIESEL)
        else {
            conteudoInput = `
                <input type="${pergunta.type || 'text'}" 
                    value="${respostas[pergunta.id] || ''}"
                    oninput="respostas['${pergunta.id}'] = this.value"
                    placeholder="Toque para digitar..." 
                    class="w-full bg-[#0f172a] border border-[#334155] rounded-xl p-4 text-slate-100 focus:outline-none focus:border-blue-500 mt-2 font-medium">`;
        }
        
        div.innerHTML = `
            <p class="text-[11px] font-black text-slate-400 mb-1 uppercase tracking-widest flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                ${pergunta.label}
            </p>
            ${conteudoInput}`;
        lista.appendChild(div);
    });

    // 2. RODAPÉ COM OS 3 BOTÕES (VOLTAR, SALVAR, PDF)
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

    // 3. LÓGICA DOS BOTÕES
    document.getElementById('btn-voltar-footer').onclick = () => {
        if (nivelAtual === 'submenu') {
            const catManut = CATEGORIAS.find(c => c.id === 'manutencao');
            openSubmenu(catManut);
        } else {
            showScreen('categories');
            renderCategories();
        }
    };

    document.getElementById('btn-salvar-footer').onclick = function() {
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

    document.getElementById('btn-pdf-footer').onclick = () => {
        gerarPDF();
    };
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
        { id: `${sub.id}_foto_1`, label: 'Foto (Antes)', type: 'file' },
        { id: `${sub.id}_foto_2`, label: 'Foto (Depois)', type: 'file' }
    ];
    openItems({ name: sub.name, items: campos });
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

async function gerarPDF() {
    if (Object.keys(respostas).length <= 1) {
        return alert("Preencha os dados primeiro!");
    }

    // O elemento que vamos transformar em PDF
    const divParaPdf = document.createElement('div');
    divParaPdf.innerHTML = `
        <div style="font-family: Arial; padding: 20px; color: #333;">
            <h1 style="color: #f59e0b; border-bottom: 2px solid #f59e0b; text-align: center;">RELATÓRIO DE INSPEÇÃO</h1>
            <p><strong>Responsável:</strong> ${respostas['responsavel']}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleDateString()}</p>
            <hr>
            ${Object.entries(respostas).map(([id, valor]) => {
                if(!valor || id === 'responsavel') return '';
                const titulo = id.toUpperCase().replace(/_/g, ' ');
                if (typeof valor === 'string' && valor.startsWith('data:image')) {
                    return `<div style="margin-top: 15px;"><strong>${titulo}:</strong><br><img src="${valor}" style="width: 100%; border-radius: 8px; margin-top: 5px;"></div>`;
                }
                return `<div style="margin-top: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;"><strong>${titulo}:</strong> ${valor}</div>`;
            }).join('')}
        </div>
    `;

    const opcoes = {
        margin: 10,
        filename: 'Relatorio_Inspecao.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        // Gera o PDF como um BLOB (arquivo em memória)
        const pdfBlob = await html2pdf().set(opcoes).from(divParaPdf).output('blob');
        
        // Cria o arquivo PDF real
        const arquivoPdf = new File([pdfBlob], `Relatorio_${respostas['responsavel']}.pdf`, { type: 'application/pdf' });

        // Tenta abrir a bandeja de compartilhar do WhatsApp/Email
        if (navigator.share && navigator.canShare({ files: [arquivoPdf] })) {
            await navigator.share({
                title: 'Relatório de Inspeção',
                text: 'Segue anexo o relatório em PDF.',
                files: [arquivoPdf]
            });
        } else {
            // Se o navegador no PC não suportar o "Share", ele baixa o PDF direto
            alert("No PC o compartilhamento direto é limitado. O PDF será baixado para você anexar manualmente.");
            html2pdf().set(opcoes).from(divParaPdf).save();
        }
    } catch (erro) {
        console.error(erro);
        alert("Erro ao processar o PDF. Verifique sua conexão com a internet.");
    }
} 