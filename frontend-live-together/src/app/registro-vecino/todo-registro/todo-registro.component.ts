import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../servicios/auth-service";
import { RegistrarVecino } from "../../modelos/RegistrarVecino";

@Component({
  selector: 'app-todo-registro',
  templateUrl: './todo-registro.component.html',
  styleUrls: ['./todo-registro.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule
  ]
})
export class TodoRegistroComponent implements OnInit {

  registroVecino: RegistrarVecino = {
    nombre: "",
    apellidos: "",
    telefono: "",
    fechaNacimiento: "",
    dni: "",
    correo: "",
    contrasena: ""
  };

  repetirContrasena: string = "";
  aceptaPoliticas: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.registroVecino = {
      nombre: "",
      apellidos: "",
      telefono: "",
      fechaNacimiento: "",
      dni: "",
      correo: "",
      contrasena: ""
    };
    this.repetirContrasena = "";
  }
  registrar() {
    if (!this.registroVecino.correo || !this.registroVecino.contrasena || !this.repetirContrasena ||
      !this.registroVecino.nombre || !this.registroVecino.apellidos || !this.registroVecino.telefono ||
      !this.registroVecino.fechaNacimiento || !this.registroVecino.dni) {
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

    const ahora = new Date();
    const fechaNacimiento = new Date(this.registroVecino.fechaNacimiento);
    if (fechaNacimiento >= ahora) {
      const toast = document.getElementById("diaIncorrecto") as any;
      toast.present();
      return;
    }

    const dniRegex = /^[0-9]{8}[A-Za-z]$/;
    if (!dniRegex.test(this.registroVecino.dni)) {
      const toast = document.getElementById("errorDNI") as any;
      toast.present();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registroVecino.correo)) {
      const toast = document.getElementById("errorEmail") as any;
      toast.present();
      return;
    }

    if (this.registroVecino.contrasena.length < 6) {
      const toast = document.getElementById("errorContrasena") as any;
      toast.present();
      return;
    }

    if (this.registroVecino.contrasena !== this.repetirContrasena) {
      const toast = document.getElementById("errorConfirmarContrasena") as any;
      toast.present();
      return;
    }

    if (!this.aceptaPoliticas) {
      const toast = document.getElementById("errorPoliticas") as any;
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
        console.error(error);
      }
    });
  }


  navigateToInicioSesion() {
    this.router.navigate(['/inicio-sesion']);
  }
}
