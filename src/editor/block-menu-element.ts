import { LitElement, html, css} from 'lit';
import { customElement, property} from 'lit/decorators.js';
import {ProgramBlock} from '../general/interfaces'
import { consume } from '@lit/context';
import { detailGeneralExport} from '../general/context';
import { LangCode, transl } from '../general/language';
import '../icons/delete-icon'
import '../icons/detail-start-icon'

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

    @property({ attribute: false })
    currentLang: LangCode = 'en';

    static styles = css`

    h2{
        color: black;
    }
    
    button {
        padding: 8px 8px;
        border: none;
        margin: 3px;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background: linear-gradient(135deg, #ddd,rgb(224, 224, 224));
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
      top: 75vh;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      background: linear-gradient(135deg, #4a90e2, #7da7d9);
      width: 100%;
      max-width: 1200px;
      padding: 10px;
      max-height: 15vh;
      overflow-y: auto;
    }

    .save {
      background: linear-gradient(135deg, rgb(79, 255, 108), rgb(200, 255, 220));
    }

    .delete {
      background: linear-gradient(135deg, rgb(255, 104, 104), rgb(255, 160, 180));
    }
  `;

  render() {
    return html`
        <div class="overlay" @click=${this._openCloseModal}>
          <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
            ${!this.block.block.simple ? html`
            <button @click=${this._detailBlock}><detail-start-icon></detail-start-icon>Detail</button>` :''}
            <button class="delete" @click=${this._deleteBlock}><delete-icon></delete-icon>${transl('delete')}</button>
            <button @click=${this._replaceBlock}>${transl('replace')}</button>
            ${!this.block.block.simple ? html`
            <button class="save">${transl('saveAsProcedure')}</button>` :''}
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

    private _replaceBlock(){
      this.dispatchEvent(new CustomEvent('replace-block', {
        detail: { value: this.block },
        bubbles: true,
        composed: true
      }));
      this._deleteBlock();
    }

    private _deleteBlock() {
      if(this.block.block.id==='if'){
        const confirmMove = window.confirm(transl('attentionIfDelete'));
        if (!confirmMove) {
          this._openCloseModal()
          return;
        }
      }

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
      const confirmMove = window.confirm(transl('attentionIf'));
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
    if(up && this.startIndex) return false;
    if(!up && this.endIndex) return false;
    return true;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'block-menu-element': BlockMenuElement
  }
}