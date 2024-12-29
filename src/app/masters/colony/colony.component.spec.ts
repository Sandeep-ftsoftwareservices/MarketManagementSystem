import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColonyComponent } from './colony.component';

describe('ColonyComponent', () => {
  let component: ColonyComponent;
  let fixture: ComponentFixture<ColonyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColonyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColonyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
