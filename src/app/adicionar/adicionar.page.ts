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
  }

  async iniciarStorage() {
    this.storage = await this.storage.create();
  }

  async salvar() {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    const contato = this.perfilForm.value;

    const contatos: any[] = await this.storage.get(this.chave_storage) || [];
    contatos.push(contato);

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
