import {Component, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";
import {Login} from "../../modelos/Login";
import {RegistrarVecino} from "../../modelos/RegistrarVecino";
import {AuthService} from "../../servicios/auth-service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-config-perfil-vecino',
  templateUrl: './config-perfil-vecino.component.html',
  styleUrls: ['./config-perfil-vecino.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule
  ]
})
export class ConfigPerfilVecinoComponent implements OnInit {

  private datos: Login = {
    correo: "",
    contrasena: ""
  }

  registroVecino: RegistrarVecino = {
    nombre: "",
    apellidos: "",
    telefono: "",
    fechaNacimiento: "",
    dni: "",
    correo: this.datos.correo,
    contrasena: this.datos.contrasena,
  }
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.datos = this.authService.getDatos();
    this.registroVecino.correo = this.datos.correo;
    this.registroVecino.contrasena = this.datos.contrasena;
  }

  ionViewWillEnter() {
    this.registroVecino.nombre = ""
    this.registroVecino.apellidos = ""
    this.registroVecino.telefono = ""
    this.registroVecino.fechaNacimiento = ""
    this.registroVecino.dni = ""
  }

  navigateToInicioSesion() {

    if (
      !this.registroVecino.nombre ||
      !this.registroVecino.apellidos ||
      !this.registroVecino.telefono ||
      !this.registroVecino.fechaNacimiento ||
      !this.registroVecino.dni
    ) {
      const toast = document.getElementById("campoVacioRegistro") as any;
      toast.present();
      return;
    }


    if (this.registroVecino.nombre.trim().length < 2) {
      const toast = document.getElementById("errorNombre") as any;
      toast.present();
      return;
    }


    if (this.registroVecino.apellidos.trim().length < 2) {
      const toast = document.getElementById("errorApellidos") as any;
      toast.present();
      return;
    }


    const telRegex = /^[0-9]{9}$/;
    if (!telRegex.test(this.registroVecino.telefono)) {
      const toast = document.getElementById("errorTelefono") as any;
      toast.present();
      return;
    }

    const dniRegex = /^[0-9]{8}[A-Za-z]$/;
    if (!dniRegex.test(this.registroVecino.dni)) {
      const toast = document.getElementById("errorDNI") as any;
      toast.present();
      return;
    }

    const ahora = new Date();
    const fechaNacimiento = new Date(this.registroVecino.fechaNacimiento);

    if (fechaNacimiento >= ahora) {
      const toast = document.getElementById("diaIncorrecto") as any;
      toast.present();
      return;
    }

    this.authService.registroVecino(this.registroVecino).subscribe({
      next: () => {
        const toast = document.getElementById("exitoCreacionRegistroTerminado") as any;
        toast.present();
        this.router.navigate(['/inicio-sesion']);
      },
      error: error => {
        const toast = document.getElementById("errorRegistro") as any;
        toast.present();
        console.log(error);
      }
    });
  }
}
