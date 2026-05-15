import { Component, OnInit } from '@angular/core';
import {FooterComunidadComponent} from "../footer-comunidad/footer-comunidad.component";
import {HeaderComponent} from "../header/header.component";
import {IonicModule} from "@ionic/angular";
import {NavLateralComunidadComponent} from "../nav-lateral-comunidad/nav-lateral-comunidad.component";
import {NavLateralDerechoVecinoComponent} from "../nav-lateral-derecho-vecino/nav-lateral-derecho-vecino.component";
import {FormsModule} from "@angular/forms";
import {AnadirGastoComponent} from "./anadir-gasto/anadir-gasto.component";
import {GastosComponent} from "./gastos/gastos.component";
import {DeudoresComponent} from "./deudores/deudores.component";
import {NgIf} from "@angular/common";

@Component({
    selector: 'app-gastos-comunidad',
    templateUrl: './gastos-comunidad.component.html',
    styleUrls: ['./gastos-comunidad.component.scss'],
    standalone: true,
  imports: [
    FooterComunidadComponent,
    HeaderComponent,
    IonicModule,
    NavLateralComunidadComponent,
    FormsModule,
    AnadirGastoComponent,
    GastosComponent,
    DeudoresComponent,
  ]
})
export class GastosComunidadComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  seccion: string = 'gastos'

}
