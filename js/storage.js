// Camada de acesso ao LocalStorage: todo o resto do app passa por aqui.
const Armazenamento = {
  ler(chave, padrao) {
    try {
      const valor = localStorage.getItem(chave);
      return valor ? JSON.parse(valor) : padrao;
    } catch {
      return padrao; // dado corrompido ou storage indisponível
    }
  },
  gravar(chave, valor) {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
      return true;
    } catch {
      return false; // por exemplo, armazenamento cheio
    }
  }
};
