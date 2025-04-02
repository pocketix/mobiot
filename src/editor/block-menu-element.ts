import { LitElement, html, css} from 'lit';
import { customElement, property} from 'lit/decorators.js';
import {ProgramBlock} from '../general/interfaces'
import { consume } from '@lit/context';
import { detailGeneralExport} from '../general/context';
import '../icons/delete-icon'

@customElement('block-menu-element')
export class BlockMenuElement extends LitElement {

    @property()
    isOpen: boolean = false;

    @property({ type: Object })
    block: ProgramBlock = {block: {name: '', simple: false, id: '', type: 'all', argTypes: []}, arguments: [], hide: false};

    @property()
    startIndex: boolean=false;

    @property()
    endIndex: boolean=false;

    @consume({ context: detailGeneralExport, subscribe: true })
    @property({ attribute: false })
    detailGeneral: boolean=false;

    static styles = css`

    h2{
        color: black;
    }
    
    button {
        padding: 8px 8px;
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
      position: fixed;
      bottom: 15vh;
      background-color: #7da7d9;
      width: 100%;
      max-width: 1040px;
      padding: 10px;
    }

    .save {
      background-color:rgb(79, 255, 108);
    }

    .delete {
      background-color:rgb(255, 104, 104);
    }
  `;

  render() {
    return html`
        <div class="overlay" @click=${this._openCloseModal}>
          <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
            ${!this.block.block.simple ? html`
            <button @click=${this._detailBlock}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 3H3v5"/>
              <path d="M3 16v5h5"/>
              <path d="M16 3h5v5"/>
              <path d="M21 16v5h-5"/>
              </svg>
            Detail</button>` :''}
            <button class="delete" @click=${this._deleteBlock}><delete-icon></delete-icon>Delete</button>
            <button @click=${this._replaceBlock}>Replace</button>
            <button class="save">Save as procedure</button>
            ${this._availableMove(true) ? html`<button @click=${()=>this._moveBlock(true)}>△</button>` : ''}
            ${this._availableMove()  ? html`<button @click=${()=>this._moveBlock(false)}>▽</button>` : ''}
            
          </div>
        </div>
      `//buttons save as procedure function is not part of this thesis
  }
    private _openCloseModal() {
        this.isOpen = !this.isOpen;
        this.dispatchEvent(new CustomEvent('block-menu', {
            detail: { value: this.isOpen },
            bubbles: true,
            composed: true
        }));
    }

    private _replaceBlock(){//TODO clean code
      this.dispatchEvent(new CustomEvent('replace-block', {
        detail: { value: this.block },
        bubbles: true,
        composed: true
    }));
    this._deleteBlock();
    }

    private _deleteBlock() {
        this.dispatchEvent(new CustomEvent('delete-block', {
            detail: { value: this.block },
            bubbles: true,
            composed: true
        }));
        this._openCloseModal()
    }

  private _detailBlock() {
    this.dispatchEvent(new CustomEvent('detail-block', {
        bubbles: true,
        composed: true
    }));
    this._openCloseModal()
  }

  private _moveBlock(up: boolean) {
    if(this.block.block.id==='if'){
      const confirmMove = window.confirm("Attention: All (else if) and (else) blocks connected with this (if) block will be moved too. ");
      if (!confirmMove) {
        this._openCloseModal()
        return;
      }
    }

    this.dispatchEvent(new CustomEvent('move-block', {
        detail: { value: up },
        bubbles: true,
        composed: true
    }));
    this._openCloseModal();
    }

  private _availableMove(up: boolean=false): boolean{
    if(this.block.block.id==='else' || this.block.block.id==='elseif')return false;
    if(up && this.startIndex) {
      return false;
    }
    if(!up && this.endIndex) return false;
    return true;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'block-menu-element': BlockMenuElement
  }
}