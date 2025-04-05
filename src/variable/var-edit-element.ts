import { LitElement, html, css, TemplateResult} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { VarObject, Argument} from '../general/interfaces'
import { TypeOption } from '../general/types';
import { CondText } from '../general/cond-text.ts';

@customElement('var-edit-element')
export class VarEditElement extends LitElement {

  original: VarObject= {
    name: '',
    value: {type: 'note', value: '', args: []}
  };

    @state()
    private isOpen: boolean = false;

    @state()
    private canSave: boolean = false;

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

    p {
      font-size: 1em;
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

    .menu {
            border-radius: 8px;
            border: 1px solid transparent;
            padding: 0.4em 0.8em;
            margin: 0.2em 0.4em;
            font-size: 1em;
            font-weight: 500;
            font-family: inherit;
            background-color: #7da7d9;
            cursor: pointer;
            transition: border-color 0.25s;
            color: white;
    }

    .save {
      margin: 16px 4px;
      background-color:rgb(79, 255, 108);
    }

    button:disabled {
      background-color: grey;
      cursor: not-allowed;
      background-color: #c4c4c4; /* světle šedá */
      color: #6e6e6e;
    }

    .cancel {
      margin: 16px 4px;
      background-color:rgb(255, 104, 104);
    }
        
    button.selected {
        background-color: #7da7d9;
    }

    input {
      font-size: 1em;
      padding: 4px;
      border: none;
      background-color: #7da7d9;
      color: black;
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
    let title = this.var.value.type==='note' ? '+ New variable' : '✎Edit';
    this._saveBut();
    let valueType: TemplateResult=html``
    if(this.var.value.type==='bool'){
      valueType=html`
      <button class=${'true' === this.var.value.value ? 'selected' : ''} @click=${() => this._handleBoolInput('true')}>true</button>
      <button class=${'false' === this.var.value.value ? 'selected' : ''} @click=${() => this._handleBoolInput('false')}>false</button>`
    }else if(this.var.value.type==='num'){
      valueType=html`<input type="number" inputmode="decimal" step="any" .value=${this.var.value.value} @input=${this._handleValueInput} placeholder="Enter a number">`
    }else if(this.var.value.type==='expr'){
      valueType=html`<cond-edit-element 
                        .newMode=${false} .args=${this.var.value.args} .exprMode=${true}
                        .title=${this.var.value.args.length===0 ? 'Click here to create expression. ' : CondText(this.var.value.args[0])}
                        @click=${(e: Event) => e.stopPropagation()}
                        @cond-update=${(e: CustomEvent) => this._updateExpr(e.detail.value)}>
                    </cond-edit-element>`
    }else{
      valueType=html`<input type="text" .value=${this.var.value.value} @input=${this._handleValueInput} placeholder="Add variable value..." />`
    }
    return html`
      <button class="menu" @click=${this._openCloseModal}>${title}</button>

      ${this.isOpen ? html`
        <div class="overlay" @click=${this._openCloseModal}>
          <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
            <h2>Select type of variable: </h2>
            <div>
             ${this.type.map(item=>html`
                <button class=${item === this.var.value.type ? 'selected' : ''} @click=${() => this._selectTypeInput(item)}>${item}</button>
                `)}
            </div>
            <h2>Name: </h2>${this.original.name==='' ? 
              html`<input type="text" .value=${this.var.name} @input=${this._handleNameInput} placeholder="Add variable name..." />`
              : html`<p>${this.var.name}</p>`}
             
            <h2>Value: </h2>
            <div>${valueType}</div>
            <button class="save" ?disabled=${!this.canSave} @click=${()=>{this._saveChanges()}}>Save</button>
            <button class="cancel" @click=${()=>{this.var=this.original;this._saveChanges()}}>Cancel</button>
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
    this._saveBut();
  }

  private _handleValueInput(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    this.var.value.value = target.value;
    this._saveBut();
  }

  private _updateExpr(updatedCond: Argument) {
    this.var = {...this.var, 
      value: { ...this.var.value, args: [updatedCond] }, 
    };
    this._saveBut();
  }

  private _handleBoolInput(input: string) {
    this.var = {...this.var, 
      value: { ...this.var.value, value: input }, 
    };
    this._saveBut();
  }

  private _selectTypeInput(option: TypeOption) {
    this.var = { ...this.var, 
      value: { ...this.var.value, type: option }
    };
    this._saveBut();
  }

  private _saveBut() {//TODO clean code
    if (this.var.name && this.var.value.type!='note' && 
      (this.var.value.value || (this.var.value.type==='expr' && this.var.value.args.length!==0) )&&
      (this.var.value.type!='bool' || this.var.value.value==='true' || this.var.value.value==='false'))this.canSave=true;
    else this.canSave=false;
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