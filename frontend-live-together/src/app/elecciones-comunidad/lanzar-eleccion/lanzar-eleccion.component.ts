import { Component, OnInit } from '@angular/core';
import {Usuario} from "../../modelos/Usuario";
import {Comunidad} from "../../modelos/Comunidad";
import {CrearEleccion} from "../../modelos/CrearEleccion";
import {Vecino} from "../../modelos/Vecino";
import {ComunidadService} from "../../servicios/comunidad-service";
import {Router} from "@angular/router";
import {UsuarioService} from "../../servicios/usuario-service";
import {EleccionesService} from "../../servicios/elecciones-service";
import {
  AlertController,
  IonButton,
  IonDatetime, IonImg, IonInput,
  IonSelect,
  IonSelectOption,
  IonText,
  IonToast
} from "@ionic/angular/standalone";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../../modelos/TokenDataDTO";
import {FormsModule} from "@angular/forms";
import {TipoNotificacion} from "../../modelos/Notificacion";

@Component({
  selector: 'app-lanzar-eleccion',
  templateUrl: './lanzar-eleccion.component.html',
  styleUrls: ['./lanzar-eleccion.component.scss'],
  standalone: true,
  imports: [
    IonSelect,
    IonSelectOption,
    IonText,
    IonButton,
    IonToast,
    FormsModule,
    IonDatetime,
    IonInput,
    IonImg
  ]
})
export class LanzarEleccionComponent  implements OnInit {

  correo?: string;
  private usuario!: Usuario
  private comunidad!: Comunidad
  fecha: string = '';
  hora: string = '';

  crearEleccion: CrearEleccion = {
    motivo: "",
    fechaHora: "",
    idComunidad: undefined,
    idCandidato: undefined
  }

  modoCambioPresidente: boolean = false;
  listaPropietarios: Vecino[] = [];
  idNuevoPresidente: number | undefined;
  nuevoPresidente!: Vecino

  constructor(private comunidadService: ComunidadService,
              private router: Router,
              private usuarioService: UsuarioService,
              private eleccionService: EleccionesService,
              private alertController: AlertController) {
  }

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
    }
  }

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
          this.crearEleccion.idComunidad = this.comunidad.id;
        }
      })
    }
  }

  crearEleccionMetodo() {
    if (!this.crearEleccion.fechaHora || !this.crearEleccion.motivo || !this.crearEleccion.idComunidad) {
      const toast = document.getElementById("campoVacio") as any;
      toast.present();
      return;
    }

    const ahora = new Date();
    const fechaEleccion = new Date(this.crearEleccion.fechaHora);

    if (fechaEleccion <= ahora) {
      const toast = document.getElementById("diaIncorrecto") as any;
      toast.present();
      return;
    }

    if (this.modoCambioPresidente && this.idNuevoPresidente) {

      this.comunidadService.cargarVecinoPorIdVecinoComunidad(this.idNuevoPresidente).subscribe({
        next: data => {
          this.nuevoPresidente = data;
          this.crearEleccion.motivo += ` - Candidato: ${this.nuevoPresidente.nombre} ${this.nuevoPresidente.apellidos}`;
          this.crearEleccion.idCandidato = this.idNuevoPresidente;

          this.lanzarEleccion();
        },
        error: () => {
          console.error("Error al cargar el presidente.");
        }
      });
    } else {
      this.lanzarEleccion();
    }
  }

  lanzarEleccion() {
    this.eleccionService.crearEleccion(this.crearEleccion).subscribe({
      next: () => {
        const toast = document.getElementById("exitoCreacion") as any;
        toast.present();

        this.crearEleccion = {
          motivo: '',
          fechaHora: '',
          idComunidad: this.comunidad?.id
        };
        this.fecha = '';
        this.hora = '';
        this.modoCambioPresidente = false;

        this.comunidadService.listarPropietariosComunidad(this.comunidad.id).subscribe({
          next: data =>
            this.comunidadService.enviarNotificacion(data.map(vecino => vecino.id), this.comunidad.id, TipoNotificacion.ELECCION)
              .subscribe({})
        })

      },
      error: () => {
        console.log('Error al lanzar la elección.');
      }
    });
  }


  actualizarFechaHora() {
    if (this.fecha && this.hora) {
      const horaSolo = this.hora.split('T')[1]?.substring(0, 5);
      this.crearEleccion.fechaHora = `${this.fecha}T${horaSolo}`;
    }
  }

  activarCambioPresidente() {
    this.modoCambioPresidente = true;
    this.crearEleccion.motivo = "Elección de nuevo presidente";

    if (this.comunidad && this.comunidad.id) {
      this.comunidadService.listarPropietariosComunidad(this.comunidad.id).subscribe({
        next: (propietarios: Vecino[]) => {
          this.listaPropietarios = propietarios;
        },
        error: err => {
          console.error("Error al cargar los propietarios:", err);
        }
      });
    }
  }

  abrirModalOpciones() {
    this.alertController.create({
      header: 'Tipo de votación',
      message: 'Selecciona el tipo de elección',
      buttons: [
        {
          text: 'Nuevo Presidente',
          handler: () => {
            this.seleccionarTipo('presidente');
          }
        },
        {
          text: 'Personalizado',
          handler: () => {
            this.seleccionarTipo('personalizado');
          }
        },
      ]
    }).then(alert => {
      alert.present();
    });
  }

  seleccionarTipo(tipo: 'presidente' | 'personalizado') {
    if (tipo === 'presidente') {
      this.activarCambioPresidente();
    } else {
      this.modoCambioPresidente = false;
      this.crearEleccion.motivo = '';
    }
  }

}
