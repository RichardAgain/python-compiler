import { ast, repl } from './../compiler/main';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { tokenize } from '../compiler/frontend/lexer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  // templateUrl: './app.component.html',
  template: `
    <h1 class="text-center text-3xl font-bold">{{ title }}</h1><br>

    <div class="flex place-content-evenly">
      <textarea (keyup)="onChange($event)" (keydown)="onKeyDown($event)" type="text"
        class="min-h-[90vh] max-h-[90vh] w-2/5 border border-black font-mono text-sm">  
      </textarea>

      <div class="h-[90vh] w-2/5">
        <div class="h-[5vh] flex">
          <button (click)="changeState(2)" class="solid border-black border-[1px] px-3"> INTERPRETER </button>
          <button (click)="changeState(1)" class="solid border-black border-[1px] px-3"> AST </button>
          <button (click)="changeState(0)" class="solid border-black border-[1px] px-3"> TOKENS </button>
        </div>
        <pre class="overflow-scroll border border-black text-xs h-[85vh]">
          {{ output }}
        </pre>
      </div>
    </div>
  `,
})
export class AppComponent {
  title = 'Python Compiler';

  input = ''
  output = ''
  state:number = 2
  color = 'black'

  ngOnInit() {
    this.render();
  }

  onChange(e: any) {
    this.input = e.target.value
    this.render()
  }

  render () {
    try{
      // this.color = 'black'
      if (this.state == 0) this.output = JSON.stringify(tokenize(this.input), null, 4)
      if (this.state == 1) this.output = ast(this.input)
      if (this.state == 2) this.output = repl(this.input)
    } catch (e: any) {
      // this.color = 'red-600'
      this.output = e.message;
    }
  }

  changeState(n: number) {
    this.state = n
    this.render()
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
  
      textarea.value = textarea.value.substring(0, start) + '\t' + textarea.value.substring(end);  
      textarea.selectionStart = textarea.selectionEnd = start + 1;
    }
  }
}
