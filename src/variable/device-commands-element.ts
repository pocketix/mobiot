import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

@customElement('device-commands-element')
export class VarListElement extends LitElement {

    @state()
    private isOpen: boolean = false;

    static styles = css`

      :host {
        color: black;
      }

      .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 16px;
        overflow-y: auto;
        color": black;
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
      margin-left: auto;
    }
      `;
    
      render() {
        return html`
        <button @click=${this._openCloseModal}>Commands</button>
    
        ${this.isOpen ? html`
          <div class="modal">

            <button @click=${this._openCloseModal}>Back</button>
          </div>
          ` : ''}
        `;
      }

      private _openCloseModal() {
        this.isOpen = !this.isOpen;
      }
 
}
declare global {
  interface HTMLElementTagNameMap {
    'device-commands-element': VarListElement
  }
}
