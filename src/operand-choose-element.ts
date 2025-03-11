import { LitElement, html, css, TemplateResult} from 'lit';
import { customElement, property} from 'lit/decorators.js';
import { TypeOption} from './interfaces'

@customElement('operand-choose-element')
export class OperandChooseElement extends LitElement {

    @property()
    isOpen: boolean = true;

    @property({ type: Object })
    operand: TypeOption = 'note'

    @property()
    operandList: TypeOption[]=['AND','OR','NOT','==','!=','>','<','>=','<=','+','-','*','/'];

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
        const listOperand: TemplateResult[]=[];
        this.operandList.forEach((item)=>{
            listOperand.push(html`<li><button @click=${() => this._addArg(item)}>${item}</button></li>`);
  });
    return html`
      <button @click=${this._openCloseModal}>Add Operand (variable)</button>

      ${this.isOpen ? html`
        <div class="overlay" @click=${this._openCloseModal}>
          <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
            ${listOperand}
            <button class="close-btn" @click=${this._openCloseModal}>Cancel</button>
          </div>
        </div>
      ` : ''}
    `;
  }
  private _openCloseModal() {
    this.isOpen = !this.isOpen;
  }


    private _addArg(operand: TypeOption) {//TODO edit exist operand 4th phase
        this.dispatchEvent(new CustomEvent('oper-choose', {
            detail: { value: operand},
            bubbles: true,
            composed: true
        }));
        this._openCloseModal()
    }

}

declare global {
  interface HTMLElementTagNameMap {
    'operand-choose-element': OperandChooseElement
  }
}