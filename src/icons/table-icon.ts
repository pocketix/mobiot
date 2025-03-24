import { html, LitElement } from 'lit';

export class TableIcon extends LitElement {

  render() {
    return html`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
    </svg>
    `;
  }
}

customElements.define('table-icon', TableIcon);