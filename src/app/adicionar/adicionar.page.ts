import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adicionar',
  templateUrl: './adicionar.page.html',
  styleUrls: ['./adicionar.page.scss'],
  standalone: false,
})
export class AdicionarPage {

  constructor(private router: Router) { }

  cancelar() {
    this.router.navigate(['/tabs/tab1']);
  }

}
