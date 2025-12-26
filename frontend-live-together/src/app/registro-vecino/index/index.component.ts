import { Component, OnInit } from '@angular/core';
import {Platform} from "@ionic/angular";
import {NgIf} from "@angular/common";
import {IonContent} from "@ionic/angular/standalone";
import {ConfigPerfilVecinoComponent} from "../config-perfil-vecino/config-perfil-vecino.component";
import {RegistroComponent} from "../registro/registro.component";
import {TodoRegistroComponent} from "../todo-registro/todo-registro.component";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    IonContent,
    ConfigPerfilVecinoComponent,
    RegistroComponent,
    TodoRegistroComponent
  ]
})
export class IndexComponent  implements OnInit {
  isDesktop: boolean = false;
  constructor(private platform: Platform) {}

  ngOnInit() {
    this.isDesktop = this.platform.width() >= 992;
  }

}
