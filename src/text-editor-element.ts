import { LitElement, html, css } from 'lit';
import { customElement, property, state} from 'lit/decorators.js';

//TODO clean code
interface ProgramBlock {
  name: string;
  simple: boolean;
  condition: string;
  code: string;
}

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
      if(item.name==="End of block"){
        this.value = this.value + this.stack.pop();
        this.deepCounter-=2
      }else{
        for(let i=0;i<this.deepCounter;i++){
          tabs=tabs+'  ';
        }
        this.value=this.value + tabs + '{\n'
        // tabs=tabs + '  '
        this.value=this.value + tabs + '  "id": "' + item.name + '",\n'

        let blockEnd: string=''
        blockEnd=tabs + '  "arguments": []\n'//TODO add arguments, commas
        blockEnd=blockEnd + tabs + '}\n'


        if(!item.simple){
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