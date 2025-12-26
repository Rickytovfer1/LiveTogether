import {Component, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-config-perfil-vecino',
  templateUrl: './config-perfil-vecino.component.html',
  styleUrls: ['./config-perfil-vecino.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class ConfigPerfilVecinoComponent implements OnInit {

  constructor(
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  navigateToInicioSesion() {

    this.router.navigate(['/inicio-sesion']);
  }
}
