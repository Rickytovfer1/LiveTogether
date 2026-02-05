import { Component, OnInit } from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {HeaderVecinoComponent} from "../header-vecino/header-vecino.component";
import {IonicModule} from "@ionic/angular";
import {NavLateralDerechoVecinoComponent} from "../nav-lateral-derecho-vecino/nav-lateral-derecho-vecino.component";
import {NavLateralVecinoComponent} from "../nav-lateral-vecino/nav-lateral-vecino.component";
import {Gasto} from "../modelos/Gasto";
import {Router} from "@angular/router";
import {Comunidad} from "../modelos/Comunidad";
import {GastoService} from "../servicios/gasto-service";
import {NgClass, NgForOf} from "@angular/common";
import {FooterVecinoComponent} from "../footer-vecino/footer-vecino.component";

@Component({
    selector: 'app-gastos',
    templateUrl: './gastos.component.html',
    styleUrls: ['./gastos.component.scss'],
    standalone: true,
  imports: [
    HeaderComponent,
    HeaderVecinoComponent,
    IonicModule,
    NavLateralDerechoVecinoComponent,
    NavLateralVecinoComponent,
    NgClass,
    NgForOf,
    FooterVecinoComponent
  ]
})
export class GastosComponent  implements OnInit {
  comunidadObjeto!: Comunidad
  listaGastos: Gasto[] = []

  constructor(private router: Router,
              private gastoService: GastoService) { }

  ionViewWillEnter() {
    this.listarGastos()
  }

  ngOnInit() {
    const comunidad = sessionStorage.getItem('comunidad');
    if (comunidad) {
      this.comunidadObjeto = JSON.parse(comunidad);
    }
  }

  listarGastos() {
    if (this.comunidadObjeto?.id)
      this.gastoService.listarGastos(this.comunidadObjeto.id).subscribe({
        next: data => this.listaGastos = data
      })
  }

  comprobarEstado(gasto: Gasto): string {
    if (gasto.total === gasto.cantidadPagada) {
      return "Pagado"
    }
    return "Pendiente"
  }

  navigateToGasto(idGasto: number) {
    this.router.navigate(['comunidad/gastos/gasto', idGasto])
  }

}
