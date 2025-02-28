import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

type TypeOption = 'num' | 'str' | 'bool' | 'expr';

interface VarObject {
    type: TypeOption | null;
    name: string;
    value: string;
}

@customElement('var-list-element')
export class VarListElement extends LitElement {

        @state()
        private isOpen: boolean = false;

        @property()
        table: VarObject[] = []

        @state()
        private varEdit: VarObject={
            type: null,
            name: '',
            value: ''
        }

        static styles = css`
        
        button {
                padding: 8px 16px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                background-color: #ddd;
                transition: background-color 0.2s, color 0.2s;
                color: black;
            }
        
        /* Překrytí při otevřeném pop-up okně */
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: black;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 16px;
        }

        table {
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 18px;
        }
    
        th, td {
            padding: 12px 15px;
            border: 1px solid #ddd;
            text-align: left;
        }
      `;
    
      render() {
    
        return html`
          <button @click=${this._openCloseModal}>List of variable</button>
    
          ${this.isOpen ? html`
            <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
                <table>
                    <thead>
                    <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${this.table.map(item => html`
                        <tr>
                        <td>${item.type}</td>
                        <td>${item.name}</td>
                        <td>${item.value}</td>
                        <var-edit-element .var=${item} @var-saved=${(e: CustomEvent) => this._updateVar(e.detail.value, item)}></var-edit-element>
                        <button @click=${() => this._deleteVar(item)}>Delete</button>
                        </tr>
                    `)}
                    </tbody>
                </table>
                <div>
                    <button @click=${this._saveChanges}>Back</button>
                    <var-edit-element .var=${this.varEdit} @var-saved=${(e: CustomEvent) => this._newVar(e.detail.value)}></var-edit-element>
                </div>
            </div>
          ` : ''}
        `;
      }

      private _openCloseModal() {
        this.isOpen = !this.isOpen;
      }

    private _newVar(newVar: VarObject) {//TODO clean code
        this.varEdit = { ...newVar };
        if(this.varEdit.name!=''){
            this.table.push(this.varEdit)
        }
        this.varEdit={type: null, name: '', value: ''}
    }

    private _updateVar(updatedVar: VarObject, originalVar: VarObject) {
        this.table=this.table.filter(item => item != originalVar)
        this.varEdit = { ...updatedVar };
        if(this.varEdit.name!=''){
            this.table.push(this.varEdit)
        }
        this.varEdit={type: null, name: '', value: ''}
    }

    private _deleteVar(deletedVar: VarObject) {
        this.table=this.table.filter(item => item != deletedVar)
    }

    private _saveChanges() {
        this.dispatchEvent(new CustomEvent('list-saved', {
            detail: { value: this.table },
            bubbles: true,
            composed: true
        }));
        this._openCloseModal()

    }

}
declare global {
  interface HTMLElementTagNameMap {
    'var-list-element': VarListElement
  }
}
