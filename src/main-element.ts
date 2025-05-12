import { LitElement, css, html, TemplateResult} from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { VarObject, ProgramBlock } from './general/interfaces.ts'
import { View } from './general/types.ts';
import { varListExport, condListExport, programIndexExport, detailGeneralExport} from './general/context.ts';
import { provide } from '@lit/context';
import { vpToText } from './convert/vp-to-text.ts';
import { TextToVp } from './convert/text-to-vp.ts';
import { UpdateVarList } from './convert/update-var-list.ts';
import { TextSyntax } from './convert/text-syntax.ts';
import { LangCode, getLang, transl, translations, updateTranslations} from './general/language.ts';
import './editor/vp-editor-element.ts';
import './editor/text-editor-element.ts';
import './variable/var-list-element.ts';
import './options-element.ts';
import './condition/cond-edit-element.ts'
import './menu-element.ts';


@customElement('main-element')
export class MainElement extends LitElement {

    @provide({ context: programIndexExport})
    @property({ type: String })
    programIndex: number = -1;

    @property({attribute: false})
    currentLang: LangCode = 'en';

    @property({ type: Object })
    get newTranslations(): typeof translations | undefined {
      return translations;
    }
    set newTranslations(value: typeof translations) {
      if (value) {
        updateTranslations(value);
      }
    }

    @property({ type: String})
    get importProgram(): string {
      return vpToText(this.program);
    }
    set importProgram(value: string) {
      if (value) {
        this._saveText(value);
      }
    }

    @provide({ context: detailGeneralExport})
    @property({attribute: false})
    detailGeneral: boolean=false;

    @state()
    private view: View=window.matchMedia('(max-width: 768px)').matches ? 'Graphical' : 'Both';

    @property()
    programStartIndex: number=-1;

    @property()
    condOpen: boolean=false;

    @provide({ context: condListExport })
    @property({attribute: false})
  conditions: VarObject[] = [];

  @property()
  program: ProgramBlock[]=[];

  @provide({ context: varListExport })
  @property({attribute: false})
    varList: VarObject[] = [];
  
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('beforeunload', this._handleUnload);
  }
  
  disconnectedCallback() {
    window.removeEventListener('beforeunload', this._handleUnload);
    super.disconnectedCallback();
  }
  
  private _handleUnload(event: BeforeUnloadEvent) {
    event.preventDefault();
  }

  static styles = css`
    :host {
      width: 1200px;
      margin: 0 auto;
      padding: 0px;
      text-align: center;
      display: flex;
      flex-direction: column;
      background: white;
      height: 100vh;
      overflow: hidden;
    }

    @media (max-width: 768px) {
      :host {
        width: 100%;
        margin: 0;

      }
    }

    .container {
      display: flex;
      flex-direction: column;
      max-height: 100vh;
    }

    .menu{
      position: sticky;
      top: 0;
      flex: 0 0 auto;
    }

    .body {
      flex: 0 0 75vh;
      position: relative;
      z-index: 100;
      overflow-y: auto;
    }

    .body.text{
      flex: 0 0 100vh;;
    }

    .editor{
      flex: 1;
      
    }

    .editor-container {
      flex: 1 1 auto;
      overflow-y: auto;
      display: flex; 
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    .options {
      flex: 0 0 25vh;
      overflow-y: auto;
      width: 100%;
      border-top: 2px solid #ccc;
      z-index: 10;
      background: rgb(168, 168, 168);
    }

 
  `

  render() {
    let editors: TemplateResult=html``;
    if(this.view==='Both'){
      editors=html`
        <vp-editor-element class="editor" 
          .currentLang=${this.currentLang}
          .program=${this.program} 
          @change-block=${(e: CustomEvent) => this._changeBlock(e.detail.value)}
          @delete-block=${(e: CustomEvent) => this._deleteBlock(e.detail.value)}
          @replace-block=${(e: CustomEvent) => this._replaceBlock(e.detail.value)}
          
          @detail-index=${(e: CustomEvent) => {this._detailBlock(e.detail.value);this._changeDetail()}}
          @block-saved=${(e: CustomEvent) => this._updateProgram(e.detail.value)}></vp-editor-element>
        <text-editor-element class="editor" 
          .value=${vpToText(this.program)} @value-changed=${(e: CustomEvent) => {this._updateProgram(e.detail.value)}}></text-editor-element>`
    }
    else if(this.view==='Graphical'){
      editors=html`
        <vp-editor-element class="editor"
          .currentLang=${this.currentLang} 
          .program=${this.program} 
          @change-block=${(e: CustomEvent) => this._changeBlock(e.detail.value)}
          @delete-block=${(e: CustomEvent) => this._deleteBlock(e.detail.value)}
          @replace-block=${(e: CustomEvent) => this._replaceBlock(e.detail.value)}
          
          @detail-index=${(e: CustomEvent) => {this._detailBlock(e.detail.value);this._changeDetail()}}
          @block-saved=${(e: CustomEvent) => this._updateProgram(e.detail.value)}></vp-editor-element>`
    }else{
      editors=html`
        <text-editor-element class="editor" .value=${vpToText(this.program)} @value-changed=${(e: CustomEvent) => {this._updateProgram(e.detail.value)}}></text-editor-element>`
    }
    return html`
      <div class="container">
        <div class="body ${this.view==='Text'?"text":''}">
        <menu-element class="menu" 
        .currentLang=${this.currentLang}
          .programText=${vpToText(this.program)} 
          @program-saved=${(e: CustomEvent) => this._saveText(e.detail.value)}
          .varList=${this.varList}
          @list-saved=${(e: CustomEvent) => this._varList(e.detail.value)}
          .view=${this.view}
          @view-saved=${(e: CustomEvent) => this._updateView(e.detail.value)}
          @cond-list-saved=${(e: CustomEvent) => this._condList(e.detail.value)}
          @language-changed=${()=>this._updateLang()}></menu-element>
        <div class="editor-container">
          ${editors}
        </div>
        </div>
          ${this.view==='Text'? '':html`
          <options-element class="options" style="z-index: ${this.condOpen ? 100 : 10};"
            .conditions=${this.conditions} .variables=${this.varList} .program=${this.program} .programStartIndex=${this.programStartIndex} .currentLang=${this.currentLang}
            @block-saved=${(e: CustomEvent) => this._updateProgram(e.detail.value)}
            @index-changed=${(e: CustomEvent) => this._updateIndex(e.detail.value)}
            @cond-open=${(e: CustomEvent) => this._condOpen(e.detail.value)}></options-element>
      </div>

          `}
    `
  }

