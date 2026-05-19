import { Component, OnInit } from '@angular/core';
import {environment} from "../../environments/environment";
import {Usuario} from "../modelos/Usuario";
import {Vecino} from "../modelos/Vecino";
import {EditarVecinoDTO} from "../modelos/EditarVecinoDTO";
import {Router} from "@angular/router";
import {UsuarioService} from "../servicios/usuario-service";
import {VecinoService} from "../servicios/vecino-service";
import {ComunidadService} from "../servicios/comunidad-service";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {FooterComponent} from "../footer/footer.component";
import {HeaderComponent} from "../header/header.component";
import {IonicModule} from "@ionic/angular";
import {NavLateralComponent} from "../nav-lateral/nav-lateral.component";
import {FormsModule} from "@angular/forms";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    IonicModule,
    NavLateralComponent,
    FormsModule,
    NgOptimizedImage
  ]
})
export class PerfilComponent  implements OnInit {

  baseUrl: string = environment.apiUrl;

  usuario: Usuario = {} as Usuario;
  vecino: Vecino = {} as Vecino;
  correo?: string;
  editable: boolean = false;

  editarVecino: EditarVecinoDTO = {
    nombre: "",
    apellidos: "",
    telefono: "",
    fechaNacimiento: "",
    dni: "",
    fotoPerfil: ""
  }

  foto: File | null = null;


  toastSuccess = false;
  toastError = false;
  toastUsuarioError = false;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private vecinoService: VecinoService,
    private comunidadService: ComunidadService
  ) {}

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
    }
  }

  cargarUsuario(correo: string): void {
    this.usuarioService.cargarUsuario(correo).subscribe({
      next: (usuario: Usuario) => {
        this.usuario = usuario;
        if (this.usuario && this.usuario.id) {
          this.cargarVecino();
        }
      },
      error: (e) => {
        console.error("Error al cargar el usuario:", e);
        this.toastUsuarioError = true;
      }
    });
  }

  cargarVecino() {
    if (this.usuario.id) {
      this.vecinoService.cargarVecinoPorIdUsuario(this.usuario.id).subscribe({
        next: data => {
          this.vecino = data;
          this.editarVecino = {
            nombre: this.vecino.nombre,
            apellidos: this.vecino.apellidos,
            telefono: this.vecino.telefono,
            fechaNacimiento: this.vecino.fechaNacimiento,
            dni: this.vecino.dni,
            fotoPerfil: this.vecino?.fotoPerfil || ""
          }
        }
      })
    }
  }
  visibleInput() {
    if (!this.editable){
      this.editable = true;
    }else {
      this.editable = false;
    }

  }
  actualizarVecino(idVecino: number) {
    const formData = new FormData();

    const dto = {
      nombre: this.editarVecino.nombre,
      apellidos: this.editarVecino.apellidos,
      telefono: this.editarVecino.telefono,
      fechaNacimiento: this.editarVecino.fechaNacimiento,
      dni: this.editarVecino.dni,
      fotoPerfil: this.editarVecino.fotoPerfil
    };

    formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

    if (this.foto) {
      formData.append('fotoPerfil', this.foto);
    }

    this.vecinoService.editarPerfil(formData, this.vecino.id).subscribe({
      next: res => {
        console.log('Actualizado correctamente');
        this.editable = false;
        this.toastSuccess = true;
        this.cargarVecino()
      },
      error: err => {
        console.error('Error al actualizar', err);
      }
    });
  }

  seleccionarFoto(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.foto = event.target.files[0];
      // @ts-ignore
      console.log('Foto seleccionada:', this.foto.name);
    }
  }

  getImageUrlVecino(vecino: Vecino): string {
    if (!vecino.fotoPerfil || vecino.fotoPerfil.trim() === '') {
      return 'assets/icon/perfiles/26.png';
    } else if (vecino.fotoPerfil.startsWith('http')) {
      return vecino.fotoPerfil;
    } else {
      return `${this.baseUrl}${vecino.fotoPerfil}`;
    }
  }
}
