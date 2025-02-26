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

  private _blockEnd(): void {
    this.deepCounter--;
    for(let i=0;i<this.deepCounter;i++){
      this.value=this.value+'\t';
    }
    this.value=this.value+'}\n'
  }
  
  @property({ type: String })
  value: string = '';

  @state()//TODO repair state
  private deepCounter: number = 0;

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
    this.value=''
    this.program.forEach((item)=>{
      if(item.name==="End of block"){
        this._blockEnd()
      }else{
        for(let i=0;i<this.deepCounter;i++){
          this.value=this.value+'\t';
        }
        if(!item.simple){
          this.deepCounter++
        }
        this.value=this.value+item.code
        if(item.condition!=''){
          if(item.condition==='add condition'){
            this.value=this.value + '){\n'
          }
          else{
            this.value=this.value+item.condition+'){\n'
          }
        }
      }
    })
    while(this.deepCounter>0){
      this._blockEnd()
    }
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