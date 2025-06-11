import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { ContatosFavoritosService } from 'src/app/services/contatos-favoritos.service';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
  standalone: false
})
export class DetalhesPage {
  contato: any;
  eFavorito: boolean = false;
  private chave_storage = 'lista_contatos';

  constructor(
    private router: Router,
    private storage: Storage,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private favoritosService: ContatosFavoritosService,
    private toastCtrl: ToastController
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['contato']) {
      this.contato = nav.extras.state['contato'];
      this.eFavorito = this.favoritosService.isFavorito(this.contato.id); // ← usa o ID
    }
  }

  async favoritarContato() {
    if (this.eFavorito) {
      const alerta = await this.alertCtrl.create({
        header: 'Aviso',
        message: 'Este contato já está favoritado.',
        buttons: ['OK']
      });
      await alerta.present();
      return;
    }

    await this.favoritosService.adicionarFavorito(this.contato);
    this.eFavorito = true;

    // Atualiza o Storage geral (se quiser refletir visualmente em outras telas)
    const contatos = await this.storage.get(this.chave_storage) || [];
    const index = contatos.findIndex((c: any) => c.id === this.contato.id);
    if (index > -1) {
      contatos[index].favorito = true;
      await this.storage.set(this.chave_storage, contatos);
    }

    this.router.navigate(['/tabs/tab2']);
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
            const contatos = await this.storage.get(this.chave_storage) || [];
            const atualizados = contatos.filter((c: any) => c.id !== this.contato.id);
            await this.storage.set(this.chave_storage, atualizados);

            // Remove dos favoritos (usando id corretamente)
            await this.favoritosService.removerFavorito(this.contato.id, false);

            const toast = await this.toastCtrl.create({
              message: 'Contato excluído com sucesso!',
              duration: 2000,
              color: 'medium',
              position: 'top'
            });
            await toast.present();

            this.navCtrl.back();
          }
        }
      ]
    });

    await alerta.present();
  }
}
