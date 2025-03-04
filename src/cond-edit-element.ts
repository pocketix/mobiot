import { LitElement, css, html} from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { VarObject, Argument} from './interfaces'
import './var-choose-element';
import './new-val-element';
import './cond-block-element';

@customElement('cond-edit-element')
export class CondEditElement extends LitElement {

    @state()
    private isOpen: boolean = false;

    @state()
    private groupAction: boolean = false;

    @state()
    private deleteAction: boolean = false;

    @state()
    private selectMode: boolean = false;

    @state()
    private newArg: Argument={type: 'note',value:'', args: []};

    @property()
    condEdit: VarObject={name: '', value: []}

    @property()
    block: Argument={type: 'boolean_expression',value:'', args: []}

    @property()
    varList: VarObject[] = []

    @state()
    private selectedBlock: Argument=this.block

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

      `;
    
      render() {
        return html`
          <button @click=${this._openCloseModal}>Condition editor</button>
    
          ${this.isOpen ? html`
            <div class="modal">
                    <input type="text" .value=${this.condEdit.name} @input=${this._handleValueInput} placeholder="Add name ..." />
                    <cond-block-element .block=${this.block}
                      .newArg=${this.newArg}
                      .groupAction=${this.groupAction}
                      .deleteAction=${this.deleteAction}
                      .selectMode=${this.selectMode}
                      .selectedBlock=${this.selectedBlock}
                      @block-changed=${(e: CustomEvent) => this._updateChoose(e.detail.value)}
                      @select-ended=${() => { this._selectMode(); this._action();}}
                      @new-arg-clean=${this._newArgClean}
                    ></cond-block-element>
                    <var-choose-element .varList=${this.varList} @var-saved=${(e: CustomEvent) => this._addArg(e.detail.value)}></var-choose-element>
                    <new-val-element @val-saved=${(e: CustomEvent) => this._addArg(e.detail.value)}></new-val-element>
                     ${this.selectMode ? html`
                        <div>
                            <button @click=${()=>{this.groupAction =true}}>Group</button>
                            <button @click=${()=>{this.deleteAction =true}}>Delete</button>
                        </div>
                    ` : html`<button @click=${this._selectMode}>Select ...</button>`}
                <div>
                    <button>Save condition</button>
                    <button>Use value</button>
                    <button @click=${this._openCloseModal}>Back</button>
                </div>
            </div>
          ` : ''}
        `;
      }

      private _openCloseModal() {
        this.isOpen = !this.isOpen;
      }

      private _selectMode() {
        this.selectMode = !this.selectMode;
      }

      private _action(){
        this.groupAction=false;
        this.deleteAction=false;
      }

      private _handleValueInput(event: InputEvent) {
        const target = event.target as HTMLInputElement;
        this.condEdit.name = target.value;
      }

      private _addArg(newArg: Argument) {
        this.newArg = { ...newArg};
      }

      private _updateChoose(updatedArg: Argument) {
        this.selectedBlock = updatedArg;
      }

      private _newArgClean() {
        this.newArg = {type: 'note',value:'', args: []};
      }
}
declare global {
  interface HTMLElementTagNameMap {
    'cond-edit-element': CondEditElement
  }
}
