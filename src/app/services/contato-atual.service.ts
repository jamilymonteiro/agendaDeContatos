import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContatoAtualService {
  private contato: any;

  setContato(contato: any) {
    this.contato = contato;
  }

  getContato() {
    return this.contato;
  }

  limparContato() {
    this.contato = null;
  }
}
