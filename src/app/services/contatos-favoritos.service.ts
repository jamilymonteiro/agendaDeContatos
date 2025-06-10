import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root' // Serviço disponível globalmente na aplicação
})
export class ContatosFavoritosService {
  // BehaviorSubject para manter e emitir a lista de contatos favoritos
  private favoritosSubject = new BehaviorSubject<any[]>([]);
  // Observable público para componentes assinarem as atualizações da lista de favoritos
  favoritos$ = this.favoritosSubject.asObservable();
  // Chave usada para armazenar e recuperar os favoritos do Storage
  private chave = 'contatos_favoritos';

  constructor(private storage: Storage) {
    this.init(); // Inicializa o armazenamento e carrega os favoritos salvos
  }

  // Inicializa o Storage e carrega os favoritos salvos, atualizando o BehaviorSubject
  private async init() {
    await this.storage.create(); // Cria o armazenamento se ainda não criado
    const salvos = await this.storage.get(this.chave); // Recupera os favoritos salvos
    this.favoritosSubject.next(salvos || []); // Atualiza o BehaviorSubject com os dados ou lista vazia
  }

  // Adiciona um contato à lista de favoritos, se ainda não estiver nela
  async adicionarFavorito(contato: any) {
    const favoritosAtuais = this.favoritosSubject.value;
    // Verifica se já existe um favorito com o mesmo nome para evitar duplicação
    if (!favoritosAtuais.some(f => f.nome === contato.nome)) {
      const atualizados = [...favoritosAtuais, contato]; // Cria uma nova lista com o novo favorito
      this.favoritosSubject.next(atualizados); // Atualiza o BehaviorSubject
      await this.storage.set(this.chave, atualizados); // Salva a nova lista no Storage
    }
  }

  // Remove um contato da lista de favoritos pelo nome
  async removerFavorito(nome: string) {
    const favoritosAtuais = this.favoritosSubject.value;
    // Filtra a lista removendo o contato com o nome passado
    const atualizados = favoritosAtuais.filter(f => f.nome !== nome);
    this.favoritosSubject.next(atualizados);
    await this.storage.set(this.chave, atualizados);
  }

  // Retorna o valor atual da lista de favoritos (não é um Observable)
  getFavoritos() {
    return this.favoritosSubject.value;
  }
}
