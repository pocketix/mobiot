import { LitElement, html, css } from 'lit';
import { customElement, property, state} from 'lit/decorators.js';
import { ProgramBlock} from './interfaces'

@customElement('text-editor-element')
export class TextEditorElement extends LitElement {

  @state()
  private stack: string[] = [];
  
  @property({ type: String })
  value: string = '';

  @state()//TODO repair state
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
        this.value = this.value + this.stack.pop();
        this.deepCounter-=2
      }else{
        for(let i=0;i<this.deepCounter;i++){
          tabs=tabs+'  ';
        }
        this.value=this.value + tabs + '{\n'
        // tabs=tabs + '  '
        this.value=this.value + tabs + '  "id": "' + item.block.id + '",\n'

        let blockEnd: string=''
        if(item.arguments.length!=0){
          blockEnd=tabs + '  "arguments": [\n';//TODO add commas
          item.arguments.forEach((argument)=>{
            blockEnd=blockEnd + tabs + '    {\n';
            blockEnd=blockEnd + tabs + '      "type": "' + argument.type + '",\n'
            blockEnd=blockEnd + tabs + '      "value": "' + argument.value + '"\n'
            blockEnd=blockEnd + tabs + '    }\n';
          })
          blockEnd=blockEnd + tabs + '  ]\n';
        }
        blockEnd=blockEnd + tabs + '}\n'


        if(!item.block.simple){
          this.value=this.value + tabs + '  "block": [\n'
          blockEnd=tabs + '  ],\n' + blockEnd
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
      this.value = this.value + this.stack.pop();
    }
    this.value=this.value + ']'
    this.deepCounter=1
    return html`
      <textarea 
        type="text" 
        .value=${this.value} 
        @input=${this._handleInput} 
        placeholder="Napiš něco..."
      />
    `;
  }

  private _handleInput(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;

    // TODO Spustí vlastní událost pro obousměrnou datovou vazbu
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