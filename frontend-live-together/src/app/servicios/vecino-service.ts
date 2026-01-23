import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ComunService} from "./comun-service";
import {Observable} from "rxjs";
import {Vecino} from "../modelos/Vecino";

@Injectable({
  providedIn: 'root',
})
export class VecinoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private comunService: ComunService) { }

  cargarVecinoPorIdUsuario(idUsuario: number): Observable<Vecino> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<Vecino>(`${this.apiUrl}/vecino/ver/vecino/usuario/${idUsuario}`, options)
  }

  cargarVecinoPorIdVecino(idVecino: number): Observable<Vecino> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<Vecino>(`${this.apiUrl}/vecino/ver/vecino/${idVecino}`, options)
  }
}
