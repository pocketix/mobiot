import { LitElement, html, css, TemplateResult} from 'lit';
import { customElement, property, state} from 'lit/decorators.js';
import { TypeOption} from '../general/types';
import { LangCode, transl, getLang } from '../general/language';

@customElement('operation-choose-element')
export class OperationChooseElement extends LitElement {

    @property()
    isOpen: boolean = true;

    @property()
    itemSum: number=2;

    @state()
    private operationTypes: string[]=['Compare', 'Logical', 'Numeric'];

    @state()
    private selected: string='Compare';

    @property({ attribute: false })
        currentLang: LangCode = 'en';
    
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
      background: linear-gradient(135deg, rgb(170, 170, 170), #ddd);
      transition: background-color 0.2s, color 0.2s;
      color: black;
    }

    button.selected {
      background: linear-gradient(135deg, #4a90e2, #7da7d9);
      margin 0px;
      color: white;
    }

    .cancel {
      background: linear-gradient(135deg, rgb(255, 104, 104), rgb(255, 160, 180));
    }

    .button-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .menu-container {
      border-radius: 12px;
      padding: 2px 4px;
      background: linear-gradient(135deg, gray, rgb(170, 170, 170));
    }

    .menu {
      background: none;
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
    const listOperation: TemplateResult[]=[];
    let operationList: TypeOption[]=[];
    if(this.itemSum===1){
      this.operationTypes=['Logical'];
      this.selected='Logical';
      operationList=['NOT'];
    }
    else if(this.selected==='Compare')operationList=['=','≠','>','<','>=','<='];
    else if(this.selected==='Logical')operationList=['AND','OR','NOT'];
    else operationList=['+','-','*','/'];
    
    operationList.forEach((item)=>{
      listOperation.push(html`<button @click=${() => this._addArg(item)}>${item}</button>`);
    });
    
    return html`
      ${this.isOpen ? html`
        <div class="overlay" @click=${this._openCloseModal}>
          <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
            <div class="menu-container">
              ${this.operationTypes.map(item=>html`
              <button class=${item === this.selected ? 'selected' : 'menu'} @click=${() => this._selectType(item)}>${transl(item)}</button>
              `)}
            </div>
            <div >
              ${listOperation}
            </div>
            <button class="cancel" @click=${this._openCloseModal}>X ${transl('cancel')}</button>
          </div>
        </div>
      ` : ''}
    `;
  }
  private _openCloseModal() {
    this.isOpen = !this.isOpen;
    this.currentLang=getLang();
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
    'operation-choose-element': OperationChooseElement
  }
}