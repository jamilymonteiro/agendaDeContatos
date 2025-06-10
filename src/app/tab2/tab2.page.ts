import { Component, OnInit } from '@angular/core';
import { ContatosFavoritosService } from 'src/app/services/contatos-favoritos.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: false  // ← Importante!
})
export class Tab2Page implements OnInit {
  favoritos: any[] = [];

  constructor(private favoritosService: ContatosFavoritosService, private router: Router) {} // Serviço para gerenciar contatos favoritos

  ngOnInit() {
    // Inscreve-se no observable do serviço para receber atualizações da lista de favoritos
    this.favoritosService.favoritos$.subscribe((favoritos: any[]) => {
      this.favoritos = favoritos; // Atualiza a lista local sempre que os favoritos mudam
    });
  }

  // Navega para a página de detalhes do contato selecionado, passando o contato pelo estado da navegação
  abrirDetalhes(contato: any) {
    this.router.navigate(['/detalhes'], {
      state: { contato }
    });
  }

  // Chama o serviço para remover um contato da lista de favoritos pelo nome
  removerFavorito(nome: string) {
    this.favoritosService.removerFavorito(nome);
  }
}