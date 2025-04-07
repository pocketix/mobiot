import { LitElement, html, css } from 'lit';
import { customElement, property, state} from 'lit/decorators.js';
import { Argument, ProgramBlock} from '../general/interfaces'

@customElement('text-editor-element')
export class TextEditorElement extends LitElement {

  @state()
  private stack: string[] = [];
  
  @property({ type: String })
  value: string = '';

  @state()
  private deepCounter: number = 1;

  @property()
    program: ProgramBlock[] = [];

  static styles = css`
    textarea {
      border: 2px solid #ddd;
      border-radius: 4px;
      padding: 8px;
      width: 500px;
      height: 500px;
      font-size: 16px;
    }
  `;

  render() {
    this.value='[\n'
    this.program.forEach((item)=>{
      let tabs: string=''
      if(item.block.id==="end"){
        this.value=this._removeComma(this.value);
        this.value = this.value + this.stack.pop();
        this.deepCounter-=2
      }else{
        for(let i=0;i<this.deepCounter;i++){
          tabs=tabs+'  ';
        }
        this.value=this.value + tabs + '{\n'
        this.value=this.value + tabs + '  "id": "' + item.block.id + '",\n';
        let blockEnd=this._addArgs(item.arguments, tabs + '  ', 'arguments');
        blockEnd=this._removeComma(blockEnd);
        blockEnd=blockEnd + tabs + '},\n';


        if(!item.block.simple){
          if(this.program.indexOf(item)===this.program.length-1 || this.program[this.program.indexOf(item)+1].block.id==='end'){
            this.value=this.value + tabs + '  "block": [],\n'
          }else{
            this.value=this.value + tabs + '  "block": [\n';
            blockEnd=tabs + '  ],\n' + blockEnd
          }
          this.stack.push(blockEnd)
          this.deepCounter+=2
        }
        else{
          this.value=this.value + blockEnd
        }
      }
    }
  )
    while(this.stack.length>=1){
      this.value=this._removeComma(this.value);
      this.value = this.value + this.stack.pop();
    }
    this.value=this._removeComma(this.value);
    this.value=this.value + ']'
    this.deepCounter=1
    return html`
      <textarea 
        type="text" 
        .value=${this.value} 
        @input=${this._handleInput} 
      />
    `;
  }

  private _addArgs(args: Argument[], tabs: string, title: string='value'): string{
    let blockEnd: string=''
    if(args.length!=0){
      blockEnd=tabs + '  "' + title + '": [\n';//TODO import export
      args.forEach((argument)=>{
        blockEnd=blockEnd + tabs + '  {\n';
        blockEnd=blockEnd + tabs + '    "type": "' + argument.type + '",\n'
        if(argument.args.length===0){
          blockEnd=blockEnd + tabs + '    "value": "' + argument.value + '"\n'
        }else{
          blockEnd=blockEnd + this._addArgs(argument.args, tabs + '  ')
        }
        blockEnd=this._removeComma(blockEnd);
        blockEnd=blockEnd + tabs + '  },\n';
      })
      blockEnd=this._removeComma(blockEnd);
      blockEnd=blockEnd + tabs + '],\n';
    }
    return blockEnd
  }

  private _removeComma(text: string): string {
    if (text.length >= 2 && text[text.length - 2] === ',') {
      return text.slice(0, text.length - 2) + text[text.length - 1];
    }
    return text;
  }

  private _handleInput(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }
}

declare global {
    interface HTMLElementTagNameMap {
      'test-editor-element': TextEditorElement;
    }
  }