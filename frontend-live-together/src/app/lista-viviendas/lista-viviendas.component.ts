import { Component, OnInit } from '@angular/core';
import {FooterVecinoComponent} from "../footer-vecino/footer-vecino.component";
import {HeaderComponent} from "../header/header.component";
import {HeaderVecinoComponent} from "../header-vecino/header-vecino.component";
import {IonicModule} from "@ionic/angular";
import {NavLateralDerechoVecinoComponent} from "../nav-lateral-derecho-vecino/nav-lateral-derecho-vecino.component";
import {NavLateralVecinoComponent} from "../nav-lateral-vecino/nav-lateral-vecino.component";
import {NgOptimizedImage} from "@angular/common";
import {NavLateralComunidadComponent} from "../nav-lateral-comunidad/nav-lateral-comunidad.component";
import {FooterComunidadComponent} from "../footer-comunidad/footer-comunidad.component";

@Component({
  selector: 'app-lista-viviendas',
  templateUrl: './lista-viviendas.component.html',
  styleUrls: ['./lista-viviendas.component.scss'],
  standalone: true,
  imports: [
    FooterVecinoComponent,
    HeaderComponent,
    HeaderVecinoComponent,
    IonicModule,
    NavLateralDerechoVecinoComponent,
    NavLateralVecinoComponent,
    NgOptimizedImage,
    NavLateralComunidadComponent,
    FooterComunidadComponent
  ]
})
export class ListaViviendasComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
