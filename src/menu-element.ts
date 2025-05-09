import { LitElement, css, html} from 'lit'
import { customElement, property, state} from 'lit/decorators.js'
import { VarObject} from './general/interfaces.ts'
import { View } from './general/types.ts';
import { transl, LangCode} from './general/language.ts';
import './variable/var-list-element.ts';
import './options-element.ts';
import './condition/cond-edit-element.ts'
import './condition/cond-list-element.ts'
import './setting-element.ts';

@customElement('menu-element')
export class MenuElement extends LitElement {
  @property({ attribute: false })
  currentLang: LangCode = 'en';

    @property()
    varList: VarObject[] = [];

    @property()
    programText: string=''

    @state()
    private viewList: View[] = window.matchMedia('(max-width: 768px)').matches ?['Graphical', 'Text']:['Both','Graphical','Text'];

    @property()
    view: View='Both'

  render() {
    return html`
        <div class="content">
        <div class="view-container">
        <setting-element class="setting" .programText=${this.programText} .varList=${this.varList}></setting-element>
          <h2>${transl('chooseEditor')}</h2>
          <div class="view">
            ${this.viewList.map(item=>html`
            <button class=${item === this.view ? 'selected' : ''} @click=${() => this._selectTypeInput(item)}>${transl(item)}</button>
            `)}
          </div>
        </div>
        </div>
    `
    }

    private _selectTypeInput(updated: View) {
        this.view = updated;
        this.dispatchEvent(new CustomEvent('view-saved', {
            detail: { value: this.view },
            bubbles: true,
            composed: true
        }));  
    }

  static styles = css`
    
    .content{
      background: white;
    }

    h2 {
      font-size: 1.1em;
      font-weight: 500;
      font-family: inherit;
      color: #1a1a1a;
    }

    .view-container {
      display: flex;
      align-items: center;
      margin: 0px;
      gap: 2px;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.4em 0.8em;
      margin: 0.2em 0.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: gray;
      cursor: pointer;
      transition: border-color 0.25s;
    }

    .setting {
      margin-left: auto;
    }

    .view button{
      background: none;
    }

    button.selected {
      border: none;
      background: linear-gradient(135deg, #ddd,rgb(168, 168, 168));
      color: black;
    }

    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    .view {
      max-width: fit-content;
      border-radius: 12px;
      padding: 6px;
      background: linear-gradient(135deg, gray, rgb(170, 170, 170));
      margin: 2px;
      margin-right: auto;
    }
  `
}


declare global {
  interface HTMLElementTagNameMap {
    'menu-element': MenuElement
  }
}
