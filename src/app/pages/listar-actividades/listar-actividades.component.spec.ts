import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarActividadesComponent } from './listar-actividades.component';

describe('ListarActividadesComponent', () => {
  let component: ListarActividadesComponent;
  let fixture: ComponentFixture<ListarActividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarActividadesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
