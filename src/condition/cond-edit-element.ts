import { LitElement, TemplateResult, css, html} from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { VarObject, Argument} from '../general/interfaces'
import { varListExport, condListExport} from '../general/context';
import { consume } from '@lit/context';
import { CondText } from '../general/cond-text';
import './var-choose-element';
import '../editor/new-val-element';
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

    @property()
    newMode: boolean=true;

    @property()
    title: string='New condition'

    @property()
    newArg: Argument={type: 'note',value:'', args: []};

    @property()
    block: Argument={type: 'boolean_expression',value:'', args: []}

    @property()
    condEdit: VarObject={name: '', value: this.block}

    @consume({ context: varListExport })
    @property({ attribute: false })
    varList: VarObject[] = []

    @consume({ context: condListExport })
    @property({ attribute: false })
    condList: VarObject[] = []

    @state()
    selectedBlock: Argument=this.block

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
        let cond: TemplateResult=html``;
        if(!this.newMode){
          this.condList.forEach((item)=>{
            cond=html`${cond}<li><button @click=${()=>{this.block=item.value;this._updateCond()}}>${CondText(item.value.args[0])}</button></li>`
          })
          cond=html`<h2>Or select one from exist</h2>
            <div>${cond}</div>`;
        }
        return html`
          <button @click=${this._openCloseModal}>${this.title}</button>
    
          ${this.isOpen ? html`
            <div class="modal">
                    ${this.newMode ? html`<input type="text" .value=${this.condEdit.name} @input=${this._handleValueInput} placeholder="Add name ..." />`:''}
                    <cond-block-element .block=${this.block}
                      .newArg=${this.newArg}
                      .groupAction=${this.groupAction}
                      .deleteAction=${this.deleteAction}
                      .selectMode=${this.selectMode}
                      .selectedBlock=${this.selectedBlock}
                      @cond-changed=${(e: CustomEvent) => this._updateChoose(e.detail.value)}
                      @select-ended=${() => { this._selectMode(); this._action();}}
                      @new-arg-clean=${this._newArgClean}
                    ></cond-block-element>
                    <var-choose-element .varList=${this.varList} @var-add=${(e: CustomEvent) => this._addArg(e.detail.value)}></var-choose-element>
                    <new-val-element @val-saved=${(e: CustomEvent) => this._addArg(e.detail.value)}></new-val-element>
                     ${this.selectMode ? html`
                        <div>
                            <button @click=${()=>{this.groupAction =true}}>Group</button>
                            <button @click=${()=>{this.deleteAction =true}}>Delete</button>
                        </div>
                    ` : html`<button @click=${this._selectMode}>Select ...</button>`}
                <div>
                    ${this.newMode ? html`<button @click=${()=>{this._saveUpdate(true)}}>Save condition</button>`:html`<button @click=${()=>{this._saveUpdate(false)}}>Use value</button>`}
                    <button @click=${this._backAction}>Back</button>
                </div>
              ${cond}
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

      private _saveUpdate(newItem: boolean){
        if(this.block.args.length===1 && (!['num', 'str', 'bool', 'expr','variable','+','-','*','/'].includes(this.block.args[0].type))){
          if(newItem)this._saveCond();
          else this._updateCond();
        }
      }
      private _saveCond() {
        if(this.condEdit.name){
          this.condEdit.value={ ...this.block};
          this.dispatchEvent(new CustomEvent('cond-saved', {
            detail: { value: this.condEdit },
            bubbles: true,
            composed: true
          }));
          this.condEdit={name: '', value: {type: 'note',value:'', args: []}}
          this.block.args=[]
          this._openCloseModal()
        }
      }

      private _updateCond() {
        this.dispatchEvent(new CustomEvent('cond-update', {
          detail: { value: this.block },
          bubbles: true,
          composed: true
        }));
        this._openCloseModal()
      }

      private _backAction() {
        if(this.newArg){
          this.condEdit={name: '', value: {type: 'note',value:'', args: []}}
          this.block.args=[]
        }
        this.dispatchEvent(new CustomEvent('cond-clean', {
          bubbles: true,
          composed: true
        }));
        this._openCloseModal()
      }
}
declare global {
  interface HTMLElementTagNameMap {
    'cond-edit-element': CondEditElement
  }
}
