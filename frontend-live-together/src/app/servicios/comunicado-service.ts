import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ComunService} from "./comun-service";
import {Observable} from "rxjs";
import {Comunicado} from "../modelos/Comunicado";
import {CrearComunicado} from "../modelos/CrearComunicado";

@Injectable({
  providedIn: 'root',
})
export class ComunicadoService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private comunService: ComunService) { }

  listarComunicados(idComunidad: number): Observable<Comunicado[]> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<Comunicado[]>(`${this.apiUrl}/vecino/listar/comunicados/${idComunidad}`, options)
  }

  crearComunicado(comunicado: CrearComunicado): Observable<any> {
    const options = this.comunService.autorizarPeticion();
    return this.http.post(`${this.apiUrl}/vecino/crear/comunicado`, comunicado, options);
  }

  eliminarComunicadoVecino(idComunicado: number): Observable<void> {
    const options = this.comunService.autorizarPeticion();
    return this.http.post<void>(`${this.apiUrl}/vecino/eliminar/comunicado/${idComunicado}`, {}, options);
  }

}
