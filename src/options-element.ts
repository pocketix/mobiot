import { LitElement, TemplateResult, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('options-element')
export class OptionsElement extends LitElement {

}

declare global {
  interface HTMLElementTagNameMap {
    'options-element': OptionsElement
  }
}