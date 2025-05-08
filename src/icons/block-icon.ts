import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class BlockIcon extends LitElement {
    @property({ type: String }) type = '';

    @property() height: boolean = false;

  static styles = css`
    img {
      height: 24px;
      margin: 0px 4px;
    }

    .big {
      height: 28px;
    }
  `;//      width: 24px;

  private getImageUrl(fileName: string): string {
    return new URL(fileName, import.meta.url).href;
  }

  private imageMap: Record<string, string> = {
    'if': this.getImageUrl('img/if-icon.png'),
    'else': this.getImageUrl('img/else-icon.png'),
    'elseif': this.getImageUrl('img/elseif-icon.png'),
    'switch': this.getImageUrl('img/switch-icon.png'),
    'case': this.getImageUrl('img/case-icon.png'),
    'while': this.getImageUrl('img/while-icon.png'),
    'repeat': this.getImageUrl('img/repeat-icon.png'),
    'alert': this.getImageUrl('img/alert-icon.png'),
    'setvar': this.getImageUrl('img/setvar-icon.png'),
    'dev': this.getImageUrl('img/dev-icon.png'),
  };

  render() {
    const imageSrc = this.imageMap[this.type as keyof typeof this.imageMap];

    return imageSrc ? html`<img class="${this.height? 'big':''}" src="${imageSrc}" alt="${this.type} icon">` : html``;
  }
}

customElements.define('block-icon', BlockIcon);