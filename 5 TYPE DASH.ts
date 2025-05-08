import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PatientsService } from '../../core/services/patients.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('patientsChart') chartRef!: ElementRef;
  
  // Datos de pacientes
  patients: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  
  // Formulario
  patientForm: any = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    doctor: '',
    fecha: '',
    hora: ''
  };
  
  // UI States
  showDialog = false;
  isEditMode = false;
  currentPatientId: string | null = null;
  loading = false;
  
  // Datos de ejemplo
  patientsToday = 0;
  patientsWeek = 0;
  doctors = ['Dr. Juan Pérez', 'Dra. Ana Sánchez', 'Dr. Luis García', 'Dra. Patricia Ruiz'];
  chart: Chart | undefined;

  constructor(
    private authService: AuthService,
    private patientsService: PatientsService,
    private router: Router
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  loadPatients(): void {
    this.patientsService.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.calculateStats();
        this.renderChart();
        this.totalPages = Math.ceil(this.patients.length / this.pageSize);
      },
      error: (err) => {
        console.error('Error loading patients', err);
      }
    });
  }

  calculateStats(): void {
    const today = new Date().toDateString();
    this.patientsToday = this.patients.filter(p => {
      return new Date(p.fecha).toDateString() === today;
    }).length;
    
    this.patientsWeek = this.patients.length;
  }

  renderChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    
    const doctorCounts = this.doctors.map(doctor => {
      return this.patients.filter(p => p.doctor === doctor).length;
    });
    
    const ctx = this.chartRef.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.doctors,
        datasets: [{
          label: 'Pacientes',
          data: doctorCounts,
          backgroundColor: [
            'rgba(52, 152, 219, 0.7)',
            'rgba(155, 89, 182, 0.7)',
            'rgba(46, 204, 113, 0.7)',
            'rgba(241, 196, 15, 0.7)'
          ],
          borderColor: [
            'rgba(52, 152, 219, 1)',
            'rgba(155, 89, 182, 1)',
            'rgba(46, 204, 113, 1)',
            'rgba(241, 196, 15, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  openAddPatientDialog(): void {
    this.isEditMode = false;
    this.patientForm = {
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      doctor: '',
      fecha: '',
      hora: ''
    };
    this.showDialog = true;
  }

  editPatient(patient: any): void {
    this.isEditMode = true;
    this.currentPatientId = patient.id;
    this.patientForm = {
      nombre: patient.nombre,
      apellidoPaterno: patient.apellidoPaterno,
      apellidoMaterno: patient.apellidoMaterno,
      doctor: patient.doctor,
      fecha: patient.fecha.split('T')[0],
      hora: patient.hora
    };
    this.showDialog = true;
  }

  savePatient(): void {
    if (!this.patientForm.nombre || !this.patientForm.apellidoPaterno || 
        !this.patientForm.apellidoMaterno || !this.patientForm.doctor || 
        !this.patientForm.fecha || !this.patientForm.hora) {
      return;
    }
    
    this.loading = true;
    
    if (this.isEditMode && this.currentPatientId) {
      this.patientsService.updatePatient(this.currentPatientId, this.patientForm).subscribe({
        next: () => {
          this.closeDialog();
          this.loadPatients();
        },
        error: (err) => {
          console.error('Error updating patient', err);
          this.loading = false;
        }
      });
    } else {
      this.patientsService.addPatient(this.patientForm).subscribe({
        next: () => {
          this.closeDialog();
          this.loadPatients();
        },
        error: (err) => {
          console.error('Error adding patient', err);
          this.loading = false;
        }
      });
    }
  }

  deletePatient(id: string): void {
    if (confirm('¿Está seguro de eliminar este paciente?')) {
      this.patientsService.deletePatient(id).subscribe({
        next: () => {
          this.loadPatients();
        },
        error: (err) => {
          console.error('Error deleting patient', err);
        }
      });
    }
  }

  closeDialog(): void {
    this.showDialog = false;
    this.loading = false;
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}