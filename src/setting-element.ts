import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { VarObject } from './general/interfaces';
import { ExportText } from './general/export';
import { LangCode, transl, setLang, getLang, translations } from './general/language';
import './variable/device-commands-element';
import './variable/device-parameters-element';
import './variable/kpi-element'

@customElement('setting-element')
export class SettingElement extends LitElement {

  @state()
  private isOpen: boolean = false;

  @property()
  programText: string='';

  @property()
  varList: VarObject[] = [];

  @state()
  private showHelp: boolean = false;

  @state()
  private showAbout: boolean = false;

  static styles = css`

    :host {
      color: black;
    }

    .modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: auto;
    }

    .modal-content {
      background: white;
      max-height: 100%;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;

      max-width: 425px;
      box-sizing: border-box;
      padding: 16px 0px;
      border-radius: 8px;
    }

    h1{
      color: rgb(66, 63, 255);
    }
    h1, h2 {
      margin: 16px 0 0 0;
    }

    h2{
      color: #7da7d9
    }

    .border{
    padding-top: 16px;
      border-top: 1px solid #ccc;
    }

    select{
      max-width: 200px;
      margin: auto;
      padding: 5px 20px;
      font-size: 1em;
      background: linear-gradient(135deg, gray, rgb(170, 170, 170));
      border: none;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.4em 0.8em;
      margin: 0.2em 0.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background: linear-gradient(135deg, gray, rgb(170, 170, 170));
      border: none;
      cursor: pointer;
      transition: border-color 0.25s;
    }

    .back{
      margin: 0.2em 0.8em;
    }

    option {
      color: black;
    }

    h3{
      margin: 0;
    }

    p{
      margin: 0 2px 16px 2px;
    }
  `;
    
  render() {
    return html`
    <button @click=${this._openCloseModal}>⛭</button>

    ${this.isOpen ? html`
      <div class="modal">
      <div class="modal-content">
        <h1>⛭ ${transl('settings')}</h1>
        <h2>Program</h2>
        <div>
          <button @click=${this._openFilePicker}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3v12"></path>
            <path d="m8 11 4 4 4-4"></path>
            <path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"></path>
            </svg>
          ${transl('importJSONfile')}</button>
          <button @click=${this._exportText}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12l7-7 7 7" />
            <path d="M12 5v14" />
            </svg>
          ${transl('exportJSONfile')}</button>
        </div>
        <h2 class="border">${transl('chooseLanguage')}</h2>
        <select .value=${getLang()} @change=${this._changeLanguage}>
          ${Object.keys(translations).map(lang => html`
            <option value=${lang}>${lang}</option>
          `)}
        </select>
        <h2 class="border">${transl('usersFactors')}</h2>
        <div>
          <var-list-element .currentLang=${getLang()}></var-list-element>
          <cond-list-element .currentLang=${getLang()}></cond-list-element>
          <button>{ } ${transl('procedures')}</button>
        </div>
        <h2 class="border">${transl('devicesFactors')}</h2>
        <div>
          <device-commands-element .currentLang=${getLang()}></device-commands-element>
          <device-parameters-element .currentLang=${getLang()}></device-parameters-element>
          <kpi-element .currentLang=${getLang()}></kpi-element>
        </div>
        <h2 class="border" @click=${()=>this.showHelp=!this.showHelp}>${transl('help')}${this.showHelp? '▲':'▼'}</h2>
        
        ${this.showHelp ? html`
          <p>${transl('helpText')}</p>
          <h3>${transl('graphicalView')}</h3>
          <p>${transl('graphicalViewText')}</p>
          <h3>${transl('textView')}</h3>
          <p>${transl('textViewText')}</p>
          <h3>${transl('offerSection')}</h3>
          <p>${transl('offerSectionText')}</p>
          <h3>${transl('settingsHelp')}</h3>
          <p>${transl('settingsText')}</p>
        ` : ''}
        <h2 class="border" @click=${()=>this.showAbout=!this.showAbout}>${transl('about')}${this.showAbout? '▲':'▼'}</h2>
        ${this.showAbout? html`<p>${transl('aboutText')}<a href="https://github.com/pocketix/iot-vpl-editor" target="_blank">${transl('here')}</a></p>`:''}
        <button class="back" @click=${this._openCloseModal}>← ${transl('back')}</button>
      </div>
      </div>
      ` : ''}
    `;
  }//button Procedures is not part of this thesis

private _openCloseModal() {
  this.isOpen = !this.isOpen;
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
        window.alert(transl('invalidImport'));
      }
    }
  }

  private _exportText() {
    const exportText=ExportText(this.programText, this.varList);
    const blob = new Blob([exportText], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "JSONprogram.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private _changeLanguage(e: Event) {
    const select = e.target as HTMLSelectElement;
    setLang(select.value as LangCode);
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent('language-changed', {
      bubbles: true,
      composed: true
    }));
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'setting-element': SettingElement
  }
}
