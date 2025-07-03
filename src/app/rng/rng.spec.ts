import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rng } from './rng';

describe('Rng', () => {
  let component: Rng;
  let fixture: ComponentFixture<Rng>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rng]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rng);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
