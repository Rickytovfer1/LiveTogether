import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-footer-vecino',
  templateUrl: './footer-vecino.component.html',
  styleUrls: ['./footer-vecino.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class FooterVecinoComponent  implements OnInit {

  gastosImgSrc: string = 'assets/icon/nav-footer-vecino/gastos.png'
  perfilImgSrc: string = 'assets/icon/nav-footer-vecino/perfil.png'
  eleccionesImgSrc: string = 'assets/icon/nav-footer-vecino/elecciones.png'
  documentacionImgSrc: string = 'assets/icon/nav-footer-vecino/documentacion.png'

  constructor(private router: Router) { }

  ngOnInit() {

    if (this.router.url.includes('/gastos')) {
      this.gastosImgSrc = 'assets/icon/nav-footer-vecino/gastosActive.png'
    } else if (this.router.url.includes('/perfil')) {
      this.perfilImgSrc = 'assets/icon/nav-footer-vecino/perfilActive.png'
    } else if (this.router.url.includes('/elecciones')) {
      this.eleccionesImgSrc = 'assets/icon/nav-footer-vecino/eleccionesActive.png'
    } else if (this.router.url.includes('/documentacion')) {
      this.documentacionImgSrc = 'assets/icon/nav-footer-vecino/documentacionActive.png'
    }
  }

  navigateToGastos() {
    this.router.navigate(['comunidad/gastos'])
  }

  navigateToPerfil() {
    this.router.navigate(['comunidad/perfil'])
  }

  navigateToElecciones() {
    this.router.navigate(['comunidad/elecciones'])
  }

  navigateToDocumentacion() {
    this.router.navigate(['comunidad/documentacion'])
  }
}
