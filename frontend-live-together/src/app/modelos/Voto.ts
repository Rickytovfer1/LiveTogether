import {TipoVoto} from "../enum/TipoVoto";

export interface Voto {
  voto?: TipoVoto
  idEleccion?: number
  idVecino?: number
}
