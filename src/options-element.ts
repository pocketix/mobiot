import { LitElement, TemplateResult, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { Block, ProgramBlock, VarObject, Argument} from './general/interfaces'
import { BlockType, TypeOption } from './general/types';
import { CondText } from './general/cond-text';
import { consume } from '@lit/context';
import { programIndexExport, detailGeneralExport} from './general/context';
import './icons/block-icon.ts';

@customElement('options-element')//TODO clean code 3rd phase
export class OptionsElement extends LitElement {

    @state()
    private blocks: Block[] = [
        {name: "Repeat", simple: false, id: "repeat", argTypes: ['num'], type: 'cycle'},
        {name: "While ... do ...", simple: false, id: "while", argTypes: ['boolean_expression'], type: 'cycle'},
        {name: "Send notification", simple: true, id: "alert", argTypes: ['str'], type: 'alert'},
        {name: "If ... do ...", simple: false, id: "if", argTypes: ['boolean_expression'], type: 'branch'},
        {name: "Else do ...", simple: false, id: "else", argTypes: [], type: 'branch'},
        {name: "Else If ... do ...", simple: false, id: "elseif", argTypes: ['boolean_expression'], type: 'branch'},
        {name: "Switch according ...", simple: false, id: "switch", argTypes: ['num'], type: 'branch'},
        {name: "Case", simple: false, id: "case", argTypes: ['num'], type: 'branch'},
        {name: "End of block", simple: true, id: "end", argTypes: [], type: 'end'},
        {name: "Set Variable", simple: true, id: "setvar", argTypes: ['variable', 'note'], type: 'set_var'},
        {name: "LED 1.setLedColor", simple: true, id: "str_opt", argTypes: ['bool'], type: 'dev'},
    ];

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

    render() {
        let listOptions: TemplateResult[]=[];
        if(!this.menuParams){
            let filteredBlocks =this._syntaxFilter();
            if (this.category ==='others'){
                filteredBlocks=filteredBlocks.filter(item => item.type === 'alert' || item.type === 'end' || item.type === 'set_var')
            }else if(this.category!='all'){
                filteredBlocks=filteredBlocks.filter(item => item.type === this.category)
            }
            filteredBlocks.forEach((block)=>{
            listOptions.push(html`<button class=${block.type} @click=${() => this._addToProgram(block)}><block-icon type=${block.id}></block-icon> ${block.name}</button>`);
        });
        }else{
            listOptions=this._filterParams();
        }

        let cathegoriesMenu: TemplateResult=html``;
        if(!this.menuParams){
            cathegoriesMenu=html`
            <div class="menu">
                ${this.categories.map(item=>html`
                <button class=${item === this.category ? 'selected' : 'menu-item'} @click=${() => this._selectCategory(item)}>${item}</button>
                `)}
            </div>`
        }
        return html`
            ${cathegoriesMenu}
            <div class="content">
                ${listOptions}
            </div>`
                
    }

    private _filterParams(): TemplateResult[]{
        let list: TemplateResult[]=[];
        if(this.paramType==='boolean_expression'){
            this.conditions.forEach((condition)=>{
                list.push(html`<button @click=${() => this._addParamsVar(condition)}>${condition.name}: ${CondText(condition.value.args[0])}</button>`);
            });
        }else if(this.paramType==='variable'){
            this.variables.forEach((item)=>{
                list.push(html`<button @click=${() => this._addParamsVar(item)}>${item.name}: ${item.value.value}</button>`);
            });
        }else{
            let varList: VarObject[]=this.variables;
            if(this.paramType!='note'){
                varList=this.variables.filter(item => item.value.type === this.paramType)
            }
            varList.forEach((item)=>{
                list.push(html`<button @click=${() => this._addParamsVar(item)}>${item.name}: ${item.value.value}</button>`);
            });
            if(this.paramType==='bool'){
                list.push(html`<li><button @click=${() => this._addParamsVal('true')}>true</button></li>`);
                list.push(html`<li><button @click=${() => this._addParamsVal('false')}>false</button></li>`);
            }else if(this.paramType==='num'){
                let paramInput: string='';
                list.push(html`
                    <li>
                      <input type="number" inputmode="decimal" step="any" .value=${paramInput} @input=${(e: Event) => paramInput = (e.target as HTMLInputElement).value} placeholder="Enter a number">
                      <button @click=${() => this._addParamsVal(paramInput)}>Use this value</button>
                    </li>
                  `);
            }else{
                let paramInput: string='';
                list.push(html`
                    <li>
                      <input type="text" .value=${paramInput} @input=${(e: Event) => paramInput = (e.target as HTMLInputElement).value} placeholder="Enter a string">
                      <button @click=${() => this._addParamsVal(paramInput)}>Use this value</button>
                    </li>
                  `);
                }
        }
        return list
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
                    break;
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
        // console.log(filteredBlocks);
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
            if (this.programIndex > 0 && this.programIndex < this.program.length) {
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
                            console.log(this.programStartIndex);
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
            if(param.value.type!='boolean_expression'){
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

    private _addParams(block: ProgramBlock, arg: Argument){
        const updatedBlock = { ...block, arguments: [...block.arguments, arg]};
        
        if(this.programIndex===-1){
            this.program=[...this.program, updatedBlock];
        }else{
            if (this.programIndex > 0 && this.programIndex < this.program.length) {
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
            font-family: inherit;
            background-color: #7da7d9;
            cursor: pointer;
            transition: border-color 0.25s;
            }
        button.selected {
            background-color: #7da7d9;
            color: white;
            margin: 0px;
            padding: 0.8em 1.6em;
            border-radius: 0px;
        }

        .menu {
            position: sticky;
            top: 0;
            background-color: gray;
            width: 100%;
            max-width: 1040px;
        }

        .menu-item {
            padding: 0.6em 1.2em;
            background-color: gray;
            margin: 0px;
        }

        .content{
            flex: 1;
            overflow-y: auto;
        }

        input {
            font-size: 1em;
            padding: 4px;
            border: none;
            background-color: #7da7d9;
            color: black;
        }

        li {
            list-style-type: none;
            padding: 0;
        }

        .branch { background-color: #7da7d9;}
        .cycle { background-color: rgb(106, 175, 108);}
        .dev { background-color: #ff9800; }
        .alert { background-color:rgb(255, 108, 108); }
        .end { background-color:rgb(226, 192, 0); }
        .set_var { background-color: #E2A7F0; } 
     `
}

declare global {
  interface HTMLElementTagNameMap {
    'options-element': OptionsElement
  }
}