private _updateLang(){
  this.currentLang=getLang();
}

private _varList(newVar: VarObject[]) {
  this.varList = [ ...newVar] ;
}

private _updateView(newView: View) {
  this.view = newView ;
}

private _condOpen(condOpen: boolean) {
  this.condOpen = condOpen ;
}

private _updateProgram(updatedProgram: ProgramBlock[]) {
  this.program = [ ...updatedProgram ];
}

private _detailBlock(indexes: number[]){
  this.programStartIndex=indexes[1];
  this.programIndex=indexes[0];
  if(indexes[0]===this.program.length){
    this.program=[...this.program, {block: {name: "End of block", simple: true, id: "end", argTypes: [], type: 'end'}, arguments: [], hide: false}]
  }
}

private _changeDetail(){
  this.detailGeneral=!this.detailGeneral;
  if(!this.detailGeneral){
    this.programIndex=-1;
    this.programStartIndex=-1;
  }
}

private _saveText(newProgram: string) {
  const result = TextSyntax(newProgram);
  if(result.program){
    if('header' in result.program){
      this.varList=UpdateVarList(result.program.header);
    }
    if('block' in result.program){
      this.program = TextToVp(result.program.block);
    }
  }else{
    window.alert(transl('invalidImport'));
  }
}

private _condList(newCond: VarObject[]){
  this.conditions=[... newCond]
}


private _changeBlock(block: ProgramBlock){
  this.program = this.program.map(b => 
    b === block ? { ...block } : b
  );
}

private _updateIndex(newIndex: number){
  this.programIndex=newIndex;
  if(this.programIndex===-1){
    this.detailGeneral=false;
    this.programStartIndex=-1;
  }
}

private _replaceBlock(block: ProgramBlock){
  if(this.program.indexOf(block)<this.program.length-1){
    this.programIndex=this.program.indexOf(block);
  }
}

private _deleteBlock(block: ProgramBlock){
  const index = this.program.indexOf(block);
  let deepCounter=1;

  if (index !== -1) {
    if(block.block.simple){
      this.program=this.program.filter(item=>item!=block);
    }else{
      let endIndex = index + 1;
      while (endIndex < this.program.length && (deepCounter>0 || this.program[endIndex].block.id==='elseif' || this.program[endIndex].block.id==='else')) {
        if(!this.program[endIndex].block.simple)deepCounter++;
        if(this.program[endIndex].block.id==='end')deepCounter--;
        endIndex++;
      }

      this.program = [...this.program.slice(0, index), ...this.program.slice(endIndex)];
    }
  }
}

}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MainElement
  }
}
