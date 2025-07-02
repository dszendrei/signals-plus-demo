import { Component } from '@angular/core';
import { SubComponent } from './sub/sub.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SubComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly url = 'https://jsonplaceholder.typicode.com/todos';
}
