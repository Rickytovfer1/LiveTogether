import {Component, OnInit, ViewChild} from '@angular/core';
import {FooterComunidadComponent} from "../footer-comunidad/footer-comunidad.component";
import {HeaderComponent} from "../header/header.component";
import {IonicModule} from "@ionic/angular";
import {NavLateralComunidadComponent} from "../nav-lateral-comunidad/nav-lateral-comunidad.component";
import {FormsModule} from "@angular/forms";
import Quill from "quill";
import {ColorAttributor} from "quill/formats/color";
import {QuillModule} from "ngx-quill";
import {FontType} from "../enum/TipoFuente";
import {Usuario} from "../modelos/Usuario";
import {Comunidad} from "../modelos/Comunidad";
import {CrearComunicadoComunidad} from "../modelos/CrearComunicadoComunidad";
import {Router} from "@angular/router";
import {UsuarioService} from "../servicios/usuario-service";
import {ComunicadoService} from "../servicios/comunicado-service";
import {ComunidadService} from "../servicios/comunidad-service";
import {jwtDecode} from "jwt-decode";
import {TokenDataDTO} from "../modelos/TokenDataDTO";
import {TipoNotificacion} from "../modelos/Notificacion";

const font: any = Quill.import('formats/font')
const FontStyle: any = Quill.import('attributors/style/font');
const SizeStyle: any = Quill.import('attributors/style/size');
const Parchment = Quill.import('parchment')
const BaseColor = Quill.import('formats/color') as any

const CustomColor = new ColorAttributor('color', 'color', {scope: Parchment.Scope.INLINE})

Object.assign(BaseColor, CustomColor)

FontStyle.whitelist = ['verdana', 'arial', 'couriernew', 'georgia', 'tahoma', 'timesnewroman']
SizeStyle.whitelist = ['8px', '12px', '16px', '24px']

const customColors = [
  'rgb(0, 163, 255)',
  'rgb(42, 227, 236)',
  'rgb(250, 196, 8)',
  'rgb(135, 191, 47)',
  'rgb(228, 49, 135)',
  'rgb(139, 85, 201)',
  'rgb(147, 240, 245)',
  'rgb(252, 225, 130)',
  'rgb(194, 222, 150)',
  'rgb(241, 151, 194)',
  'rgb(196, 169, 227)',
  'rgb(200, 247, 250)',
  'rgb(253, 240, 192)',
  'rgb(224, 238, 202)',
  'rgb(248, 202, 224)',
  'rgb(225, 211, 241)',
  'rgb(0, 0, 0)',
  'rgb(128, 128, 128)',
  'rgb(173, 173, 173)',
  'rgb(240, 240, 240)',
  'rgb(255, 255, 255)'
]

@Component({
  selector: 'app-crear-comunicado-comunidad',
  templateUrl: './crear-comunicado-comunidad.component.html',
  styleUrls: ['./crear-comunicado-comunidad.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    HeaderComponent,
    QuillModule,
    FooterComunidadComponent,
    NavLateralComunidadComponent,
  ]
})
export class CrearComunicadoComunidadComponent  implements OnInit {

  @ViewChild('quillEditor', {static: false}) quillEditor: any

  fontType: FontType[] = ['Verdana', 'Arial', 'Courier New', 'Georgia', 'Tahoma', 'Times New Roman']

  formatos = [
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'color',
    'link',
    'image'
  ]

  correo?: string;
  private usuario!: Usuario
  private comunidad!: Comunidad

  crearComunicado: CrearComunicadoComunidad = {
    descripcion: "",
    idComunidad: undefined
  };

  constructor(private router: Router,
              private usuarioService: UsuarioService,
              private comunicadoService: ComunicadoService,
              private comunidadService: ComunidadService) {
  }

  ngOnInit() {
    this.inicio()
    this.quillSetUp()
  }

  inicio() {
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

  quillSetUp() {
    font.whitelist = [...this.fontType.map(type => type.toLowerCase().replace(/\s+/g, ''))]
    Quill.register(font, true)
    Quill.register(FontStyle, true)
    Quill.register(SizeStyle, true)
  }

  quillConfig = {
    toolbar: [
      [{font: [...this.fontType.map(type => type.toLowerCase().replace(/\s+/g, ''))]}, {size: ['8px', '12px', '16px', '24px']}],
      ['bold', 'italic', 'underline'],
      [{color: customColors}],
      ['link'],
      ['image']
    ]
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
          this.crearComunicado.idComunidad = this.comunidad.id;
        }
      })
    }
  }

  volverAtras(): void {
    this.router.navigate(['/documentacion/comunidad']);
  }


  crearComunicadoMetodo() {
    if (!this.crearComunicado.descripcion || !this.crearComunicado.idComunidad) {
      console.log("Faltan datos para crear el comunicado.");
      return;
    }

    this.comunicadoService.crearComunicadoComunidad(this.crearComunicado).subscribe({
      next: () => {
        this.crearComunicado.descripcion = "";
        this.comunidadService.listarVecinosComunidad(this.comunidad.id).subscribe({
          next: data =>
            this.comunidadService.enviarNotificacion(data.map(vecino => vecino.id), this.comunidad.id, TipoNotificacion.COMUNICADO)
              .subscribe({})
        })
        this.router.navigate(['/documentacion/comunidad']);
      },
      error: () => {
        console.log('Error al insertar comunicado.');
      }
    });
  }
}
