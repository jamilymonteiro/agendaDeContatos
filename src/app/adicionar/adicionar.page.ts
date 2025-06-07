import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-adicionar',
  templateUrl: './adicionar.page.html',
  styleUrls: ['./adicionar.page.scss'],
  standalone: false
})
export class AdicionarPage {
  perfilForm: FormGroup;
  private chave_storage = 'lista_contatos';
  contatoOriginal: any = null;

  constructor(
    private router: Router,
    private storage: Storage,
    private fb: FormBuilder
  ) {
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

    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['contato']) {
      this.contatoOriginal = nav.extras.state['contato'];
      this.preencherFormulario(this.contatoOriginal);
    }
  }

  async iniciarStorage() {
    await this.storage.create();
  }

  preencherFormulario(contato: any) {
    this.perfilForm.patchValue(contato);
  }

  async salvar() {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    const contatoEditado = this.perfilForm.value;
    let contatos: any[] = await this.storage.get(this.chave_storage) || [];

    if (this.contatoOriginal) {
    
      const index = contatos.findIndex(c => c.nome === this.contatoOriginal.nome);
      if (index > -1) {
        contatos[index] = contatoEditado;
      }
    } else {
      
      contatos.push(contatoEditado);
    }

    await this.storage.set(this.chave_storage, contatos);
    this.perfilForm.reset();
    this.router.navigate(['/tabs/tab1']);
  }

  cancelar() {
    this.router.navigate(['/tabs/tab1']);
  }

  get enderecoFormGroup(): FormGroup {
    return this.perfilForm.get('endereco') as FormGroup;
  }
}
