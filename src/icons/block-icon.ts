import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import ifIcon from'/img/if-icon.png';
import elseIcon from'/img/else-icon.png';
import elseifIcon from'/img/elseif-icon.png';
import switchIcon from'/img/switch-icon.png';
import caseIcon from'/img/case-icon.png';
import whileIcon from'/img/while-icon.png';
import repeatIcon from'/img/repeat-icon.png';
import alertIcon from'/img/alert-icon.png';
import setvarIcon from'/img/setvar-icon.png';
import devIcon from'/img/dev-icon.png';

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
    'if': this.getImageUrl(ifIcon),
    'else': this.getImageUrl(elseIcon),
    'elseif': this.getImageUrl(elseifIcon),
    'switch': this.getImageUrl(switchIcon),
    'case': this.getImageUrl(caseIcon),
    'while': this.getImageUrl(whileIcon),
    'repeat': this.getImageUrl(repeatIcon),
    'alert': this.getImageUrl(alertIcon),
    'setvar': this.getImageUrl(setvarIcon),
    'dev': this.getImageUrl(devIcon),
  };

  render() {
    const imageSrc = this.imageMap[this.type as keyof typeof this.imageMap];

    return imageSrc ? html`<img class="${this.height? 'big':''}" src="${imageSrc}" alt="${this.type} icon">` : html``;
  }
}

customElements.define('block-icon', BlockIcon);