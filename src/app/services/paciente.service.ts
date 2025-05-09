import { Injectable, signal } from '@angular/core';
import { Paciente } from '../models/paciente.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private pacienteSignal = signal<Paciente[]>([]);

  constructor(private http: HttpClient) { }

  //Obtener TODOS los pacientes
  getPacientes(){
    this.http.get<Paciente[]>('http://localhost:3000/pacientes')
    .subscribe(paciente => this.pacienteSignal.set(paciente));
  }

  get pacientes(){
    return this.pacienteSignal;
  }


  //Añadimos pacientes
  addPaciente(paciente: Paciente){
    this.http.post('http://localhost:3000/pacientes', paciente)
    .subscribe(() => this.getPacientes())
  }

  //Eliminar un paciente
  deletePaciente(id: number){
    this.http.delete(`http://localhost:3000/pacientes/${id}`)
    .subscribe(() => this.getPacientes());
  }

  //Actualizar
  updatePaciente(id: string, updatePaciente: Paciente){
    this.http.put(`http://localhost:3000/pacientes/${id}`, updatePaciente)
    .subscribe(() => this.getPacientes());
  }


  //Obetener paciente por id
  getPacientePorId(id: number){
    return this.pacienteSignal().find(paciente => paciente.id == id);
  }
}
