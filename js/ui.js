// Interface: troca de telas, renderização e eventos.
const $ = seletor => document.querySelector(seletor);
const esc = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const TELAS = ['lista', 'detalhe', 'form'];
let fotoAtual = '';

function mostrar(nome) {
  TELAS.forEach(t => { $('#tela-' + t).hidden = t !== nome; });
  window.scrollTo(0, 0);
}

/* ---------- Lista ---------- */
function irLista() {
  $('#aviso').textContent = '';
  mostrar('lista');
  renderLista();
}

function renderLista() {
  const itens = Personagens.listar({ busca: $('#busca').value, status: $('#f-status').value, relacao: $('#f-relacao').value });
  $('#lista').innerHTML = itens.length ? itens.map(p => `
    <li class="linha" data-id="${esc(p.id)}">
      <button class="link nome" data-acao="ver">${esc(p.nome)}</button>
      <span class="desc">${esc([p.classe, p.especie ?? p.raca].filter(Boolean).join(' · '))}</span>
      <span class="st">${esc(p.status)}</span>
      <span class="rel">${esc(p.relacao)}</span>
      <span class="botoes">
        <button class="icone" data-acao="editar" aria-label="Alterar ${esc(p.nome)}" title="Alterar">&#9998;</button>
        <button class="icone" data-acao="excluir" aria-label="Excluir ${esc(p.nome)}" title="Excluir">&#10005;</button>
      </span>
    </li>`).join('')
    : '<li class="vazio">Nenhum personagem encontrado. Use "Novo Personagem" para cadastrar o primeiro.</li>';
}

['#busca', '#f-status', '#f-relacao'].forEach(s => $(s).addEventListener('input', renderLista));

/* ---------- Detalhe ---------- */
function abrirDetalhe(id) {
  const p = Personagens.buscar(id);
  if (!p) return irLista();
  $('#detalhe-conteudo').dataset.id = p.id;
  $('#detalhe-conteudo').innerHTML = `
    <div class="detalhe-topo">
      <h2>${esc(p.nome)}</h2>
      <span class="botoes">
        <button class="icone" data-acao="editar" aria-label="Alterar" title="Alterar">&#9998;</button>
        <button class="icone" data-acao="excluir" aria-label="Excluir" title="Excluir">&#10005;</button>
      </span>
    </div>
    <div class="grade" style="margin-top:1.5rem">
      <div class="foto">${p.foto ? `<img src="${esc(p.foto)}" alt="Foto de ${esc(p.nome)}">` : '<span>Sem foto</span>'}</div>
      <div>
        <strong class="rotulo">Descrição</strong><p class="desc">${esc(p.descricao) || '—'}</p>
        <div class="dados">
          <div><strong>Status</strong>${esc(p.status)}</div>
          <div><strong>Classe</strong>${esc(p.classe) || '—'}</div>
          <div><strong>Espécie</strong>${esc(p.especie ?? p.raca) || '—'}</div>
          <div><strong>Antecedente</strong>${esc(p.antecedente) || '—'}</div>
          <div><strong>Idade</strong>${p.idade !== '' ? esc(p.idade) + ' anos' : '—'}</div>
          <div><strong>Relação</strong>${esc(p.relacao)}</div>
        </div>
      </div>
    </div>
    <div class="acoes"><button class="btn" data-acao="voltar">Voltar à lista</button></div>`;
  mostrar('detalhe');
}

/* ---------- Cadastro e alteração ---------- */
function mostrarFoto(src) {
  fotoAtual = src || '';
  $('#previa').innerHTML = fotoAtual ? `<img src="${esc(fotoAtual)}" alt="Prévia da foto">` : '<span>Sem foto</span>';
}

let etapa = 0;
let escolha = {};
const CAMPOS = ['classe', 'especie', 'antecedente'];
const NOMES_ETAPAS = ['Classe', 'Espécie', 'Antecedente', 'Detalhes'];

function montarCartoes() {
  CAMPOS.forEach(campo => {
    const lista = Dados[campo === 'especie' ? 'especies' : campo + 's'];
    $('#cartoes-' + campo).innerHTML = lista.map(o => `
      <button type="button" class="cartao-opcao" data-campo="${campo}" data-valor="${esc(o.nome)}" aria-pressed="false">
        <strong>${esc(o.nome)}</strong><small>${esc(o.info)}</small>
      </button>`).join('');
  });
}

