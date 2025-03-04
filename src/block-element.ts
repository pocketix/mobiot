import { LitElement, html, TemplateResult, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ProgramBlock} from './interfaces'

@customElement('block-element')
export class BlockElement extends LitElement {

    @property()
    block: ProgramBlock={block: {name: '', simple: false, id: ''}, arguments: []}

    static styles = css`
    :host {
      display: block;
      border: 2px solid #333;
      border-radius: 8px;
      padding: 8px;
      background-color: #e0e0e0;
      margin: 8px;
    }
    .header {
      background-color: #7da7d9;
      padding: 8px;
      color: white;
      font-weight: bold;
      border-radius: 4px 4px 0 0;
    }

    .content {
      background-color: #d4f1c5;
      min-height: 50px;
      padding: 8px;
      border-radius: 0 0 4px 4px;
    }

    .condition {
      background-color: white;
      color: #333;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8em;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `;
  render() {
    let header: TemplateResult=html``;
    if(this.block.arguments.length===0){
      header=html`${this.block.block.name}`;
    }
    else{
      header=html`${this.block.block.name}<span class="condition">${this.block.arguments[0].value}</span>`
    }//TODO check more vars
    return html`
      <div class="header">${header}</div>
      <div class="content">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
    interface HTMLElementTagNameMap {
      'block-element': BlockElement;
    }
  }