import { LitElement, html, css, TemplateResult} from 'lit';
import { customElement, property, state} from 'lit/decorators.js';
import { TypeOption} from '../general/types'

@customElement('operand-choose-element')
export class OperandChooseElement extends LitElement {

    @property()
    isOpen: boolean = true;

    @property({ type: Object })
    operand: TypeOption = 'note'

    @state()
    private operandTypes: string[]=['Compare', 'Logical', 'Numeric'];

    @state()
    private selected: string='Compare';
    
    static styles = css`

    h2{
        color: black;
    }
    
    button {
      max-width: fit-content;
      margin: 8px 4px;
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #ddd;
      transition: background-color 0.2s, color 0.2s;
      color: black;
    }

    button.selected {
      background-color: #7da7d9;
      margin 0px;
      color: white;
    }

    .cancel {
      background-color:rgb(255, 104, 104);
    }

    .button-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .menu-container {
      border-radius: 12px;
      padding: 2px 4px;
      background: rgb(168, 168, 168);
    }

    .menu {
      background: rgb(168, 168, 168);
      margin 0px;
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
      max-width: 250px;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    }
  `;

  render() {
    const listOperand: TemplateResult[]=[];
    let operandList: TypeOption[]=[];

    if(this.selected==='Compare')operandList=['=','≠','>','<','>=','<='];
    else if(this.selected==='Logical')operandList=['AND','OR','NOT'];
    else operandList=['+','-','*','/'];
    
    operandList.forEach((item)=>{
      listOperand.push(html`<button @click=${() => this._addArg(item)}>${item}</button>`);
    });
    
    return html`
      ${this.isOpen ? html`
        <div class="overlay" @click=${this._openCloseModal}>
          <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
            <div class="menu-container">
              ${this.operandTypes.map(item=>html`
              <button class=${item === this.selected ? 'selected' : 'menu'} @click=${() => this._selectType(item)}>${item}</button>
              `)}
            </div>
            <div >
              ${listOperand}
            </div>
            <button class="cancel" @click=${this._openCloseModal}>X Cancel</button>
          </div>
        </div>
      ` : ''}
    `;
  }
  private _openCloseModal() {
    this.isOpen = !this.isOpen;
  }

  private _selectType(cat: string){
    this.selected=cat
  }

  private _addArg(operand: TypeOption) {
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