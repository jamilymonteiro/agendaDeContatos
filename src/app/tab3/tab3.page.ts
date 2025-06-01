import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';

interface Profile {
  id: number;
  name: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class Tab3Page implements OnInit {
  name: string = '';
  email: string = '';
  phone: string = '';
  currentProfileId: number | null = null; // ID do perfil sendo editado
  profiles: Profile[] = [];

  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Carregar perfis do localStorage
    this.loadProfiles();
    this.clearForm();
  }

  // Carregar perfis
  private loadProfiles() {
    this.profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
  }

  // Salvar perfil
  async saveProfile() {
    // Validações
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{10,15}$/;

    if (!this.name.trim()) {
      await this.showToast('Por favor, insira um nome.');
      return;
    }

    if (this.email.trim() && !emailRegex.test(this.email)) {
      await this.showToast('Por favor, insira um e-mail válido.');
      return;
    }

    if (this.phone.trim() && !phoneRegex.test(this.phone)) {
      await this.showToast('Por favor, insira um telefone válido (10-15 dígitos).');
      return;
    }

    const profile: Profile = {
      id: this.currentProfileId ?? Date.now(), // Novo ID se não estiver editando
      name: this.name,
      email: this.email,
      phone: this.phone
    };

    if (this.currentProfileId) {
      // Editar perfil existente
      const index = this.profiles.findIndex(p => p.id === this.currentProfileId);
      if (index !== -1) {
        this.profiles[index] = profile;
      }
    } else {
      // Adicionar novo perfil
      this.profiles.push(profile);
    }

    localStorage.setItem('profiles', JSON.stringify(this.profiles));
    await this.showToast(`Perfil salvo! Bem-vindo, ${this.name}!`);
    this.clearForm();
  }

  // Listar perfis
  async listProfiles() {
    if (this.profiles.length === 0) {
      await this.showToast('Nenhum perfil cadastrado.');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Perfis Cadastrados',
      inputs: this.profiles.map(profile => ({
        name: 'profile',
        type: 'radio',
        label: `${profile.name} (${profile.email || 'Sem e-mail'})`,
        value: profile.id.toString()
      })),
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Editar',
          handler: (id) => {
            const profile = this.profiles.find(p => p.id === parseInt(id));
            if (profile) {
              this.name = profile.name;
              this.email = profile.email;
              this.phone = profile.phone;
              this.currentProfileId = profile.id;
            }
          }
        },
        {
          text: 'Excluir',
          handler: async (id) => {
            const alert = await this.alertController.create({
              header: 'Confirmar Exclusão',
              message: 'Deseja excluir este perfil?',
              buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                  text: 'Excluir',
                  handler: () => {
                    this.profiles = this.profiles.filter(p => p.id !== parseInt(id));
                    localStorage.setItem('profiles', JSON.stringify(this.profiles));
                    this.clearForm();
                    this.showToast('Perfil excluído com sucesso.');
                  }
                }
              ]
            });
            await alert.present();
          }
        }
      ]
    });
    await alert.present();
  }

  // Excluir perfil atual
  async deleteProfile() {
    if (!this.currentProfileId && !this.name.trim()) {
      await this.showToast('Nenhum perfil selecionado para excluir.');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: 'Deseja excluir o perfil atual?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          handler: () => {
            if (this.currentProfileId) {
              this.profiles = this.profiles.filter(p => p.id !== this.currentProfileId);
              localStorage.setItem('profiles', JSON.stringify(this.profiles));
            }
            this.clearForm();
            this.showToast('Perfil excluído com sucesso.');
          }
        }
      ]
    });
    await alert.present();
  }

  // Limpar formulário
  private clearForm() {
    this.name = '';
    this.email = '';
    this.phone = '';
    this.currentProfileId = null;
  }

  // Exibir toast
  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
}