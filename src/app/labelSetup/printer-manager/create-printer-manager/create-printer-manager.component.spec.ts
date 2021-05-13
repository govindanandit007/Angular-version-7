import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePrinterManagerComponent } from './create-printer-manager.component';

describe('CreatePrinterManagerComponent', () => {
  let component: CreatePrinterManagerComponent;
  let fixture: ComponentFixture<CreatePrinterManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePrinterManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePrinterManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
