import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWaveplanComponent } from './create-waveplan.component';

describe('CreateWaveplanComponent', () => {
  let component: CreateWaveplanComponent;
  let fixture: ComponentFixture<CreateWaveplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWaveplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWaveplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
