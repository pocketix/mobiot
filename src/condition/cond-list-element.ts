import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { condListExport} from '../general/context';
import { consume } from '@lit/context';
import './cond-edit-element.ts';
import '../icons/table-icon.ts'
import '../icons/delete-icon.ts'
import { VarObject, Argument} from '../general/interfaces.ts';
import { CondText } from '../general/cond-text.ts';

@customElement('cond-list-element')
export class CondListElement extends LitElement {

    @state()
    private isOpen: boolean = false;

    @consume({ context: condListExport })
    @property({ attribute: false })
    table: VarObject[] = []

    @state()
    private condEdit: VarObject={
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
            background-color:gray;
            cursor: pointer;
            transition: border-color 0.25s;
        }

        h1 {
            color: black;
        }

        .delete {
            margin: 0.2em;
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
          <button @click=${this._openCloseModal}><table-icon></table-icon>Conditions</button>
    
          ${this.isOpen ? html`
            <div class="modal" @click=${(e: Event) => this._handleRowClick(e, this.condEdit)}>
                <h1>List of conditions</h1>
                <table @click=${(e: Event) => { e.stopPropagation()}}>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${this.table.map(item => html`
                        <tr @click=${(e: Event) => this._handleRowClick(e, item)}>
                        <td>${item.name}</td>
                        <td>${CondText(item.value)}</td>
                        <div>
                        ${this.selectedRow === item ? (() => {
                            const original = structuredClone(item.value); return html`
                            <cond-edit-element 
                                .newMode=${false} .args=${[item.value]} .selectedBlock=${item.value} .title=${'✎ Edit'}
                                @click=${(e: Event) => e.stopPropagation()}
                                @cond-update=${(e: CustomEvent) => this._updateCond(e.detail.value, item)}
                                @cond-clean=${() => this._updateCond(original, item)}>
                            </cond-edit-element>
                            <button class="delete" @click=${(e: Event) => this._deleteCond(e, item)}><delete-icon></delete-icon>Delete</button>
                        ` ;})(): ''}
                        </div>
                        </tr>
                    `)}
                    </tbody>
                </table>
                <div>
                    <button @click=${this._saveChanges}>Back</button>
                    <cond-edit-element @click=${(e: Event) => e.stopPropagation()} @cond-saved=${(e: CustomEvent) => this._addCond(e.detail.value)}>></cond-edit-element>
                </div>
            </div>
          ` : ''}
        `;
      }

    private _openCloseModal() {
    this.isOpen = !this.isOpen;
    }

    private _addCond(newCond: VarObject){
        this.table=[...this.table, newCond];
        this.table = [...this.table.sort((a, b) => a.name.localeCompare(b.name))];
    }

    private _updateCond(updatedCond: Argument, originalCond: VarObject) {
        this.table=this.table.filter(item => item != originalCond)
        originalCond.value = { ...updatedCond };
        this.table.push(originalCond)
        this.table = [...this.table.sort((a, b) => a.name.localeCompare(b.name))];
    }

    private _deleteCond(event: Event, deletedVar: VarObject) {
        event.stopPropagation();
        this.table=this.table.filter(item => item != deletedVar)
    }

    private _saveChanges() {
        this.dispatchEvent(new CustomEvent('cond-list-saved', {
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
    'cond-list-element': CondListElement
  }
}
