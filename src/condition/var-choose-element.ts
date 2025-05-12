import { LitElement, html, css, TemplateResult} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Argument, VarObject} from '../general/interfaces';
import { sensors } from '../general/sensors';
import { LangCode, transl } from '../general/language';

@customElement('var-choose-element')
export class VarChooseElement extends LitElement {

    @state()
    private isOpen: boolean = false;

    @state()
    private varTypes: string[]=['User', 'Device'];

    @state()
    private selected: string='User';

    @property({ type: Object })
    arg: Argument = {
        type: 'variable',
        value: '',
        args: []
    };

    @property()
    varList: VarObject[]=[];

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
      margin: 4px 4px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      background: linear-gradient(135deg, gray, rgb(170, 170, 170));
      transition: background-color 0.2s, color 0.2s;
      color: black;
    }

    .cancel {
      background: linear-gradient(135deg, rgb(255, 104, 104), rgb(255, 160, 180));
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
      display: flex;
      flex-direction: column;
    }

    button.selected {
      background: linear-gradient(135deg, #4a90e2, #7da7d9);
      margin 0px;
      color: white;
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

    .icon {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `;

  render() {
    const listCode: TemplateResult[]=[];
    if(this.selected==='User'){
      let filteredList=this.varList.filter(item=>item.value.type!=='text' && item.value.type!=='expr')
      filteredList.forEach((item)=>{
        listCode.push(html`<button @click=${() => this._addArg(item.name)}>${item.name}: ${transl(item.value.value)}</button>`);
      });
    }
    else {
      let filteredList=sensors.filter(item=>item.value.type!=='text')
      filteredList.forEach((item)=>{
        listCode.push(html`<button @click=${() => this._addArg(item.name)}>${item.name}</button>`);
      });
    }
    
    return html`
      <button @click=${this._openCloseModal}><div class="icon"><h3>+</h3> <p>${transl('addVariable')}</p></div></button>

      ${this.isOpen ? html`
        <div class="overlay" @click=${this._openCloseModal}>
          <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
            <div class="menu-container">
              ${this.varTypes.map(item=>html`
              <button class=${item === this.selected ? 'selected' : 'menu'} @click=${() => this._selectType(item)}>${transl(item)} ${transl('variables')}</button>
              `)}
            </div>
            ${listCode}
            <button class="cancel" @click=${this._openCloseModal}>X ${transl('cancel')}</button>
          </div>
        </div>
      ` : ''}
    `;
  }

  private _openCloseModal() {
    this.isOpen = !this.isOpen;
  }

  private _addArg(value: string) {
    this.arg.value=value;
    this.dispatchEvent(new CustomEvent('var-add', {
      detail: { value: this.arg },
      bubbles: true,
      composed: true
    }));
    this._openCloseModal()
  }

  private _selectType(cat: string){
    this.selected=cat
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'var-choose-element': VarChooseElement
  }
}