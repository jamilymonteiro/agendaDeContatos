import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  async salvarContato(contato: any) {
    let contatos = await this._storage?.get('contatos') || [];
    contatos.push(contato);
    await this._storage?.set('contatos', contatos);
  }

  async listarContatos() {
    return await this._storage?.get('contatos') || [];
  }
}