import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Vecino} from "../modelos/Vecino";
import {Mensaje} from "../modelos/Mensaje";
import {ActionSheetController, AlertController, IonContent} from "@ionic/angular/standalone";
import {environment} from "../../environments/environment";
import {Subscription, switchMap} from "rxjs";
import {MensajeService} from "../servicios/mensaje-service";
import {UsuarioService} from "../servicios/usuario-service";
import {ActivatedRoute, Router} from "@angular/router";
import {VecinoService} from "../servicios/vecino-service";
import {CommonModule, DatePipe, NgOptimizedImage} from "@angular/common";
import {jwtDecode} from "jwt-decode";
import {Usuario} from "../modelos/Usuario";
import {SocketService} from "../servicios/socket-service";
import {FormsModule} from "@angular/forms";
import {VecinoUsuarioDTO} from "../modelos/VecinoUsuarioDTO";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    NgOptimizedImage,
  ],
  providers: [DatePipe]
})
export class ChatComponent  implements OnInit {
  @ViewChild('content') private scrollContent!: ElementRef;
  @ViewChild('content', { static: false }) content!: IonContent;
  @Input() vecinoInput!: VecinoUsuarioDTO;
  @Output() cerrar = new EventEmitter<void>();

  baseUrl: string = environment.apiUrl;

  usuario: { correo: string; id: number } = { id: 0, correo: '' };
  mensajes: Mensaje[] = [];
  gruposMensajes: { fecha: string; mensajes: Mensaje[] }[] = [];
  nuevoTexto = '';
  idReceptor = 0;
  vecino: Vecino = {} as Vecino;
  private needScroll = false;
  private socketSubscription: Subscription = new Subscription();

  constructor(
    private mensajeService: MensajeService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private vecinoService: VecinoService,
    private datePipe: DatePipe,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/inicio-sesion']);
      return;
    }

    const decoded: any = jwtDecode(token);
    const tokenData = decoded?.tokenDataDTO;

