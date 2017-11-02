import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressHudComponent } from './progress-hud.component';

describe('ProgressHudComponent', () => {
  let component: ProgressHudComponent;
  let fixture: ComponentFixture<ProgressHudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressHudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressHudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
