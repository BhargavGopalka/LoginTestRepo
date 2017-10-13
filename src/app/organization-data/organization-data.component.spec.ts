import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationDataComponent } from './organization-data.component';

describe('OrganizationDataComponent', () => {
  let component: OrganizationDataComponent;
  let fixture: ComponentFixture<OrganizationDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
