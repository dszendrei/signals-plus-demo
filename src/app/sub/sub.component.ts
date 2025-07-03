import { HttpClient, HttpClientModule } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  viewChild,
} from "@angular/core";
import { bindable } from "ngx-signals-plus";
import { EntryComponent } from "../entry/entry.component";
import { AddEntryComponent } from "../add-entry/add-entry.component";
import { fromEvent, Subject, takeUntil } from "rxjs";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: "app-sub",
  standalone: true,
  imports: [HttpClientModule, EntryComponent, AddEntryComponent],
  templateUrl: "./sub.component.html",
  styleUrl: "./sub.component.css",
})
export class SubComponent implements OnInit, AfterViewInit {
  readonly url = input.required<string>();

  readonly addEntry = viewChild(AddEntryComponent, {
    read: ElementRef<HTMLElement>,
  });

  private readonly httpClient = inject(HttpClient);

  readonly subComponents = bindable<Todo[] | undefined>(undefined);

  constructor() {
    effect((onCleanup) => {
      const destroy$ = new Subject<void>();
      const addEntryComponent = this.addEntry()?.nativeElement;
      if (addEntryComponent) {
        fromEvent(
          addEntryComponent,
          "click",
          () => addEntryComponent.querySelector("input")?.value
        )
          .pipe(takeUntil(destroy$))
          .subscribe((value) => {
            console.log(value);
          });
      }
      onCleanup(() => {
        destroy$.next();
        destroy$.complete();
      });
    });
  }

  ngOnInit(): void {
    this.subComponents.bindTo(this.httpClient.get<Todo[]>(this.url()));
  }

  ngAfterViewInit(): void {
    console.log(this.addEntry());
  }
}
