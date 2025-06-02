import { Component, OnInit } from '@angular/core';
import { ContatosFavoritosService } from 'src/app/services/contatos-favoritos.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: false  // ← Importante!
})
export class Tab2Page implements OnInit {
  favoritos: any[] = [];

  constructor(private favoritosService: ContatosFavoritosService) {}

  ngOnInit() {
    this.favoritosService.favoritos$.subscribe((favoritos: any[]) => {
      this.favoritos = favoritos;
    });
  }

  removerFavorito(nome: string) {
    this.favoritosService.removerFavorito(nome);
  }
}