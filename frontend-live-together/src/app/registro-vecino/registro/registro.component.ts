import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class RegistroComponent  implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {}

  navigateToInicioSesion() {
    this.router.navigate(['/inicio-sesion']);
  }

  navigateToConfigPerfilVecino() {
    this.router.navigate(['/config-perfil-vecino']);
  }
}
