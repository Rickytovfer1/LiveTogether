import { Component, OnInit } from '@angular/core';
import {FooterVecinoComponent} from "../footer-vecino/footer-vecino.component";
import {HeaderComponent} from "../header/header.component";
import {HeaderVecinoComponent} from "../header-vecino/header-vecino.component";
import {IonicModule} from "@ionic/angular";
import {NavLateralDerechoVecinoComponent} from "../nav-lateral-derecho-vecino/nav-lateral-derecho-vecino.component";
import {NavLateralVecinoComponent} from "../nav-lateral-vecino/nav-lateral-vecino.component";
import {ComunicadosComponent} from "./comunicados/comunicados.component";
import {SancionesComponent} from "./sanciones/sanciones.component";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-documentacion',
    templateUrl: './documentacion.component.html',
    styleUrls: ['./documentacion.component.scss'],
    standalone: true,
  imports: [
    FooterVecinoComponent,
    HeaderComponent,
    HeaderVecinoComponent,
    IonicModule,
    NavLateralDerechoVecinoComponent,
    NavLateralVecinoComponent,
    ComunicadosComponent,
    SancionesComponent,
    FormsModule
  ]
})
export class DocumentacionComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  seccion: string = 'comunicados'

}
