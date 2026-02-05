import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";

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

  constructor(private router: Router) { }

  ngOnInit() {
    if (this.router.url.includes('/propiedades')) {
      this.propiedadesImgSrc = 'assets/icon/nav-footer-vecino/propiedadesActive.png'
    } else if (this.router.url.includes('/gastos')) {
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

}
