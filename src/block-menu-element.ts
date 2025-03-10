import { LitElement, html, css} from 'lit';
import { customElement, property} from 'lit/decorators.js';
import {ProgramBlock} from './interfaces'

@customElement('block-menu-element')
export class BlockMenuElement extends LitElement {

    @property()
    isOpen: boolean = false;

    @property({ type: Object })
    block: ProgramBlock = {block: {name: '', simple: false, id: '', type: 'all', argTypes: []}, arguments: [], hide: false};

    static styles = css`

    h2{
        color: black;
    }
    
    button {
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        background-color: #ddd;
        transition: background-color 0.2s, color 0.2s;
        color: black;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10;
    }

    .modal {
      background: white;
      padding: 24px;
      border-radius: 8px;
      max-width: 400px;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    }
  `;

  render() {

    return html`
        <div class="overlay" @click=${this._openCloseModal}>
          <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
            <button>Detail</button>
            <button @click=${this._deleteBlock}>Delete</button>
            <button>Replace</button>
            <button>Save as procedure</button>
          </div>
        </div>
      `//buttons save as procedure function is not part of this thesis
      //TODO button detail 3rd phase
      //TODO button replace 4th phase
  }
    private _openCloseModal() {
        this.isOpen = !this.isOpen;
        this.dispatchEvent(new CustomEvent('block-menu', {
            detail: { value: this.isOpen },
            bubbles: true,
            composed: true
        }));
    }

    private _deleteBlock() {
        this.dispatchEvent(new CustomEvent('delete-block', {
            detail: { value: this.block },
            bubbles: true,
            composed: true
        }));
        this._openCloseModal()
    }

  
}

declare global {
  interface HTMLElementTagNameMap {
    'block-menu-element': BlockMenuElement
  }
}