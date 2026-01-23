import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ComunService} from "./comun-service";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Comunidad} from "../modelos/Comunidad";

@Injectable({
  providedIn: 'root',
})
export class ComunidadService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private comunService: ComunService) { }

  listarComunidades(idVecino: number): Observable<Comunidad[]> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<Comunidad[]>(`${this.apiUrl}/vecino/listar/comunidades/${idVecino}`, options)
  }

}
