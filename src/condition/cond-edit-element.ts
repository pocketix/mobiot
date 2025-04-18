import { LitElement, TemplateResult, css, html} from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { VarObject, Argument} from '../general/interfaces'
import { varListExport, condListExport} from '../general/context';
import { consume } from '@lit/context';
import { CondText } from '../general/cond-text';
import './var-choose-element';
import './new-val-element';
import './cond-block-element';
import '../icons/delete-icon';

const EMPTYBLOCK=html`<div class="empty"><div class="empty-header">Add first variable or value to your condition</div><div class="empty-content" /></div>`

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
  private canSave: boolean = false;

  @state()
  private canGroup: boolean = false;

  @property()
  newMode: boolean=true;

  @property()
  exprMode: boolean=false;

  @property()
  title: string='+ New condition'

  @property()
  newArg: Argument={type: 'note',value:'', args: []};

  @property()
  args: Argument[]=[];
  
  @property()
  block: Argument={type: 'cond',value:'', args: this.args}

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
      margin: 0px 4px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      background-color: rgb(168, 168, 168);
      transition: background-color 0.2s, color 0.2s;
      color: black;
    }

    .save {
      margin: 16px 4px;
      background-color:rgb(79, 255, 108);
    }

    button:disabled {
      background-color: grey;
      cursor: not-allowed;
      opacity: 0.5;
    }

    .delete {
      margin: 16px 4px;
      background-color:rgb(255, 104, 104);
    }
        
    .group {
      background-color: #7da7d9;
    }

    h2{
      color: black;
      margin: 0px;
    }

    h1 {
      color:  #7da7d9;
    }

    input {
      font-size: 1em;
      padding: 4px;
      border: none;
      background-color: #7da7d9;
      color: black;
    }

    .empty {
      display: block;
      border: 2px solid #333;
      border-radius: 8px;
      margin: 8px;
    }

    .empty-header {
      border-bottom: 2px solid #333;
      background-color: gray;
      padding: 8px;
      color: white;
      font-weight: bold;
      border-radius: 4px 4px 0 0;
    }
    
    .empty-content {
      background-color: rgb(168, 168, 168);
      min-height: 50px;
      padding: 8px;
      border-radius: 0 0 4px 4px;
    }

    .menu {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.5em 1em;
      margin: 0.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #7da7d9;
      cursor: pointer;
      transition: border-color 0.25s;
      color: white;
    }

    .block {
      background-color: #ddd;
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
      overflow: auto;
    }
  `;
    
  render() {
    if(this.block.args.length===0 && this.args.length!==0){
      this.block.args=this.args;
    }
    let cond: TemplateResult=this._drawExistOptions();
    
    return html`
      <button class=${'+ New condition' === this.title || '✎ Edit' === this.title? 'menu' : 'block'} @click=${this._openCloseModal}>${this.title}</button>

      ${this.isOpen ? html`
        <div class="modal">
          <h1>Condition Editor</h1>
          ${this.newMode ? html`<h2>Fill name of new condition</h2>
            <input type="text" .value=${this.condEdit.name} @input=${this._handleValueInput} placeholder="Add name ..." />`:''}
          ${this.block.args.length===0? EMPTYBLOCK:''}
          <cond-block-element .block=${this.block}
            .newArg=${this.newArg}
            .groupAction=${this.groupAction}
            .deleteAction=${this.deleteAction}
            .selectMode=${this.selectMode}
            .selectedBlock=${this.selectedBlock}
            .canGroup=${this.canGroup}
            @cond-changed=${(e: CustomEvent) => this._updateChoose(e.detail.value)}
            @select-ended=${() => {this._selectMode(); this._actionEnd();}}
            @new-arg-clean=${this._newArgClean}
            @can-group=${(e: CustomEvent) => this.canGroup = e.detail}
          ></cond-block-element>
          <div>
            <var-choose-element .varList=${this.varList} @var-add=${(e: CustomEvent) => this._addArg(e.detail.value)}></var-choose-element>
            <new-val-element @val-saved=${(e: CustomEvent) => this._addArg(e.detail.value)}></new-val-element>
          </div>
            ${this.selectMode ? html`
              <div>
                  <button class="group" ?disabled=${!this.canGroup} @click=${()=>{this.groupAction =true}}>Group</button>
                  <button class="delete" @click=${()=>{this.deleteAction =true}}><delete-icon></delete-icon>Delete</button>
              </div>
          ` : html`<button class="group" @click=${this._selectMode}>☑ Select ...</button>`}
            <div>
                ${this.newMode ? html`<button ?disabled=${!this.canSave} class="save" @click=${()=>{this._saveUpdate(true)}}>Save condition</button>`:
                  html`<button class="save" ?disabled=${!this.canSave} @click=${()=>{this._saveUpdate(false)}}>Use value</button>`}
                <button @click=${this._backAction}>Back</button>
            </div>
          ${cond}
        </div>
      ` : ''}
    `;
  }

  private _drawExistOptions(): TemplateResult{
    let cond: TemplateResult=html``;
    if(!this.newMode && this.title!=='✎ Edit' && this.condList.length!=0){
      this.condList.forEach((item)=>{
        cond=html`${cond}<button @click=${()=>{this.block.args[0]=structuredClone(item.value);this._updateCond()}}>${CondText(item.value)}</button>`
      })
      cond=html`<h2>Select one from exist</h2>
        <div>${cond}</div>`;
    }
    return cond;
  }

  private _openCloseModal() {
    this.isOpen = !this.isOpen;
    this.dispatchEvent(new CustomEvent('cond-open', {
      detail: { value: this.isOpen },
      bubbles: true,
      composed: true
    }));
    this._saveCheck();
  }

  private _selectMode() {
    this.selectMode = !this.selectMode;
    this._saveCheck();
  }

  private _actionEnd(){
    this.groupAction=false;
    this.deleteAction=false;
  }

  private _handleValueInput(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    this.condEdit.name = target.value;
    this._saveCheck();
  }

  private _addArg(newArg: Argument) {
    this.newArg = { ...newArg};
  }

  private _updateChoose(updatedArg: Argument) {
    this.selectedBlock = updatedArg;
    this.selectMode=false;
  }

  private _newArgClean() {
    this.newArg = {type: 'note',value:'', args: []};
    this._saveCheck();
  }

  private _saveUpdate(newItem: boolean){
    if(newItem)this._saveCond();
    else this._updateCond();
  }

  private _saveCheck(){
    if(this.block.args.length===1 && !['num', 'str', 'bool', 'expr','variable'].includes(this.block.args[0].type) &&
      ((!['+','-','*','/'].includes(this.block.args[0].type) || this.exprMode)&&
      (!this.newMode || this.condEdit.name)))this.canSave=true;
    else this.canSave=false;
  }

  private _saveCond() {
    this.condEdit.value={ ...this.block.args[0]};
    this.dispatchEvent(new CustomEvent('cond-saved', {
      detail: { value: this.condEdit },
      bubbles: true,
      composed: true
    }));
    this._endClean();
    this._openCloseModal();
  }

  private _updateCond() {
    this.dispatchEvent(new CustomEvent('cond-update', {
      detail: { value: this.block.args[0] },
      bubbles: true,
      composed: true
    }));
    this._openCloseModal()
  }

  private _backAction() {
    if(this.newArg) this._endClean();
    this.dispatchEvent(new CustomEvent('cond-clean', {
      bubbles: true,
      composed: true
    }));
    this._openCloseModal()
  }

  private _endClean(){
    this.condEdit={name: '', value: {type: 'note',value:'', args: []}}
    this.block.args=[];
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'cond-edit-element': CondEditElement
  }
}
