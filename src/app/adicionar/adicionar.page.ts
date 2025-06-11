// Importações para criar o componente, formulário, navegação e armazenamento
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-adicionar',
  templateUrl: './adicionar.page.html',
  styleUrls: ['./adicionar.page.scss'],
  standalone: false
})
export class AdicionarPage {
  // Declaração do formulário principal do contato
  perfilForm: FormGroup;
  // Chave usada para armazenar os dados no Ionic Storage
  private chave_storage = 'lista_contatos';
  // Contato original (usado para edição)
  contatoOriginal: any = null;

  constructor(
    private router: Router,
    private storage: Storage,
    private fb: FormBuilder,
    private toastCtrl: ToastController
  ) {
    // Inicializa o formulário com validações
    this.perfilForm = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      endereco: this.fb.group({
        rua: [''],
        numero: [''],
        cidade: [''],
        estado: [''],
        pais: ['']
      })
    });

    this.iniciarStorage();

    // Verifica se a navegação para esta página trouxe um contato (edição)
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['contato']) {
      this.contatoOriginal = nav.extras.state['contato'];
      this.preencherFormulario(this.contatoOriginal); //Preenche o formulário com os dados do contato existente
    }
  }

  async iniciarStorage() {
    await this.storage.create();
  }

  // Preenche os campos do formulário com os dados do contato recebido
  preencherFormulario(contato: any) {
    this.perfilForm.patchValue(contato);
  }

  // Função chamada ao clicar em "Salvar"
  async salvar() {
    // Verifica se o formulário está inválido
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched(); // Marca todos os campos como tocados para exibir erros
      return;
    }

    const contatoEditado = this.perfilForm.value;
    // Busca a lista atual de contatos no Storage (ou inicia vazia):
    let contatos: any[] = await this.storage.get(this.chave_storage) || [];

    if (this.contatoOriginal) {
      // Edição: encontra o índice do contato original e substitui pelo novo
      const index = contatos.findIndex(c => c.nome === this.contatoOriginal.nome);
      if (index > -1) {
        contatos[index] = contatoEditado;
      }
    } else {
      // Novo contato: adiciona à lista:
      contatos.push(contatoEditado);
    }
    // Salva a lista atualizada no Storage:
    await this.storage.set(this.chave_storage, contatos);

    // Exibe o toast de confirmação
    const toast = await this.toastCtrl.create({
      message: this.contatoOriginal ? 'Contato atualizado com sucesso!' : 'Contato salvo com sucesso!',
      duration: 2000, // duração em ms
      color: 'medium',
      position: 'bottom' // pode ser 'top', 'middle' ou 'bottom'
    });
    await toast.present();

    // Após o toast, limpa o formulário e navega
    this.perfilForm.reset();
    this.router.navigate(['/tabs/tab1']);
  }

  // Função chamada ao clicar em "Cancelar"
  cancelar() {
    this.router.navigate(['/tabs/tab1']);
  }

  
  get enderecoFormGroup(): FormGroup {
    return this.perfilForm.get('endereco') as FormGroup;
  }
}
