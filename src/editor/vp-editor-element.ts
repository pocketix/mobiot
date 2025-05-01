import { LitElement, TemplateResult, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ProgramBlock} from '../general/interfaces.ts'
import { consume} from '@lit/context';
import { programIndexExport, detailGeneralExport} from '../general/context';
import { LangCode, transl } from '../general/language.ts';
import './block-element.ts';

const BREAKPOINT = html`<!-- BREAKPOINT -->`;

let stackComplexName: ProgramBlock[] = [];
let stackProgramBody: TemplateResult[] = [];

@customElement('vp-editor-element')
export class VPEditorElement extends LitElement {

  @property()
  program: ProgramBlock[] = [];

  @property({ attribute: false })
  currentLang: LangCode = 'en';

  @consume({ context: programIndexExport, subscribe: true })
  @property({ attribute: false })
  programIndex: number=-1;

  @consume({ context: detailGeneralExport, subscribe: true})
  @property({attribute: false})
  detailGeneral: boolean=false;

  @property()
  zoneAvailable: boolean=false;

  private elseZone: boolean=false;
  private elseIfZone: boolean=false;
  private caseZone: boolean=false;


  private _startX = 0;
  private _startY = 0;
  private _offsetX = 0;
  private _offsetY = 0;

  private _draggedElement: HTMLElement | null = null;
  private dropZone: HTMLElement[] = [];

  @state()
  private dragItem: ProgramBlock | null=null;

  @state()
  private dragEndIndex: number | null=null;

  static styles = css`
  .block {
    display: block;
    border: 2px dashed #333;
    border-radius: 8px;
    background-color: #e0e0e0;
    margin: 4px ;
  }
  .header {
    padding: 6px 2px;
    color: white;
    font-weight: bold;
    border-radius: 4px 4px 0 0;
    background: linear-gradient(to bottom, gray, #e0e0e0);
  }

  .content {
    min-height: 80px;
    padding: 4px;
    border-radius: 0 0 4px 4px;
  }
    
  .drop-zone {
    height: 40px;
    border: 2px solid #333;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e0e0e0;
    margin: 4px ;
    color: black;
  }

  .drop-zone.over {
    background: gray;
    color: white;
  }
  `

  render() {
    if(this.program.length===0){
      return html`
        <div class="block">
        <div class="header">${transl('insertFirstBlock')}</div>
        <div class="content" />
        </div>`
    }

    stackProgramBody.push(html`${(this.zoneAvailable && this._zoneFilter()) ? this._dropZone(0):''}`);
    
    this.program.forEach((item)=>{
      if(this.program.indexOf(item)===this.programIndex && item.arguments.length===item.block.argTypes.length){
        stackProgramBody.push(html`<div class="block"><div class="header">${transl('insertBlock')}</div></div>`);
      }

      if(item.block.id=="end"){
        stackProgramBody.push(this._createBlockElement(this.program.indexOf(item)))
      }
      else if(item.block.simple==true){
        stackProgramBody.push(html`<block-element .block=${item} .currentLang=${this.currentLang}
          .startIndex=${this.program.indexOf(item)===0} .endIndex=${this.program.indexOf(item)===this.program.length-1}
          @move-block=${(e: CustomEvent)=>{e.stopPropagation();this._moveBlock(e.detail.value, this.program.indexOf(item), this.program.indexOf(item))}}
          @show-zone=${(e: CustomEvent)=>{e.stopPropagation(); this.zoneAvailable=!this.zoneAvailable; this.dragItem===null ? this.dragItem=item : this.dragItem=null;}}
          @dragstart=${(e: DragEvent) => { e.stopPropagation();this._handleDragStart(e, this.program.indexOf(item)); }} 
          @touch-start=${(e: CustomEvent) => {e.stopPropagation();this.dragItem=item;this._handleTouchStart(e);}}
          @touchmove=${(e: TouchEvent) => { e.stopPropagation(); this._handleTouchMove(e); }} 
          @touchend=${(e: TouchEvent) => { e.stopPropagation(); this._handleTouchEnd(e, this.program.indexOf(item), this.program.indexOf(item)); }}>
        </block-element>
        ${(this.zoneAvailable && this._zoneFilter(item)) ? this._dropZone(this.program.indexOf(item)+1):''}`);
      }
      else{
        stackComplexName.push(item);
        stackProgramBody.push(BREAKPOINT);
      }
    });

    let last:ProgramBlock=this.program[this.program.length-1];
    if(last.arguments.length===last.block.argTypes.length && this.programIndex===-1 && !this.zoneAvailable){
      stackProgramBody.push(html`<div class="block"><div class="header">${transl('insertBlock')}</div></div>`);
    }

    while(stackComplexName.length>=1){
      stackProgramBody.push(this._createBlockElement());
    }

    let programBody: TemplateResult=html``
    while(stackProgramBody.length>=1){
      programBody=html`${stackProgramBody.pop()}${programBody}`
    }
    return programBody;
  }

