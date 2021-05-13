import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWaveComponent } from './edit-wave.component';

describe('EditWaveComponent', () => {
  let component: EditWaveComponent;
  let fixture: ComponentFixture<EditWaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
