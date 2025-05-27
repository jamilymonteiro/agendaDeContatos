import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContatoService } from '../services/contato.service';

@Component({
  selector: 'app-adicionar',
  templateUrl: './adicionar.page.html',
  styleUrls: ['./adicionar.page.scss'],
  standalone: false,
})

export class AdicionarPage {
  contato: any = this.getContatoInicial();

  constructor(private contatoService: ContatoService, private router: Router) {}

  getContatoInicial() {
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

  ionViewWillEnter() {
    this.contato = this.getContatoInicial();
  }

  async salvar() {
    const { nome, telefone, email } = this.contato;

    if (!nome || !telefone || !email) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    await this.contatoService.salvarContato(this.contato);
    this.router.navigate(['/tabs/tab1']);
  }

  cancelar() {
    this.router.navigate(['/tabs/tab1']);
  }
}