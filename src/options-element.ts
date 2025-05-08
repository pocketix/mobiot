import { LitElement, TemplateResult, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { Block, ProgramBlock, VarObject, Argument} from './general/interfaces'
import { BlockType, TypeOption } from './general/types';
import { CondText } from './general/cond-text';
import { consume } from '@lit/context';
import { programIndexExport, detailGeneralExport} from './general/context';
import { blockTypes } from './general/blocks.ts';
import { sensors } from './general/sensors.ts';
import { LangCode, transl } from './general/language.ts';
import './icons/block-icon.ts';

@customElement('options-element')//TODO clean code 3rd phase
export class OptionsElement extends LitElement {

    private blocks = blockTypes;

    @state()
    private categories: BlockType[]= ['all', 'branch', 'cycle', 'dev','others'];

    @state()
    private category: BlockType='all'

    @property()menuParams=false;

    @property() paramType: TypeOption='note'

    @property()
    program: ProgramBlock[] = [];

    @property()
    conditions: VarObject[] = [];

    @property()
    variables: VarObject[] = [];

    @consume({ context: programIndexExport, subscribe: true })
    @property({ attribute: false })
    programIndex: number=-1;

    @consume({ context: detailGeneralExport, subscribe: true })
    @property({ attribute: false })
    detailGeneral: boolean=false;

    @property()
    programStartIndex: number=-1;

    @property({attribute: false})
    currentLang: LangCode = 'en';

    @state()
    private canSave: boolean = false;

    render() {
        let block: ProgramBlock|undefined;
        if (this.programIndex >= 0 && this.programIndex < this.program.length) {
            block = this.program[this.programIndex];
        }else{
            block=this.program[this.program.length-1]
        }
        if(block && block.block.argTypes.length>block.arguments.length){
            this.paramType=block.block.argTypes[block.arguments.length]
        }else{
            this.menuParams=false;
            this.paramType='note';
        }
        
        let listOptions: TemplateResult[]=[];
        if(!this.menuParams){
            let filteredBlocks =this._syntaxFilter();
            if (this.category ==='others'){
                filteredBlocks=filteredBlocks.filter(item => item.type === 'alert' || item.type === 'end' || item.type === 'set_var')
            }else if(this.category!='all'){
                filteredBlocks=filteredBlocks.filter(item => item.type === this.category)
            }
            filteredBlocks.forEach((block)=>{
            listOptions.push(html`<button class=${block.type} @click=${() => this._addToProgram(block)}>
                ${block.type==='dev' ? html`<block-icon type="dev"></block-icon>` : html`<block-icon type=${block.id}></block-icon>`} ${transl(block.name)}${this.addText(block.id)}</button>`);
        });
        }else{
            listOptions=this._filterParams();
        }

        let cathegoriesMenu: TemplateResult=html``;
        if(!this.menuParams){
            cathegoriesMenu=html`
            <div class="menu">
                ${this.categories.map(item=>html`
                <button class=${item === this.category ? `${item} selected` : `menu-item ${item}_text`} @click=${() => this._selectCategory(item)}>${transl(item)}</button>
                `)}
            </div>`
        }
        return html`
            ${cathegoriesMenu}
            <div class="content">
                ${listOptions}
            </div>`
                
    }

    private addText(id: string):string{
        if(['while', 'if', 'elseif'].includes(id)){
            return "..." + transl('do') + "...";
        }else if(id==='else'){
            return ' ' + transl('do') +'...'
        }else if(id==='switch'){
            return '...'
        }
        return'';
    }

    private _filterParams(): TemplateResult[]{
        let list: TemplateResult[]=[];
        if(this.paramType==='cond'){
            this.conditions.forEach((condition)=>{
                list.push(html`<button @click=${() => this._addParamsVar(condition)}>${condition.name}: ${CondText(condition.value)}</button>`);
            });
            list.push(html`<cond-edit-element " class="button"
                .newMode=${false}
                .title=${transl('clickCreate')}
                @click=${(e: Event) => e.stopPropagation()}
                @cond-update=${(e: CustomEvent) => this._addParamsVar({name: '', value: e.detail.value})}>
              </cond-edit-element>`)
        }else if(this.paramType==='variable'){
            this.variables.forEach((item)=>{
                list.push(html`<button @click=${() => this._addParamsVar(item)}>${item.name}: ${item.value.type==='expr' ? CondText(item.value.args[0]) : transl(item.value.value)}</button>`);
            });//TODO clean code
        }else{
            let varList: VarObject[]=[];
            if(this.paramType!='note'){
                this.variables.forEach(item => {
                    if(item.value.type===this.paramType)varList.push(item);
                    else if(item.value.type==='expr'){
                        if(['+','-','*','/'].includes(item.value.args[0].type)){
                            if(this.paramType==='number')varList.push(item);
                        }else{
                            if(this.paramType==='bool')varList.push(item);
                        }
                    }
                })
            }else{
                varList=this.variables;
            }
            varList.forEach((item)=>{
                list.push(html`<button @click=${() => this._addParamsVar(item)}>${item.name}: 
                    ${item.value.type==='expr' ? CondText(item.value.args[0]) : transl(item.value.value)}</button>`);
            });
            let sensorsList: VarObject[]=sensors.filter(item => item.value.type===this.paramType);
            sensorsList.forEach((item)=>{
                list.push(html`<button @click=${() => this._addParamsVar(item)}>${item.name}</button>`);
            });
            if(this.paramType==='bool'){
                list.push(html`<li><button @click=${() => this._addParamsVal('true')}>${transl('true')}</button></li>`);
                list.push(html`<li><button @click=${() => this._addParamsVal('false')}>${transl('false')}</button></li>`);
            }else if(this.paramType==='number'){
                let paramInput: string='';
                list.push(html`
                    <li>
                      <input type="number" inputmode="decimal" step="any" .value=${paramInput} 
                        @input=${(e: Event) => {paramInput = (e.target as HTMLInputElement).value;this._canSave(paramInput)}} placeholder=${transl('enterNumber')}>
                      <button class="save" ?disabled=${!this.canSave} @click=${() => this._addParamsVal(paramInput)}>${transl('useValue')}</button>
                    </li>
                  `);
            }else{
                let paramInput: string='';
                list.push(html`
                    <li>
                      <input type="text" .value=${paramInput} 
                        @input=${(e: Event) => {paramInput = (e.target as HTMLInputElement).value;this._canSave(paramInput)}} placeholder=${transl('addVal')}>
                      <button class="save" ?disabled=${!this.canSave} @click=${() => this._addParamsVal(paramInput)}>${transl('useValue')}</button>
                    </li>
                  `);
                }
        }
        return list
    }

    private _canSave(value: string) {
        if(value)this.canSave=true;
        else this.canSave=false;
    }

    private _syntaxFilter(): Block[]{
        let filteredBlocks =this.blocks;
        let deepCounter=0;
        let filterEnd=true;
        let filterElse=true;
        if(this.variables.length===0){
            filteredBlocks=filteredBlocks.filter(item => item.id != 'setvar')
        }
        let endIndex: number=this.programIndex===-1 ? this.program.length-1 : this.programIndex-1;
        for (let i = endIndex; i >= 0; i--){
            if(this.program[i].block.id==='end'){
                deepCounter++;
            }
            if(['branch', 'cycle'].includes(this.program[i].block.type)){
                deepCounter--;
            }
            if(this.program[endIndex].block.id==='switch'){
                return filteredBlocks.filter(item => item.id === 'case');
            }
            if (deepCounter===0){
                if(['if','elseif'].includes(this.program[i].block.id) && this.program[endIndex].block.id==='end'){
                    filterElse=false;
                    // break;
                }
                if(this.program[i].block.id==='case'){
                    return filteredBlocks.filter(item => item.id === 'case'||item.id==='end');
                }
                if(this.program[i].block.id==='else')filteredBlocks=filteredBlocks.filter(item => item.id != 'else' && item.id != 'elseif');
            }else if(deepCounter===-1){
                if(this.program[endIndex].block.simple){
                    filterEnd=false;
                }
            }
            if(!filterElse && !filterEnd)break
        };
        if(filterElse)filteredBlocks=filteredBlocks.filter(item => item.id != 'else' && item.id != 'elseif');
        if(filterEnd)filteredBlocks=filteredBlocks.filter(item => item.id != 'end');
        filteredBlocks=filteredBlocks.filter(item => item.id != 'case');
        return filteredBlocks;
    }

    private _addToProgram(input: Block) {
        if(input.argTypes.length>0){
            this.menuParams=true;
            this.paramType= input.argTypes[0]
        }
        if(this.programIndex===-1){
            this.program=[...this.program, {block: input, arguments: [], hide: false}]
        }
        else{
            if (this.programIndex >= 0 && this.programIndex < this.program.length) {
                if(input.id==='end'){
                    this.programIndex=this._endCheck();
                    this.dispatchEvent(new CustomEvent('index-changed', {
                        detail: { value: this.programIndex },
                        bubbles: true,
                        composed: true
                    }));
                }else{
                    if(!input.simple){
                        if(this.programStartIndex===-1){
                            this.programStartIndex=this.programIndex;
                        }
                        this.program = [
                            ...this.program.slice(0, this.programIndex),
                            { block: input, arguments: [], hide: false },
                            { block: {name: "End of block", simple: true, id: "end", argTypes: [], type: 'end'}, arguments: [], hide: false },
                            ...this.program.slice(this.programIndex)
                        ];
                        
                    }else{
                        this.program = [
                            ...this.program.slice(0, this.programIndex),
                            { block: input, arguments: [], hide: false },
                            ...this.program.slice(this.programIndex)
                        ];
                        if(input.argTypes.length===0){
                            if(this.detailGeneral){
                                this.programIndex+=1;
                            }else{
                                this.programIndex=-1;
                            }
                            this.dispatchEvent(new CustomEvent('index-changed', {
                                detail: { value: this.programIndex },
                                bubbles: true,
                                composed: true
                            }));
                        }
                    }
                }
            }
        }
        this._saveChanges();
    }

    private _endCheck(): number{
        let deep: number=0;
        for(let i=this.programStartIndex; i<this.programIndex+1;i++){
            if(!this.program[i].block.simple)deep++;
            if(this.program[i].block.id==='end')deep--;
        }
        if(deep===0){
            this.programStartIndex=-1;
            return -1;
        }else{
            return this.programIndex+=1;
        }
    }

    private _addParamsVar(param: VarObject) {
        let block: ProgramBlock|undefined;
        if (this.programIndex >= 0 && this.programIndex < this.program.length) {
            block = this.program.splice(this.programIndex, 1)[0]; 
            if(!block.block.simple){
                this.program.splice(this.programIndex+1, 1)[0];
            }
        } else {
            block=this.program.pop();
        }
        if(block){
            let arg: Argument=param.value
            if(['number', 'text', 'bool', 'expr'].includes(param.value.type)){
                arg = {type: 'variable', value:param.name, args: []};
            }
            this._addParams(block, arg)
        }
    }

    private _addParamsVal(value: string) {//TODO clean code
        if(value){
            let block: ProgramBlock|undefined;
            if (this.programIndex >= 0 && this.programIndex < this.program.length) {
                block = this.program.splice(this.programIndex, 1)[0]; 
                if(!block.block.simple){
                    this.program.splice(this.programIndex+1, 1)[0];
                }
            } else {
                block=this.program.pop();
            }
            if(block){
                let arg: Argument = {type: this.paramType, value: value, args: []};
                this._addParams(block, arg)
            }
        }
    }

    private _addParams(block: ProgramBlock, arg: Argument){//TODO clen code
        const updatedBlock = { ...block, arguments: [...block.arguments, arg]};
        
        if(this.programIndex===-1){
            this.program=[...this.program, updatedBlock];
        }else{
            if (this.programIndex >= 0 && this.programIndex < this.program.length) {
                if(updatedBlock.block.simple){
                    this.program = [
                        ...this.program.slice(0, this.programIndex),
                        updatedBlock,
                        ...this.program.slice(this.programIndex)
                    ];
                }else{
                    this.program = [
                        ...this.program.slice(0, this.programIndex),
                        updatedBlock,{ block: {name: "End of block", simple: true, id: "end", argTypes: [], type: 'end'}, arguments: [], hide: false },
                        ...this.program.slice(this.programIndex)
                    ];
                }
            }
        }
        
        if(block.block.argTypes.length>updatedBlock.arguments.length){
            this.paramType=block.block.argTypes[updatedBlock.arguments.length]
        }else{
            this.menuParams=false;
            this.paramType='note';
            if(updatedBlock.block.simple && this.programStartIndex===-1 && !this.detailGeneral){
                this.programIndex=-1;
            }else if(this.programIndex!==-1){
                this.programIndex++;
            }
            this.dispatchEvent(new CustomEvent('index-changed', {
                detail: { value: this.programIndex },
                bubbles: true,
                composed: true
            }));
        }
        this.canSave=false;
        this._saveChanges();
    }
    
    private _saveChanges() {
        this.dispatchEvent(new CustomEvent('block-saved', {
            detail: { value: this.program },
            bubbles: true,
            composed: true
        }));
    }

    private _selectCategory(cat: BlockType){
        this.category=cat
        this.requestUpdate();
    }

    static styles = css`
        button {
            border-radius: 8px;
            border: 1px solid transparent;
            margin: 0.3em;
            padding: 0.6em 0.2em;
            font-size: 1em;
            font-weight: 500;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: inherit;
            background: linear-gradient(135deg, #4a90e2, #7da7d9);
            border: none;
            cursor: pointer;
            transition: border-color 0.25s;
            }
        button.selected {
            border: none;
            color: white;
            margin: 0px;
            padding: 0.8em 1.6em;
            border-radius: 0px;
        }

        .menu {
            position: sticky;
            top: 0;
            display: flex;
            justify-content: center;
            background-color: gray;
            width: 100%;

        }

        .menu-item {
            padding: 0.6em 0.8em;
            background: gray;
            margin: 0px;
        }

        .content{
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            flex: 1;
            overflow-y: auto;
        }

        input {
            font-size: 1em;
            padding: 4px;
            border: none;
            background: linear-gradient(135deg, #4a90e2, #7da7d9);
            color: black;
        }

        li {
            list-style-type: none;
            padding: 0;
        }

        .save {
        margin: 12px 1px;
        background: linear-gradient(135deg, rgb(106, 175, 108), rgb(79, 255, 108));
        border: none;
        }

        button:disabled {
            background-color: grey;
            cursor: not-allowed;
            background: linear-gradient(135deg, #c4c4c4, rgb(214, 214, 214));
            color: #6e6e6e;
        }

        .branch {
        background: linear-gradient(135deg, #7da7d9, #96b9e1);
        border: none;
        }
        .cycle {
        background: linear-gradient(135deg, rgb(106, 175, 108), rgb(136, 205, 138));
        border: none;
        }
        .dev {
        background: linear-gradient(135deg, #ff9800, #ffb733);
        border: none;
        }
        .alert {
        background: linear-gradient(135deg, rgb(255, 108, 108), rgb(255, 138, 138));
        border: none;
        }
        .end {
        background: linear-gradient(135deg, rgb(226, 192, 0), rgb(236, 206, 64));
        border: none;
        }
        .set_var {
        background: linear-gradient(135deg, #E2A7F0, #ebbef5);
        border: none;
        }

        .branch_text {color:  #7da7d9;}
        .cycle_text {color:  rgb(106, 175, 108);}
        .dev_text {color:  #ff9800;}
     `
}

declare global {
  interface HTMLElementTagNameMap {
    'options-element': OptionsElement
  }
}