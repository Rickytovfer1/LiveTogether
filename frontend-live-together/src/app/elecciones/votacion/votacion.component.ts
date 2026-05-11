import { Component, OnInit } from '@angular/core';
import {FooterVecinoComponent} from "../../footer-vecino/footer-vecino.component";
import {HeaderComponent} from "../../header/header.component";
import {HeaderVecinoComponent} from "../../header-vecino/header-vecino.component";
import {IonicModule} from "@ionic/angular";
import {NavLateralDerechoVecinoComponent} from "../../nav-lateral-derecho-vecino/nav-lateral-derecho-vecino.component";
import {NavLateralVecinoComponent} from "../../nav-lateral-vecino/nav-lateral-vecino.component";
import {Usuario} from "../../modelos/Usuario";
import {Vecino} from "../../modelos/Vecino";
import {Eleccion} from "../../modelos/Eleccion";
import {VecinoUsuarioDTO} from "../../modelos/VecinoUsuarioDTO";
import {Comunidad} from "../../modelos/Comunidad";
import {Voto} from "../../modelos/Voto";
import {VotoService} from "../../servicios/voto-service";
import {ActivatedRoute} from "@angular/router";
import {UsuarioService} from "../../servicios/usuario-service";
import {VecinoService} from "../../servicios/vecino-service";
import {AlertController} from "@ionic/angular/standalone";
import {EleccionesService} from "../../servicios/elecciones-service";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../../modelos/TokenDataDTO";
import {TipoVoto} from "../../enum/TipoVoto";

@Component({
    selector: 'app-votacion',
    templateUrl: './votacion.component.html',
    styleUrls: ['./votacion.component.scss'],
    standalone: true,
    imports: [
        FooterVecinoComponent,
        HeaderComponent,
        HeaderVecinoComponent,
        IonicModule,
        NavLateralDerechoVecinoComponent,
        NavLateralVecinoComponent
    ]
})
export class VotacionComponent  implements OnInit {
  usuario: Usuario = {} as Usuario;
  vecino: Vecino = {} as Vecino;
  correo?: string
  idEleccion!: number;
  votoEnCurso: boolean = false;
  yaHaVotado: boolean = false;
  eleccion: Eleccion = {} as Eleccion;
  totalVoto?: number;
  listaPropietarios: VecinoUsuarioDTO[] = []
  comunidadObjeto!: Comunidad

  voto: Voto = {
    voto: undefined,
    idEleccion: undefined,
    idVecino: undefined
  }

  constructor(private votoService: VotoService,
              private activateRoute: ActivatedRoute,
              private usuarioService: UsuarioService,
              private vecinoService: VecinoService,
              private alertController: AlertController,
              private eleccionesService: EleccionesService) { }

  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      this.idEleccion = Number(params['id']);
    });
    const comunidad = sessionStorage.getItem('comunidad');
    if (comunidad) {
      this.comunidadObjeto = JSON.parse(comunidad);
    }
    this.getEleccion()
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
          this.vecino = data;
          this.verificarSiYaHaVotado()
        }
      })
    }
  }

  getEleccion() {
    if (this.idEleccion) {
      this.eleccionesService.getEleccion(this.idEleccion).subscribe({
        next: data => {
          this.eleccion = data;
          this.totalVotoMetodo()
        }
      });
    }
  }

  totalVotoMetodo() {
    if (this.idEleccion) {
      this.eleccionesService.totalVoto(this.idEleccion).subscribe({
        next: data => {
          this.totalVoto = data;
          this.listarPropietarios()
        }
      });
    }
  }

  listarPropietarios() {
    this.vecinoService.listarPropietarios(this.comunidadObjeto.id).subscribe({
      next: data => this.listaPropietarios = data
    })
  }

  votar() {
    this.votoService.votar(this.voto).subscribe({
      next: () => {
        console.log('Voto enviado:', this.voto);
        this.votoEnCurso = false;
        this.yaHaVotado = true;
      },
      error: (e) => {
        console.error('Error al votar:', e);
        this.votoEnCurso = false;
      }
    });
  }

  emitirVoto(tipo: string) {
    if (Array.isArray(this.listaPropietarios) || this.vecino.id) {
      if (!this.listaPropietarios.some(v => v.id === this.vecino.id)) {
        this.mostrarSoloPropietarios()
        return;
      }
      if (this.yaHaVotado) {
        this.mostrarAlertaYaHasVotado()
        return;
      }
      if (this.votoEnCurso) {
        return;
      }

      this.votoEnCurso = true;

      const tipoVoto: TipoVoto = TipoVoto[tipo as keyof typeof TipoVoto];

      this.voto = {
        voto: tipoVoto,
        idEleccion: this.idEleccion,
        idVecino: this.vecino.id
      };

      this.confirmarVoto();
    }
  }

  async confirmarVoto() {
    const alert = await this.alertController.create({
      header: 'Confirmar voto',
      message: '¿Estás seguro de que quieres emitir este voto?, ¡solo se puede votar 1 vez!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Voto cancelado');
            this.votoEnCurso = false;
          }
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            this.votar();
          }
        }
      ]
    });

    await alert.present();
  }

  async mostrarAlertaYaHasVotado() {
    const alert = await this.alertController.create({
      header: 'Ya has votado',
      message: 'Solo puedes votar una vez en esta elección.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  async mostrarSoloPropietarios() {
    const alert = await this.alertController.create({
      header: 'No eres propietario',
      message: 'Solo los propietarios de viviendas podrán participar en las elecciones.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  verificarSiYaHaVotado() {
    if (this.vecino?.id && this.idEleccion) {
      this.votoService.verificacionVoto(this.vecino.id, this.idEleccion).subscribe({
        next: (yaVoto: boolean) => {
          this.yaHaVotado = yaVoto;
        },
        error: err => {
          console.error('Error al verificar si ya ha votado', err);
        }
      });
    }
  }
}
