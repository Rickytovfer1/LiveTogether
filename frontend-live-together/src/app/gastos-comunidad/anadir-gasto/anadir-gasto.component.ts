import { Component, OnInit } from '@angular/core';
import {IonButton, IonInput, IonText, IonToast} from "@ionic/angular/standalone";
import {Usuario} from "../../modelos/Usuario";
import {Comunidad} from "../../modelos/Comunidad";
import {CrearGasto} from "../../modelos/CrearGasto";
import {ComunidadService} from "../../servicios/comunidad-service";
import {Router} from "@angular/router";
import {UsuarioService} from "../../servicios/usuario-service";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../../modelos/TokenDataDTO";
import {GastoService} from "../../servicios/gasto-service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-anadir-gasto',
  templateUrl: './anadir-gasto.component.html',
  styleUrls: ['./anadir-gasto.component.scss'],
  standalone: true,
  imports: [
    IonText,
    IonInput,
    IonButton,
    IonToast,
    FormsModule
  ]
})
export class AnadirGastoComponent  implements OnInit {

  correo?: string;
  private usuario!: Usuario
  private comunidad!: Comunidad
  fecha: string = '';
  hora: string = '';

  crearGasto: CrearGasto = {
    concepto: "",
    total: undefined,
    idComunidad: undefined
  }
  constructor(private comunidadService: ComunidadService,
              private router: Router,
              private usuarioService: UsuarioService,
              private gastoService: GastoService) { }

  ngOnInit() {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode<{ tokenDataDTO: TokenDataDTO }>(token);
        const tokenDataDTO = decodedToken?.tokenDataDTO;
        if (tokenDataDTO && tokenDataDTO.correo) {
          this.correo = tokenDataDTO.correo;
          this.cargarUsuario(this.correo);
        }
      } catch (e) {
        console.error('Error al decodificar el token:', e);
      }
    } else {
      this.router.navigate(['/']);
    }}

  cargarUsuario(correo: string): void {
    this.usuarioService.cargarUsuarioComunidad(correo).subscribe({
      next: (usuario: Usuario) => {
        this.usuario = usuario;
        if (this.usuario && this.usuario.id) {
          this.cargarComunidad()
        }
      },
      error: (e) => {
        console.error("Error al cargar el usuario:", e);
      }
    });
  }

  cargarComunidad() {
    if (this.usuario.id) {
      this.comunidadService.cargarComunidadPorIdUsuario(this.usuario.id).subscribe({
        next: data => {
          this.comunidad = data
          console.log(this.comunidad)
          this.crearGasto.idComunidad = this.comunidad.id;
        }
      })
    }
  }

  crearGastoMetodo() {
    if (!this.crearGasto.total || !this.crearGasto.concepto || !this.crearGasto.idComunidad) {
      const toast = document.getElementById("campoVacioGasto") as any;
      toast.present();
      return;
    }

    this.gastoService.crearGasto(this.crearGasto).subscribe({
      next: () => {
        console.log(this.crearGasto);
        const toast = document.getElementById("exitoCreacionGasto") as any;
        toast.present();
        this.crearGasto = {
          concepto: '',
          total: undefined,
          idComunidad: this.comunidad?.id
        };
      },
      error: () => {
        console.log('Error al crear gasto.');
      }
    });
  }

}
