import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";
import {Login} from "../modelos/Login";
import {AuthService} from "../servicios/auth-service";
import {TokenData} from "../modelos/TokenData";
import {jwtDecode} from "jwt-decode";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule
  ]
})
export class InicioSesionComponent  implements OnInit {

  formLogin: Login = {
    correo: "",
    contrasena: ""
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  navigateToRegistro() {
    this.router.navigate(['/registro-vecino-index']);
  }

  login() {
    if (!this.formLogin.correo || !this.formLogin.contrasena) {
      const toast = document.getElementById("toastCamposVacios") as any;
      toast.present();
      return;
    }
    this.authService.login(this.formLogin).subscribe({
      next: data => {
        const token = data.token;
        sessionStorage.setItem("authToken", token);
        this.authService.setAuthState(true);

          const decodedToken = jwtDecode(token) as { tokenDataDTO: TokenData };
          const rol = decodedToken?.tokenDataDTO.rol;

          if (rol === "VECINO") {
            const toast = document.getElementById("toastExito") as any;
            toast.present();
            console.log("Logueado correctamente")
          }
      },
      error: err => {
        const toast = document.getElementById("toastLoginIncorrecto") as any;
        toast.present();
        console.log("Error al loguearse");
      }
    })
  }
}
