import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ComunService} from "./comun-service";
import {Observable} from "rxjs";
import {Voto} from "../modelos/Voto";

@Injectable({
  providedIn: 'root',
})
export class VotoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private comunService: ComunService) { }

  votar(voto: Voto): Observable<any> {
    const options = this.comunService.autorizarPeticion();
    return this.http.post(`${this.apiUrl}/vecino/votar`, voto, options);
  }

  verificacionVoto(idVecino: number, idEleccion: number): Observable<boolean> {
    const options = this.comunService.autorizarPeticion();
    return this.http.get<boolean>(`${this.apiUrl}/vecino/verificar/voto/${idVecino}/${idEleccion}`, options);
  }
}
