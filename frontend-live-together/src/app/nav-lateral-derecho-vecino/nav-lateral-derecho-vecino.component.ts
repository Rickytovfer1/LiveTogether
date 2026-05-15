import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {HeaderVecinoComponent} from "../header-vecino/header-vecino.component";
import {ChatComponent} from "../chat/chat.component";
import {ListaVecinosComponent} from "../lista-vecinos/lista-vecinos.component";
import {VecinoUsuarioDTO} from "../modelos/VecinoUsuarioDTO";
import {NgIf} from "@angular/common";
import {NotificacionesComponent} from "../notificaciones/notificaciones.component";

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
    NotificacionesComponent
  ]
})
export class NavLateralDerechoVecinoComponent  implements OnInit {
  lateralActivo: 'vecinos' | 'chat' | 'notificaciones' = 'vecinos';
  vecinoSeleccionado?: VecinoUsuarioDTO;

  constructor() { }

  ngOnInit() {}

  abrirChat(vecino: VecinoUsuarioDTO) {
    this.vecinoSeleccionado = vecino;
    this.lateralActivo = 'chat';
  }

  cerrarChat() {
    this.lateralActivo = 'vecinos';
    this.vecinoSeleccionado = undefined;
  }

  mostrarNotificaciones() {
    this.lateralActivo = 'notificaciones';
  }

  mostrarListaVecinos() {
    console.log('Evento chat recibido: mostrar lista vecinos');
    this.lateralActivo = 'vecinos';
  }


}
