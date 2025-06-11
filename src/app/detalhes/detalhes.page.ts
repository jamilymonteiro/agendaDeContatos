import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AlertController, NavController, ToastController  } from '@ionic/angular';
import { ContatosFavoritosService } from 'src/app/services/contatos-favoritos.service';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
  standalone: false
})
export class DetalhesPage {
  // Objeto que vai armazenar o contato atual:
  contato: any;
  // Chave usada no Storage para salvar a lista de contatos:
  private chave_storage = 'lista_contatos';

  constructor(
    private router: Router,
    private storage: Storage,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private favoritosService: ContatosFavoritosService,
    private toastCtrl: ToastController
  ) {
    // Verifica se foi passado um contato pela navegação (ao vir da tela anterior):
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['contato']) {
      this.contato = nav.extras.state['contato'];
    }
  }

  // Função para favoritar ou desfavoritar o contato
async favoritarContato() {
  const favoritos = this.favoritosService.getFavoritos();
  const jaFavoritado = favoritos.some(f => f.nome === this.contato.nome);

  if (jaFavoritado) {
    // Se já está na lista de favoritos, mostra alerta
    const alerta = await this.alertCtrl.create({
      header: 'Aviso',
      message: 'Este contato já está favoritado.',
      buttons: ['OK']
    });
    await alerta.present();
  } else {
    // Se não está, adiciona aos favoritos
    await this.favoritosService.adicionarFavorito(this.contato);
    this.contato.favorito = true;

    // Atualiza o status de favorito também no armazenamento local
    const contatos = await this.storage.get(this.chave_storage) || [];
    const index = contatos.findIndex((c: any) => c.nome === this.contato.nome);
    if (index > -1) {
      contatos[index].favorito = true;
      await this.storage.set(this.chave_storage, contatos);
    }

    this.router.navigate(['/tabs/tab2']);
  }
}

  editarContato() {
    this.router.navigate(['/adicionar'], {
      state: { contato: this.contato }
    });
  }

  async excluirContato() {
  const alerta = await this.alertCtrl.create({
    header: 'Confirmar',
    message: 'Tem certeza que deseja excluir este contato?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Excluir',
        handler: async () => {
          // Remove o contato da lista e atualiza o Storage
          const contatos = await this.storage.get(this.chave_storage) || [];
          const atualizados = contatos.filter((c: any) => c.nome !== this.contato.nome);
          await this.storage.set(this.chave_storage, atualizados);

          // Também remove dos favoritos (caso esteja lá)
          await this.favoritosService.removerFavorito(this.contato.nome, false);

          // Mostra o toast de confirmação
          const toast = await this.toastCtrl.create({
            message: 'Contato excluído com sucesso!',
            duration: 2000,
            color: 'danger',
            position: 'bottom'
          });
          await toast.present();

          // Volta para a tela anterior
          this.navCtrl.back();
        }
      }
    ]
  });

  await alerta.present();
}
}
