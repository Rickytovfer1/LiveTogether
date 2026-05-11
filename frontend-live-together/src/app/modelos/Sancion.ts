export interface Sancion {
  id: number
  motivo: string
  sancion: number
  idVecino: number
  idComunidad: number
  nombreVecino?: string;
}
