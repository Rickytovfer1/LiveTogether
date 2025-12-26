import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";
import {Login} from "../../modelos/Login";
import {AuthService} from "../../servicios/auth-service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule
  ]
})
export class RegistroComponent  implements OnInit {

  datosRegistro: Login = {
    correo: "",
    contrasena: ""
  }

  repetirContrasena: string = ""
  aceptaPoliticas: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.datosRegistro.correo = ""
    this.datosRegistro.contrasena = ""
    this.repetirContrasena = ""
  }

  navigateToInicioSesion() {
    this.router.navigate(['/inicio-sesion']);
  }

  navigateToConfigPerfilVecino() {

    if (!this.datosRegistro.correo || !this.datosRegistro.contrasena || !this.repetirContrasena) {
      const toast = document.getElementById("campoVacioRegistro") as any;
      toast.present();
      return;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.datosRegistro.correo)) {
      const toast = document.getElementById("errorEmail") as any;
      toast.present();
      return;
    }


    if (this.datosRegistro.contrasena.length < 6) {
      const toast = document.getElementById("errorContrasena") as any;
      toast.present();
      return;
    }


    if (this.datosRegistro.contrasena !== this.repetirContrasena) {
      const toast = document.getElementById("errorConfirmarContrasena") as any;
      toast.present();
      return;
    }

    if (!this.aceptaPoliticas) {
      const toast = document.getElementById("errorPoliticas") as any;
      toast.present();
      return;
    }

    this.authService.setDatos(this.datosRegistro);
    const toast = document.getElementById("exitoCreacionRegistro") as any;
    toast.present();
    this.router.navigate(['/config-perfil-vecino']);
  }
}
