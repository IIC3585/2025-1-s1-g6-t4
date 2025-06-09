import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

export class SuscripcionLit extends LitElement {
  // Definir propiedades del componente
  static properties = {
    titulo: { type: String },
    precio: { type: String },
    moneda: { type: String },
    periodo: { type: String },
    caracteristicas: { type: Array },
    urlBoton: { type: String, attribute: 'url-boton' },
    textoBoton: { type: String, attribute: 'texto-boton' },
    tema: { type: String, reflect: true }
  };
  
  // Valor por defecto de las propiedades
  constructor() {
    super();
    this.titulo = 'Plan Básico';
    this.precio = '9.99';
    this.moneda = '$';
    this.periodo = 'mo';
    this.caracteristicas = [];
    this.urlBoton = '#';
    this.textoBoton = 'Get Started';
    this.tema = 'default';
  }
  
  // Convertir el atributo caracteristicas (string) a array cuando se asigna desde HTML
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    
    if (name === 'caracteristicas' && newValue) {
      this.caracteristicas = newValue.split(',').map(item => item.trim()).filter(Boolean);
    }
  }
  
  // Manejar clic en el botón
  _handleClick(e) {
    e.preventDefault();
    
    // Crear y disparar evento personalizado
    this.dispatchEvent(new CustomEvent('suscripcion-click', {
      bubbles: true,
      composed: true,
      detail: {
        titulo: this.titulo,
        precio: this.precio,
        moneda: this.moneda,
        periodo: this.periodo,
        url: this.urlBoton
      }
    }));
    
    // Si hay una URL, navegar a ella
    if (this.urlBoton && this.urlBoton !== '#') {
      window.location.href = this.urlBoton;
    }
  }
  
  // Definir estilos encapsulados del componente
  static styles = css`
    :host {
      display: block;
      font-family: 'Arial', sans-serif;
      --primary-color: #3498db;
      --secondary-color: #2980b9;
      --text-color: #333;
      --background-color: #fff;
      --border-color: #eaeaea;
      --highlight-color: #f8f9fa;
    }
    
    /* Temas */
    :host([tema="dark"]) {
      --primary-color: #7b68ee;
      --secondary-color: #6a5acd;
      --text-color: #f5f5f5;
      --background-color: #2c3e50;
      --border-color: #34495e;
      --highlight-color: #3c4d5f;
    }
    
    :host([tema="premium"]) {
      --primary-color: #f1c40f;
      --secondary-color: #f39c12;
      --text-color: #2c3e50;
      --background-color: #ecf0f1;
      --border-color: #bdc3c7;
      --highlight-color: #f5f5f5;
    }
    
    .suscripcion-card {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 24px;
      background-color: var(--background-color);
      color: var(--text-color);
      max-width: 300px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .suscripcion-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    
    .suscripcion-titulo {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 16px;
      text-align: center;
    }
    
    .suscripcion-precio {
      font-size: 2.5rem;
      font-weight: bold;
      text-align: center;
      margin-bottom: 16px;
    }
    
    .suscripcion-periodo {
      font-size: 1rem;
      color: rgba(var(--text-color), 0.7);
    }
    
    .suscripcion-caracteristicas {
      list-style-type: none;
      padding: 0;
      margin: 24px 0;
    }
    
    .suscripcion-caracteristica {
      padding: 8px 0;
      position: relative;
      padding-left: 28px;
    }
    
    .suscripcion-caracteristica:before {
      content: "✓";
      color: var(--primary-color);
      position: absolute;
      left: 0;
      font-weight: bold;
    }
    
    .btn-action {
      display: block;
      width: 100%;
      padding: 12px;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      transition: background-color 0.3s ease;
    }
    
    .btn-action:hover {
      background-color: var(--secondary-color);
    }
  `;
  
  // Renderizar el componente (método de LitElement)
  render() {
    return html`
      <div class="suscripcion-card">
        <div class="suscripcion-titulo">${this.titulo}</div>
        <div class="suscripcion-precio">
          <span class="suscripcion-moneda">${this.moneda}</span>${this.precio}
          <span class="suscripcion-periodo">/${this.periodo}</span>
        </div>
        
        <ul class="suscripcion-caracteristicas">
          ${this.caracteristicas.map(item => html`
            <li class="suscripcion-caracteristica">${item}</li>
          `)}
        </ul>
        
        <a href="${this.urlBoton}" class="btn-action" @click="${this._handleClick}">
          ${this.textoBoton}
        </a>
      </div>
    `;
  }
}

// Registrar el componente
customElements.define('suscripcion-lit', SuscripcionLit);
