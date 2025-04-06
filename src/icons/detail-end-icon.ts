import { html, css, LitElement } from 'lit';

export class DetailEndIcon extends LitElement {
    static styles = css`
    svg {
      width: 24px;
      height: 24px;
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `;

  render() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24">
        <polyline points="4 14 9 14 9 19"></polyline>
        <polyline points="14 4 14 9 19 9"></polyline>
        <polyline points="14 19 14 14 19 14"></polyline>
        <polyline points="4 9 9 9 9 4"></polyline>
      </svg>
    `;
  }
}

customElements.define('detail-end-icon', DetailEndIcon);