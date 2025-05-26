import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdicionarPage } from './adicionar.page';

describe('AdicionarPage', () => {
  let component: AdicionarPage;
  let fixture: ComponentFixture<AdicionarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdicionarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
