import { LitElement, TemplateResult, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ProgramBlock} from '../general/interfaces.ts'
import { consume} from '@lit/context';
import { programIndexExport, detailGeneralExport} from '../general/context';
import './block-element.ts';

const BREAKPOINT = html`<!-- BREAKPOINT -->`;

let stack_complex_name: ProgramBlock[] = [];
let stack_program_body: TemplateResult[]=[];

@customElement('vp-editor-element')
export class VPEditorElement extends LitElement {

  private _createBlockElement( endIndex: number=this.program.length): TemplateResult {
    let programVP: TemplateResult = html``;
    let program = stack_program_body.pop();
  
    while (program !== BREAKPOINT && stack_program_body.length >= 1) {
        programVP = html`${program}${programVP}`;
        program = stack_program_body.pop();
    }
    let item=stack_complex_name.pop();
    if(item){
      if(item.hide){
        return html`<block-element .block=${item} @change-detail=${() => this._changeDetail(endIndex, item)} .detail=${false}
          @move-block=${(e: CustomEvent)=>{e.stopPropagation();this._moveBlock(e.detail.value, this.program.indexOf(item), endIndex)}}
          @dragstart=${(e: DragEvent) => { e.stopPropagation();this._setZone(item);this._handleDragStart(e); }} 
          @touch-start=${(e: CustomEvent) => {e.stopPropagation();this.dragItem=item;this._setZone(item);this._handleTouchStart(e);}} 
          @touchmove=${(e: TouchEvent) => { e.stopPropagation();e.preventDefault(); this._handleTouchMove(e); }} 
          @touchend=${(e: TouchEvent) => { e.stopPropagation(); this._handleTouchEnd(e, this.program.indexOf(item), endIndex); }}></block-element>
        ${(this.zoneAvailable && this._zoneFilter(item, endIndex)) ? html`<div class="drop-zone"
            data-index="${endIndex+1}" 
            @dragover=${this._handleDragOver}
            @dragleave=${this._handleDragLeave}
            @drop=${this._handleDrop}
          >Insert here. </div>`:''}`;
      }else{
          return html`<block-element .block=${item} 
            @change-detail=${() => this._changeDetail(endIndex, item)}
            @move-block=${(e: CustomEvent)=>{e.stopPropagation();this._setZone(item);this._moveBlock(e.detail.value, this.program.indexOf(item), endIndex)}}
            @dragstart=${(e: DragEvent) => { e.stopPropagation();this._setZone(item);this._handleDragStart(e); }} 
            @touch-start=${(e: CustomEvent) => {e.stopPropagation();this.dragItem=item;this._setZone(item);this._handleTouchStart(e);}} 
            @touchmove=${(e: TouchEvent) => { e.stopPropagation();e.preventDefault(); this._handleTouchMove(e); }} 
            @touchend=${(e: TouchEvent) => { e.stopPropagation(); this._handleTouchEnd(e, this.program.indexOf(item), endIndex); }}>
          ${item===this.dragItem? '':html`
          ${(this.zoneAvailable && this._zoneFilter(item, -1, true))? html`<div class="drop-zone" 
            data-index="${this.program.indexOf(item)+1}"
            @dragover=${this._handleDragOver}
            @dragleave=${this._handleDragLeave}
            @drop=${this._handleDrop}
          >Insert here. </div>`:''}`}
          ${programVP}</block-element>
          ${(this.zoneAvailable && this._zoneFilter(item, endIndex) && endIndex!==this.program.length) ? html`<div class="drop-zone"
            data-index="${endIndex+1}" 
            @dragover=${this._handleDragOver}
            @dragleave=${this._handleDragLeave}
            @drop=${this._handleDrop}
          >Insert here. </div>`:''}`;
      }
    }else{
      return programVP
    }
  }

  private _changeDetail(index: number, item: ProgramBlock){//TODO clean code
    if(!this.detailGeneral){
      this.dispatchEvent(new CustomEvent('detail-index', {
        detail: { value: [index, this.program.indexOf(item)] },
        bubbles: true,
        composed: true
      }));
    }
  }

  @property()
  program: ProgramBlock[] = [];

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
  private _dropZone: HTMLElement[] = [];

  @state()
  private dragItem: ProgramBlock | null=null;

