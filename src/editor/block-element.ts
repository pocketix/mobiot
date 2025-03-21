import { LitElement, html, TemplateResult, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Argument, ProgramBlock} from '../general/interfaces.ts'
import { CondText } from '../general/cond-text.ts';
import './block-menu-element.ts'
import './change-val-element.ts'
import '../condition/cond-edit-element.ts'

@customElement('block-element')
export class BlockElement extends LitElement {

    @property()
    block: ProgramBlock={block: {name: '', simple: false, id: '', type: 'all', argTypes: []}, arguments: [], hide: false}

    @state()
    private menu: boolean=false;

    @state()
    private args: boolean=false;

    @property()
    detail: boolean=false;

    private longPressTimeout: any = null;

    static styles = css`
    :host {
      display: block;
      border: 2px solid #333;
      border-radius: 8px;
      background-color: #e0e0e0;
      margin: 8px;
    }
    .header {
      padding: 8px;
      color: white;
      font-weight: bold;
      border-radius: 4px 4px 0 0;
    }

    .content {
      min-height: 20px;
      padding: 8px;
      border-radius: 0 0 4px 4px;
    }

    .condition {
      padding: 4px 8px;
      margin: 4px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      background-color: #ddd;
      color: black;
      font-weight: normal;
    }

    .focus-arg {
      padding: 4px 8px;
      margin: 4px 20px;
      border: none;
      color: white;
      font-weight: bold;
      border-radius: 8px;
      background-color: gray;
    }

    .focus-block {
      border: 4px solid red;
      position: relative;
      z-index: 1000;
    }

    .detail {
      display: block;
      left: 0;
      width: 100vw;
      margin-left: calc(-50vw + 50%);
    }

    .hide {
      background-color: #e0e0e0;
      color: black;
      border: 1px solid transparent;
      font-size: 1em;
    }

    .menu {
      position: relative;
      z-index: 100;
    }

    .branch { background-color: #7da7d9; }
    .cycle { background-color: rgb(106, 175, 108); }
    .dev { background-color: #ff9800; }
    .alert { background-color:rgb(255, 108, 108); }
    .end { background-color:rgb(226, 192, 0); }
    .set_var { background-color: #E2A7F0; } 
    .branch-body { background-color:rgb(179, 200, 224); }
    .cycle-body { background-color: #d4f1c5; }
  `;
  render() {
    let header: TemplateResult=html``;
    let hide: TemplateResult=html``;
    let body: TemplateResult=html``;
    const original: ProgramBlock=structuredClone(this.block)
    if(this.block.block.argTypes.length===0){
      header=html`${this.block.block.name}`;
    }
    else{
      if(this.block.arguments.length!=this.block.block.argTypes.length){
        this.block.arguments.forEach((item)=>{
          header=html`${header}<div class="condition">${item.type==='boolean_expression'? CondText(item.args[0]):item.value}</div>`
        })
        for(let i=this.block.arguments.length;i<this.block.block.argTypes.length;i++){
          header=html`${header}<div class="${i===this.block.arguments.length ? 'focus-arg':'condition'}">Add argument: ${this.block.block.argTypes[i]}</div>`
        }
        header=html`${this.block.block.name} ${header}`
      }else if(this.block.arguments.length===1){
        if(this.block.arguments[0].type==='boolean_expression'){
          header=html`${this.block.block.name}<cond-edit-element 
            .newMode=${false} .block=${this.block.arguments[0]} .selectedBlock=${this.block.arguments[0]} .title=${CondText(this.block.arguments[0].args[0])}
            @cond-update=${(e: CustomEvent) => this._changeBlock(e.detail.value)}
            @cond-clean=${() => this._changeBlock(original.arguments[0])}></cond-edit-element>`
        }else{
          header=html`${this.block.block.name}<change-val-element 
            .val=${this.block.arguments[0]} .type=${this.block.block.argTypes[0]}
            @val-changed=${(e: CustomEvent) => this._changeBlock(e.detail.value)}></change-val-element>`
        }
      }else{
        if(this.args){
          this.block.arguments.forEach((item)=>{
            header=html`${header}<change-val-element 
              .val=${item} .type=${this.block.block.argTypes[0]}
              @val-changed=${(e: CustomEvent) => this._changeBlock(e.detail.value)}>`
          })
          header=html`${this.block.block.name}<div>${header}</div><div class="condition" @click=${this._showArguments}>Hide</div>`
        }else{
          header=html`${this.block.block.name}<span class="condition" @click=${this._showArguments}>Arguments...</span>`
        }
      }
    }
    if(!this.block.block.simple){
      if(this.block.hide){
        hide=html`<button class="hide" @click=${this._hideBlock}>Show block contend</button>`
      }
      else{
        hide=html`<button class="hide" @click=${this._hideBlock}>Hide block contend</button>`
      }
      body=html`
      <div class="content ${this.block.block.type==='branch'? 'branch-body':'cycle-body'}">
      <slot></slot>
    </div>`
    }
    return html`
    ${this.menu === true ? html`
      <block-menu-element class="menu" 
        isOpen=${this.menu} .block=${this.block} 
        @block-menu=${(e: CustomEvent) => this._blockMenu(e.detail.value)}
        @detail-block=${() => this._detailBlock()}></block-menu-element>
      ` : ''}
      <div class="${this.menu===true ? 'focus-block' : ''}">
      <div class="${this.detail ? 'detail' : ''}">
      <div class="header ${this.block.block.type}" 
          @pointerdown=${() => this._handleLongPress()}
          @pointerup=${() => this._cancelLongPress()}>
        ${header} ${this.detail ? html`<button class="${this.block.block.type}" @click=${()=>this._detailBlock()}>End</button>`:''}
      </div>
      ${hide}
      ${body}
      </div>
      </div>
    `;
  }//TODO change End for icon

  private _hideBlock(){
    this.block.hide=!this.block.hide;
    this.dispatchEvent(new CustomEvent('change-block', {
        detail: { value: this.block },
        bubbles: true,
        composed: true
    }));  
  }

  private _changeBlock(updated: Argument){
    this.block.arguments[0]=updated;
    this.dispatchEvent(new CustomEvent('change-block', {
        detail: { value: this.block },
        bubbles: true,
        composed: true
    }));  
  }

  private _blockMenu(menu: boolean){
    this.menu=menu
  }

  private _detailBlock(){
    this.detail=!this.detail;
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