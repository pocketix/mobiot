import { LitElement, html, css, TemplateResult} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { VarObject} from '../general/interfaces'
import { TypeOption } from '../general/types';

@customElement('var-edit-element')
export class VarEditElement extends LitElement {

  original: VarObject= {
    name: '',
    value: {type: 'note', value: '', args: []}
  };

    @state()
    private isOpen: boolean = false;

    @state()
    private type: TypeOption[] = ['num', 'str', 'bool', 'expr'];

    @property({ type: Object })
    var: VarObject = {
        name: '',
        value: {type: 'note', value: '', args: []}
    };

    static styles = css`

    h2{
        color: black;
    }
    
    button {
            padding: 8px 16px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            background-color: #ddd;
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

    /* Překrytí při otevřeném pop-up okně */
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

    /* Vzhled pop-up okna */
    .modal {
      background: white;
      padding: 24px;
      border-radius: 8px;
      max-width: 400px;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    }
  `;

  render() {
    let title = this.var.value.type==='note' ? '+' : 'Edit';
    let valueType: TemplateResult=html``
    if(this.var.value.type==='bool'){
      valueType=html`
      <button class=${'true' === this.var.value.value ? 'selected' : ''} @click=${() => this._handleBoolInput('true')}>true</button>
      <button class=${'false' === this.var.value.value ? 'selected' : ''} @click=${() => this._handleBoolInput('false')}>false</button>`
    }else{
      valueType=html`<input type="text" .value=${this.var.value.value} @input=${this._handleValueInput} placeholder="Add variable value..." />`
    }
    return html`
      <button @click=${this._openCloseModal}>${title}</button>

      ${this.isOpen ? html`
        <div class="overlay" @click=${this._openCloseModal}>
          <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
            <h2>Type of variable: </h2>
            <div>
             ${this.type.map(item=>html`
                <button class=${item === this.var.value.type ? 'selected' : ''} @click=${() => this._selectTypeInput(item)}>${item}</button>
                `)}
            </div>
            <h2>Name: </h2>
             <input type="text" .value=${this.var.name} @input=${this._handleNameInput} placeholder="Add variable name..." />
            <h2>Value: </h2>
            <div>${valueType}</div>
            <button class="close-btn" @click=${this._saveChanges}>Save</button>
            <button class="close-btn" @click=${()=>{this.var={...this.original};this._saveChanges()}}>Cancel</button>
          </div>
        </div>
      ` : ''}
    `;
  }
  private _openCloseModal() {
    if(!this.isOpen){
      this.original=structuredClone(this.var);
    }
    this.isOpen = !this.isOpen;
  }

  private _handleNameInput(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    this.var.name = target.value;
  }

  private _handleValueInput(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    this.var.value.value = target.value;
  }

  private _handleBoolInput(input: string) {
    this.var = {...this.var, 
      value: { ...this.var.value, value: input }, 
    };  
  }

  private _selectTypeInput(option: TypeOption) {
    this.var = { ...this.var, 
      value: { ...this.var.value, type: option }
    };  
  }

    private _saveChanges() {
        this.dispatchEvent(new CustomEvent('var-saved', {
            detail: { value: this.var },
            bubbles: true,
            composed: true
        }));
        this._openCloseModal()

    }

}

declare global {
  interface HTMLElementTagNameMap {
    'var-edit-element': VarEditElement
  }
}