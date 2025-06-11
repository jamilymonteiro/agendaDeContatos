import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Router, NavigationExtras, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false
})
export class Tab1Page {
  // Lista de contatos agrupados por letra
  contatosAgrupados: { letra: string; contatos: Contato[] }[] = [];
  todosContatos: Contato[] = []; // Lista completa de contatos sem filtro
  termoBusca: string = ''; // Campo utilizado para buscar contatos
  private chave_storage = 'lista_contatos';

  constructor(private storage: Storage, private router: Router) {
    this.iniciarStorage();

    // Detecta quando retorna para a rota /tabs/tab1
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      if (event.urlAfterRedirects === '/tabs/tab1') {
        this.carregarContatos();
      }
    });
  }

  async iniciarStorage() {
    await this.storage.create();
    this.carregarContatos();
  }

  // Evento acionado toda vez que a página vai ser exibida (útil para recarregar dados)
  ionViewWillEnter() {
    this.carregarContatos();
  }

  // Função que busca os contatos no Storage
  async carregarContatos() {
    const contatos: Contato[] = await this.storage.get(this.chave_storage) || [];
    this.todosContatos = contatos; // Salva a lista completa
    this.agrupadosPorLetra(contatos); // Agrupa por letra
  }

  // Filtra os contatos com base no termo digitado
  filtrarContatos() {
    const termo = this.termoBusca.toLowerCase();
    const filtrados = this.todosContatos.filter(c => // Filtra por nome que contenha o termo
      c.nome.toLowerCase().includes(termo)
    );
    this.agrupadosPorLetra(filtrados); // Reagrupa os resultados filtrados
  }

  // Agrupa os contatos por letra inicial do nome
  agrupadosPorLetra(contatos: Contato[]) {
    contatos.sort((a, b) => a.nome.localeCompare(b.nome)); // Ordena os contatos em ordem alfabética

    const agrupados: { [letra: string]: Contato[] } = {};

    // Cria os grupos por letra
    contatos.forEach(contato => {
      const letra = contato.nome.charAt(0).toUpperCase(); // Pega a primeira letra do nome
      if (!agrupados[letra]) {
        agrupados[letra] = []; // Cria o array se ainda não existir
      }
      agrupados[letra].push(contato); // Adiciona o contato ao grupo correspondente
    });

    // Converte o objeto para um array de objetos ordenado
    this.contatosAgrupados = Object.keys(agrupados)
      .sort()
      .map(letra => ({
        letra,
        contatos: agrupados[letra]
      }));
  }

  // Redireciona para a página de detalhes, passando o contato como parâmetro
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
  id!: number;
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
