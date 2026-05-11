import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cancelado',
  templateUrl: './cancelado.component.html',
  styleUrls: ['./cancelado.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class CanceladoComponent {

  constructor(private router: Router) {}

  intentarDeNuevo() {
    this.router.navigate(['comunidad/gastos']);
  }

}
