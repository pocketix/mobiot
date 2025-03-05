import { LitElement, css, html, TemplateResult} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { VarObject, ProgramBlock, View} from './interfaces'
import './vp-editor-element.ts';
import './text-editor-element.ts';
import './var-list-element.ts';
import './options-element.ts';
import './cond-edit-element.ts'
import './menu-element.ts'

@customElement('my-element')
export class MyElement extends LitElement {
  
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more'

    @property()
    programText: string=''

    @property()
    view: View='both';

  @property()
  conditions: VarObject[] = [//TODO argument
    {name: 'cond_1', value: [{type: 'boolean_expression', value: 'x+5==8', args: []}]},
    {name: 'cond_2', value: [{type: 'boolean_expression', value: 'a*b!=8', args: []}]},
    {name: 'cond_3', value: [{type: 'boolean_expression', value: 'x AND y', args: []}]}
  ];

  @property()
  program: ProgramBlock[]=[
    {block: {name: "If", simple: false, id: "if"}, arguments: [{type: 'boolean_expression', value: 'x==5', args: []}]},
    {block: {name: "Else", simple: false, id: 'else'}, arguments: []},
    {block: {name: "Send notification", simple: true, id: 'alert'}, arguments: []},
  ];

  @property()
    varList: VarObject[] = [
            { name: 'name', value: [{type: 'str',value: 'John', args: []}] },
            { name: 'age', value: [{type: 'num',value: '40', args: []}] },
            { name: 'isAdmin', value: [{type: 'bool',value: 'true', args: []}] },
            { name: 'fee', value: [{type: 'expr',value: 'a + b == 6', args: []}] }
            ];

  render() {
    let chooseView: TemplateResult=html``;
    if(this.view==='both'){
      chooseView=html`
        <div class="wrapper">
          <vp-editor-element class="editor" .program=${this.program}></vp-editor-element>
          <text-editor-element class="editor" .program=${this.program}></text-editor-element>
        </div>`
    }
    else if(this.view==='vp'){
      chooseView=html`
        <vp-editor-element class="editor" .program=${this.program}></vp-editor-element>`
    }else{
      chooseView=html`
        <text-editor-element class="editor" .program=${this.program}></text-editor-element>`
    }
    return html`
      <menu-element 
        .programText=${this.programText} 
        @program-saved=${(e: CustomEvent) => this._saveText(e.detail.value)}
        .varList=${this.varList}
        @list-saved=${(e: CustomEvent) => this._varList(e.detail.value)}
        .view=${this.view}
        @view-saved=${(e: CustomEvent) => this._updateView(e.detail.value)}
        @cond-saved=${(e: CustomEvent) => this._addCond(e.detail.value)}></menu-element>
      <p>Here is your program:</p>
      ${chooseView}
      <options-element .conditions=${this.conditions} .program=${this.program} @block-saved=${(e: CustomEvent) => this._updateProgram(e.detail.value)}></options-element>
      <p class="read-the-docs">${this.docsHint}</p>
    `
  }

  private _varList(newVar: VarObject[]) {
    this.varList = [ ...newVar] ;
}

private _updateView(newView: View) {
  this.view = newView ;
}

private _updateProgram(updatedProgram: ProgramBlock[]) {
  this.program = [ ...updatedProgram ];
}

private _saveText(newProgram: string) {
  this.programText=newProgram ;
}

private _addCond(newCond: VarObject){
  this.conditions=[...this.conditions, newCond]
}

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }
    .wrapper {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .editor{
      flex: 1;
    }

    .card {
      padding: 2em;
    }

    .read-the-docs {
      color: #888;
    }

    ::slotted(h1) {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
