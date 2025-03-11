import { LitElement, html, css} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Argument, TypeOption} from './interfaces'

@customElement('new-val-element')
export class NewValElement extends LitElement {

    @state()
    private isOpen: boolean = false;

    @state()
    private type: TypeOption[] = ['num', 'str', 'bool', 'expr'];

    @property({ type: Object })
    value: Argument = {
        type: 'note',
        value: '',
        args: []
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

  render() {//TODO boolean choose

    return html`
      <button @click=${this._openCloseModal}>Add Operand (value)</button>

      ${this.isOpen ? html`
        <div class="overlay" @click=${this._openCloseModal}>
          <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
            <h2>Type of variable: </h2>
            <div>
             ${this.type.map(item=>html`
                <button class=${item === this.value.type ? 'selected' : ''} @click=${() => this._selectTypeInput(item)}>${item}</button>
                `)}
            </div>
            <h2>Value: </h2>
             <input type="text" .value=${this.value.value} @input=${this._handleValueInput}  />
            <button class="close-btn" @click=${this._addNew}>Save</button>
            <button class="close-btn" @click=${this._openCloseModal}>Cancel</button>
          </div>
        </div>
      ` : ''}
    `;
  }
  private _openCloseModal() {
    if(!this.isOpen){
        this.value.type='note'
        this.value.value=''
    }
    this.isOpen = !this.isOpen;

  }

  private _handleValueInput(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    this.value.value = target.value;
  }

  private _selectTypeInput(option: TypeOption) {
    this.value = { ...this.value, type: option };
  }

    private _addNew() {
        this.dispatchEvent(new CustomEvent('val-saved', {
            detail: { value: this.value },
            bubbles: true,
            composed: true
        }));
        this._openCloseModal()
    }

}

declare global {
  interface HTMLElementTagNameMap {
    'new-val-element': NewValElement
  }
}