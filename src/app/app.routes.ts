import { Routes } from '@angular/router';
import { AddEditPacientesComponent } from './add-edit-pacientes/add-edit-pacientes.component';
import { ListaPacientesComponent } from './lista-pacientes/lista-pacientes.component';
import { TablaPacientesComponent } from './tabla-pacientes/tabla-pacientes.component';

export const routes: Routes = [

    {path: 'nuevo', component: AddEditPacientesComponent},
    {path: 'dashboard', component:TablaPacientesComponent},
    {path: 'lista', component:ListaPacientesComponent}

    


];
