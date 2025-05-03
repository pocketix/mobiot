import { LitElement, html, css, TemplateResult} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Argument} from '../general/interfaces'
import { TypeOption } from '../general/types';
import { LangCode, transl } from '../general/language';

@customElement('new-val-element')
export class NewValElement extends LitElement {

    @state()
    private isOpen: boolean = false;

    @state()
    private canSave: boolean = false;

    @state()
    private type: TypeOption[] = ['number', 'text', 'bool'];

    @property({ type: Object })
    value: Argument = {
        type: 'note',
        value: '',
        args: []
    };

    @property({ attribute: false })
    currentLang: LangCode = 'en';

    static styles = css`

    h2{
      color: black;
    }

    h3 {
      margin: 0;
      padding: 0;
    }

    p {
      margin: 0;
    }
    
    button {
      padding: 8px 16px;
      margin: 0px 4px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      background: linear-gradient(135deg, gray, rgb(170, 170, 170));
      transition: background-color 0.2s, color 0.2s;
      color: black;
    }

    .menu{
      background: linear-gradient(135deg, #ddd,rgb(224, 224, 224));
    }
        
    button.selected {
      background: linear-gradient(135deg, #4a90e2, #7da7d9);
      color: white;
    }

    .save {
      margin: 16px 3px;
      padding: 8px 24px;
      background: linear-gradient(135deg, rgb(79, 255, 108), rgb(200, 255, 220));
    }

    button:disabled {
      background: linear-gradient(135deg, #c4c4c4, rgb(214, 214, 214));
      color: #6e6e6e;
      cursor: not-allowed;
      opacity: 0.5;
    }

    .cancel {
      margin: 16px 3px;
      background: linear-gradient(135deg, rgb(255, 104, 104), rgb(255, 160, 180));
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

    .icon {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `;

  render() {
    let valueType: TemplateResult=html``
    if(this.value.type==='bool'){
      valueType=html`
      <button class=${'true' === this.value.value ? 'selected' : ''} @click=${() => this._handleBoolInput('true')}>${transl('true')}</button>
      <button class=${'false' === this.value.value ? 'selected' : ''} @click=${() => this._handleBoolInput('false')}>${transl('false')}</button>`
    }else if(this.value.type==='number'){
      valueType=html`<input type="number" inputmode="decimal" step="any" .value=${this.value.value} @input=${this._handleValueInput} placeholder=${transl('enterNumber')}>`
    }else{
      valueType=html`<input type="text" .value=${this.value.value} @input=${this._handleValueInput} placeholder=${transl('addVarVal')}/>`
    }
    return html`
      <button @click=${this._openCloseModal}><div class="icon"><h3>+</h3> <p>${transl('addValue')}</p></div></button>

      ${this.isOpen ? html`
        <div class="overlay" @click=${this._openCloseModal}>
          <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
            <h2>${transl('selectTypeOfVar')}</h2>
            <div>
              ${this.type.map(item=>html`
                <button class=${item === this.value.type ? 'selected' : 'menu'} @click=${() => this._selectTypeInput(item)}>${transl(item)}</button>
                `)}
            </div>
            <h2>${transl('value')}: </h2>
              ${valueType}
            <div>
              <button class="save" ?disabled=${!this.canSave} @click=${this._addNew}>${transl('save')}</button>
              <button class="cancel" @click=${this._openCloseModal}>X ${transl('cancel')}</button>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }
  private _openCloseModal() {
    if(!this.isOpen){
      this.value.type='note';
      this.value.value='';
    }
    this.isOpen = !this.isOpen;
  }

  private _handleValueInput(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    this.value.value = target.value;
    this._saveBut();
  }

  private _handleBoolInput(input: string) {
    this.value= {...this.value, value:input} 
    this._saveBut();
  }

  private _selectTypeInput(option: TypeOption) {
    this.value = { ...this.value, type: option, value: ''};
    this._saveBut();
  }

  private _addNew() {
    this.dispatchEvent(new CustomEvent('val-saved', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
    this._openCloseModal()
  }

  private _saveBut(){
    if(this.value.value && (this.value.type!='bool' || this.value.value==='true' || this.value.value==='false'))this.canSave=true;
    else this.canSave=false
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'new-val-element': NewValElement
  }
}