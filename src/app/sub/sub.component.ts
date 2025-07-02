import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  Component,
  effect,
  EffectRef,
  inject,
  Injector,
  input,
  signal,
  WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-sub',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './sub.component.html',
  styleUrl: './sub.component.css',
})
export class SubComponent {
  readonly url = input.required<string>();

  private readonly injector = inject(Injector);
  private readonly httpClient = inject(HttpClient);

  subComponents: WritableSignal<string[]> = signal(['default sub component']);

  ngOnInit(): void {
    const response = toSignal(this.httpClient.get<Todo[]>(this.url()), {
      injector: this.injector,
    });
    const effectRef: EffectRef = effect(
      () => {
        const responseValue = response();
        if (responseValue !== undefined) {
          this.subComponents.set(responseValue.map((todo) => todo.title));
          effectRef.destroy();
        }
      },
      { injector: this.injector, allowSignalWrites: true }
    );
  }
}
