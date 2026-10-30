import { DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstadoTarea, Tarea, TareaInput } from '../models/tarea';
import { FiltrosTarea, TareaService } from '../services/tarea.service';

registerLocaleData(localeEs);

@Component({
  selector: 'app-task-list',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly tareaService = inject(TareaService);

  readonly formulario = this.formBuilder.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.required, Validators.maxLength(500)]],
    fechaLimite: [this.fechaLocal(new Date()), Validators.required],
    prioridad: [2, Validators.required],
    estado: ['Pendiente' as EstadoTarea, Validators.required],
  });

  tareas: Tarea[] = [];
  filtroEstado: EstadoTarea | '' = '';
  busqueda = '';
  ordenarPor: FiltrosTarea['ordenarPor'] = 'fechaLimite';
  direccion: FiltrosTarea['direccion'] = 'asc';
  editandoId: string | null = null;
  cargando = false;
  guardando = false;
  error = '';

  ngOnInit(): void {
    this.cargarTareas();
  }

  get pendientes(): number {
    return this.tareas.filter((tarea) => tarea.estado === 'Pendiente').length;
  }

  get completadas(): number {
    return this.tareas.filter((tarea) => tarea.estado === 'Completada').length;
  }

  cargarTareas(): void {
    this.cargando = true;
    this.error = '';
    this.tareaService
      .obtenerTodas({
        estado: this.filtroEstado,
        buscar: this.busqueda,
        ordenarPor: this.ordenarPor,
        direccion: this.direccion,
      })
      .subscribe({
        next: (tareas) => {
          this.tareas = tareas;
          this.cargando = false;
        },
        error: (error: HttpErrorResponse) => {
          this.error = this.mensajeError(error);
          this.cargando = false;
        },
      });
  }

  actualizarBusqueda(evento: Event): void {
    this.busqueda = (evento.target as HTMLInputElement).value;
    this.cargarTareas();
  }

  actualizarFiltroEstado(evento: Event): void {
    this.filtroEstado = (evento.target as HTMLSelectElement).value as EstadoTarea | '';
    this.cargarTareas();
  }

  actualizarOrden(evento: Event): void {
    this.ordenarPor = (evento.target as HTMLSelectElement).value as FiltrosTarea['ordenarPor'];
    this.cargarTareas();
  }

  nuevaTarea(): void {
    this.editandoId = null;
    this.formulario.reset({
      titulo: '',
      descripcion: '',
      fechaLimite: this.fechaLocal(new Date()),
      prioridad: 2,
      estado: 'Pendiente',
    });
    this.formulario.markAsPristine();
  }

  editar(tarea: Tarea): void {
    this.editandoId = tarea.id;
    this.formulario.setValue({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      fechaLimite: tarea.fechaLimite.slice(0, 10),
      prioridad: tarea.prioridad,
      estado: tarea.estado,
    });
    this.formulario.markAsPristine();
    document.getElementById('formulario-tarea')?.scrollIntoView({ behavior: 'smooth' });
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = '';
    const entrada = this.formulario.getRawValue();
    const peticion = this.editandoId
      ? this.tareaService.actualizar(this.editandoId, entrada)
      : this.tareaService.crear(entrada);

    peticion.subscribe({
      next: () => {
        this.guardando = false;
        this.nuevaTarea();
        this.cargarTareas();
      },
      error: (error: HttpErrorResponse) => {
        this.error = this.mensajeError(error);
        this.guardando = false;
      },
    });
  }

  alternarEstado(tarea: Tarea): void {
    const entrada: TareaInput = {
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      fechaLimite: tarea.fechaLimite,
      prioridad: tarea.prioridad,
      estado: tarea.estado === 'Completada' ? 'Pendiente' : 'Completada',
    };

    this.tareaService.actualizar(tarea.id, entrada).subscribe({
      next: () => this.cargarTareas(),
      error: (error: HttpErrorResponse) => {
        this.error = this.mensajeError(error);
      },
    });
  }

  eliminar(tarea: Tarea): void {
    if (!window.confirm(`¿Eliminar la tarea "${tarea.titulo}"?`)) {
      return;
    }

    this.tareaService.eliminar(tarea.id).subscribe({
      next: () => this.cargarTareas(),
      error: (error: HttpErrorResponse) => {
        this.error = this.mensajeError(error);
      },
    });
  }

  prioridadTexto(prioridad: number): string {
    return ['Baja', 'Media', 'Alta'][prioridad - 1] ?? 'Media';
  }

  private fechaLocal(fecha: Date): string {
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  }

  private mensajeError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No se pudo conectar con la API. Verifica que el backend y MongoDB estén disponibles.';
    }

    const mensaje = error.error?.message ?? error.error?.title;
    return typeof mensaje === 'string'
      ? mensaje
      : `La solicitud no se completó (HTTP ${error.status}).`;
  }
}
