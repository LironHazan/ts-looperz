import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuitarLooperComponent } from './guitar-looper.component';

describe('GuitarLooperComponent', () => {
  let component: GuitarLooperComponent;
  let fixture: ComponentFixture<GuitarLooperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuitarLooperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuitarLooperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
