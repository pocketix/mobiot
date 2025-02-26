import { LitElement, html, TemplateResult, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('block-element')
export class BlockElement extends LitElement {
    @property({ type: String })
    title: string = 'Blok';

    @property({ type: String })
    condition: string = '';

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
    if(this.condition===''){
      header=html`${this.title}`;
    }
    else{
      header=html`${this.title}<span class="condition">${this.condition}</span>`
    }
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