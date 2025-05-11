import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PacienteService } from '../services/paciente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-edit-pacientes',
  imports: [ReactiveFormsModule, MatButtonModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatCardModule, MatIconModule, MatFormFieldModule, CommonModule],
  templateUrl: './add-edit-pacientes.component.html',
  styleUrl: './add-edit-pacientes.component.css'
})
export class AddEditPacientesComponent {
  pacienteService = inject(PacienteService);

  router = inject(Router);
  snackBar = inject(MatSnackBar);
  route = inject(ActivatedRoute);

  doctores = ["Dr. Pérez", "Dra. Gómez", "Dr. Ramírez", "Dra. Torres", "Dr. Castro"];

  pacienteForm: FormGroup;

  isEditmode = false;
  pacienteId: number = 0;

  constructor(private fb: FormBuilder){
    this.pacienteForm = this.fb.group({
      nombre: ["", Validators.required],
      apellidoP: ["", Validators.required],
      apellidoM: ["", Validators.required],
      doctor: ["", Validators.required],
      cita: ["", Validators.required]

  });

  this.route.paramMap.subscribe(params =>{
    const id = params.get("id");

    if(id){
      this.isEditmode = true;
      this.pacienteId = +id;
      this.pacienteService.getPacientes();

      effect(() => {
        const paciente = this.pacienteService.pacientes();
        if(paciente.length > 0){
          this.loadPacienteData(this.pacienteId);
        }
      })
    }
  });

  }

  loadPacienteData(pacienteId: number){
    const paciente = this.pacienteService.getPacientePorId(pacienteId);
    console.log(paciente);
  }

  onSubmit(){
    console.log("Form Submitted");
  }



}
