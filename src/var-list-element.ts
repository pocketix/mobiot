import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import './var-edit-element.ts'
import { VarObject} from './interfaces'

@customElement('var-list-element')
export class VarListElement extends LitElement {

    @state()
    private isOpen: boolean = false;

    @property()
    table: VarObject[] = []

    @state()
    private varEdit: VarObject={
        name: '',
        value: [{type: 'note', value: '', args: []}]
    }

    @state()
    private selectedRow: VarObject | null = null;

    private longPressTimeout: any = null;

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
          <button @click=${this._openCloseModal}>Variables</button>
    
          ${this.isOpen ? html`
            <div class="modal" @click=${(e: Event) => this._handleRowClick(e, this.varEdit)}>
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
                        <tr @contextmenu=${(e: Event) => this._handleRowClick(e, item)}
                            @pointerdown=${() => this._handleLongPress(item)}
                            @pointerup=${() => this._cancelLongPress()}>
                        <td>${item.value[0].type}</td>
                        <td>${item.name}</td>
                        <td>${item.value[0].value}</td>
                        <div>
                        ${this.selectedRow === item ? html`
                            <var-edit-element 
                                @click=${(e: Event) => e.stopPropagation()} 
                                .var=${item} 
                                @var-saved=${(e: CustomEvent) => this._addVar(e.detail.value, item)}>
                            </var-edit-element>
                            <button @click=${(e: Event) => this._deleteVar(e, item)}>Delete</button>
                        ` : ''}
                        </div>
                        </tr>
                    `)}
                    </tbody>
                </table>
                <div>
                    <button @click=${this._saveChanges}>Back</button>
                    <var-edit-element .var=${this.varEdit} @var-saved=${(e: CustomEvent) => this._addVar(e.detail.value)}></var-edit-element>
                </div>
            </div>
          ` : ''}
        `;
      }

      private _openCloseModal() {
        this.isOpen = !this.isOpen;
      }

    private _addVar(updatedVar: VarObject, originalVar: VarObject=this.varEdit) {
        this.table=this.table.filter(item => item != originalVar)
        this.varEdit = { ...updatedVar };
        if(this.varEdit.name!=''){
            this.table.push(this.varEdit)
        }
        this.varEdit={name: '',value: [{type: 'note', value: '', args: []}]}
    }

    private _deleteVar(event: Event, deletedVar: VarObject) {
        event.stopPropagation();
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

    private _handleRowClick(event: Event, item: VarObject) {
        event.preventDefault();
        this.selectedRow = this.selectedRow === item ? null : item;
    }

    private _handleLongPress(item: VarObject) {
        this.longPressTimeout = setTimeout(() => {
            this.selectedRow = item;
        }, 500);
    }

    private _cancelLongPress() {
        clearTimeout(this.longPressTimeout);
    }

}
declare global {
  interface HTMLElementTagNameMap {
    'var-list-element': VarListElement
  }
}
