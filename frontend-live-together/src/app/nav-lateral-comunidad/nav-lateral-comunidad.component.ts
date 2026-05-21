import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav-lateral-comunidad',
  templateUrl: './nav-lateral-comunidad.component.html',
  styleUrls: ['./nav-lateral-comunidad.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
  ]
})
export class NavLateralComunidadComponent  implements OnInit {
  gastosImgSrc: string = 'assets/icon/nav-footer-vecino/gastos.png'
  viviendasImgSrc: string = 'assets/icon/nav-footer-vecino/propiedades.png'
  eleccionesImgSrc: string = 'assets/icon/nav-footer-vecino/elecciones.png'
  documentacionImgSrc: string = 'assets/icon/nav-footer-vecino/documentacion.png'

  constructor(private router: Router) { }

  ngOnInit() {

    if (this.router.url.includes('/gastos')) {
      this.gastosImgSrc = 'assets/icon/nav-footer-vecino/gastosActive.png'
    } else if (this.router.url.includes('/lista-viviendas')) {
      this.viviendasImgSrc = 'assets/icon/nav-footer-vecino/propiedadesActive.png'
    } else if (this.router.url.includes('/elecciones')) {
      this.eleccionesImgSrc = 'assets/icon/nav-footer-vecino/eleccionesActive.png'
    } else if (this.router.url.includes('/documentacion')) {
      this.documentacionImgSrc = 'assets/icon/nav-footer-vecino/documentacionActive.png'
    }
  }


  navigateToGastos() {
    this.router.navigate(['gastos/comunidad'])
  }

  navigateToVivienda() {
    this.router.navigate(['lista-viviendas'])
  }

  navigateToElecciones() {
    this.router.navigate(['elecciones/comunidad'])
  }

  navigateToDocumentacion() {
    this.router.navigate(['documentacion/comunidad'])
  }
}
