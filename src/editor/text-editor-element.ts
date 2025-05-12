import { LitElement, html, css } from 'lit';
import { customElement, property, state} from 'lit/decorators.js';
import { TextSyntax } from '../convert/text-syntax';
import { TextToVp } from '../convert/text-to-vp';

@customElement('text-editor-element')
export class TextEditorElement extends LitElement {

  @property({ type: String })
  value: string = '';

  @state()
  private errorLines: number[]=[];

  @state()
  private updateErr: boolean=true;

  static styles = css`
    .text-container {
      border: 2px solid #ccc;
      border-radius: 4px;
      padding: 8px;
      font-size: 16px;
      font-family: sans-serif;
      color: black;
      text-align: left;
      overflow: auto;
      outline: none;
      resize: none;
      line-height: 1.4;
      flex: 1;
      }

    .highlight {
      color: rgb(156, 0, 0);
      background: rgb(255, 131, 131)
    }

    .highlight-less {
      color: rgb(156, 0, 0);
      background: rgb(255, 178, 178)
    }

    .wrapper {
      display: flex;
      align-items: flex-start;
      margin: 4px;
    }

    .line-numbers {
    padding: 11px 4px 11px 0;
    display: flex;
    flex-direction: column;
    user-select: none;
    text-align: right;
    font-size: 16px;
    font-family: sans-serif;
    line-height: 1.4;
  }

  .line-numbers p {
    margin: 0;
    height: 1.4em; 
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: gray;
  }
  `;

  render() {
    const lines = this.value.split('\n');
    if(this.updateErr){
      this.errorLines=[];
    }else this.updateErr=true;

    return html`
    <div class="wrapper">
      <div class="line-numbers">
        ${lines.map((_, index) => html`<div class="line"><p>${this.errorLines.includes(index) ? '⚠️': index + 1}</p></div>`)}
      </div>
      <div class="text-container" contenteditable @input=${this._handleInput}>
        ${lines.map(
        (line, index) => 
          html`<div style="white-space: pre-wrap;" class=${this._getLineClass(index)}>${line}</div>`
        )}
      </div>
    </div>
    `;
  }

  private _getLineClass(index: number): string {
    const isError = this.errorLines.includes(index);
    const isPrevError = this.errorLines.includes(index - 1);
    const isNextError = this.errorLines.includes(index + 1);
  
    if (isError && isPrevError && isNextError) {
      return 'highlight';
    } else if (isError) {
      return 'highlight-less';
    } else {
      return '';
    }
  }

  private _handleInput(event: InputEvent) {
    const container = event.currentTarget as HTMLElement;
    let newValue = ''
    
    const isDeleting = event.inputType==='deleteContentBackward';

    Array.from(container.childNodes)
      .filter(node => node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'DIV')
      .map((divNode) => {
        
        const divElement = divNode as HTMLElement;
        const divText = divElement.innerText;

        if (divText.trim()==='' && isDeleting) {
          divElement.remove();
        } else {
          newValue = newValue + divText + '\n';
        }
      });

    const result=TextSyntax(newValue);
    if(result.program){
      let program = TextToVp(result.program);
      this.value=newValue;
      this.errorLines=[];
      this.requestUpdate();
        this.dispatchEvent(new CustomEvent('value-changed', {
        detail: { value: program},
        bubbles: true,
        composed: true
      }));
    }
    if(result.errorIndex){
      this.errorLines=[result.errorIndex-3, result.errorIndex-2, result.errorIndex-1]
      this.updateErr=false;
    }
  }
}

declare global {
    interface HTMLElementTagNameMap {
      'test-editor-element': TextEditorElement;
    }
  }