
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContatosFavoritosService {
  private favoritosSubject = new BehaviorSubject<any[]>([]);
  favoritos$ = this.favoritosSubject.asObservable();

  constructor() {}

  adicionarFavorito(contato: any) {
    const favoritosAtuais = this.favoritosSubject.value;
    if (!favoritosAtuais.some(f => f.nome === contato.nome)) {
      this.favoritosSubject.next([...favoritosAtuais, contato]);
    }
  }

  removerFavorito(nome: string) {
    const favoritosAtuais = this.favoritosSubject.value;
    this.favoritosSubject.next(favoritosAtuais.filter(f => f.nome !== nome));
  }

  getFavoritos() {
    return this.favoritosSubject.value;
  }
}