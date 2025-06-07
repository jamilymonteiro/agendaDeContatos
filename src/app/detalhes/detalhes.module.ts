import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { DetalhesPageRoutingModule } from './detalhes-routing.module';
import { DetalhesPage } from './detalhes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalhesPageRoutingModule
  ],
  declarations: [DetalhesPage]
})
export class DetalhesPageModule {}
