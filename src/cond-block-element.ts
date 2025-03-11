import { LitElement, html, TemplateResult, css } from 'lit';
import { customElement, property} from 'lit/decorators.js';
import { Argument, TypeOption} from './interfaces'
import './operand-choose-element'

@customElement('cond-block-element')
export class CondBlockElement extends LitElement {

    @property()
    private selectMode: boolean = false;

    @property()
    private groupAction: boolean = false;

    @property()
    private deleteAction: boolean = false;

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
    .header {
      background-color: #7da7d9;
      padding: 8px;
      color: white;
      font-weight: bold;
      border-radius: 4px 4px 0 0;
    }

    .header.selected {
      background: blue;
      color: black;
    }

    .content {
      background-color:black;
      min-height: 50px;
      padding: 8px;
      border-radius: 0 0 4px 4px;
    }

  `;
  render() {
    if(!this.block.args.includes(this.newArg) && this.selectedBlock === this.block && this.newArg.type != 'note'){
        this.block.args.push(this.newArg);
        this.newArg={type: 'note',value:'', args: []};
        this.dispatchEvent(new CustomEvent('new-arg-clean'
        ));
    }

    if(this.deleteAction && this.selectedBlock === this.block){
        this._deleteArgs()
    }

    let element: TemplateResult=html``;
    if(this.groupAction && this.selectedBlock === this.block){
        element=html`<operand-choose-element @oper-choose=${(e: CustomEvent) => this._groupArgs(e.detail.value)}></operand-choose-element>`
    }

    if(this.block.args.length===0){
      element=html`
        <p>${this.block.value}
            ${(this.selectMode && this.selectedBlock === this.blockParent) ? 
                html`<input type="checkbox" @change=${(e: Event) => this._toggleSelection(e)}>` : ''}
        </p>
        `
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
            </cond-block-element>
        `
        })//TODO help block 3rd phase
        //TODO clean in back
        element=html`
            <div class="block">
                <div 
                    class="header ${this.selectedBlock === this.block ? 'selected' : ''}" 
                >
                    <p @click=${this._handleClick}>${this.block.type}</p>
                    ${(this.selectMode && this.selectedBlock === this.blockParent) ? 
                        html`<input type="checkbox" @change=${(e: Event) => this._toggleSelection(e)}>` : ''}
                </div>
                <div class="content">
                    ${element}
                </div>
            </div>
        `
    }
    return element;
  }

  private _toggleSelection(event: Event) {
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

    private _handleClick() {
        this.selectedBlock = this.block;

        this.dispatchEvent(new CustomEvent('block-changed', {
            detail: { value: this.selectedBlock },
            bubbles: true,
            composed: true
        }
    ));
    }

    private _groupArgs(type: TypeOption){
        if(this.chooseArgs.length>=2){
            let newArg: Argument={type: type, value: '', args: this.chooseArgs};
            this.block.args = this.block.args.filter(item => !this.chooseArgs.includes(item))
            this.block.args = [ ...this.block.args, newArg];
            this.chooseArgs=[];
            this.groupAction=false;
        
            this.dispatchEvent(new CustomEvent('select-ended'));
        }
      }

    private _deleteArgs(){
        this.block.args = this.block.args.filter(item => !this.chooseArgs.includes(item))
        this.chooseArgs=[];
        this.deleteAction=false;
    
        this.dispatchEvent(new CustomEvent('select-ended'
        ));
    }

    private _updateList(updatedList: Argument[]) {
        this.chooseArgs = [ ...updatedList ];
    }
}

declare global {
    interface HTMLElementTagNameMap {
      'cond-block-element': CondBlockElement;
    }
  }