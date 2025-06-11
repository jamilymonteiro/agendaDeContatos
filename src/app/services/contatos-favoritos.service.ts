import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular'; // ← Importado aqui

@Injectable({
  providedIn: 'root'
})
export class ContatosFavoritosService {
  private favoritosSubject = new BehaviorSubject<any[]>([]);
  favoritos$ = this.favoritosSubject.asObservable();
  private chave = 'contatos_favoritos';

  constructor(
    private storage: Storage,
    private toastController: ToastController // ← Injetado aqui
  ) {
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
      this.exibirToast(`Contato "${contato.nome}" adicionado aos favoritos.`, 'medium');
    }
  }

  async removerFavorito(nome: string, mostrarToast: boolean = true) {
  const favoritosAtuais = this.favoritosSubject.value;
  const atualizados = favoritosAtuais.filter(f => f.nome !== nome);
  this.favoritosSubject.next(atualizados);
  await this.storage.set(this.chave, atualizados);

  if (mostrarToast) {
    this.exibirToast(`Contato "${nome}" removido dos favoritos.`, 'medium');
  }
}

  getFavoritos() {
    return this.favoritosSubject.value;
  }

  private async exibirToast(mensagem: string, cor: 'success' | 'medium' | 'medium' = 'success') {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      position: 'top',
      color: cor,
      mode: 'ios',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }
}
