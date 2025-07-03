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
import { bindable, signalFromEvent } from "ngx-signals-plus";
import { EntryComponent } from "../entry/entry.component";
import { AddEntryComponent } from "../add-entry/add-entry.component";

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

  private readonly newEntry = signalFromEvent<MouseEvent, string | undefined>(
    "click",
    {
      target: this.addEntry,
      resultSelector: () =>
        this.addEntry()?.nativeElement.querySelector("input")?.value,
      activate: true,
    }
  );

  constructor() {
    effect(() => console.log(this.newEntry()));
  }

  ngOnInit(): void {
    this.subComponents.bindTo(this.httpClient.get<Todo[]>(this.url()));
  }

  ngAfterViewInit(): void {
    console.log(this.addEntry());
  }
}
