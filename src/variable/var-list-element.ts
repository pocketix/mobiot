import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import '../variable/var-edit-element.ts'
import { VarObject} from '../general/interfaces.ts'

@customElement('var-list-element')//TODO sort table 3rd phase
export class VarListElement extends LitElement {

    @state()
    private isOpen: boolean = false;

    @property()
    table: VarObject[] = []

    @state()
    private varEdit: VarObject={
        name: '',
        value: {type: 'note', value: '', args: []}
    }

    @state()
    private selectedRow: VarObject | null = null;

    static styles = css`
        
        button {
            border-radius: 8px;
            border: 1px solid transparent;
            padding: 0.5em 1em;
            margin: 0.2em 0.4em;
            font-size: 1em;
            font-weight: 500;
            font-family: inherit;
            background-color:rgb(51, 51, 51);
            cursor: pointer;
            transition: border-color 0.25s;
        }

        h1 {
            color: black;
        }

        .delete {
            background-color:rgb(255, 64, 64);
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
        }

        table {
            border-collapse: separate;
            border-spacing: 0 2px;
            margin: 20px 0;
            font-size: 18px;
        }
    
        th, td {
            padding: 12px 15px;
            
            text-align: left;
            color: black;
        }
           
        tr {
            border-radius: 8px;
            background-color:rgb(170, 170, 170);
        }

        tr td:first-child {
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
        }

        tr td:last-child {
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
        }

        thead tr {
            background-color:white;
        }
      `;
    
      render() {
    
        return html`
          <button @click=${this._openCloseModal}>Variables</button>
    
          ${this.isOpen ? html`
            <div class="modal" @click=${(e: Event) => this._handleRowClick(e, this.varEdit)}>
                <h1>List of variables</h1>
                <table @click=${(e: Event) => { e.stopPropagation()}}>
                    <thead>
                    <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${this.table.map(item => html`
                        <tr @click=${(e: Event) => this._handleRowClick(e, item)}>
                        <td>${item.value.type}</td>
                        <td>${item.name}</td>
                        <td>${item.value.value}</td>
                        <div>
                        ${this.selectedRow === item ? html`
                            <var-edit-element 
                                @click=${(e: Event) => e.stopPropagation()} 
                                .var=${item} 
                                @var-saved=${(e: CustomEvent) => this._addVar(e.detail.value, item)}>
                            </var-edit-element>
                            <button class="delete" @click=${(e: Event) => this._deleteVar(e, item)}>Delete</button>
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
        this.varEdit={name: '',value: {type: 'note', value: '', args: []}}
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

}
declare global {
  interface HTMLElementTagNameMap {
    'var-list-element': VarListElement
  }
}
