import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import '../variable/var-edit-element.ts'
import '../icons/table-icon.ts'
import '../icons/delete-icon.ts'
import { VarObject} from '../general/interfaces.ts'
import { CondText } from '../general/cond-text.ts'
import { consume } from '@lit/context';
import { varListExport } from '../general/context.ts'
import { LangCode, transl } from '../general/language.ts'

@customElement('var-list-element')
export class VarListElement extends LitElement {

    @state()
    private isOpen: boolean = false;

    @property({ attribute: false })
    currentLang: LangCode = 'en';

    @consume({ context: varListExport })
    @property({ attribute: false })
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
            padding: 0.4em 0.4em;
            margin: 0.1em 0.2em;
            font-size: 1em;
            font-weight: 500;
            font-family: inherit;
            background-color:gray;
            background: linear-gradient(135deg, gray, rgb(170, 170, 170));
            border: none;
            cursor: pointer;
            transition: border-color 0.25s;
        }

        h1 {
            color: #4a90e2;
        }

        .delete {
            background: linear-gradient(135deg, rgb(255, 104, 104), rgb(255, 160, 180));
        }
        
        

        .modal {
            position: fixed;
            inset: 0;
            height: 100vh;
            overflow: hidden;

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
            border: none;
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
        align-items: center;}
      `;
    
      render() {
    
        return html`
        <button @click=${this._openCloseModal}><table-icon></table-icon>${transl('variables')}</button>
    
          ${this.isOpen ? html`
          <div class="modal">
            <div class="modal-content" @click=${(e: Event) => this._handleRowClick(e, this.varEdit)}>
                <h1>▦${transl('listOfVariables')}</h1>
                <table @click=${(e: Event) => { e.stopPropagation()}}>
                    <thead>
                    <tr>
                        <th>${transl('type')}</th>
                        <th>${transl('name')}</th>
                        <th>${transl('value')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${this.table.map(item => html`
                        <tr @click=${(e: Event) => this._handleRowClick(e, item)}>
                        <td>${transl(item.value.type)}</td>
                        <td>${item.name}</td>
                        ${item.value.type==='expr' ? html`<td>${CondText(item.value.args[0])}</td>` : 
                            html`<td>${item.value.type==='bool'? transl(item.value.value) : item.value.value}</td>`}
                        <div class="menu">
                        ${this.selectedRow === item ? html`
                            <var-edit-element 
                                .currentLang=${this.currentLang}
                                @click=${(e: Event) => e.stopPropagation()} 
                                .var=${item} 
                                @var-saved=${(e: CustomEvent) => this._addVar(e.detail.value, item)}>
                            </var-edit-element>
                            <button class="delete" @click=${(e: Event) => this._deleteVar(e, item)}><delete-icon></delete-icon>${transl('delete')}</button>
                        ` : ''}
                        </div>
                        </tr>
                    `)}
                    </tbody>
                </table>
                <div>
                    <button @click=${this._saveChanges}>← ${transl('back')}</button>
                    <var-edit-element .var=${this.varEdit} .currentLang=${this.currentLang} .varList=${this.table} @var-saved=${(e: CustomEvent) => this._addVar(e.detail.value)}></var-edit-element>
                </div>
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
        this.varEdit={name: '',value: {type: 'note', value: '', args: []}};
        this.table = [...this.table.sort((a, b) => a.name.localeCompare(b.name))];
    }

    private _deleteVar(event: Event, deletedVar: VarObject) {
        event.stopPropagation();
        const confirmMove = window.confirm(transl('attentionVar'));
        if (!confirmMove) return;
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
