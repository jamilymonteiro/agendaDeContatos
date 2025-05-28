import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-adicionar',
  templateUrl: './adicionar.page.html',
  styleUrls: ['./adicionar.page.scss'],
  standalone: false,
})
export class AdicionarPage {
  contato: Contato = this.getContatoInicial();
  contatos: Contato[] = [];
  private chave_storage = 'lista_contatos';

  constructor(private router: Router, private storage: Storage) {
    this.iniciarStorage();
    this.carregar();
  }

  getContatoInicial(): Contato {
    return {
      nome: '',
      telefone: '',
      email: '',
      endereco: {
        rua: '',
        numero: '',
        cidade: '',
        estado: '',
        pais: ''
      }
    };
  }

  async iniciarStorage() {
    this.storage = await this.storage.create();
  }

  async carregar() {
    this.contatos = await this.storage.get(this.chave_storage);
  }

  private persistir() {
    this.storage.set(this.chave_storage, this.contatos);
  }

  async salvar() {
  const { nome, telefone, email } = this.contato;
  this.persistir();

  if (!nome || !telefone || !email) {
    alert('Preencha todos os campos obrigatórios!');
    return;
  }

  // Recupera os contatos salvos, ou cria uma lista vazia se não houver nada
  const contatos: any[] = await this.storage.get('lista_contatos') || [];

  contatos.push(this.contato); 
  await this.storage.set('lista_contatos', contatos);

  this.router.navigate(['/tabs/tab1']);
}

  cancelar() {
    this.router.navigate(['/tabs/tab1']);
  }
  
}

class Contato {
  nome!: string;
  telefone!: string;
  email!: string;
  endereco = {
    rua: '',
    numero: '',
    cidade: '',
    estado: '',
    pais: ''
  };
}