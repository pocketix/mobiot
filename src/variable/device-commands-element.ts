import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { LangCode, transl } from '../general/language';
import { blockTypes } from '../general/blocks';

@customElement('device-commands-element')
export class DeviceCommandElement extends LitElement {

    @state()
    private isOpen: boolean = false;

    @property({ attribute: false })
    currentLang: LangCode = 'en';

    static styles = css`

      :host {
        color: black;
      }

      .modal {
            position: fixed;
            inset: 0;
            height: 100vh;
            overflow: hidden;
            background: background: rgba(0, 0, 0, 0.5);;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background: white;
            height: 100%;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;

            padding: 24px 5px;;
            flex-direction: column;
            gap: 8px;
        }

        @media (min-width: 425px) {
            .modal-content {
                min-width: 425px;
                border-radius: 8px;
                box-sizing: border-box;
            }
        }

        @media (max-width: 425px) {
            .modal-content {
                width: 100%;
            }
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
      width: 100%;
      max-width: 200px;
    }

    .block {
    display: block;
    border: 2px solid #333;
    border-radius: 8px;
    background-color: #e0e0e0;
    margin: 2px ;
    width: 100%;
    max-width: 200px;
  }
  .header {
    padding: 6px 2px;
    color: white;
    font-weight: bold;
    border-radius: 4px 4px 0 0;
    background: linear-gradient(to bottom, rgb(66, 63, 255), #7da7d9);
  }

  .content {
    padding: 4px;
    border-radius: 0 0 4px 4px;
    background: linear-gradient(to bottom, #7da7d9, #e0e0e0);
  }

  h2{
    color: #7da7d9
  }
      `;
    
      render() {
        const commandsList: Record<string, string[]> = {};
        let devList=blockTypes.filter(item=>(item.type==='dev'));
        devList.forEach(item=>{
          const itemParts = item.name.split('.');

          if (itemParts.length >= 2) {
            const key = itemParts[0];
            const value = itemParts[1];

            if (!commandsList[key]) {
              commandsList[key] = [value];
            }else {
              commandsList[key].push(value);
            }
          } 
        });
        return html`
        <button @click=${this._openCloseModal}>${transl('commands')}</button>
    
        ${this.isOpen ? html`
        <div class="modal">
          <div class="modal-content">
            <h2>${transl('commands')}</h2>
            ${Object.entries(commandsList).map(([key, values]) => html`
            <div class="block">
              <div class="header">${key}</div>
              <div class="content">
                ${values.map(value => html`<div>${value}</div>`)}
              </div>
            </div>
            `)}
            <button class="back" @click=${this._openCloseModal}>← ${transl('back')}</button>
          </div>
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
    'device-commands-element': DeviceCommandElement
  }
}
