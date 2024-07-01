import { repl } from './../compiler/main';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  // templateUrl: './app.component.html',
  template: `
    <h1 class="text-center text-3xl font-bold underline">Hello world!</h1>

    <div class="flex place-content-evenly">
      <textarea (keyup)="onChange($event)" type="text" name="" id=""
        class="h-[90vh] w-2/5 border border-black font-mono text-sm">  
      </textarea>

      <pre class="h-[90vh] w-2/5 overflow-scroll border border-black text-xs">
        {{ output }}
      </pre
      >
    </div>
  `,
})
export class AppComponent {
  title = 'Hola Dani 👋👋👋';

  output = repl('x + 1 * 2');

  onChange(e: any) {
    console.log(e.target.value);
    try{
      this.output = repl(e.target.value);
    } catch (e: any) {
      this.output = 'Error compilando';
    }
  }
}
