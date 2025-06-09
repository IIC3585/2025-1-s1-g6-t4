import { LitElement, html, css } from 'https://unpkg.com/lit@3.1.2/index.js?module';

class AcordionLit extends LitElement {
  static properties = {
    secciones: { type: Array },
    opened: { type: Number }
  };

  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
    }
    .acordion-section {
      border-bottom: 1px solid #ddd;
    }
    .acordion-header {
      background: var(--acordion-header-bg, #f0f0f0);
      color: var(--acordion-header-color, #222);
      padding: 1em;
      cursor: pointer;
      font-weight: bold;
    }
    .acordion-header:hover {
      background: var(--acordion-header-hover-bg, #e0e0e0);
    }
    .acordion-content {
      background: var(--acordion-content-bg, #fff);
      color: var(--acordion-content-color, #333);
      padding: 1em;
      display: none;
    }
    .acordion-content.open {
      display: block;
    }
  `;

  constructor() {
    super();
    this.secciones = [
      { titulo: 'Sección 1', contenido: 'Contenido de la sección 1' },
      { titulo: 'Sección 2', contenido: 'Contenido de la sección 2' }
    ];
    this.opened = 0;
  }

  updated(changedProps) {
    if (typeof this.secciones === 'string') {
      try {
        this.secciones = JSON.parse(this.secciones);
      } catch {
        // ignora si no es válido
      }
    }
  }

  _abrir(idx) {
    this.opened = idx;
    this.dispatchEvent(new CustomEvent('acordion-cambio', {
      detail: { indice: idx, seccion: this.secciones[idx] },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div>
        ${this.secciones.map((sec, i) => html`
          <div class="acordion-section">
            <div class="acordion-header" @click=${() => this._abrir(i)}>${sec.titulo}</div>
            <div class="acordion-content${this.opened === i ? ' open' : ''}">${sec.contenido}</div>
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define('acordion-lit', AcordionLit);
