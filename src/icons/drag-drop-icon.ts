import { html, css, LitElement } from 'lit';

export class DragDropIcon extends LitElement {
    static styles = css`
    svg {
      width: 16px;
      height: 16px;
      fill: none;
    }
  `;

  render() {
    return html`
      <svg  viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 1L3 0L4 1" stroke="white" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="0" y1="2" x2="6" y2="2" stroke="white" stroke-width="0.5" stroke-linecap="round"/>
        <line x1="0" y1="4" x2="6" y2="4" stroke="white" stroke-width="0.5" stroke-linecap="round"/>
        <path d="M2 5L3 6L4 5" stroke="white" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }
}

customElements.define('drag-drop-icon', DragDropIcon);