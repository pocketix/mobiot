import { LitElement, html, css } from 'lit';
import { customElement, property} from 'lit/decorators.js';

@customElement('text-editor-element')
export class TextEditorElement extends LitElement {

  @property({ type: String })//TODO connect with syntax control
  value: string = '';

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

    return html`
      <textarea 
        type="text" 
        .value=${this.value} 
        @input=${this._handleInput} 
      />
    `;
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