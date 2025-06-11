import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ToastController  } from '@ionic/angular';


@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: false
})
export class Tab3Page {
  perfilForm: FormGroup;
  usuario: any = null;
  mostrarFormulario = false;  // Controla se o formulário de cadastro/edição está visível
  editando = false; // Flag para indicar se está editando um perfil existente

  constructor(
    private fb: FormBuilder,
    private storage: Storage,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.perfilForm = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      foto: [''],
    });
  }

  // Método executado ao inicializar o componente
  async ngOnInit() {
    await this.storage.create();
    const dados = await this.storage.get('perfil'); // Tenta recuperar perfil salvo
    if (dados) {
      this.usuario = dados; // Se encontrar, carrega o perfil
    }
  }

  // Método chamado ao selecionar uma foto no input do formulário
  selecionarFoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Atualiza o valor do campo 'foto' no formulário com a imagem em base64
        this.perfilForm.patchValue({ foto: reader.result });
      };
      reader.readAsDataURL(file); // Lê o arquivo como URL de dados
    }
  }

  // Método para salvar o perfil (cadastro ou edição)
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

  // Exibe o toast de sucesso
  const toast = await this.toastController.create({
  message: 'Perfil salvo com sucesso!',
  duration: 2000,
  color: 'success',
  position: 'bottom'
});
  await toast.present();
}

  cancelar() {
    this.mostrarFormulario = false;
    this.editando = false;
    this.perfilForm.reset();
  }

  // Método para entrar no modo edição, carregando os dados no formulário
  editar() {
    if (!this.usuario) return; // Se não tiver perfil, não faz nada

    this.editando = true;
    this.mostrarFormulario = true;

    this.perfilForm.patchValue({
      nome: this.usuario.nome || '',
      telefone: this.usuario.telefone || '',
      email: this.usuario.email || '',
      foto: this.usuario.foto || '',
    });
  }

  // Método para excluir o perfil após confirmação do usuário
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

          // Exibe o toast de confirmação
          const toast = await this.toastController.create({
            message: 'Perfil excluído com sucesso!',
            duration: 2000,
            color: 'danger',
            position: 'bottom'
          });
          await toast.present();
        }
      }
    ]
  });

  await alerta.present();
} 
}
