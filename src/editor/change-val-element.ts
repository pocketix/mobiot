import { LitElement, html, css, TemplateResult} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Argument, VarObject} from '../general/interfaces'
import { consume } from '@lit/context';
import { TypeOption } from '../general/types';
import { varListExport } from '../general/context';
import { CondText } from '../general/cond-text';

@customElement('change-val-element')
export class ChangeValElement extends LitElement {

    @state()
    private isOpen: boolean = false;

    @property({ type: Object })
    val: Argument = {type: 'note', value: '', args: []
    };

    @property()
    type: TypeOption='note'

    @consume({ context: varListExport })
    @property({ attribute: false })
    varList: VarObject[]=[];

    static styles = css`

    h2{
      color: black;
    }
    
    button {
      padding: 8px 16px;
      margin: 4px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      background-color: #7da7d9;
      transition: background-color 0.2s, color 0.2s;
      color: black;
    }
        
    button.selected {
      background-color: #7da7d9;
      color: white;
    }

    input {
      background-color: #7da7d9;
    }

    .save {
      margin: 16px 1px;
      background-color:rgb(79, 255, 108);
    }

    .back {
      margin: 0px;
      background-color: #ddd;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10;
    }

    .modal {
      background: white;
      padding: 24px;
      border-radius: 8px;
      max-width: 400px;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    }
  `;

  render() {
    let valueType: TemplateResult=html``
    let varBlock: TemplateResult=html`<h2>Use variable</h2>`
    let filteredList: VarObject[]=[];

    if(this.type==='bool'){
      valueType=html`
        <button class=${'true' === this.val.value ? 'selected' : ''} @click=${() => this._handleBoolInput('true')}>true</button>
        <button class=${'false' === this.val.value ? 'selected' : ''} @click=${() => this._handleBoolInput('false')}>false</button>`
    }else if(this.type==='num'){
      valueType=html`<input type="number" .value=${this.val.type === 'variable' ? '' : this.val.value}
       @input=${this._handleValueInput} inputmode="decimal" step="any" placeholder="Enter a number">`
    }else{
      valueType=html`<input type="text" .value=${this.val.type === 'variable' ? '' : this.val.value} @input=${this._handleValueInput} placeholder="Add value" />`
    }

    if(this.type!='variable' && this.type!=='note'){
      this.varList.forEach(item => {
        if(item.value.type===this.type)filteredList.push(item);
        else if(item.value.type==='expr'){
          if(['+','-','*','/'].includes(item.value.args[0].type)){
            if(this.type==='num')filteredList.push(item);
          }else{
            if(this.type==='bool')filteredList.push(item);
          }
      }})
    }else{
      filteredList=this.varList;
    }

    filteredList.forEach((item)=>{
        varBlock=html`${varBlock}
        <button @click=${() => this._saveChanges(item.name)}>${item.name}: ${item.value.type==='expr' ? CondText(item.value.args[0]) : item.value.value}</button>`
    })

    return html`
      <button class="back" @click=${this._openCloseModal}>${this.val.value}</button>

      ${this.isOpen ? html`
        <div class="overlay" @click=${this._openCloseModal}>
          <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
            ${this.type!='variable' ? html`
            <h2>Change value: </h2>
            <div>${valueType} <button class="save" @click=${() => this._saveChanges()}>Save</button></div>
            ` : ''}
            ${filteredList.length != 0 ? html`${varBlock}` : ''}
            <div><button class="back" @click=${this._openCloseModal}>Back</button></div>
          </div>
        </div>
      ` : ''}
    `;
  }

  private _openCloseModal() {
    this.isOpen = !this.isOpen;
  }

  private _handleValueInput(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    this.val.value = target.value;
  }

  private _handleBoolInput(input: string) {
    this.val = {...this.val, value: input }
  }

  private _saveChanges(item: string='') {
    if(item){
      this.val.type='variable';
      this.val.value=item;
    }
    else{
      this.val.type=this.type
    }
    this.dispatchEvent(new CustomEvent('val-changed', {
      detail: { value: this.val },
      bubbles: true,
      composed: true
    }));
    this._openCloseModal()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'change-val-element': ChangeValElement
  }
}