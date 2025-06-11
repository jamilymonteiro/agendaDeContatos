// Importações para criar o componente, formulário, navegação e armazenamento
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
import { ContatosFavoritosService } from '../services/contatos-favoritos.service';


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
    private toastCtrl: ToastController,
    private favoritosService: ContatosFavoritosService
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
  if (this.perfilForm.invalid) {
    this.perfilForm.markAllAsTouched();
    return;
  }

  const contatoEditado = this.perfilForm.value;

  let contatos: any[] = await this.storage.get(this.chave_storage) || [];

  if (this.contatoOriginal) {
    // Edição: atualiza o contato existente pelo ID
    const index = contatos.findIndex(c => c.id === this.contatoOriginal.id);
    if (index > -1) {
      contatoEditado.id = this.contatoOriginal.id; // mantém o ID original
      contatos[index] = contatoEditado;
    }
  } else {
    // Novo contato: gera um ID único
    const novoId = Date.now(); // simples gerador baseado no tempo
    contatoEditado.id = novoId;
    contatos.push(contatoEditado);
  }

  await this.storage.set(this.chave_storage, contatos); // ← SALVA os contatos atualizados

  // Atualizar também nos favoritos se for edição
  if (this.contatoOriginal) {
    const favoritosAtuais = await this.storage.get('contatos_favoritos') || [];
    const indexFavorito = favoritosAtuais.findIndex((f: any) => f.id === this.contatoOriginal.id);
    if (indexFavorito > -1) {
      favoritosAtuais[indexFavorito] = contatoEditado;
      await this.storage.set('contatos_favoritos', favoritosAtuais);
      this.favoritosService.atualizarListaFavoritos(favoritosAtuais); // Atualiza o BehaviorSubject
    }
  }

  // Mensagem e redirecionamento
  const toast = await this.toastCtrl.create({
    message: this.contatoOriginal ? 'Contato atualizado com sucesso!' : 'Contato salvo com sucesso!',
    duration: 2000,
    color: 'medium',
    position: 'top'
  });
  await toast.present();

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