    this.usuarioService.cargarUsuario(tokenData.correo)
      .subscribe(user => {
        if (!user?.id) return;

        this.usuario = user;

        // 🔥 DESKTOP
        if (this.vecinoInput?.idUsuario) {
          this.inicializarChat(this.vecinoInput.idUsuario);
        }
        // 📱 MOBILE
        else {
          this.route.paramMap.subscribe(params => {
            const receptorId = Number(params.get('id'));
            if (receptorId > 0) {
              this.inicializarChat(receptorId);
            }
          });
        }
      });
  }

  inicializarChat(idReceptor: number) {
    this.idReceptor = idReceptor;

    this.cargarConversacion(this.usuario.id, this.idReceptor, true);
    this.cargarPerfil(this.idReceptor);

    this.socketService.subscribeToConversation(this.usuario.id, this.idReceptor);
    this.socketSubscription = this.socketService.listenEvent()
      .subscribe(data => this.handleSocketEvent(data));
  }


  ngAfterViewChecked() {
    if (this.needScroll && this.content) {
      this.scrollToBottom();
      this.needScroll = false;
    }
  }

  handleSocketEvent(data: any) {
    const action = data.action;
    const mensajeData: Mensaje = data.mensaje;
    if (!action || !mensajeData) return;

    if (!this.content) {
      console.warn('IonContent no está disponible aún');
      return;
    }

    this.content.getScrollElement().then(el => {
      const oldScrollHeight = el.scrollHeight;
      const oldScrollTop = el.scrollTop;
      const oldClientHeight = el.clientHeight;
      const distanceFromBottom = oldScrollHeight - (oldScrollTop + oldClientHeight);

      if (action === 'create') {
        this.mensajes.push(mensajeData);
      } else if (action === 'update') {
        const index = this.mensajes.findIndex(m => m.id === mensajeData.id);
        if (index !== -1) {
          this.mensajes[index] = { ...this.mensajes[index], ...mensajeData };
        }
      } else if (action === 'delete') {
        const index = this.mensajes.findIndex(m => m.id === mensajeData.id);
        if (index !== -1) {
          this.mensajes[index].borrado = true;
        }
      }

      this.agruparMensajesPorFecha();

      setTimeout(() => {
        const newScrollHeight = el.scrollHeight;
        const newClientHeight = el.clientHeight;
        const newScrollTop = newScrollHeight - newClientHeight - distanceFromBottom;
        this.content.scrollToPoint(0, newScrollTop, 0);
      }, 50);
    }).catch(err => {
      console.error('Error al acceder a getScrollElement:', err);
    });
  }

  cargarConversacion(idEmisor?: number, idReceptor?: number, scroll: boolean = true, preserveScrollPosition?: number) {
    if (idEmisor === undefined || idReceptor === undefined) {
      return;
    }
    this.mensajeService.verConversacion(idEmisor, idReceptor).subscribe({
      next: mensajes => {
        mensajes.sort((a, b) => new Date(a.fecha!).getTime() - new Date(b.fecha!).getTime());
        this.mensajes = mensajes;
        this.agruparMensajesPorFecha();
        if (scroll) {
          this.needScroll = true;
        } else if (preserveScrollPosition !== undefined) {
          setTimeout(() => {
            this.content.scrollToPoint(0, preserveScrollPosition, 0);
          }, 100);
        }
      },
      error: () => {}
    });
  }

  enviar() {
    if (!this.nuevoTexto.trim()) {
      return;
    }
    if (!this.usuario.id || !this.idReceptor) {
      return;
    }
    const now = new Date();
    const mensaje: Mensaje = {
      texto: this.nuevoTexto.trim(),
      idEmisor: this.usuario.id,
      idReceptor: this.idReceptor,
      fecha: this.datePipe.transform(now, 'yyyy-MM-dd') || '',
      hora: this.datePipe.transform(now, 'HH:mm:ss') || ''
    };
    this.mensajeService.enviarMensaje(mensaje).subscribe({
      next: () => { this.nuevoTexto = ''; },
      error: () => {}
    });
  }

  cargarPerfil(idUsuario: number | undefined) {
    if (!idUsuario) return;
    this.vecinoService.cargarVecinoPorIdUsuario(idUsuario).subscribe({
      next: (vecino: Vecino) => { this.vecino = vecino; },
      error: () => {}
    });
  }

  agruparMensajesPorFecha() {
    const grupos: { fecha: string; mensajes: Mensaje[] }[] = [];
    let grupoActual: { fecha: string; mensajes: Mensaje[] } | null = null;
    this.mensajes.forEach(m => {
      const fechaMensaje = new Date(m.fecha!);
      const hoy = new Date();
      const ayer = new Date();
      ayer.setDate(hoy.getDate() - 1);
      let fechaFormateada = this.getFormattedDate(m.fecha!);
      if (this.esMismoDia(fechaMensaje, hoy)) {
        fechaFormateada = 'Hoy';
      } else if (this.esMismoDia(fechaMensaje, ayer)) {
        fechaFormateada = 'Ayer';
      }
      if (!grupoActual || grupoActual.fecha !== fechaFormateada) {
        grupoActual = { fecha: fechaFormateada, mensajes: [] };
        grupos.push(grupoActual);
      }
      grupoActual.mensajes.push(m);
    });
    this.gruposMensajes = grupos;
  }

  esMismoDia(fecha1: Date, fecha2: Date): boolean {
    return fecha1.getDate() === fecha2.getDate() &&
      fecha1.getMonth() === fecha2.getMonth() &&
      fecha1.getFullYear() === fecha2.getFullYear();
  }

  getFormattedDate(fecha: string): string {
    const date = new Date(fecha);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return day + '/' + month;
  }

  scrollToBottom() {
    if (this.content) {
      setTimeout(() => {
        this.content.scrollToBottom(300);
      }, 100);
    }
  }

  async mostrarOpciones(mensaje: Mensaje) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [
        { text: 'Editar', handler: () => this.editarMensaje(mensaje) },
        { text: 'Eliminar', handler: () => this.eliminarMensaje(mensaje) },
        { text: 'Cancelar', role: 'cancel' }
      ]
    });
    await actionSheet.present();
  }

  async editarMensaje(mensaje: Mensaje) {
    const alert = await this.alertController.create({
      header: 'Editar Mensaje',
      inputs: [{ name: 'texto', type: 'text', value: mensaje.texto }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Guardar', handler: data => { if (data.texto.trim()) { this.mensajeService.editarMensaje(mensaje.id!, data.texto.trim()).subscribe({ next: () => {}, error: () => {} }); } } }
      ]
    });
    await alert.present();
  }

  async eliminarMensaje(mensaje: Mensaje) {
    const alert = await this.alertController.create({
      header: 'Eliminar Mensaje',
      message: '¿Estás seguro de que deseas eliminar este mensaje?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: () => { this.mensajeService.eliminarMensaje(mensaje.id!).subscribe({ next: () => {}, error: () => {} }); } }
      ]
    });
    await alert.present();
  }

  trackByGrupo(index: number, grupo: { fecha: string; mensajes: Mensaje[] }): string {
    return grupo.fecha;
  }

  trackByMensaje(index: number, mensaje: Mensaje): number | undefined {
    return mensaje.id;
  }

  ngOnDestroy() {
    this.socketSubscription.unsubscribe();
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

  salirDelChat() {
    if (this.vecinoInput) {
      this.cerrar.emit();
    }
    else {
      this.router.navigate(['/lista-vecinos']);
    }
  }


}
