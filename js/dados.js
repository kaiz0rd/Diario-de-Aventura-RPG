// Opções do criador de personagem (sistema D&D 5E, nomes do SRD 5.2).
// Pessoal, pra mudar as perguntas ou opções, basta editar o nome somente neste arquivo.
const Dados = {
  classes: [
    { nome: 'Bárbaro', info: 'd12 · Força' }, { nome: 'Bardo', info: 'd8 · Carisma' },
    { nome: 'Bruxo', info: 'd8 · Carisma' }, { nome: 'Clérigo', info: 'd8 · Sabedoria' },
    { nome: 'Druida', info: 'd8 · Sabedoria' }, { nome: 'Feiticeiro', info: 'd6 · Carisma' },
    { nome: 'Guardião', info: 'd10 · Destreza e Sabedoria' }, { nome: 'Guerreiro', info: 'd10 · Força ou Destreza' },
    { nome: 'Ladino', info: 'd8 · Destreza' }, { nome: 'Mago', info: 'd6 · Inteligência' },
    { nome: 'Monge', info: 'd8 · Destreza e Sabedoria' }, { nome: 'Paladino', info: 'd10 · Força e Carisma' }
  ],
  especies: ['Anão', 'Elfo', 'Gnomo', 'Humano', 'Orc', 'Halfling', 'Outro']
    .map(nome => ({ nome, info: '' })),
  antecedentes: [
    ['Acólito', 'Iniciado em Magia'], ['Andarilho', 'Sortudo'], ['Artesão', 'Artifista'], ['Artista', 'Músico'],
    ['Charlatão', 'Habilidoso'], ['Criminoso', 'Alerta'], ['Eremita', 'Curandeiro'], ['Escriba', 'Habilidoso'],
    ['Fazendeiro', 'Vigoroso'], ['Guarda', 'Alerta'], ['Guia', 'Iniciado em Magia'], ['Marinheiro', 'Valentão de Taverna'],
    ['Mercador', 'Sortudo'], ['Nobre', 'Habilidoso'], ['Sábio', 'Iniciado em Magia'], ['Soldado', 'Atacante Selvagem']
  ].map(([nome, info]) => ({ nome, info }))
};
