import { html, css, LitElement } from 'lit';

export class DeleteIcon extends LitElement {
    static styles = css`
    svg {
      width: 16px;
      height: 16px;
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `;

  render() {
    return html`
      <svg viewBox="0 0 24 24">
        <path d="M3 6h18"/>
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <rect x="5" y="6" width="14" height="14" rx="2" ry="2"/>
        <path d="M10 11v6M14 11v6"/>
      </svg>
    `;
  }
}

customElements.define('delete-icon', DeleteIcon);