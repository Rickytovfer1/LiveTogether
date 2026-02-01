import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {HeaderVecinoComponent} from "../header-vecino/header-vecino.component";
import {ChatComponent} from "../chat/chat.component";
import {ListaVecinosComponent} from "../lista-vecinos/lista-vecinos.component";
import {VecinoUsuarioDTO} from "../modelos/VecinoUsuarioDTO";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-nav-lateral-derecho-vecino',
    templateUrl: './nav-lateral-derecho-vecino.component.html',
    styleUrls: ['./nav-lateral-derecho-vecino.component.scss'],
    standalone: true,
  imports: [
    IonicModule,
    HeaderVecinoComponent,
    ChatComponent,
    ListaVecinosComponent,
    NgIf
  ]
})
export class NavLateralDerechoVecinoComponent  implements OnInit {
  chatAbierto = false;
  vecinoSeleccionado!: VecinoUsuarioDTO;
  constructor() { }

  ngOnInit() {}

  abrirChat(vecino: VecinoUsuarioDTO) {
    this.vecinoSeleccionado = vecino;
    this.chatAbierto = true;
  }

  cerrarChat() {
    this.chatAbierto = false;
  }

}
