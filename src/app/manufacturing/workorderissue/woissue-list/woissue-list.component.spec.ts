import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WoissueListComponent } from './woissue-list.component';

describe('WoissueListComponent', () => {
  let component: WoissueListComponent;
  let fixture: ComponentFixture<WoissueListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WoissueListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WoissueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
