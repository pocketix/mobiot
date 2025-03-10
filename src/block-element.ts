import { LitElement, html, TemplateResult, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ProgramBlock} from './interfaces'
import './block-menu-element.ts'

@customElement('block-element')
export class BlockElement extends LitElement {

    @property()//TODO arguments vizualization
    block: ProgramBlock={block: {name: '', simple: false, id: '', type: 'all', argTypes: []}, arguments: [], hide: false}

    @state()
    private menu: boolean=false;

    private longPressTimeout: any = null;

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
    let hide: TemplateResult=html``;
    let body: TemplateResult=html``;
    if(this.block.arguments.length===0){
      header=html`${this.block.block.name}`;
    }
    else{
      header=html`${this.block.block.name}<span class="condition">${this.block.arguments[0].value}</span>`
    }//TODO check more vars
    if(!this.block.block.simple){
      if(this.block.hide){
        hide=html`<button @click=${this._hideBlock}>Show block contend</button>`
      }
      else{
        hide=html`<button @click=${this._hideBlock}>Hide block contend</button>`
      }
      body=html`
      <div class="content">
      <slot></slot>
    </div>`
    }
    return html`
    ${this.menu === true ? html`
      <block-menu-element isOpen=${this.menu} .block=${this.block} @block-menu=${(e: CustomEvent) => this._blockMenu(e.detail.value)}></block-menu-element>
      ` : ''}
      <div class="header" @contextmenu=${(e: Event) => this._handleRowClick(e)}
          @pointerdown=${() => this._handleLongPress()}
          @pointerup=${() => this._cancelLongPress()}>
        ${header}
      </div>
      ${hide}
      ${body}
    `;
  }

  private _hideBlock(){
    this.dispatchEvent(new CustomEvent('hide-block', {
        detail: { value: this.block },
        bubbles: true,
        composed: true
    }));  
  }

  private _blockMenu(menu: boolean){
    this.menu=menu
  }

  private _handleRowClick(event: Event) {//TODO clean code
      event.preventDefault();
      this.menu=!this.menu;
  }

  private _handleLongPress() {
      this.longPressTimeout = setTimeout(() => {
          this.menu=true;
      }, 500);
  }

  private _cancelLongPress() {
      clearTimeout(this.longPressTimeout);
  }
}

declare global {
    interface HTMLElementTagNameMap {
      'block-element': BlockElement;
    }
  }