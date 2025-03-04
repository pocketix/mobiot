import { LitElement, css, html} from 'lit'
import { customElement, property, state} from 'lit/decorators.js'
import { VarObject, View} from './interfaces'
import './var-list-element.ts';
import './options-element.ts';
import './cond-edit-element.ts'

@customElement('menu-element')
export class MenuElement extends LitElement {
    @property()
    varList: VarObject[] = [];

    @property()
    programText: string=''

    @state()
    private viewList: View[] = ['both','text','vp'];

    @property()
    view: View='both'

  render() {
    return html`
        <button @click=${this._openFilePicker}>Import JSON file</button>
        <button @click=${this._exportText}>Export JSON file</button>
        <var-list-element .table=${this.varList} @list-saved=${(e: CustomEvent) => this._varList(e.detail.value)}></var-list-element>
        <div>
            ${this.viewList.map(item=>html`
                <button class=${item === this.view ? 'selected' : ''} @click=${() => this._selectTypeInput(item)}>${item}</button>
                `)}
            </div>
    `
    }
    //TODO <cond-edit-element .varList=${this.varList}></cond-edit-element>

    private _varList(newVar: VarObject[]) {
        this.varList = [ ...newVar] ;
        this.dispatchEvent(new CustomEvent('var-saved', {
            detail: { value: this.varList},
            bubbles: true,
            composed: true
        }));
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

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }

    button.selected {
        background-color: #7da7d9;
        color: white;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }
  `
}


declare global {
  interface HTMLElementTagNameMap {
    'menu-element': MenuElement
  }
}
