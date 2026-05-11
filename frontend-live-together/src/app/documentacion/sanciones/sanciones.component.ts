import { Component, OnInit } from '@angular/core';
import {Usuario} from "../../modelos/Usuario";
import {Vecino} from "../../modelos/Vecino";
import {Sancion} from "../../modelos/Sancion";
import {Comunidad} from "../../modelos/Comunidad";
import {SancionService} from "../../servicios/sancion-service";
import {UsuarioService} from "../../servicios/usuario-service";
import {VecinoService} from "../../servicios/vecino-service";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../../modelos/TokenDataDTO";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-sanciones',
  templateUrl: './sanciones.component.html',
  styleUrls: ['./sanciones.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class SancionesComponent  implements OnInit {

  private usuario!: Usuario
  private vecino!: Vecino
  listaSanciones: Sancion[] = []
  correo?: string
  comunidadObjeto?: Comunidad


  constructor(private sancionService: SancionService,
              private usuarioService: UsuarioService,
              private vecinoService: VecinoService) { }

  ngOnInit() {
    const comunidad = sessionStorage.getItem('comunidad');
    if (comunidad) {
      this.comunidadObjeto = JSON.parse(comunidad);
    }

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
    }

  }

  cargarUsuario(correo: string): void {
    this.usuarioService.cargarUsuario(correo).subscribe({
      next: (usuario: Usuario) => {
        this.usuario = usuario;
        if (this.usuario && this.usuario.id) {
          this.cargarVecino()
        }
      },
      error: (e) => {
        console.error("Error al cargar el usuario:", e);
      }
    });
  }

  cargarVecino() {
    if (this.usuario.id) {
      this.vecinoService.cargarVecinoPorIdUsuario(this.usuario.id).subscribe({
        next: data => {
          this.vecino = data
          this.listarSanciones()
        }
      })
    }
  }

  listarSanciones() {
    if (this.comunidadObjeto?.id) {
      this.sancionService.listarSanciones(this.comunidadObjeto.id).subscribe({
        next: data => {
          this.listaSanciones = data;

          this.listaSanciones.forEach(sancion => {
            this.vecinoService.cargarVecinoPorIdVecino(sancion.idVecino).subscribe({
              next: vecino => {
                sancion.nombreVecino = vecino.nombre + " " + vecino.apellidos;
              },
              error: err => {
                console.error("Error al cargar el vecino:", err);
              }
            });
          });
        }
      })
    }
  }


}
