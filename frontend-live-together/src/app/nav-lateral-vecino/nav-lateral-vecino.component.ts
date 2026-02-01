import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-nav-lateral-vecino',
  templateUrl: './nav-lateral-vecino.component.html',
  styleUrls: ['./nav-lateral-vecino.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class NavLateralVecinoComponent  implements OnInit {

  propiedadesImgSrc: string = 'assets/icon/nav-footer-vecino/propiedades.png'
  gastosImgSrc: string = 'assets/icon/nav-footer-vecino/gastos.png'
  perfilImgSrc: string = 'assets/icon/nav-footer-vecino/perfil.png'
  eleccionesImgSrc: string = 'assets/icon/nav-footer-vecino/elecciones.png'
  documentacionImgSrc: string = 'assets/icon/nav-footer-vecino/documentacion.png'

  constructor() { }

  ngOnInit() {}

}
