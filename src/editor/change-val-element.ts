import { LitElement, html, css, TemplateResult} from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Argument, VarObject} from '../general/interfaces'
import { consume } from '@lit/context';
import { TypeOption } from '../general/types';
import { varListExport } from '../general/context';
import { CondText } from '../general/cond-text';
import { sensors } from '../general/sensors';
import { LangCode, transl } from '../general/language';

@customElement('change-val-element')
export class ChangeValElement extends LitElement {

    @state()
    private isOpen: boolean = false;

    @property({ type: Object })
    val: Argument = {type: 'note', value: '', args: []
    };

    @property()
    type: TypeOption='note'

    @consume({ context: varListExport })
    @property({ attribute: false })
    varList: VarObject[]=[];

    @property({ attribute: false })
    currentLang: LangCode = 'en';

    @state()
    private canSave: boolean = false;

    static styles = css`

    h2{
      color: black;
      margin: 0px;
    }
    
    button {
      padding: 8px 16px;
      margin: 4px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      background: linear-gradient(135deg, #4a90e2, #7da7d9);
      transition: background-color 0.2s, color 0.2s;
      color: black;
    }
        
    button.selected {
      background: linear-gradient(135deg, rgb(66, 63, 255), #357ABD);
      color: white;
    }

    input {
      padding: 8px 16px;
      margin: 4px;
      background: linear-gradient(135deg, #4a90e2, #7da7d9);
      border: none;
    }

    .save {
      margin: 12px 1px;
      background: linear-gradient(135deg, rgb(79, 255, 108), rgb(200, 255, 220));
    }

    button:disabled {
      background-color: grey;
      cursor: not-allowed;
      background: linear-gradient(135deg, #c4c4c4, rgb(214, 214, 214));
      color: #6e6e6e;
    }

    .but {
      margin: 0px 4px;
      padding: 8px 10px;
      background: #ddd;
    }

    .cancel{
      margin: 0px;
      background: linear-gradient(135deg, rgb(255, 104, 104), rgb(255, 160, 180));
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10;
    }

    .modal {
      position: fixed;
      bottom: 0;
      width: 100%;
      max-width: 1200px;
      height: 25vh; 
      background: white;
      padding: 4px;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
      overflow-y: auto;
    }
  `;

  render() {
    let valueType: TemplateResult=html``
    let varBlock: TemplateResult=html`<h2>${transl('useVariable')}</h2>`
    let filteredList: VarObject[]=[];

    if(this.type==='bool'){
      valueType=html`
        <button class=${'true' === this.val.value ? 'selected' : ''} @click=${() => this._handleBoolInput('true')}>${transl('true')}</button>
        <button class=${'false' === this.val.value ? 'selected' : ''} @click=${() => this._handleBoolInput('false')}>${transl('false')}</button>`
    }else if(this.type==='number'){
      valueType=html`<input type="number" .value=${this.val.type === 'variable' ? '' : this.val.value}
       @input=${this._handleValueInput} inputmode="decimal" step="any" placeholder=${transl('enterNumber')}>`
    }else{
      valueType=html`<input type="text" .value=${this.val.type === 'variable' ? '' : this.val.value} @input=${this._handleValueInput} placeholder=${transl('addVal')} />`
    }

    if(this.type!='variable' && this.type!=='note'){
      this.varList.forEach(item => {
        if(item.value.type===this.type)filteredList.push(item);
        else if(item.value.type==='expr'){
          if(['+','-','*','/'].includes(item.value.args[0].type)){
            if(this.type==='number')filteredList.push(item);
          }else{
            if(this.type==='bool')filteredList.push(item);
          }
      }})
    }else{
      filteredList=this.varList;
    }

    filteredList.forEach((item)=>{
        varBlock=html`${varBlock}
        <button @click=${() => this._saveChanges(item.name)}>${item.name}: ${item.value.type==='expr' ? CondText(item.value.args[0]) : transl(item.value.value)}</button>`
    })

    let filteredSensors=sensors;
    if(this.type!=='variable'){
      if(this.type!=='note'){
        filteredSensors=sensors.filter(item => item.value.type===this.type);
      }
      filteredSensors.forEach((item)=>{
        varBlock=html`${varBlock}
        <button @click=${() => this._saveChanges(item.name)}>${item.name}</button>`
      })
    }

    return html`
      <button class="but" @click=${this._openCloseModal}>${this.val.type==='bool'? transl(this.val.value):this.val.value}</button>

      ${this.isOpen ? html`
        <div class="overlay" @click=${this._openCloseModal}>
          <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
            ${filteredList.length != 0 || filteredSensors.length!==0 ? html`${varBlock}` : ''}
            ${this.type!='variable' ? html`
            <h2>${transl('changeValue')}</h2>
            <div>${valueType} <button class="save" ?disabled=${!this.canSave} @click=${() => this._saveChanges()}>${transl('save')}</button></div>
            ` : ''}
            <div><button class="cancel" @click=${this._openCloseModal}>X ${transl('cancel')}</button></div>
          </div>
        </div>
      ` : ''}
    `;
  }

  private _openCloseModal() {
    if(!this.isOpen && this.val.type==='variable'){
      this.canSave=false;
    }
    this.isOpen = !this.isOpen;
  }

  private _handleValueInput(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    this.val.value = target.value;
    this._saveBut();
  }

  private _handleBoolInput(input: string) {
    this.val = {...this.val, value: input }
    this._saveBut();
  }

  private _saveChanges(item: string='') {
    if(item){
      this.val.type='variable';
      this.val.value=item;
    }
    else{
      this.val.type=this.type
    }
    this.dispatchEvent(new CustomEvent('val-changed', {
      detail: { value: this.val },
      bubbles: true,
      composed: true
    }));
    this._openCloseModal()
  }

  private _saveBut() {
    if (this.val.value.length===0)this.canSave=false;
    else this.canSave=true;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'change-val-element': ChangeValElement
  }
}