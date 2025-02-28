import { LitElement, TemplateResult, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import './vp-editor-element.ts';
import './text-editor-element.ts';
import './var-list-element.ts'

type TypeOption = 'num' | 'str' | 'bool' | 'expr';

interface VarObject {
    type: TypeOption | null;
    name: string;
    value: string;
}

@customElement('my-element')
export class MyElement extends LitElement {
  
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more'

  @property()
  blocks = [
    {name: "If", condition: true, simple: false, code: "if("},
    {name: "Else", condition: false, simple: false, code: "else{\n"},
    {name: "Send notification", condition: false, simple: true, code: "fun send_notif()\n"},
    {name: "End of block", condition: false, simple: true, code: "}\n"}
  ];

  @property()
  conditions = ['x+5==8','a*b!=25','x AND y'];

  @property()menuCondition=false;

  @property()
  program=[
    {name: "If", simple: false, condition: 'x==5', code: "if("},
    {name: "Else", simple: false, condition: '', code: "else{\n"},
    {name: "send notification", simple: true, condition: '', code: "fun send_notif()\n"},
  ];

  @property()
    varList: VarObject[] = [
            { type: 'str', name: 'name', value: 'John' },
            { type: 'num', name: 'age', value: '40' },
            { type: 'bool', name: 'isAdmin', value: 'true' },
            { type: 'expr', name: 'fee', value: 'age *4 + 100' }
            ];;

  render() {
    const listCode: TemplateResult[]=[];
    if(!this.menuCondition){
      this.blocks.forEach((block)=>{
        listCode.push(html`<li><button @click=${() => this._addToProgram(block)}>${block.name}</button></li>`);
    });
    }else{
      this.conditions.forEach((condition)=>{
        listCode.push(html`<li><button @click=${() => this._addCondition(condition)}>${condition}</button></li>`);
    });
  }

    return html`
      <var-list-element .table=${this.varList} @list-saved=${(e: CustomEvent) => this._varList(e.detail.value)}></var-list-element>
      <p>Here is your program:</p>
      <div class="wrapper">
        <text-editor-element class="editor" .program=${this.program}></text-editor-element>
        <vp-editor-element class="editor" .program=${this.program}></vp-editor-element>
      </div>
      <ul>
        ${listCode}
      </ul>
      <p class="read-the-docs">${this.docsHint}</p>
    `
  }

  private _addToProgram(input: { name: string; condition: boolean; simple: boolean; code: string}) {
    let conditionText='';
    if(input.condition){
      conditionText="add condition";
      this.menuCondition=true;
    }
    this.program=[...this.program, {name: input.name, simple: input.simple, condition: conditionText, code: input.code}]
  }

  private _addCondition(text: string) {
    let block=this.program.pop();
    if(block){
      block.condition=text;
      this.menuCondition=false;
      this.program=[...this.program, block];
    }
  }

  private _varList(newVar: VarObject[]) {
    this.varList = [ ...newVar] ;
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