function marcarEscolhas() {
  document.querySelectorAll('.cartao-opcao').forEach(b => {
    const ativo = escolha[b.dataset.campo] === b.dataset.valor;
    b.classList.toggle('ativo', ativo);
    b.setAttribute('aria-pressed', ativo);
  });
}

function mostrarEtapa(n) {
  etapa = n;
  document.querySelectorAll('.etapa').forEach(e => { e.hidden = Number(e.dataset.etapa) !== n; });
  $('#etapas').innerHTML = NOMES_ETAPAS.map((nome, i) => `<li class="${i === n ? 'atual' : i < n ? 'feita' : ''}">${i + 1}. ${nome}</li>`).join('');
  $('[data-acao="anterior"]').textContent = n === 0 ? 'Cancelar' : 'Anterior';
  $('[data-acao="proximo"]').hidden = n === 3;
  $('#btn-salvar').hidden = n !== 3;
  $('#erro-form').textContent = '';
}

function proximo() {
  if (etapa < 3 && !escolha[CAMPOS[etapa]]) { $('#erro-form').textContent = 'Escolha uma opção para continuar.'; return; }
  if (etapa < 3) mostrarEtapa(etapa + 1);
}

function anterior() {
  if (etapa === 0) irLista(); else mostrarEtapa(etapa - 1);
}

$('#tela-form').addEventListener('click', e => {
  const b = e.target.closest('.cartao-opcao');
  if (!b) return;
  escolha[b.dataset.campo] = b.dataset.valor;
  marcarEscolhas();
  $('#erro-form').textContent = '';
});

function abrirForm(id) {
  const p = id ? Personagens.buscar(id) : null;
  if (!p && Personagens.cheio()) {
    irLista();
    $('#aviso').textContent = `Limite de ${Personagens.LIMITE} personagens atingido. Exclua um para cadastrar outro.`;
    return;
  }
  const f = $('#form-personagem');
  f.reset();
  f.elements.id.value = p ? p.id : ''; // campo oculto não é limpo pelo reset()
  if (p) ['nome', 'descricao', 'status', 'idade', 'relacao'].forEach(c => { f.elements[c].value = p[c] ?? ''; });
  escolha = p ? { classe: p.classe, especie: p.especie ?? p.raca, antecedente: p.antecedente } : {};
  marcarEscolhas();
  mostrarFoto(p ? p.foto : '');
  $('#titulo-form').textContent = p ? 'Alterar personagem' : 'Novo personagem';
  mostrar('form');
  mostrarEtapa(0);
}

function lerFoto(arquivo) {
  return new Promise(resolver => {
    const leitor = new FileReader();
    leitor.onerror = () => resolver('');
    leitor.onload = () => {
      const img = new Image();
      img.onerror = () => resolver('');
      img.onload = () => {
        const k = Math.min(1, 400 / img.width); // reduz a foto para caber no LocalStorage
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolver(c.toDataURL('image/jpeg', 0.8));
      };
      img.src = leitor.result;
    };
    leitor.readAsDataURL(arquivo);
  });
}

$('#foto').addEventListener('change', async e => {
  const arquivo = e.target.files[0];
  if (!arquivo) return;
  if (!arquivo.type.startsWith('image/')) { $('#erro-form').textContent = 'Escolha um arquivo de imagem.'; return; }
  mostrarFoto(await lerFoto(arquivo));
});

$('#form-personagem').addEventListener('submit', e => {
  e.preventDefault();
  if (etapa < 3) return proximo();
  const d = { ...Object.fromEntries(new FormData(e.target)), ...escolha, foto: fotoAtual };
  const r = Personagens.salvar(d);
  if (r.erro) $('#erro-form').textContent = r.erro; else irLista();
});

/* ---------- Ações e navegação ---------- */
function excluir(id) {
  const p = Personagens.buscar(id);
  if (p && confirm(`Excluir "${p.nome}"? Essa ação não pode ser desfeita.`)) {
    Personagens.excluir(id);
    irLista();
  }
}

document.addEventListener('click', e => {
  const b = e.target.closest('[data-acao]');
  if (!b) return;
  const id = b.closest('[data-id]')?.dataset.id;
  const acoes = {
    ver: () => abrirDetalhe(id), editar: () => abrirForm(id), excluir: () => excluir(id),
    novo: () => abrirForm(), voltar: irLista, anterior, proximo
  };
  (acoes[b.dataset.acao] || (() => {}))();
});

montarCartoes();
irLista();
