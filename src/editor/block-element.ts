import { LitElement, html, TemplateResult, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Argument, ProgramBlock} from '../general/interfaces.ts'
import { CondText } from '../general/cond-text.ts';
import { consume} from '@lit/context';
import { detailGeneralExport} from '../general/context';
import { LangCode, transl } from '../general/language.ts';
import './block-menu-element.ts'
import './change-val-element.ts'
import '../condition/cond-edit-element.ts'
import '../icons/block-icon.ts'
import '../icons/drag-drop-icon.ts'
import '../icons/detail-end-icon.ts'

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

    @property()
    startIndex: boolean=false;

    @property()
    endIndex: boolean=false;

    @consume({ context: detailGeneralExport, subscribe: true})
    @property({attribute: false})
    detailGeneral: boolean=false;

    @property({ attribute: false })
    currentLang: LangCode = 'en';

    private longPressTimeout: any = null;

    static styles = css`
    :host {
      display: block;
      border: 2px solid #333;
      border-radius: 8px;
      background: #e0e0e0;
      margin: 4px;
    }

    button {
      border: 2px solid #fff;
      border-radius: 8px;
    }
    
    .header {
      padding: 6px 2px;
      color: white;
      font-weight: bold;
      border-radius: 4px 4px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header .center {
      flex: 1; 
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .header .right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    .header .left {
      display: flex;
      justify-content: flex-start;
      padding: 8px 8px;
      margin: 2px 8px;
      align-items: center;
    }

    .content {
      min-height: 20px;
      padding: 4px;
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
      background: linear-gradient(135deg, gray, rgb(170, 170, 170));
    }

    .focus-block {
      border: 4px solid red;
      position: relative;
      z-index: 1000;
      background: #e0e0e0;
    }

    .detail {
      display: block;
      left: 0;
      width: 100vw;
      margin-left: calc(-50vw + 50%);
      background: #e0e0e0;
      border: 4px solid red;
    }

    @media (min-width: 426px) {
      .detail {
        max-width: 1200px;
        margin: 0 auto;
        width: 105%;
      }
    }

    .hide {
      background: #e0e0e0;
      color: black;
      border: 1px solid transparent;
      font-size: 1em;
    }

    .menu {
      position: relative;
      z-index: 100;
    }

    .branch {
      background: linear-gradient(135deg, #7da7d9, #96b9e1);
    }
    .cycle {
      background: linear-gradient(135deg, rgb(106, 175, 108), rgb(136, 205, 138));
    }
    .dev {
      background: linear-gradient(135deg, #ff9800, #ffb733);
    }
    .alert {
      background: linear-gradient(135deg, rgb(255, 108, 108), rgb(255, 138, 138));
    }
    .end {
      background: linear-gradient(135deg, rgb(226, 192, 0), rgb(236, 206, 64));
    }
    .set_var {
      background: linear-gradient(135deg, #E2A7F0, #ebbef5);
    }
    .branch-body {
      background: linear-gradient(135deg, rgb(179, 200, 224), rgb(199, 215, 234));
    }
    .cycle-body {
      background: linear-gradient(135deg, #d4f1c5, #e1f7d7);
    }
  `;
  render() {
    this._endDetail();
    let header: TemplateResult=html``;
    let hide: TemplateResult=html``;
    let body: TemplateResult=html``;

    if(this.block.block.argTypes.length===0){
      header=html`${this.block.block.type==='dev' ? html`<block-icon height="${true}" type="dev"></block-icon>` :
        html`<block-icon height="${true}" type=${this.block.block.id}></block-icon>`} ${transl(this.block.block.name)}`;
    }
    else {
      header=this._drawHeader();
    }
    header=html`${header}${this._addText(this.block.block.id)}`;

    if(!this.block.block.simple){
      if(this.block.hide){
        hide=html`<button class="hide" @click=${()=>this._changeBlock()}>▼ ${transl('showBlock')}</button>`
      }
      else{
        hide=html`<button class="hide" @click=${()=>this._changeBlock()}>▲ ${transl('hideBlock')}</button>`
      }
      body=html`
      <div class="content ${this.block.block.type==='branch'? 'branch-body':'cycle-body'}">
        <slot></slot>
      </div>`
    }
    
    return html`
    ${this.menu === true ? html`
      <block-menu-element class="menu" .currentLang=${this.currentLang}
        isOpen=${this.menu} .block=${this.block} .startIndex=${this.startIndex} .endIndex=${this.endIndex}
        @block-menu=${(e: CustomEvent) => this._blockMenu(e.detail.value)}
        @detail-block=${(e: Event) => { e.stopPropagation(); this._detailBlock()}}></block-menu-element>
      ` : ''}
      <div class="${this.menu===true ? 'focus-block' : ''}">
      <div class="${this.detail ? 'detail' : ''}">
        <div class="header ${this.block.block.type}" @pointerdown=${() => this._handleLongPress()} @pointerup=${() => this._cancelLongPress()} 
          @contextmenu=${(e: MouseEvent) => this._handleRightClick(e)}>
          ${!this.detailGeneral ? html`<button class="left ${this.block.block.type}" draggable="true"
            @pointerdown=${(e: PointerEvent) => e.stopPropagation()} @pointerup=${(e: PointerEvent) => e.stopPropagation()}
            @touchstart=${(e: TouchEvent) => {e.stopPropagation(); this._handleTouchStart(e);}}
            @click=${() => this._showZone()}><drag-drop-icon></drag-drop-icon></button>`:''}
          <div class="center">${header}</div> ${this.detail ? html`<div class="right">
          <button class="${this.block.block.type}" @click=${()=>this._detailBlock()}><detail-end-icon></detail-end-icon> </button></div>`:''}
        </div>
      ${hide}
      ${body}
    `;
  }

  private _endDetail(){
    if(!this.detailGeneral){
      this.detail=false;
    }
  }

  private _addText(id: string): string{
    if(['while', 'if', 'elseif', 'else'].includes(id)){
      return transl(' do') + ": ";
    }
    return'';
  }

  private _drawHeader(): TemplateResult{
    if(this.block.arguments.length!=this.block.block.argTypes.length) return this._notCompleteArgs();
    else return this._completeArgs();
  }

  private _notCompleteArgs(): TemplateResult{
    let header: TemplateResult=html``;
    this.block.arguments.forEach((item)=>{
      header=html`${header}<div class="condition">${item.value==='' ? CondText(item):item.value}</div>`
    })

    for(let i=this.block.arguments.length;i<this.block.block.argTypes.length;i++){
      header=html`${header}<div class="${i===this.block.arguments.length ? 'focus-arg':'condition'}">
        ${transl('addArgument')} ${this.block.block.argTypes[i]==='note' ? 'all' : transl(this.block.block.argTypes[i])}</div>`
    }

    header=html`${this.block.block.type==='dev' ? html`<block-icon height="${true}" type="dev"></block-icon>` :
      html`<block-icon height="${true}" type=${this.block.block.id}></block-icon>`} ${transl(this.block.block.name)}<div> ${header}</div>`
    return header;
  }

  private _completeArgs(): TemplateResult{
    const original: ProgramBlock=structuredClone(this.block);
    let header: TemplateResult=html``;

    this.block.arguments.forEach((item)=>{
      let argType=this.block.block.argTypes[this.block.arguments.indexOf(item)];
      let index=this.block.arguments.indexOf(item)

      if(argType==='cond'){
        header=html`${header}<cond-edit-element .currentLang=${this.currentLang}
          .newMode=${false} .block=${{type: 'cond',value:'', args: [item]}} .selectedBlock=${item} .title=${CondText(item)}
          @cond-update=${(e: CustomEvent) => this._changeBlock(e.detail.value, index)}
          @cond-clean=${() => this._changeBlock(original.arguments[index], index)}></cond-edit-element>`
      }else{
        header=html`${header}<change-val-element .currentLang=${this.currentLang}
          .val=${item} .type=${argType}
          @val-changed=${(e: CustomEvent) => this._changeBlock(e.detail.value, index)}></change-val-element>`
      }
    });

    if(this.block.arguments.length>1){
      if(this.args) header=html`<div>${header}<div class="condition" @click=${this._showArguments}>${transl('hide')}</div></div>`
      else header=html`<span class="condition" @click=${this._showArguments}>${transl('arguments')}</span>`
    }

    header=html`${this.block.block.type==='dev' ? html`<block-icon height="${true}" type="dev"></block-icon>` :
      html`<block-icon height="${true}" type=${this.block.block.id}></block-icon>`} ${transl(this.block.block.name)} ${header}`
    return header;
  }

  private _changeBlock(updated: Argument|null=null, index: number=-1){
    if(updated && index!=-1) this.block.arguments[index]=updated;
    else{
      this.block.hide=!this.block.hide;
    }
    this.dispatchEvent(new CustomEvent('change-block', {
        detail: { value: this.block },
        bubbles: true,
        composed: true
    }));  
  }

  private _blockMenu(menu: boolean){
    this.menu=menu;
  }

  private _detailBlock(){
    this.detail=!this.detail;
    this.dispatchEvent(new CustomEvent('change-detail', {
      bubbles: true,
      composed: true
    })); 
  }

  private _showZone(){
    this.dispatchEvent(new CustomEvent('show-zone', {
      bubbles: true,
      composed: true
    })); 
  }

  private _handleLongPress() {
      this.longPressTimeout = setTimeout(() => {
        if(!this.detailGeneral)this.menu=true;
      }, 500);
  }

  private _cancelLongPress() {
      clearTimeout(this.longPressTimeout);
  }

  private _handleRightClick(e: MouseEvent) {
    e.preventDefault();
    if(!this.detailGeneral)this.menu=true;
  }

  private _showArguments(){
    this.args=!this.args;
  }

  private _handleTouchStart(event: TouchEvent) {
    this.dispatchEvent(new CustomEvent('touch-start', {
      detail: { value: event},
      bubbles: true,
      composed: true
    }));  
  }
}

declare global {
    interface HTMLElementTagNameMap {
      'block-element': BlockElement;
    }
  }