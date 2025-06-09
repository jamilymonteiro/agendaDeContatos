import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: false
})
export class Tab3Page {
  perfilForm: FormGroup;
  usuario: any = null;
  mostrarFormulario = false;
  editando = false;

  constructor(
    private fb: FormBuilder,
    private storage: Storage,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.perfilForm = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      foto: [''],
    });
  }

  async ngOnInit() {
    await this.storage.create();
    const dados = await this.storage.get('perfil');
    if (dados) {
      this.usuario = dados;
    }

    // Verifica se a URL tem ?editar=true
    this.route.queryParams.subscribe(params => {
      if (params['editar']) {
        this.editar();
      }
    });
  }

  selecionarFoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.perfilForm.patchValue({ foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  async salvarPerfil() {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    const perfilSalvo = this.perfilForm.value;
    await this.storage.set('perfil', perfilSalvo);
    this.usuario = perfilSalvo;
    this.mostrarFormulario = false;
    this.editando = false;
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.editando = false;
    this.perfilForm.reset();
  }

  editar() {
    if (!this.usuario) return;

    this.editando = true;
    this.mostrarFormulario = true;

    this.perfilForm.patchValue({
      nome: this.usuario.nome || '',
      telefone: this.usuario.telefone || '',
      email: this.usuario.email || '',
      foto: this.usuario.foto || '',
    });
  }

  async excluir() {
  const alerta = await this.alertController.create({
    header: 'Confirmar',
    message: 'Tem certeza que deseja excluir o perfil?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Excluir',
        handler: async () => {
          await this.storage.remove('perfil');
          this.usuario = null;
          this.perfilForm.reset();
          this.mostrarFormulario = false;
          this.editando = false;
        }
      }
    ]
  });

  await alerta.present();
} 
}
