class AcordionComponent extends HTMLElement {
  static get observedAttributes() {
    return ['secciones'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._secciones = [
      { titulo: 'Sección 1', contenido: 'Contenido de la sección 1' },
      { titulo: 'Sección 2', contenido: 'Contenido de la sección 2' }
    ];
    this._opened = 0;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'secciones') {
      try {
        this._secciones = JSON.parse(newValue);
      } catch {
        // ignora si el JSON no es válido
      }
    }
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: "Segoe UI", sans-serif;
        }

        .acordion-section {
          border-bottom: 1px solid #ddd;
        }

        .acordion-header {
          background: var(--acordion-header-bg, #fafafa);
          color: var(--acordion-header-color, #333);
          padding: 1rem;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.3s ease;
        }

        .acordion-header:hover {
          background: var(--acordion-header-hover-bg, #f0f0f0);
        }

        .acordion-header::after {
          content: "⌄";
          font-size: 1.2em;
          transition: transform 0.3s ease;
        }

        .acordion-section.open .acordion-header::after {
          transform: rotate(180deg);
        }

        .acordion-content {
          background: var(--acordion-content-bg, #fff);
          color: var(--acordion-content-color, #444);
          padding: 0 1rem;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, padding 0.3s ease;
        }

        .acordion-content.open {
          max-height: 500px; /* valor suficientemente grande */
          padding: 1rem;
        }
      </style>

      <div>
        ${this._secciones.map((sec, i) => `
          <div class="acordion-section${this._opened === i ? ' open' : ''}">
            <div class="acordion-header" data-index="${i}">${sec.titulo}</div>
            <div class="acordion-content${this._opened === i ? ' open' : ''}">${sec.contenido}</div>
          </div>
        `).join('')}
      </div>
    `;

    // Manejo de clics en headers
    this.shadowRoot.querySelectorAll('.acordion-header').forEach(header => {
      header.onclick = () => {
        const idx = parseInt(header.getAttribute('data-index'));
        this._opened = idx;
        this.render(); // Vuelve a renderizar para reflejar el cambio
        this.dispatchEvent(new CustomEvent('acordion-cambio', {
          detail: { indice: idx, seccion: this._secciones[idx] },
          bubbles: true,
          composed: true
        }));
      };
    });
  }
}

customElements.define('acordion', AcordionComponent);
