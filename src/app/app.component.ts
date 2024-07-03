import { repl } from './../compiler/main';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { tokenize } from '../compiler/frontend/lexer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  // templateUrl: './app.component.html',
  template: `
    <h1 class="text-center text-3xl font-bold underline">{{ title }}</h1><br>

    <div class="flex place-content-evenly">
      <textarea (keyup)="onChange($event)" type="text" name="" id=""
        class="min-h-[90vh] max-h-[90vh] w-2/5 border border-black font-mono text-sm">  
      </textarea>

      <pre class="h-[90vh] w-2/5 overflow-scroll border border-black text-xs">
        {{ output }}
      </pre>
    </div>
  `,
})
export class AppComponent {
  title = 'Hola Dani 👋👋👋';

  output = '';

  onChange(e: any) {
    try{
      this.output = repl(e.target.value);
      // console.log(tokenize(e.target.value))
    } catch (e: any) {
      this.output = 'Error compilando';
    }
  }
}
