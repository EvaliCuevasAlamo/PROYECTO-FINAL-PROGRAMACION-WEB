import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPacientesComponent } from './add-edit-pacientes.component';

describe('AddEditPacientesComponent', () => {
  let component: AddEditPacientesComponent;
  let fixture: ComponentFixture<AddEditPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditPacientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
