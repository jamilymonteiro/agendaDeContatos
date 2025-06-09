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
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.atualizarPerfil();
      }
    });
  }

  async ngOnInit() {
    await this.storage.create();
    this.usuario = await this.storage.get('perfil');
  }

  async atualizarPerfil() {
    this.usuario = await this.storage.get('perfil');
  }

  abrirPerfil() {
    this.navCtrl.navigateRoot(['/tabs/tab3'], {
      queryParams: { editar: true }
    });
  }
}
