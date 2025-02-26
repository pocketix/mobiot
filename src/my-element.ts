import { LitElement, TemplateResult, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import './vp-editor-element.ts';

@customElement('my-element')
export class MyElement extends LitElement {
  
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more'

  @property()
  blocks = [
    {name: "If", condition: true, simple: false},
    {name: "Else", condition: false, simple: false},
    {name: "Send notification", condition: false, simple: true},
    {name: "End of block", condition: false, simple: true}
  ];

  @property()
  conditions = ['x+5==8','a*b!=25','x AND y'];

  @property()menuCondition=false;

  @property()
  program=[
    {name: "If", simple: false, condition: 'x==5'},
    {name: "Else", simple: false, condition: ''},
    {name: "send notification", simple: true, condition: ''},
  ];
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
      <p>Here is your program: ${this.program}</p>
      <ul>
        ${listCode}
      </ul>
      <vp-editor-element .program=${this.program}></vp-editor-element>
      <p class="read-the-docs">${this.docsHint}</p>
    `
  }

  private _addToProgram(input: { name: string; condition: boolean; simple: boolean; }) {
    let conditionText='';
    if(input.condition){
      conditionText="add condition";
      this.menuCondition=true;
    }
    this.program=[...this.program, {name: input.name, simple: input.simple, condition: conditionText}]
  }

  private _addCondition(text: string) {
    let block=this.program.pop();
    if(block){
      block.condition=text;
      this.menuCondition=false;
      this.program=[...this.program, block];
    }
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
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