  private _dropZone(index: number) {
    return html`<div class="drop-zone"
      data-index="${index}"
      @dragover=${this._handleDragOver}
      @dragleave=${this._handleDragLeave}
      @drop=${this._handleDrop}
  >${transl('insertHere')}</div>`;
  }

  private _endIndex(index: number, ifBlock: boolean=false): boolean{
    if(ifBlock) index=this._ifElseBlock(index);
    if(index>this.program.length-1)return true;
    return false;
  }

  private _createBlockElement( endIndex: number=this.program.length): TemplateResult {
    let programVP: TemplateResult = html``;
    let program = stackProgramBody.pop();
  
    while (program !== BREAKPOINT && stackProgramBody.length >= 1) {
        programVP = html`${program}${programVP}`;
        program = stackProgramBody.pop();
    }

    let item=stackComplexName.pop();
    if(item){
      return html`<block-element .block=${item} .currentLang=${this.currentLang}
        .startIndex=${this.program.indexOf(item)===0}.endIndex=${this._endIndex(endIndex, item.block.id==='if')}
        @change-detail=${() => this._changeDetail(endIndex, item)}
        @move-block=${(e: CustomEvent)=>{e.stopPropagation();this._moveBlock(e.detail.value, this.program.indexOf(item), endIndex)}}
        @show-zone=${(e: CustomEvent)=>{e.stopPropagation(); this.zoneAvailable=!this.zoneAvailable; this.dragItem===null ? this.dragItem=item : this.dragItem=null}}
        @dragstart=${(e: DragEvent) => { e.stopPropagation();this._setZone(item);this._handleDragStart(e, endIndex); }} 
        @touch-start=${(e: CustomEvent) => {e.stopPropagation();this.dragItem=item;this._setZone(item);this._handleTouchStart(e);}} 
        @touchmove=${(e: TouchEvent) => { e.stopPropagation();e.preventDefault(); this._handleTouchMove(e); }} 
        @touchend=${(e: TouchEvent) => { e.stopPropagation(); this._handleTouchEnd(e, this.program.indexOf(item), endIndex); }}>
        ${item.hide ? '' : html`${item===this.dragItem? '':html`
        ${(this.zoneAvailable && this._zoneFilter(item, -1, true))? this._dropZone(this.program.indexOf(item)+1) : ''}`}
        ${programVP}`}
      </block-element>
      ${(this.zoneAvailable && this._zoneFilter(item, endIndex) && endIndex!==this.program.length) ? this._dropZone(endIndex+1) :''}`;
    }else{
      return programVP
    }
  }

  private _changeDetail(index: number, item: ProgramBlock){
    if(!this.detailGeneral){
      this.dispatchEvent(new CustomEvent('detail-index', {
        detail: { value: [index, this.program.indexOf(item)] },
        bubbles: true,
        composed: true
      }));
    }
  }

  private _handleDragStart(event: DragEvent, end: number) {
    event.dataTransfer?.setData('text/plain', 'dragged-item');
    event.dataTransfer!.effectAllowed = 'move';
    this.dragEndIndex=end;
  }

  private _handleTouchStart(event: CustomEvent) {
    this.zoneAvailable=true;
    const touch = event.detail.value.touches[0];
    this._draggedElement = event.currentTarget as HTMLElement;

    this._startX = touch.clientX;
    this._startY = touch.clientY;
    this._offsetX = this._draggedElement.offsetLeft;
    this._offsetY = this._draggedElement.offsetTop;

    this._draggedElement.style.position = 'absolute';
  }

  private _handleTouchMove(event: TouchEvent) {
    if (!this._draggedElement) return;

    const touch = event.touches[0];
    const newX = this._offsetX + (touch.clientX - this._startX);
    const newY = this._offsetY + (touch.clientY - this._startY);

    this._draggedElement.style.left = `${newX}px`;
    this._draggedElement.style.top = `${newY}px`;

    this.dropZone =  Array.from(this.renderRoot.querySelectorAll('.drop-zone'));
    this.dropZone.forEach((zone)=>{
      const touchOverDropZone = zone!.getBoundingClientRect();
      const isOverDropZone =
      touch.clientX > touchOverDropZone.left &&
      touch.clientX < touchOverDropZone.right &&
      touch.clientY > touchOverDropZone.top &&
      touch.clientY < touchOverDropZone.bottom;

      if (isOverDropZone) {
        zone!.classList.add('over');
      } else {
        zone!.classList.remove('over');
      }
    })
  }

  private _handleTouchEnd(event: TouchEvent, fromIndexStart: number, fromIndexEnd: number) {
    if (!this._draggedElement) return;
    const touch = event.changedTouches[0];

    this.dropZone.forEach((zone)=>{
      zone.classList.remove('over');
      const dropRect = zone.getBoundingClientRect();
      const isDroppedInZone =
        touch.clientX > dropRect.left &&
        touch.clientX < dropRect.right &&
        touch.clientY > dropRect.top &&
        touch.clientY < dropRect.bottom;

      if (isDroppedInZone) {
        const toIndex = Number(zone?.getAttribute('data-index'));
        if(toIndex!==null){
          if(this.program[fromIndexStart].block.id==='if'){
            fromIndexEnd=this._ifElseBlock(fromIndexEnd);
            const confirmMove = window.confirm(transl('attentionIf'));
            if (!confirmMove) return;
          }
          this._changeProgram(fromIndexStart, fromIndexEnd, toIndex);
        }
      }
    })
    this._saveProgram();
  }

