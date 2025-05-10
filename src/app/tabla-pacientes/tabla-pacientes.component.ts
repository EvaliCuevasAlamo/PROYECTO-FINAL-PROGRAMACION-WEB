import { Component, effect, inject, ViewChild, viewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator'
import { MatSnackBar, MatSnackBarAction, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTableDataSource } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card';
import { PacienteService } from '../services/paciente.service';
import { Paciente } from '../models/paciente.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tabla-pacientes',
  imports: [MatTableModule, MatPaginatorModule, MatSnackBarModule, MatButtonModule, MatCardModule, RouterModule],
  templateUrl: './tabla-pacientes.component.html',
  styleUrl: './tabla-pacientes.component.css'
})
export class TablaPacientesComponent {
  pacientesService = inject(PacienteService);
  snackBar = inject(MatSnackBar);

  columnasVisibles: string[] = ["id", "nombre", "apellidoP", "apellidoM", "doctor", "cita", "actions"]

  dataSource = new MatTableDataSource<Paciente>();

  totalItems: number = 0;
  pageSize: number = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pacientes = this.pacientesService.pacientes;

  constructor(){
    this.pacientesService.getPacientes();

    effect(() => {
      const pacientes = this.pacientes();
      console.log(this.dataSource);
      this.dataSource.data = pacientes;
      this.totalItems = pacientes.length;
    })
  }

  onPageChange(event: any){
    this.pageSize = event.pageSize;
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }

}
