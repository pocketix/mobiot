import { LitElement, html, TemplateResult, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Argument, ProgramBlock} from './interfaces'
import './block-menu-element.ts'
import './change-val-element.ts'

@customElement('block-element')
export class BlockElement extends LitElement {

    @property()//TODO arguments vizualization
    block: ProgramBlock={block: {name: '', simple: false, id: '', type: 'all', argTypes: []}, arguments: [], hide: false}

    @state()
    private menu: boolean=false;

    @state()
    private args: boolean=false;

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
      if(this.block.arguments.length===1){
        header=html`${this.block.block.name}<span class="condition">${this.block.arguments[0].value}</span>`
      }else{
        if(this.args){
          this.block.arguments.forEach((item)=>{
            header=html`${header}<change-val-element 
              .val=${item} .type=${this.block.block.argTypes[0]} 
              @val-changed=${(e: CustomEvent) => this._changeBlock(e.detail.value, item)}>`//TODO repair in 3rd phase
          })
          header=html`${this.block.block.name}<div>${header}</div><div class="condition" @click=${this._showArguments}>Hide</div>`
        }else{
          header=html`${this.block.block.name}<span class="condition" @click=${this._showArguments}>Arguments...</span>`
        }
      }
    }
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
    this.block.hide=!this.block.hide;
    this.dispatchEvent(new CustomEvent('change-block', {
        detail: { value: this.block },
        bubbles: true,
        composed: true
    }));  
  }

  private _changeBlock(updated: Argument, original: Argument){
    this.block.arguments[this.block.arguments.indexOf(original)]=updated
    this.dispatchEvent(new CustomEvent('change-block', {
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
  private _showArguments(){
    this.args=!this.args;
  }
}

declare global {
    interface HTMLElementTagNameMap {
      'block-element': BlockElement;
    }
  }