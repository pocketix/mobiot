import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class BlockIcon extends LitElement {
    @property({ type: String }) type = '';

    @property() height: boolean = false;

  static styles = css`
    img {
      width: auto;
      height: 24px;
    }

    .big {
      height: 28px;
    }
  `;

  private getImageUrl(fileName: string): string {
    return new URL(fileName, import.meta.url).href;
  }

  private imageMap: Record<string, string> = {
    'if': this.getImageUrl('if-icon.png'),
    'else': this.getImageUrl('else-icon.png'),
    'elseif': this.getImageUrl('elseif-icon.png'),
    'switch': this.getImageUrl('switch-icon.png'),
    'case': this.getImageUrl('case-icon.png'),
    'while': this.getImageUrl('while-icon.png'),
    'repeat': this.getImageUrl('repeat-icon.png'),
    'alert': this.getImageUrl('alert-icon.png'),
    'setvar': this.getImageUrl('setvar-icon.png'),
    'str_opt': this.getImageUrl('stropt-icon.png'),
  };

  render() {
    const imageSrc = this.imageMap[this.type as keyof typeof this.imageMap];

    return imageSrc ? html`<img class="${this.height? 'big':''}" src="${imageSrc}" alt="${this.type} icon">` : html``;
  }
}

customElements.define('block-icon', BlockIcon);