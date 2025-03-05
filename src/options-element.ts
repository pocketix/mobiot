import { LitElement, TemplateResult, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { OptionBlock, ProgramBlock, VarObject, Argument, BlockType} from './interfaces'

@customElement('options-element')
export class OptionsElement extends LitElement {

    @state()
    private blocks: OptionBlock[] = [
        {block: {name: "If", simple: false, id: "if"}, arguments: true, type: 'branch'},
        {block: {name: "Else", simple: false, id: "else"}, arguments: false, type: 'branch'},
        {block: {name: "Else If", simple: false, id: "elseif"}, arguments: true, type: 'branch'},
        {block: {name: "Switch", simple: false, id: "switch"}, arguments: true, type: 'branch'},//TODO add case
        {block: {name: "Repeat", simple: false, id: "repeat"}, arguments: true, type: 'cycle'},
        {block: {name: "While", simple: false, id: "while"}, arguments: true, type: 'cycle'},
        {block: {name: "Send notification", simple: true, id: "alert"}, arguments: true, type: 'alert'},
        {block: {name: "End of block", simple: true, id: "end"}, arguments: true, type: 'end'},
        {block: {name: "Set Variable", simple: true, id: "setvar"}, arguments: true, type: 'branch'},
        {block: {name: "LED 1.setLedColor", simple: true, id: "str_opt"}, arguments: false, type: 'dev'},
    ];

    @state()
    private categories: BlockType[]= ['all', 'branch', 'cycle', 'alert', 'set_var', 'dev', 'end'];

    @state()
    private category: BlockType='all'

    @property()menuCondition=false;

    @property()
    program: ProgramBlock[] = [];

    @property()
    conditions: VarObject[] = [];

    render() {
        const listCode: TemplateResult[]=[];
        if(!this.menuCondition){
            let filteredBlocks =this.blocks;
            if(this.category!='all'){
                filteredBlocks=filteredBlocks.filter(item => item.type === this.category)
            }
            filteredBlocks.forEach((block)=>{
            listCode.push(html`<li><button @click=${() => this._addToProgram(block)}>${block.block.name}</button></li>`);
        });
        }else{
        this.conditions.forEach((condition)=>{
            listCode.push(html`<li><button @click=${() => this._addCondition(condition)}>${condition.name}: ${condition.value[0].value}</button></li>`);
        });
    }

        return html`
            <div>
                ${this.categories.map(item=>html`
                <button class=${item === this.category ? 'selected' : ''} @click=${() => this._selectCategory(item)}>${item}</button>
                `)}
            </div>
            ${listCode}`
    }

    private _addToProgram(input: OptionBlock) {
        let condition: Argument[]=[];
        if(input.arguments){
        condition=[{type: 'note', value: 'Add condition', args: []}];
        this.menuCondition=true;
        }
        this.program=[...this.program, {block: input.block, arguments: condition}]
        this._saveChanges();
    }

    private _addCondition(condition: VarObject) {
        let block=this.program.pop();
        if(block){
            block={ ...block, arguments: condition.value };
            this.menuCondition=false;
            this.program=[...this.program, block];
            this._saveChanges();
        }
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