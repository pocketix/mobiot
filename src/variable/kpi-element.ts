import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { LangCode, transl } from '../general/language';
import { KPIs } from '../general/KPIs';

@customElement('kpi-element')
export class KpiElement extends LitElement {

    @state()
    private isOpen: boolean = false;

    @property({ attribute: false })
    currentLang: LangCode = 'en';

    @state()
    private selected: string='';

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

    button.selected {
      background: linear-gradient(135deg, #4a90e2, #7da7d9);
      margin 0px;
      color: white;
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
        max-width: 300px;
    }
  .header {
    padding: 6px 2px;
    color: white;
    font-weight: bold;
    border-radius: 4px 4px 0 0;
    background: linear-gradient(to bottom, rgb(66, 63, 255), #7da7d9);
  }

  .content {
    padding: 20px;
    border-radius: 0 0 4px 4px;
    background:  #e0e0e0;
  }

  h2{
    color: #7da7d9
  }

  .item{
    padding: 5px;
    border-radius: 6px;
  }

  .alert {
    background: linear-gradient(135deg, rgb(226, 192, 0), rgb(236, 206, 64));
  }

  .info {
    background: linear-gradient(135deg, rgb(79, 255, 108), rgb(136, 205, 138));
  }

      `;
    
      render() {
        let kpiName = Object.keys(KPIs);
        if(kpiName.length>=1 && this.selected==='')this.selected=kpiName[0];
        let devs=KPIs[this.selected].dev;
        let kpiType=KPIs[this.selected].type;
        
        return html`
        <button @click=${this._openCloseModal}>${transl('KPI')}</button>
    
        ${this.isOpen ? html`
        <div class="modal">
          <div class="modal-content">
            <h2>${transl('KPI')}</h2>
                <div class="menu-container">
                    ${kpiName.map(item=>html`
                    <button class=${item === this.selected ? 'selected' : 'menu'} @click=${() => this.selected=item}>${transl(item)}</button>
                `)}
                </div>
            <div class="block">
              <div class="header">${transl(this.selected)}</div>
              <div class="content">
                ${devs.map(dev => html`<div class="item ${dev.value ? kpiType:''}">${dev.value ? this._addIcon(kpiType):''}${dev.name}</div>`)}
              </div>
            </div>

            <button class="back" @click=${this._openCloseModal}>← ${transl('back')}</button>
          </div>
        </div>
          ` : ''}
        `;
      }

      private _openCloseModal() {
        this.isOpen = !this.isOpen;
      }

      private _addIcon(value: string): string{
        switch(value){
            case('alert'):return '⚠️';
            case('info'):return '🟢'
            default: return''
        }
      }
 
}
declare global {
  interface HTMLElementTagNameMap {
    'kpi-element': KpiElement
  }
}
