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

  static styles = css`
    .text-container {
      border: 2px solid #ccc;
      border-radius: 4px;
      padding: 8px;
      width: 500px;
      height: 500px;
      font-size: 16px;
      font-family: sans-serif;
      color: black;
      text-align: left;
      overflow: auto;
      outline: none;
      resize: none;
      line-height: 1.4;
    }
    .highlight {
      color: red;
    }
  `;

  render() {
    const lines = this.value.split('\n');

    return html`
      <div class="text-container" contenteditable @input=${this._handleInput}>
        ${lines.map(
        (line, index) => 
          html`<div style="white-space: pre-wrap;" class=${this.errorLines.includes(index) ? 'highlight' : ''}>${line}</div>`
        )}
      </div>
    `;
  }

  private _handleInput(event: InputEvent) {
    const container = event.currentTarget as HTMLElement;
    let newValue = ''

    Array.from(container.childNodes)
      .filter(node => node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'DIV')
      .map(divNode => {
        newValue=newValue +  (divNode as HTMLElement).innerText + '\n';
    });

    const result=TextSyntax(newValue);
    if(result.program){
      this.value='';
      let program = TextToVp(result.program);
        this.dispatchEvent(new CustomEvent('value-changed', {
        detail: { value: program},
        bubbles: true,
        composed: true
      }));
    }
    if(result.errorIndex){
      this.errorLines=[result.errorIndex-3, result.errorIndex-2, result.errorIndex-1]
    }
  }
}

declare global {
    interface HTMLElementTagNameMap {
      'test-editor-element': TextEditorElement;
    }
  }