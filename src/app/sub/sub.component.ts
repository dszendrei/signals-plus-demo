import { HttpClient, HttpClientModule } from "@angular/common/http";
import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  viewChildren,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { bindable } from "ngx-signals-plus";
import { fromEvent, take } from "rxjs";
import { EntryComponent } from "../entry/entry.component";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: "app-sub",
  standalone: true,
  imports: [HttpClientModule, EntryComponent],
  templateUrl: "./sub.component.html",
  styleUrl: "./sub.component.css",
})
export class SubComponent implements OnInit {
  readonly url = input.required<string>();

  readonly subComponentElements = viewChildren(EntryComponent);

  private readonly httpClient = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  readonly subComponents = bindable<Todo[] | undefined>(undefined);

  constructor() {
    const effectRef = effect(() => {
      const elements = this.subComponentElements();
      elements.forEach((element) =>
        fromEvent(element.removeBtn().nativeElement, "click")
          .pipe(take(1), takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            console.log(element.id());
            this.subComponents.set(
              this.subComponents()?.filter((comp) => comp.id !== element.id())
            );
          })
      );
      if (elements.length) {
        effectRef.destroy();
      }
    });
  }

  ngOnInit(): void {
    this.subComponents.bindTo(this.httpClient.get<Todo[]>(this.url()));
  }
}
