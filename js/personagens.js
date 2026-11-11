// Regras de negócio dos personagens (CRUD, pesquisa e filtro).
const Personagens = {
  LIMITE: 20,
  cheio() {
    return this.todos().length >= this.LIMITE;
  },
  chave() {
    return 'personagens';
  },
  todos() {
    return Armazenamento.ler(this.chave(), []);
  },
  buscar(id) {
    return this.todos().find(p => p.id === id);
  },
  validar(d) {
    if (!d.classe || !d.especie || !d.antecedente) return 'Escolha a classe, a espécie e o antecedente.';
    if (!d.nome.trim()) return 'Informe o nome do personagem.';
    if (d.idade !== '' && (!Number.isInteger(Number(d.idade)) || Number(d.idade) < 0)) {
      return 'A idade deve ser um número inteiro, zero ou maior.';
    }
    return null;
  },
  salvar(dados) {
    const erro = this.validar(dados);
    if (erro) return { erro };
    const lista = this.todos();
    if (dados.id) {
      const i = lista.findIndex(p => p.id === dados.id);
      if (i < 0) return { erro: 'Personagem não encontrado.' };
      lista[i] = { ...lista[i], ...dados };
    } else {
      if (lista.length >= this.LIMITE) return { erro: `Limite de ${this.LIMITE} personagens atingido. Exclua um para cadastrar outro.` };
      dados.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      lista.push(dados);
    }
    if (!Armazenamento.gravar(this.chave(), lista)) {
      return { erro: 'Não foi possível salvar. O armazenamento está cheio; tente uma foto menor.' };
    }
    return { ok: true };
  },
  excluir(id) {
    return Armazenamento.gravar(this.chave(), this.todos().filter(p => p.id !== id));
  },
  listar({ busca = '', status = '', relacao = '' } = {}) {
    const norm = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return this.todos()
      .filter(p => norm(p.nome).includes(norm(busca.trim())))
      .filter(p => !status || p.status === status)
      .filter(p => !relacao || p.relacao === relacao)
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }
};
