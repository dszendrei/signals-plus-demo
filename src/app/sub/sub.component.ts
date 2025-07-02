import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sub',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './sub.component.html',
  styleUrl: './sub.component.css',
})
export class SubComponent {
  readonly url = input.required<string>();
  private readonly httpClient = inject(HttpClient);

  readonly subComponents = toSignal(this.httpClient.get<string[]>(this.url()), {
    initialValue: ['default sub component'],
  });
}
