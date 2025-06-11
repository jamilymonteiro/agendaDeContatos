import { Component, OnInit } from '@angular/core';
import { ContatosFavoritosService } from 'src/app/services/contatos-favoritos.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: false  // ← Importante!
})
export class Tab2Page implements OnInit {
  favoritos: any[] = [];

  constructor(private favoritosService: ContatosFavoritosService,
     private router: Router,
     private toastController: ToastController) {} // Serviço para gerenciar contatos favoritos

  ngOnInit() {
    this.favoritosService.favoritos$.subscribe(lista => {
      this.favoritos = lista.sort((a, b) => a.nome.localeCompare(b.nome));
    });
  }

  // Navega para a página de detalhes do contato selecionado, passando o contato pelo estado da navegação
  abrirDetalhes(contato: any) {
    this.router.navigate(['/detalhes'], {
      state: { contato }
    });
  }

  // Chama o serviço para remover um contato da lista de favoritos pelo nome
  removerFavorito(id: number) {
    this.favoritosService.removerFavorito(id);
  }
    async exibirToast(mensagem: string) {
      const toast = await this.toastController.create({
        message: mensagem,
        duration: 2000,
        position: 'top',
        color: 'medium' 
      });
      toast.present();
    }
  }

