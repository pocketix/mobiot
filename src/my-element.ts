import { LitElement, css, html} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { VarObject, ProgramBlock} from './interfaces'
import './vp-editor-element.ts';
import './text-editor-element.ts';
import './var-list-element.ts';
import './options-element.ts';
import './cond-edit-element.ts'

@customElement('my-element')
export class MyElement extends LitElement {
  
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more'

  @property()
  conditions: VarObject[] = [
    {name: 'cond_1', type: 'boolean_expression', value: 'x+5==8'},
    {name: 'cond_2', type: 'boolean_expression', value: 'a*b!=25'},
    {name: 'cond_3', type: 'boolean_expression', value: 'x AND y'}
  ];

  @property()
  program: ProgramBlock[]=[
    {block: {name: "If", simple: false, id: "if"}, arguments: [{name: 'cond_0', type: 'boolean_expression', value: 'x==5'}]},
    {block: {name: "Else", simple: false, id: 'else'}, arguments: []},
    {block: {name: "Send notification", simple: true, id: 'alert'}, arguments: []},
  ];

  @property()
    varList: VarObject[] = [
            { type: 'str', name: 'name', value: 'John' },
            { type: 'num', name: 'age', value: '40' },
            { type: 'bool', name: 'isAdmin', value: 'true' },
            { type: 'expr', name: 'fee', value: 'age *4 + 100' }
            ];;

  render() {
    return html`
      <var-list-element .table=${this.varList} @list-saved=${(e: CustomEvent) => this._varList(e.detail.value)}></var-list-element>
      <cond-edit-element .varList=${this.varList}></cond-edit-element>
      <p>Here is your program:</p>
      <div class="wrapper">
        <text-editor-element class="editor" .program=${this.program}></text-editor-element>
        <vp-editor-element class="editor" .program=${this.program}></vp-editor-element>
      </div>
      <options-element .conditions=${this.conditions} .program=${this.program} @block-saved=${(e: CustomEvent) => this._updateProgram(e.detail.value)}></options-element>
      <p class="read-the-docs">${this.docsHint}</p>
    `
  }

  private _varList(newVar: VarObject[]) {
    this.varList = [ ...newVar] ;
}

private _updateProgram(updatedProgram: ProgramBlock[]) {
  this.program = [ ...updatedProgram ];
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
