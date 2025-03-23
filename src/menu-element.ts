import { LitElement, css, html} from 'lit'
import { customElement, property, state} from 'lit/decorators.js'
import { VarObject} from './general/interfaces.ts'
import { View } from './general/types.ts';
import './variable/var-list-element.ts';
import './options-element.ts';
import './condition/cond-edit-element.ts'
import './condition/cond-list-element.ts'

@customElement('menu-element')
export class MenuElement extends LitElement {
    @property()
    varList: VarObject[] = [];

    @property()
    programText: string=''

    @state()
    private viewList: View[] = window.matchMedia('(max-width: 768px)').matches ?['Text','Graphical']:['Both','Text','Graphical'];

    @property()
    view: View='Both'

  render() {
    return html`
        <div>
        <button @click=${this._openFilePicker}>Import JSON file</button>
        <button @click=${this._exportText}>Export JSON file</button>
        </div>
        <button>Procedures</button>
        <var-list-element .table=${this.varList} ></var-list-element>
        <cond-list-element></cond-list-element>
        <div class="view-container">
          <h2>Choose type of editor: </h2>
          <div class="view">
            ${this.viewList.map(item=>html`
            <button class=${item === this.view ? 'selected' : ''} @click=${() => this._selectTypeInput(item)}>${item}</button>
            `)}
          </div>
        </div>
    `
    }

    private _openFilePicker() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json"; 
        input.addEventListener("change", (event) => this._importJson(event));
        input.click();
    }

    private async _importJson(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
          const file = input.files[0];
          const text = await file.text();
          try {
            const parsedJson = JSON.parse(text);
            this.programText = JSON.stringify(parsedJson, null, 2);

            this.dispatchEvent(new CustomEvent('program-saved', {
                detail: { value: this.programText},
                bubbles: true,
                composed: true
            }));
          } catch (error) {
            console.error("Error in JSON import:", error);
          }
        }
      }

    private _exportText() {
        const blob = new Blob([this.programText], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "JSONprogram.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

    h2 {
      font-size: 1.2em;
      font-weight: 500;
      font-family: inherit;
      color: #1a1a1a;
      margin: 0 auto;
    }

    .view-container {
      display: flex;
      align-items: center;
      margin: 0 auto;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.5em 1em;
      margin: 0.2em 0.4em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: gray;
      cursor: pointer;
      transition: border-color 0.25s;
    }

    .view button{
      background-color: gray;
    }

    button.selected {
      background-color:rgb(168, 168, 168);
      color: black;
    }

    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    .view {
      max-width: fit-content;
      border-radius: 12px;
      padding: 4px;
      background: gray;
      margin: 3px auto;
    }
  `
}


declare global {
  interface HTMLElementTagNameMap {
    'menu-element': MenuElement
  }
}
