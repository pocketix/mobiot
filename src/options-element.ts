import { LitElement, TemplateResult, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { Block, ProgramBlock, VarObject, Argument} from './general/interfaces'
import { BlockType, TypeOption } from './general/types';
import { CondText } from './general/cond-text';

@customElement('options-element')//TODO clean code
export class OptionsElement extends LitElement {

    @state()
    private blocks: Block[] = [
        {name: "If", simple: false, id: "if", argTypes: ['boolean_expression'], type: 'branch'},
        {name: "Else", simple: false, id: "else", argTypes: [], type: 'branch'},
        {name: "Else If", simple: false, id: "elseif", argTypes: [], type: 'branch'},
        {name: "Switch", simple: false, id: "switch", argTypes: ['num'], type: 'branch'},//TODO add case, more types
        {name: "Repeat", simple: false, id: "repeat", argTypes: ['num'], type: 'cycle'},
        {name: "While", simple: false, id: "while", argTypes: ['boolean_expression'], type: 'cycle'},
        {name: "Send notification", simple: true, id: "alert", argTypes: ['str'], type: 'alert'},
        {name: "End of block", simple: true, id: "end", argTypes: [], type: 'end'},
        {name: "Set Variable", simple: true, id: "setvar", argTypes: ['num', 'num'], type: 'set_var'},//TODO repair
        {name: "LED 1.setLedColor", simple: true, id: "str_opt", argTypes: ['bool'], type: 'dev'},
    ];

    @state()
    private categories: BlockType[]= ['all', 'branch', 'cycle', 'alert', 'set_var', 'dev', 'end'];

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

    render() {
        let listOptions: TemplateResult[]=[];
        if(!this.menuParams){
            let filteredBlocks =this._syntaxFilter();
            if(this.category!='all'){
                filteredBlocks=filteredBlocks.filter(item => item.type === this.category)
            }
            filteredBlocks.forEach((block)=>{
            listOptions.push(html`<li><button @click=${() => this._addToProgram(block)}>${block.name}</button></li>`);
        });
        }else{
            listOptions=this._filterParams();
        }

        let cathegoriesMenu: TemplateResult=html``;
        if(!this.menuParams){
            cathegoriesMenu=html`
            <div>
                ${this.categories.map(item=>html`
                <button class=${item === this.category ? 'selected' : ''} @click=${() => this._selectCategory(item)}>${item}</button>
                `)}
            </div>`
        }
        return html`
            ${cathegoriesMenu}
            ${listOptions}`
    }

    private _filterParams(): TemplateResult[]{
        let list: TemplateResult[]=[];
        if(this.paramType==='boolean_expression'){
            this.conditions.forEach((condition)=>{
                list.push(html`<li><button @click=${() => this._addParamsVar(condition)}>${condition.name}: ${CondText(condition.value.args[0])}</button></li>`);
            });
        }else if(this.paramType==='variable'){
            this.variables.forEach((item)=>{
                list.push(html`<li><button @click=${() => this._addParamsVar(item)}>${item.name}: ${item.value.value}</button></li>`);
            });
        }else{
            this.variables.filter(item => item.value.type === this.paramType).forEach((item)=>{
                list.push(html`<li><button @click=${() => this._addParamsVar(item)}>${item.name}: ${item.value.value}</button></li>`);
            });
            if(this.paramType==='bool'){
                list.push(html`<li><button @click=${() => this._addParamsVal('true')}>true</button></li>`);
                list.push(html`<li><button @click=${() => this._addParamsVal('false')}>false</button></li>`);
            }else if(this.paramType==='str'){
                let paramInput: string='';
                list.push(html`
                    <li>
                      <input type="text" .value=${paramInput} @input=${(e: Event) => paramInput = (e.target as HTMLInputElement).value}>
                      <button @click=${() => this._addParamsVal(paramInput)}>Use this value</button>
                    </li>
                  `);
            }else{
                let paramInput: string='';
                list.push(html`
                    <li>
                      <input type="text" .value=${paramInput} @input=${(e: Event) => paramInput = (e.target as HTMLInputElement).value}>
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
        for (let i = this.program.length - 1; i >= 0; i--){
            if(this.program[i].block.id==='end'){
                deepCounter++;
            }
            if(['branch', 'cycle'].includes(this.program[i].block.type)){
                deepCounter--;
            }
            // console.log(deepCounter, this.program[i].block.id)
            if (deepCounter===0){
                if(['if','elseif'].includes(this.program[i].block.id) && this.program[this.program.length-1].block.id==='end'){
                    filterElse=false;
                }
                if(this.program[i].block.id==='else')filteredBlocks=filteredBlocks.filter(item => item.id != 'else' && item.id != 'elseif');
            }else if(deepCounter===-1){
                if(this.program[this.program.length-1].block.simple){
                    filterEnd=false;
                }
            }
            if(!filterElse && !filterEnd)break
        };
        if(filterElse)filteredBlocks=filteredBlocks.filter(item => item.id != 'else' && item.id != 'elseif');
        if(filterEnd)filteredBlocks=filteredBlocks.filter(item => item.id != 'end');

        return filteredBlocks;
    }

    private _addToProgram(input: Block) {
        if(input.argTypes.length>0){
            this.menuParams=true;
            this.paramType= input.argTypes[0]
        }
        this.program=[...this.program, {block: input, arguments: [], hide: false}]
        this._saveChanges();
    }

    private _addParamsVar(param: VarObject) {
        let block=this.program.pop();
        if(block){
            let arg: Argument=param.value
            if(param.value.type!='boolean_expression'){
                arg = {type: 'variable', value:param.name, args: []};
            }
            this._addParams(block, arg)
        }
    }

    private _addParamsVal(value: string) {
        let block=this.program.pop();
        if(block){
            let arg: Argument = {type: this.paramType, value: value, args: []};
            this._addParams(block, arg)
        }
    }

    private _addParams(block: ProgramBlock, arg: Argument){
        const updatedBlock = { ...block, arguments: [...block.arguments, arg]};
        if(block.block.argTypes.length>updatedBlock.arguments.length){
            this.paramType=block.block.argTypes[updatedBlock.arguments.length]
        }else{
            this.menuParams=false;
            this.paramType='note'
        }
        this.program=[...this.program, updatedBlock];
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
        button.selected {
        background-color: #7da7d9;
        color: white;
    }
     `
}

declare global {
  interface HTMLElementTagNameMap {
    'options-element': OptionsElement
  }
}