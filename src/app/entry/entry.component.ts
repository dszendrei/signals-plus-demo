import { Component, ElementRef, input, viewChild } from '@angular/core';

@Component({
  selector: 'app-entry',
  standalone: true,
  imports: [],
  templateUrl: './entry.component.html',
  styleUrl: './entry.component.css',
})
export class EntryComponent {
  readonly title = input.required<string>();
  readonly id = input.required<number>();

  readonly removeBtn = viewChild.required('remove', { read: ElementRef });
}
