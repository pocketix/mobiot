import { LitElement, html, css, TemplateResult} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Argument, VarObject} from '../general/interfaces'

@customElement('var-choose-element')
export class VarChooseElement extends LitElement {

    @state()
    private isOpen: boolean = false;

    @property({ type: Object })
    arg: Argument = {
        type: 'variable',
        value: '',
        args: []
    };

    @property()
    varList: VarObject[]=[];

    static styles = css`
    h2{
      color: black;
    }
    
    button {
      padding: 8px 16px;
      margin: 6px 0px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      background-color: rgb(168, 168, 168);
      transition: background-color 0.2s, color 0.2s;
      color: black;
    }

    .cancel {
      background-color:rgb(255, 104, 104);
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
  `;

  render() {
    const listCode: TemplateResult[]=[];
    let filteredList=this.varList.filter(item=>item.value.type!=='str' && item.value.type!=='expr')//TODO consult this decesion
    filteredList.forEach((item)=>{
      listCode.push(html`<button @click=${() => this._addArg(item.name)}>${item.name}: ${item.value.value}</button>`);
    });
    
    return html`
      <button @click=${this._openCloseModal}>Add variable</button>

      ${this.isOpen ? html`
        <div class="overlay" @click=${this._openCloseModal}>
          <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
            ${listCode}
            <button class="cancel" @click=${this._openCloseModal}>X Cancel</button>
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
}

declare global {
  interface HTMLElementTagNameMap {
    'var-choose-element': VarChooseElement
  }
}