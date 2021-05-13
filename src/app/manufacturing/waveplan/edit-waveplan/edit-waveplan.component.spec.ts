import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWaveplanComponent } from './edit-waveplan.component';

describe('EditWaveplanComponent', () => {
  let component: EditWaveplanComponent;
  let fixture: ComponentFixture<EditWaveplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWaveplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWaveplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
