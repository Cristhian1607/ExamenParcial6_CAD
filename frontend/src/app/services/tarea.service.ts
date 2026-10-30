import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EstadoTarea, Tarea, TareaInput } from '../models/tarea';

export interface FiltrosTarea {
  estado: EstadoTarea | '';
  buscar: string;
  ordenarPor: 'fechaLimite' | 'prioridad';
  direccion: 'asc' | 'desc';
}

/** Encapsula las solicitudes HTTP para mantener la API fuera de los componentes. */
@Injectable({ providedIn: 'root' })
export class TareaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/tareas';

  obtenerTodas(filtros: FiltrosTarea): Observable<Tarea[]> {
    // Los filtros vacíos se omiten para consultar sin restricciones.
    let params = new HttpParams()
      .set('ordenarPor', filtros.ordenarPor)
      .set('direccion', filtros.direccion);

    if (filtros.estado) {
      params = params.set('estado', filtros.estado);
    }

    if (filtros.buscar.trim()) {
      params = params.set('buscar', filtros.buscar.trim());
    }

    return this.http.get<Tarea[]>(this.apiUrl, { params });
  }

  crear(entrada: TareaInput): Observable<void> {
    return this.http.post<Tarea>(this.apiUrl, entrada).pipe(map(() => undefined));
  }

  actualizar(id: string, entrada: TareaInput): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, entrada);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
