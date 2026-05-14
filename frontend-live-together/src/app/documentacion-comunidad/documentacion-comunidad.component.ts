import { Component, OnInit } from '@angular/core';
import {AnadirGastoComponent} from "../gastos-comunidad/anadir-gasto/anadir-gasto.component";
import {DeudoresComponent} from "../gastos-comunidad/deudores/deudores.component";
import {FooterComunidadComponent} from "../footer-comunidad/footer-comunidad.component";
import {GastosComponent} from "../gastos-comunidad/gastos/gastos.component";
import {HeaderComponent} from "../header/header.component";
import {IonicModule} from "@ionic/angular";
import {NavLateralComunidadComponent} from "../nav-lateral-comunidad/nav-lateral-comunidad.component";
import {NgIf} from "@angular/common";
import {ComunicadosComponent} from "./comunicados/comunicados.component";
import {SancionesComponent} from "./sanciones/sanciones.component";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-documentacion-comunidad',
    templateUrl: './documentacion-comunidad.component.html',
    styleUrls: ['./documentacion-comunidad.component.scss'],
    standalone: true,
  imports: [
    AnadirGastoComponent,
    DeudoresComponent,
    FooterComunidadComponent,
    GastosComponent,
    HeaderComponent,
    IonicModule,
    NavLateralComunidadComponent,
    NgIf,
    ComunicadosComponent,
    SancionesComponent,
    FormsModule
  ]
})
export class DocumentacionComunidadComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  seccion: string = 'comunicados'


}
