import { LitElement, html, TemplateResult, css } from 'lit';
import { customElement, property, state} from 'lit/decorators.js';
import { Argument} from '../general/interfaces'
import { TypeOption } from '../general/types';
import './operand-choose-element'

@customElement('cond-block-element')
export class CondBlockElement extends LitElement {

    @property()
    private selectMode: boolean = false;

    @property()
    private groupAction: boolean = false;

    @property()
    private canGroup: boolean = false;

    @property()
    private deleteAction: boolean = false;

    @state()
    private changeOperand: boolean=false;
    

    @property()
    block: Argument={type: 'note',value:'', args: []}

    @property()
    newArg: Argument={type: 'note',value:'', args: []}

    @property()
    private blockParent: Argument={type: 'note',value:'', args: []}

    @property()
    chooseArgs: Argument[]=[]

    @property()
    selectedBlock: Argument={type: 'note',value:'', args: []}

    static styles = css`
    .block {
      display: block;
      border: 2px solid #333;
      border-radius: 8px;
      padding: 8px;
      background-color: #e0e0e0;
      margin: 8px;
    }

    .main{
        display: block;
        border: 2px solid #333;
        border-radius: 8px;
        min-height: 150px;
        min-width: 300px;
        background-color: #e0e0e0;
        margin: 8px;
    }

    .header {
      background-color: #7da7d9;
      padding: 4px;
      color: white;
      font-weight: bold;
      border-radius: 4px 4px 0 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 50px;
    }

    .header.selected {
      background:rgb(66, 63, 255);
    }

    .content {
      background-color: rgb(168, 168, 168);
      min-height: 50px;
      padding: 2px;
      border-radius: 0 0 4px 4px;
      color: black;
    }

    .edit {
        background-color: #7da7d9;
        border: 2px solid #fff;
        margin: 5px;
        border-radius: 8px;
    }
    
    .edit.selected {
      background:rgb(66, 63, 255);
    }

    .value {
        background-color: rgb(168, 168, 168);
        padding: 10px;
        border-radius: 4px;
        color: black;
    }

  `;
  render() {
    this._addArg();

    if(this.deleteAction && this.selectedBlock === this.block){
        this._deleteArgs()
    }

    let element: TemplateResult=html`${this._drawOperandWindow()}`;

    if(this.block.args.length===0 && this.block.value!==''){
      element=html`
        <p class="value">${this.block.value}
            ${(this.selectMode && this.selectedBlock === this.blockParent) ? 
                html`<input type="checkbox" @change=${(e: Event) => this._chooseArgsChanged(e)}>` : ''}
        </p>`
    }
    else{
        this.block.args.forEach((item)=>{
            element=html`
            ${element}
            <cond-block-element .block=${item} 
                .selectMode=${this.selectMode}
                .selectedBlock=${this.selectedBlock}
                .blockParent=${this.block}
                .chooseArgs=${this.chooseArgs}
                .groupAction=${this.groupAction}
                .deleteAction=${this.deleteAction}
                .newArg=${this.newArg}
                @choose-args-changed=${(e: CustomEvent) => this._updateList(e.detail.value)}
                @select-ended=${()=>this._cleanGroups()}
            </cond-block-element>
        `
        })
        if(this.block.args.length===0 && this.block.value==='')return element
        element= this._drawBlock(element);
    }
    return element;
  }

    private _drawOperandWindow(): TemplateResult{
        let element: TemplateResult=html``;
        if(this.groupAction && this.selectedBlock === this.block){
            element=html`<operand-choose-element @oper-choose=${(e: CustomEvent) => this._groupArgs(e.detail.value)}></operand-choose-element>`
        }

        if(this.changeOperand){
            element=html`<operand-choose-element @oper-choose=${(e: CustomEvent) => this._changeOper(e.detail.value)}></operand-choose-element>`
        }
        return element;
    }

    private _drawBlock(element: TemplateResult): TemplateResult{
        element= this.block.type!='cond'? html`
            <div class="block">
                <div 
                    class="header ${this.selectedBlock === this.block ? 'selected' : ''}" @click=${this._handleHeaderClick}
                >
                    <button class="edit ${this.selectedBlock === this.block ? 'selected' : ''}" 
                        @click=${(e: Event) => {this.changeOperand=true;e.stopPropagation()}}>✎</button>
                    <p @click=${this._handleHeaderClick}>${this.block.type}</p>
                    ${(this.selectMode && this.selectedBlock === this.blockParent) ? 
                        html`<input type="checkbox" @change=${(e: Event) => this._chooseArgsChanged(e)} @click=${(e: Event) => e.stopPropagation()}>` : ''}
                </div>
                <div class="content">
                    ${element}
                </div>
            </div>
        ` : html`<div class="main">
                <div 
                    class="header ${this.selectedBlock === this.block ? 'selected' : ''}" @click=${this._handleHeaderClick}>
                </div>
                <div>
                    ${element}
                </div>
            </div>`
        return element;
    }
  
    private _addArg(){
        if(!this.block.args.includes(this.newArg) && this.selectedBlock === this.block && this.newArg.type != 'note'){
            this.block.args.push(this.newArg);
            this.newArg={type: 'note',value:'', args: []};
            this.dispatchEvent(new CustomEvent('new-arg-clean',{
                bubbles: true, composed: true
            }
            ));
        }
    }

    private _chooseArgsChanged(event: Event) {
        const checkbox = event.target as HTMLInputElement; 
        if (checkbox.checked) {
            this.chooseArgs = [...this.chooseArgs, this.block];
        } else {
            this.chooseArgs = this.chooseArgs.filter(item => item !== this.block);
        }

        this.dispatchEvent(new CustomEvent('choose-args-changed', {
            detail: { value: this.chooseArgs },
            bubbles: true,
            composed: true
        }));
    }

    private _handleHeaderClick() {
        this.selectedBlock = this.block;

        this.dispatchEvent(new CustomEvent('cond-changed', {
            detail: { value: this.selectedBlock },
            bubbles: true,
            composed: true
        }));
    }

    private _groupArgs(type: TypeOption){
        let newArg: Argument={type: type, value: '', args: this.chooseArgs};
        this.block.args = this.block.args.filter(item => !this.chooseArgs.includes(item))
        this.block.args = [ ...this.block.args, newArg];
        this.chooseArgs=[];
        this.groupAction=false;
    
        this.dispatchEvent(new CustomEvent('select-ended', {
            bubbles: true,
            composed: true}
        ));
    }

    private _changeOper(type: TypeOption){
        this.block.type=type;
        this.changeOperand=false;
    }

    private _deleteArgs(){
        this.block.args = this.block.args.filter(item => !this.chooseArgs.includes(item))
        this.chooseArgs=[];
        this.deleteAction=false;
        this.dispatchEvent(new CustomEvent('select-ended', {
            bubbles: true,
            composed: true}
        ));
    }

    private _cleanGroups(){
        this.block.args.forEach((item)=>{
            if(['AND','OR','NOT','=','≠','>','<','>=','<=','+','-','*','/'].includes(item.type) && item.args.length===0){
                this.block.args=this.block.args.filter(filtered=> filtered!=item);
                this._handleHeaderClick();
            }
        })
    }

    private _updateList(updatedList: Argument[]) {
        this.chooseArgs = [ ...updatedList ];
        this.canGroup = this.chooseArgs.length >= 2;

        this.dispatchEvent(new CustomEvent('can-group', { 
            detail: this.canGroup, 
            bubbles: true, 
            composed: true 
        }));
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'cond-block-element': CondBlockElement;
    }
  }