import { LitElement, TemplateResult, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { OptionBlock, ProgramBlock, VarObject} from './interfaces'

@customElement('options-element')
export class OptionsElement extends LitElement {

    @state()
    private blocks: OptionBlock[] = [
        {block: {name: "If", simple: false, id: "if"}, arguments: true},
        {block: {name: "Else", simple: false, id: "else"}, arguments: false},
        {block: {name: "Send notification", simple: true, id: "alert"}, arguments: false},
        {block: {name: "End of block", simple: true, id: "end"}, arguments: false}
    ];

    @property()menuCondition=false;

    @property()
    program: ProgramBlock[] = [];

    @property()
    conditions: VarObject[] = [];

    render() {
        const listCode: TemplateResult[]=[];
        if(!this.menuCondition){
        this.blocks.forEach((block)=>{
            listCode.push(html`<li><button @click=${() => this._addToProgram(block)}>${block.block.name}</button></li>`);
        });
        }else{
        this.conditions.forEach((condition)=>{
            listCode.push(html`<li><button @click=${() => this._addCondition(condition)}>${condition.name}: ${condition.value}</button></li>`);
        });
    }

        return listCode
    }

    private _addToProgram(input: OptionBlock) {
        let condition: VarObject[]=[];
        if(input.arguments){
        condition=[{name: '', type: 'note', value: 'Add condition'}];
        this.menuCondition=true;
        }
        this.program=[...this.program, {block: input.block, arguments: condition}]
        this._saveChanges();
    }

    private _addCondition(condition: VarObject) {
        let block=this.program.pop();
        if(block){
            block={ ...block, arguments: [condition] };
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
     `
}

declare global {
  interface HTMLElementTagNameMap {
    'options-element': OptionsElement
  }
}