import { html, css, LitElement } from 'lit';

export class DetailStartIcon extends LitElement {
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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
        <path d="M8 3H3v5"/>
        <path d="M3 16v5h5"/>
        <path d="M16 3h5v5"/>
        <path d="M21 16v5h-5"/>
      </svg>
    `;
  }
}

customElements.define('detail-start-icon', DetailStartIcon);