  private _handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
    (event.currentTarget as HTMLElement).classList.add('over');
  }

  private _handleDragLeave(event: DragEvent) {
    (event.currentTarget as HTMLElement).classList.remove('over');
  }

  private _handleDrop(event: DragEvent) {
    event.preventDefault();
    (event.currentTarget as HTMLElement).classList.remove('over');

    const toIndex = Number((event.currentTarget as HTMLElement)?.getAttribute('data-index'));
    if(toIndex!==null && this.dragItem!==null && this.dragEndIndex!==null){
      if(this.program[this.program.indexOf(this.dragItem)].block.id==='if'){
        this.dragEndIndex=this._ifElseBlock(this.dragEndIndex);
        const confirmMove = window.confirm(transl('attentionIf'));
        if (!confirmMove) return;
      }
      this._changeProgram(this.program.indexOf(this.dragItem), this.dragEndIndex, toIndex);
    }
    this._saveProgram();
  }

  private _saveProgram(){
    let newProgram=this.program;
    this.program=[];
    this._draggedElement = null;
    this.dragItem=null;
    this.zoneAvailable=false;
    this.elseZone=this.elseIfZone=this.caseZone=false;

    this.dispatchEvent(new CustomEvent('block-saved', {
      detail: { value: newProgram},
      bubbles: true,
      composed: true
  })); 
  }

  private _changeProgram(fromIndexStart: number, fromIndexEnd: number, toIndex: number) {
    if (fromIndexStart < 0 || fromIndexEnd > this.program.length || toIndex < 0 || toIndex > this.program.length || fromIndexStart === toIndex || 
      (fromIndexEnd>=toIndex && fromIndexStart<=toIndex)){
      window.alert(transl('invalidAction'));
      return;
    }

    if(fromIndexEnd===this.program.length){
      this.program.push({ block: {name: "End of block", simple: true, id: "end", argTypes: [], type: 'end'}, arguments: [], hide: false });
    }

    const items = this.program.splice(fromIndexStart, fromIndexEnd - fromIndexStart+1);
    if (toIndex > fromIndexStart) {
      toIndex -= items.length;
    }
    this.program.splice(toIndex, 0, ...items); 
  }

  private _zoneFilter(block: ProgramBlock|null=null, endIndex: number=-1, inBlock: boolean=false): boolean{
    if(block===this.dragItem)return false;

    if(this.elseIfZone || this.elseZone){
      if(block===null ||endIndex===-1)return false;
      if(this.elseZone){
        if(endIndex===this.program.length-1){
          endIndex-=1;
        }
        if((block.block.id==='if'|| block.block.id==='elseif') && this.program[endIndex+1].block.id!=='elseif')return true;
        else return false;
      }
      else if(this.elseIfZone){
        if(block.block.id==='if'|| block.block.id==='elseif')return true;
        else return false;
      }
    }else{
      if((block?.block.id==='if' || block?.block.id==='elseif') && !inBlock && 
      ((endIndex<this.program.length-1) && (this.program[endIndex+1].block.id!=='elseif' || this.program[endIndex+1].block.id!=='else')))return false;
    }
    if(this.caseZone){
      if(block===null)return false;
      if((block.block.id==='case' && !inBlock)|| (block.block.id==='switch' && inBlock))return true;
        else return false;
    }
    return true;
  }

  private _moveBlock(up: boolean, fromIndexStart: number, fromIndexEnd: number){
    if(this.program[fromIndexStart].block.id==='if')fromIndexEnd=this._ifElseBlock(fromIndexEnd);

    let toIndex=up ? (fromIndexStart-1) : (fromIndexEnd+2);
    this._changeProgram(fromIndexStart, fromIndexEnd, toIndex);
    
    this.dispatchEvent(new CustomEvent('block-saved', {
      detail: { value: this.program},
      bubbles: true,
      composed: true
    })); 
  }

  private _ifElseBlock(oldEnd: number): number{
    let deepCounter=0;
    let actualBlock;

    if(oldEnd<this.program.length-1){
      for (let i=oldEnd+1;i<this.program.length;i++){
        actualBlock=this.program[i];

        if(deepCounter===0 && actualBlock.block.id!=='else' && actualBlock.block.id!=='elseif') return i-1;
        if(!actualBlock.block.simple)deepCounter+=1;
        if(actualBlock.block.id==='end')deepCounter-=1;
      }

      if(this.program[this.program.length-1].block.id==='end') return this.program.length-1;
      else return this.program.length;

    }else return oldEnd;
  }

  private _setZone(block: ProgramBlock){
    if(block.block.id==='else')this.elseZone=true;
    if(block.block.id==='elseif')this.elseIfZone=true;
    if(block.block.id==='case')this.caseZone=true;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vp-editor-element': VPEditorElement
  }
}