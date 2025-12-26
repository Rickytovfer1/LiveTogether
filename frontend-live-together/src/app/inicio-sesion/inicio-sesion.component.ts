import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class InicioSesionComponent  implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {}

  navigateToRegistro() {
    this.router.navigate(['/registro-vecino-index']);
  }
}
