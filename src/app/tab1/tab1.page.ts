import { Component, OnInit } from '@angular/core';
import { ContatoService } from '../services/contato.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  contatosOriginais: any[] = []; 
  contatosAgrupados: { [letra: string]: any[] } = {}; 
  termoBusca: string = ''; 

  constructor(private contatoService: ContatoService) {}

  async ngOnInit() {
    this.carregarContatos();
  }

  async ionViewWillEnter() {
    this.carregarContatos();
  }

  filtrarContatos() {
  const termo = this.termoBusca.toLowerCase();

  const contatosFiltrados = this.contatosOriginais.filter(contato =>
    contato.nome.toLowerCase().includes(termo)
  );

  this.contatosAgrupados = this.agruparPorLetra(contatosFiltrados);
}

  async carregarContatos() {
    this.contatosOriginais = await this.contatoService.listarContatos();
    this.filtrarContatos();
  }

  alphabetical = (a: any, b: any): number => {
    return a.key.localeCompare(b.key);
  }

  agruparPorLetra(contatos: any[]): { [letra: string]: any[] } {
    const agrupados: { [letra: string]: any[] } = {};

    contatos
      .sort((a, b) => a.nome.localeCompare(b.nome))
      .forEach(contato => {
        const letra = contato.nome.charAt(0).toUpperCase();
        if (!agrupados[letra]) {
          agrupados[letra] = [];
        }
        agrupados[letra].push(contato);
      });

    return agrupados;
  }

}
