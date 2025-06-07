import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AlertController, NavController } from '@ionic/angular';
import { ContatosFavoritosService } from 'src/app/services/contatos-favoritos.service';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
  standalone: false
})
export class DetalhesPage {
  contato: any;
  private chave_storage = 'lista_contatos';

  constructor(
    private router: Router,
    private storage: Storage,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private favoritosService: ContatosFavoritosService
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['contato']) {
      this.contato = nav.extras.state['contato'];
    }
  }

  async favoritarContato() {
    if (this.contato.favorito) {
      await this.favoritosService.removerFavorito(this.contato.nome);
      this.contato.favorito = false;
    } else {
      await this.favoritosService.adicionarFavorito(this.contato);
      this.contato.favorito = true;

      
      this.router.navigate(['/tabs/tab2']);
    }

    
    const contatos = await this.storage.get(this.chave_storage) || [];
    const index = contatos.findIndex((c: any) => c.nome === this.contato.nome);
    if (index > -1) {
      contatos[index].favorito = this.contato.favorito;
      await this.storage.set(this.chave_storage, contatos);
    }
  }

  editarContato() {
    this.router.navigate(['/tabs/adicionar'], {
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
            const atualizados = contatos.filter((c: any) => c.nome !== this.contato.nome);
            await this.storage.set(this.chave_storage, atualizados);
            this.navCtrl.back();
          }
        }
      ]
    });

    await alerta.present();
  }
}