  render() {
    if(this.program.length===0){
      return html`
      <div class="block">
        <div class="header">Insert first block of your program. </div>
        <div class="content" />
        </div>`
    }
    stack_program_body.push(html`${(this.zoneAvailable && this._zoneFilter()) ? html`<div class="drop-zone"
      data-index="${0}"
      @dragover=${this._handleDragOver}
      @dragleave=${this._handleDragLeave}
      @drop=${this._handleDrop}
    >Insert here. </div>`:''}`);
    this.program.forEach((item)=>{
      if(this.program.indexOf(item)===this.programIndex && item.arguments.length===item.block.argTypes.length){
        stack_program_body.push(html`<div class="block"><div class="header">Insert next block of your program. </div></div>`);
      }
      if(item.block.id=="end"){
        stack_program_body.push(this._createBlockElement(this.program.indexOf(item)))//TODO clean code
      }
      else if(item.block.simple==true){
        stack_program_body.push(html`<block-element .block=${item} 
          @move-block=${(e: CustomEvent)=>{e.stopPropagation();this._moveBlock(e.detail.value, this.program.indexOf(item), this.program.indexOf(item))}}
          @dragstart=${(e: DragEvent) => { e.stopPropagation(); this._handleDragStart(e); }} 
          @touch-start=${(e: CustomEvent) => {e.stopPropagation();this.dragItem=item;this._handleTouchStart(e);}}
          @touchmove=${(e: TouchEvent) => { e.stopPropagation(); this._handleTouchMove(e); }} 
          @touchend=${(e: TouchEvent) => { e.stopPropagation(); this._handleTouchEnd(e, this.program.indexOf(item), this.program.indexOf(item)); }}>
        </block-element>
        ${(this.zoneAvailable && this._zoneFilter(item)) ? html`<div class="drop-zone"
          data-index="${this.program.indexOf(item)+1}"
          @dragover=${this._handleDragOver}
          @dragleave=${this._handleDragLeave}
          @drop=${this._handleDrop}
          >Insert here. </div>`:''}`);
      }//TODO clean code
      else{
        stack_complex_name.push(item);
        stack_program_body.push(BREAKPOINT);
      }
    });
    let last:ProgramBlock=this.program[this.program.length-1];
    if(last.arguments.length===last.block.argTypes.length && this.programIndex===-1){
      stack_program_body.push(html`<div class="block"><div class="header">Insert next block of your program. </div></div>`);
    }//TODO delete zone for end block
    while(stack_complex_name.length>=1){
      stack_program_body.push(this._createBlockElement())
    };
    let programBody: TemplateResult=html``
    while(stack_program_body.length>=1){
      programBody=html`${stack_program_body.pop()}${programBody}`
    }
    return programBody;
  }

static styles = css`
  .block {
    display: block;
    border: 2px solid #333;
    border-radius: 8px;
    background-color: #e0e0e0;
    margin: 4px ;
  }
  .header {
    padding: 6px 2px;
    color: white;
    font-weight: bold;
    border-radius: 4px 4px 0 0;
    background-color: gray;
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

  private _handleDragStart(event: DragEvent) {//TODO repair drag and drop for desktop
    event.dataTransfer?.setData('text/plain', 'dragged-item');
    event.dataTransfer!.effectAllowed = 'move';
    this.zoneAvailable=true;
  }

  private _handleTouchStart(event: CustomEvent) {
    this.zoneAvailable=true;
    const touch = event.detail.value.touches[0];
    this._draggedElement = event.currentTarget as HTMLElement;
    // this.dragItem=dragItem;

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

    this._dropZone =  Array.from(this.renderRoot.querySelectorAll('.drop-zone'));
    this._dropZone.forEach((zone)=>{
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
    // let dropped = false;

    this._dropZone.forEach((zone)=>{
      zone.classList.remove('over');
      const dropRect = zone.getBoundingClientRect();
      const isDroppedInZone =
        touch.clientX > dropRect.left &&
        touch.clientX < dropRect.right &&
        touch.clientY > dropRect.top &&
        touch.clientY < dropRect.bottom;

    if (isDroppedInZone) {
      // dropped=true;
      const toIndex = Number(zone?.getAttribute('data-index'));
      if(toIndex!==null){
        this._changeProgram(fromIndexStart, fromIndexEnd, toIndex);
      }
    }
    })
    let newProgram=this.program;
    // if(!dropped){
      this.program=[];
    // }
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

  private _moveBlock(up: boolean, fromIndexStart: number, fromIndexEnd: number){
    let toIndex=up ? (fromIndexStart-1) : (fromIndexEnd+2);
    this._changeProgram(fromIndexStart, fromIndexEnd, toIndex);
    this.dispatchEvent(new CustomEvent('block-saved', {
      detail: { value: this.program},
      bubbles: true,
      composed: true
  })); 
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
    this.zoneAvailable=false;
    this.elseZone=this.elseIfZone=this.caseZone=false;//TODO
    // console.log('Item moved!');
  }

  private _changeProgram(fromIndexStart: number, fromIndexEnd: number, toIndex: number) {
    // console.log(fromIndexStart, fromIndexEnd, toIndex);
    if (fromIndexStart < 0 || fromIndexEnd > this.program.length || toIndex < 0 || toIndex > this.program.length) return;
    if (fromIndexStart === toIndex) return;
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
    // console.log(this.dragItem?.block.id, block.block.id)
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
    }
    if(this.caseZone){
      if(block===null)return false;
      if((block.block.id==='case' && !inBlock)|| (block.block.id==='switch' && inBlock))return true;
        else return false;
    }
    return true;
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