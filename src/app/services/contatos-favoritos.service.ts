import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ContatosFavoritosService {
  private favoritosSubject = new BehaviorSubject<any[]>([]);
  favoritos$ = this.favoritosSubject.asObservable();
  private chave = 'contatos_favoritos';

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    await this.storage.create();
    const salvos = await this.storage.get(this.chave);
    this.favoritosSubject.next(salvos || []);
  }

  async adicionarFavorito(contato: any) {
    const favoritosAtuais = this.favoritosSubject.value;
    if (!favoritosAtuais.some(f => f.nome === contato.nome)) {
      const atualizados = [...favoritosAtuais, contato];
      this.favoritosSubject.next(atualizados);
      await this.storage.set(this.chave, atualizados);
    }
  }

  async removerFavorito(nome: string) {
    const favoritosAtuais = this.favoritosSubject.value;
    const atualizados = favoritosAtuais.filter(f => f.nome !== nome);
    this.favoritosSubject.next(atualizados);
    await this.storage.set(this.chave, atualizados);
  }

  getFavoritos() {
    return this.favoritosSubject.value;
  }
}
