import { Component, OnInit } from '@angular/core';
import {AnadirGastoComponent} from "../gastos-comunidad/anadir-gasto/anadir-gasto.component";
import {DeudoresComponent} from "../gastos-comunidad/deudores/deudores.component";
import {FooterComunidadComponent} from "../footer-comunidad/footer-comunidad.component";
import {GastosComponent} from "../gastos-comunidad/gastos/gastos.component";
import {HeaderComponent} from "../header/header.component";
import {IonicModule} from "@ionic/angular";
import {NavLateralComunidadComponent} from "../nav-lateral-comunidad/nav-lateral-comunidad.component";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {LanzarEleccionComponent} from "./lanzar-eleccion/lanzar-eleccion.component";
import {ListarEleccionesComponent} from "./listar-elecciones/listar-elecciones.component";

@Component({
    selector: 'app-elecciones-comunidad',
    templateUrl: './elecciones-comunidad.component.html',
    styleUrls: ['./elecciones-comunidad.component.scss'],
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
    FormsModule,
    LanzarEleccionComponent,
    ListarEleccionesComponent
  ]
})
export class EleccionesComunidadComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  seccion: string = 'listar-elecciones'

}
