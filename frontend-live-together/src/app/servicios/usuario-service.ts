import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ComunService} from "./comun-service";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Usuario} from "../modelos/Usuario";

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private comunService: ComunService) { }

  cargarUsuario(correo: string): Observable<Usuario> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<Usuario>(`${this.apiUrl}/vecino/usuario/correo/${correo}`, options);
  }

  cargarUsuarioComunidad(correo: string): Observable<Usuario> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<Usuario>(`${this.apiUrl}/comunidad/usuario/correo/${correo}`, options);
  }
}
