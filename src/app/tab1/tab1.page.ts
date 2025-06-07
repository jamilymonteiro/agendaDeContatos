import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false
})
export class Tab1Page {
  contatosAgrupados: { letra: string; contatos: Contato[] }[] = [];
  todosContatos: Contato[] = [];
  termoBusca: string = '';
  private chave_storage = 'lista_contatos';

  constructor(private storage: Storage, private router: Router) {
    this.iniciarStorage();
  }

  async iniciarStorage() {
    await this.storage.create();
    this.carregarContatos();
  }

  ionViewWillEnter() {
    this.carregarContatos();
  }

  async carregarContatos() {
    const contatos: Contato[] = await this.storage.get(this.chave_storage) || [];
    this.todosContatos = contatos;
    this.agrupadosPorLetra(contatos);
  }

  filtrarContatos() {
    const termo = this.termoBusca.toLowerCase();
    const filtrados = this.todosContatos.filter(c =>
      c.nome.toLowerCase().includes(termo)
    );
    this.agrupadosPorLetra(filtrados);
  }

  agrupadosPorLetra(contatos: Contato[]) {
    contatos.sort((a, b) => a.nome.localeCompare(b.nome));

    const agrupados: { [letra: string]: Contato[] } = {};

    contatos.forEach(contato => {
      const letra = contato.nome.charAt(0).toUpperCase();
      if (!agrupados[letra]) {
        agrupados[letra] = [];
      }
      agrupados[letra].push(contato);
    });

    this.contatosAgrupados = Object.keys(agrupados)
      .sort()
      .map(letra => ({
        letra,
        contatos: agrupados[letra]
      }));
  }

  verDetalhes(contato: Contato) {
    const navigationExtras: NavigationExtras = {
      state: {
        contato: contato
      }
    };
    
    this.router.navigate(['/detalhes'], navigationExtras);

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
