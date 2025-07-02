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
import { bindable, BindableSignal } from 'ngx-signals-plus';
import { map } from 'rxjs';

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

  private readonly httpClient = inject(HttpClient);

  readonly subComponents: BindableSignal<string[]> = bindable([
    'default sub component',
  ]);

  ngOnInit(): void {
    this.subComponents.bindTo(
      this.httpClient
        .get<Todo[]>(this.url())
        .pipe(map((todos) => todos.map((todo) => todo.title)))
    );
  }
}
