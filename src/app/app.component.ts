import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  usuario: any;

  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    private router: Router
  ) {
    // Escuta eventos de navegação para atualizar o perfil sempre que a rota muda
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.atualizarPerfil();
      }
    });
  }

  // Função de ciclo de vida que roda ao iniciar o app
  async ngOnInit() {
    await this.storage.create();
    this.usuario = await this.storage.get('perfil');
  }

  // Recarrega os dados do perfil do armazenamento
  async atualizarPerfil() {
    this.usuario = await this.storage.get('perfil');
  }

  // Navega para a tela de perfil (tab3) com o parâmetro de edição
  abrirPerfil() {
    this.navCtrl.navigateRoot(['/tabs/tab3'], {
      queryParams: { editar: true }
    });
  }
}
