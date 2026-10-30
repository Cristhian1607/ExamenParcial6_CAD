import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  it('loads the task dashboard', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const requests = TestBed.inject(HttpTestingController);
    requests.expectOne((request) => request.url === '/api/tareas').flush([]);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Agenda clara');
    expect(fixture.nativeElement.textContent).toContain('Aún no hay tareas aquí');
    requests.verify();
  });
});
