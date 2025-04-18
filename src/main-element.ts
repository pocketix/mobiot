import { LitElement, css, html, TemplateResult} from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { VarObject, ProgramBlock } from './general/interfaces.ts'
import { View } from './general/types.ts';
import { varListExport, condListExport, programIndexExport, detailGeneralExport } from './general/context.ts';
import { provide } from '@lit/context';
import { vpToText } from './convert/vp-to-text.ts';
import { TextToVp } from './convert/text-to-vp.ts';
import { UpdateVarList } from './convert/update-var-list.ts';
import { TextSyntax } from './convert/text-syntax.ts';
import './editor/vp-editor-element.ts';
import './editor/text-editor-element.ts';
import './variable/var-list-element.ts';
import './options-element.ts';
import './condition/cond-edit-element.ts'
import './menu-element.ts'


@customElement('main-element')
export class MainElement extends LitElement {

    @provide({ context: programIndexExport})
    @property({attribute: false})
    programIndex: number = -1;

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
  conditions: VarObject[] = [
    {name: 'cond_1', value: {type: '=', value:'', args: [{type: '+', value: '', args: [{type: 'variable', value: 'x', args: []}, {type: 'number', value: '5', args: []}]}
      ,{type: 'number', value: '8', args: []}]}},//x+5==8
    {name: 'cond_2', value: {type: '≠', value:'', args: [{type: '*', value: '', args: [{type: 'variable', value: 'a', args: []}, {type: 'variable', value: 'b', args: []}]}
      ,{type: 'number', value: '8', args: []}]}},//a*b!=8
    {name: 'cond_3', value: {type: 'AND', value: '', args: [{type: 'variable', value: 'x', args: []}, {type: 'variable', value: 'y', args: []}]}},//x AND y
  ];

  @property()
  program: ProgramBlock[]=[
    {block: {name: "If", simple: false, id: "if", type: 'branch', argTypes: ['cond']}, 
      arguments: [{type: '=', value: '', args: [{type: 'variable', value: 'x', args: []}, {type: 'number', value: '5', args: []}]}], hide: false},
    {block: {name: "Send notification", simple: true, id: 'alert', type: 'alert', argTypes: ['text']}, 
      arguments: [{type: 'variable', value: 'name', args: []}], hide: false},
    {block: {name: "End of block", simple: true, id: "end", type: 'end', argTypes: []}, arguments: [], hide: false},
    // {block: {name: "Otherwise", simple: false, id: 'else', type: 'branch', argTypes: []}, arguments: [], hide: false}
  ];

  @provide({ context: varListExport })
  @property({attribute: false})
    varList: VarObject[] = [
            { name: 'name', value: {type: 'text',value: 'John', args: []}},
            { name: 'age', value: {type: 'number',value: '40', args: []}},
            { name: 'isAdmin', value: {type: 'bool',value: 'true', args: []}},
            { name: 'fee', value: {type: 'expr',value: '', args: [{type: '=', value:'', args: [{type: '+', value: '', args: [{type: 'variable', value: 'a', args: []},
             {type: 'number', value: 'b', args: []}]},{type: 'number', value: '6', args: []}]}]}}
            ];
  
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
    event.returnValue = '';
  }

  render() {//TODO clean code
    let editors: TemplateResult=html``;
    if(this.view==='Both'){
      editors=html`
          <vp-editor-element class="editor" 
            .program=${this.program} 
            @change-block=${(e: CustomEvent) => this._changeBlock(e.detail.value)}
            @delete-block=${(e: CustomEvent) => this._deleteBlock(e.detail.value)}
            @replace-block=${(e: CustomEvent) => this._replaceBlock(e.detail.value)}
            @change-detail=${()=>this._changeDetail()}
            @detail-index=${(e: CustomEvent) => this._detailBlock(e.detail.value)}
            @block-saved=${(e: CustomEvent) => this._updateProgram(e.detail.value)}></vp-editor-element>
          <text-editor-element class="editor" 
            .value=${vpToText(this.program)} @value-changed=${(e: CustomEvent) => {this._updateProgram(e.detail.value)}}></text-editor-element>`
    }
    else if(this.view==='Graphical'){
      editors=html`
        <vp-editor-element class="editor" 
          .program=${this.program} 
          @change-block=${(e: CustomEvent) => this._changeBlock(e.detail.value)}
          @delete-block=${(e: CustomEvent) => this._deleteBlock(e.detail.value)}
          @replace-block=${(e: CustomEvent) => this._replaceBlock(e.detail.value)}
          @change-detail=${()=>this._changeDetail()}
          @detail-index=${(e: CustomEvent) => this._detailBlock(e.detail.value)}
          @block-saved=${(e: CustomEvent) => this._updateProgram(e.detail.value)}></vp-editor-element>`
    }else{
      editors=html`
        <text-editor-element class="editor" .value=${vpToText(this.program)} @value-changed=${(e: CustomEvent) => {this._updateProgram(e.detail.value)}}></text-editor-element>`
    }
    return html`
      <div class="container">
        <div class="body">
        <menu-element class="menu"
          .programText=${vpToText(this.program)} 
          @program-saved=${(e: CustomEvent) => this._saveText(e.detail.value)}
          .varList=${this.varList}
          @list-saved=${(e: CustomEvent) => this._varList(e.detail.value)}
          .view=${this.view}
          @view-saved=${(e: CustomEvent) => this._updateView(e.detail.value)}
          @cond-list-saved=${(e: CustomEvent) => this._condList(e.detail.value)}></menu-element>
        <div class="editor-container">
          ${editors}
        </div>
        </div>
        <options-element class="options" style="z-index: ${this.condOpen ? 100 : 10};"
          .conditions=${this.conditions} .variables=${this.varList} .program=${this.program} .programStartIndex=${this.programStartIndex}
          @block-saved=${(e: CustomEvent) => this._updateProgram(e.detail.value)}
          @index-changed=${(e: CustomEvent) => this._updateIndex(e.detail.value)}
          @cond-open=${(e: CustomEvent) => this._condOpen(e.detail.value)}></options-element>
      </div>
    `
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
    this.programIndex=-1;//TODO let potencial empty block or cancel escape detail button? 
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
    window.alert("Import program cannot be used. There is some mistake in imported JSON");
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
  }
}

private _replaceBlock(block: ProgramBlock){
  this.programIndex=this.program.indexOf(block);
}

private _deleteBlock(block: ProgramBlock){
  const index = this.program.indexOf(block);
  let deepCounter=1;

  if (index !== -1) {
    if(block.block.simple){
      this.program=this.program.filter(item=>item!=block)
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

  static styles = css`
    :host {
      width: 1280px;
      margin: 0 auto;
      padding: 0.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      background: white;
    }

    @media (max-width: 768px) {
      :host {
        width: 100%;
        margin: 0;
        padding: 0;
      }
    }

    .container {
      display: flex;
      flex-direction: column;
      height: 100vh;
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
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MainElement
  }
}
