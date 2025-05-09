import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { condListExport} from '../general/context';
import { consume } from '@lit/context';
import { VarObject, Argument} from '../general/interfaces.ts';
import { CondText } from '../general/cond-text.ts';
import { LangCode, transl } from '../general/language.ts';
import './cond-edit-element.ts';
import '../icons/table-icon.ts'
import '../icons/delete-icon.ts'


@customElement('cond-list-element')
export class CondListElement extends LitElement {

    @state()
    private isOpen: boolean = false;

    @consume({ context: condListExport })
    @property({ attribute: false })
    table: VarObject[] = []

    @property({ attribute: false })
    currentLang: LangCode = 'en';

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
            padding: 0.4em 0.8em;
            margin: 0.2em 0.4em;
            font-size: 1em;
            font-weight: 500;
            font-family: inherit;
            background: linear-gradient(135deg, gray, rgb(170, 170, 170));
            border: none;
            cursor: pointer;
            transition: border-color 0.25s;
        }

        h1 {
            color: #4a90e2;
        }

        .delete {
            margin: 0.2em;
            background: linear-gradient(135deg, rgb(255, 104, 104), rgb(255, 160, 180));
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
            gap: 16px;

            padding: 24px 5px;;
            flex-direction: column;
            gap: 16px;
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
            background: linear-gradient(135deg, rgb(170, 170, 170), #ddd);
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
            background:white;
        }

        .menu{
        display: flex;
        justify-content: center;
        align-items: center;
        }
    `;
    
    render() {
        return html`
          <button @click=${this._openCloseModal}><table-icon></table-icon>${transl('conditions')}</button>
    
          ${this.isOpen ? html`
          <div class="modal">
            <div class="modal-content" @click=${(e: Event) => this._handleRowClick(e, this.condEdit)}>
                <h1>▦${transl('listOfConditions')}</h1>
                <table @click=${(e: Event) => { e.stopPropagation()}}>
                    <thead>
                    <tr>
                        <th>${transl('name')}</th>
                        <th>${transl('value')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${this.table.map(item => html`
                        <tr @click=${(e: Event) => this._handleRowClick(e, item)}>
                        <td>⚖️${item.name}</td>
                        <td>${CondText(item.value).length > this._getMaxLength()
                                ? CondText(item.value).slice(0, this._getMaxLength()) + '…' 
                                : CondText(item.value)}
                        </td>
                        <div class="menu">
                        ${this.selectedRow === item ? (() => {
                            const original = structuredClone(item.value); return html`
                            <cond-edit-element 
                                .newMode=${false} .block=${{type: 'cond',value:'', args: [item.value]}} .selectedBlock=${item.value} .title=${'✎ Edit'} .currentLang=${this.currentLang}
                                @click=${(e: Event) => e.stopPropagation()}
                                @cond-update=${(e: CustomEvent) => this._updateCond(e.detail.value, item)}
                                @cond-clean=${() => this._updateCond(original, item)}>
                            </cond-edit-element>
                            <button class="delete" @click=${(e: Event) => this._deleteCond(e, item)}><delete-icon></delete-icon>${transl('delete')}</button>
                        `})(): ''}
                        </div>
                        </tr>
                    `)}
                    </tbody>
                </table>
                <div>
                    <button @click=${this._saveChanges}>← ${transl('back')}</button>
                    <cond-edit-element @click=${(e: Event) => e.stopPropagation()} @cond-saved=${(e: CustomEvent) => this._addCond(e.detail.value)} 
                    .currentLang=${this.currentLang}></cond-edit-element>
                </div>
            </div>
            </div>
          ` : ''}
        `;
    }

    private _openCloseModal() {
        this.isOpen = !this.isOpen;
    }

    private _getMaxLength(): number {
        const width = window.innerWidth;
        if (width <= 375) return 25;
        if (width <= 425) return 30;
        return 50;
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
