import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

export class AcordionLit extends LitElement {
  // Definir propiedades del componente
  static properties = {
    items: { type: Array },
    titulo: { type: String },
    tema: { type: String, reflect: true },
    maxAbiertos: { type: Number, attribute: 'max-abiertos' },
    abiertos: { type: Array, state: true } // Propiedad interna, no se expone como atributo
  };
  
  // Valores por defecto de las propiedades
  constructor() {
    super();
    this.items = [];
    this.titulo = '';
    this.tema = 'default';
    this.maxAbiertos = 2;
    this.abiertos = [];
  }
  
  // Convertir el atributo items (string JSON) a array cuando se asigna desde HTML
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    
    if (name === 'items' && newValue) {
      try {
        this.items = JSON.parse(newValue);
      } catch (error) {
        console.error('Error al parsear items:', error);
        this.items = [];
      }
    }
  }
  
  // Manejar clic en el encabezado de un panel
  _togglePanel(index) {
    const isOpen = this.abiertos.includes(index);
    let newAbiertos;
    
    if (isOpen) {
      // Si ya está abierto, cerrarlo
      newAbiertos = this.abiertos.filter(i => i !== index);
    } else {
      // Si está cerrado, abrirlo
      newAbiertos = [...this.abiertos];
      
      // Si ya hay máximo de paneles abiertos, cerrar el más antiguo
      if (newAbiertos.length >= this.maxAbiertos) {
        newAbiertos.shift(); // Eliminar el más antiguo
      }
      
      newAbiertos.push(index);
    }
    
    this.abiertos = newAbiertos;
    
    // Disparar evento personalizado
    this.dispatchEvent(new CustomEvent('acordion-toggle', {
      bubbles: true,
      composed: true,
      detail: {
        index,
        isOpen: !isOpen,
        activeIndices: [...this.abiertos]
      }
    }));
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
      --header-bg: #f8f9fa;
      --header-bg-active: #e9ecef;
      --transition-speed: 0.4s;
    }
    
    /* Temas */
    :host([tema="dark"]) {
      --primary-color: #7b68ee;
      --secondary-color: #6a5acd;
      --text-color: #f5f5f5;
      --background-color: #2c3e50;
      --border-color: #34495e;
      --highlight-color: #3c4d5f;
      --header-bg: #34495e;
      --header-bg-active: #2c3e50;
    }
    
    :host([tema="premium"]) {
      --primary-color: #f1c40f;
      --secondary-color: #f39c12;
      --text-color: #2c3e50;
      --background-color: #ecf0f1;
      --border-color: #bdc3c7;
      --highlight-color: #f5f5f5;
      --header-bg: #f5f5f5;
      --header-bg-active: #f1c40f;
    }
    
    .acordion-container {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      background-color: var(--background-color);
      color: var(--text-color);
      overflow: hidden;
    }
    
    .acordion-titulo {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 16px;
      padding: 16px;
      text-align: center;
      border-bottom: 1px solid var(--border-color);
    }
    
    .acordion-item {
      border-bottom: 1px solid var(--border-color);
    }
    
    .acordion-item:last-child {
      border-bottom: none;
    }
    
    .acordion-header {
      background-color: var(--header-bg);
      padding: 15px 20px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      transition: background-color var(--transition-speed) ease;
    }
    
    .acordion-header:hover {
      background-color: var(--highlight-color);
    }
    
    .acordion-header.active {
      background-color: var(--header-bg-active);
      color: var(--primary-color);
    }
    
    .acordion-icon {
      transition: transform var(--transition-speed) ease;
    }
    
    .acordion-header.active .acordion-icon {
      transform: rotate(90deg);
    }
    
    .acordion-panel {
      max-height: 0;
      overflow: hidden;
      transition: max-height var(--transition-speed) ease-in-out;
      background-color: var(--background-color);
      visibility: hidden;
    }
    
    .acordion-panel.active {
      max-height: 1000px; /* Altura máxima para la animación - aumentada para contenido más grande */
      visibility: visible;
    }
    
    .acordion-content {
      padding: 20px;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
    }
    
    .acordion-panel.active .acordion-content {
      opacity: 1;
    }
    
    /* Accesibilidad - ocultar detalles visualmente pero mantenerlos para lectores de pantalla */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  `;
  
  // Renderizar el componente (método de LitElement)
  render() {
    return html`
      <div class="acordion-container">
        ${this.titulo ? html`<div class="acordion-titulo">${this.titulo}</div>` : ''}
        
        ${this.items.map((item, index) => {
          const isActive = this.abiertos.includes(index);
          
          return html`
            <div class="acordion-item">
              <div class="acordion-header ${isActive ? 'active' : ''}" 
                   @click="${() => this._togglePanel(index)}"
                   role="button"
                   aria-expanded="${isActive}"
                   tabindex="0">
                <span>${item.titulo}</span>
                <span class="acordion-icon">►</span>
                <span class="sr-only">Expandir</span>
              </div>
              <div class="acordion-panel ${isActive ? 'active' : ''}">
                <!-- 
                  Usamos .innerHTML en lugar de unsafeHTML para renderizar HTML.
                  El prefijo "." indica a LitElement que debe asignar el valor directamente
                  a la propiedad innerHTML del elemento, no como un atributo.
                  Esta es una forma segura de insertar HTML dentro de un componente
                  sin necesidad de importaciones adicionales.
                -->
                <div class="acordion-content" .innerHTML="${item.contenido}"></div>
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }
}

// Registrar el componente
customElements.define('acordion-lit', AcordionLit);
