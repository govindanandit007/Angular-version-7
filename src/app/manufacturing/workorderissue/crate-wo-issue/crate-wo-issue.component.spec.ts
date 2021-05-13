import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrateWoIssueComponent } from './crate-wo-issue.component';

describe('CrateWoIssueComponent', () => {
  let component: CrateWoIssueComponent;
  let fixture: ComponentFixture<CrateWoIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrateWoIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrateWoIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
