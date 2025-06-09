class AcordionPlan extends HTMLElement {
  constructor() {
    super();
    
    // Crear shadow DOM para encapsulación
    this.attachShadow({ mode: 'open' });
    
    // Estado interno
    this._items = [];
    this._abiertos = [];
    this._maxAbiertos = 2;
    
    // Renderizar el componente
    this.render();
  }
  
  // Propiedades observadas (atributos que provocan re-render cuando cambian)
  static get observedAttributes() {
    return ['titulo', 'items', 'max-abiertos', 'class'];
  }
  
  // Ciclo de vida: cuando cambia un atributo
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      console.log(`Atributo cambiado: ${name}`, newValue);
      
      if (name === 'items') {
        try {
          this._items = JSON.parse(newValue);
          console.log('Items parseados correctamente:', this._items);
        } catch (error) {
          console.error('Error al parsear items:', error);
          this._items = [];
        }
      } else if (name === 'max-abiertos') {
        this._maxAbiertos = parseInt(newValue, 10) || 2;
      }
      
      this.render();
      
      // Re-configurar event listeners después de renderizar
      setTimeout(() => {
        this._setupEventListeners();
      }, 0);
    }
  }
  
  // Ciclo de vida: cuando se conecta al DOM
  connectedCallback() {
    console.log('AcordionPlan conectado al DOM');
    
    // Necesitamos renderizar explícitamente para asegurar que el contenido esté listo
    // antes de configurar los event listeners
    this.render();
    
    // Configurar event listeners después del renderizado
    setTimeout(() => {
      this._setupEventListeners();
      console.log('Event listeners configurados después de timeout');
    }, 0);
  }
  
  // Ciclo de vida: cuando se desconecta del DOM
  disconnectedCallback() {
    this._cleanupEventListeners();
  }
  
  // Configurar event listeners
  _setupEventListeners() {
    // Obtener todos los encabezados de panel
    const headers = this.shadowRoot.querySelectorAll('.acordion-header');
    
    // Agregar event listener a cada encabezado
    headers.forEach((header, index) => {
      // Eliminar manejadores de eventos antiguos si existen
      if (header._clickHandler) {
        header.removeEventListener('click', header._clickHandler);
      }
      
      // Crear y asignar un nuevo manejador de eventos
      header._clickHandler = () => this._togglePanel(index);
      header.addEventListener('click', header._clickHandler);
      
      // Imprimir para depuración
      console.log(`Configurado listener para panel ${index}`);
    });
  }
  
  // Limpieza de event listeners
  _cleanupEventListeners() {
    const headers = this.shadowRoot.querySelectorAll('.acordion-header');
    
    headers.forEach((header) => {
      if (header._clickHandler) {
        header.removeEventListener('click', header._clickHandler);
        delete header._clickHandler;
      }
    });
  }
  
  // Método para cambiar el estado de un panel (abrir/cerrar)
  _togglePanel(index) {
    console.log(`Toggle panel ${index}. Estado actual: ${this._abiertos.includes(index) ? 'abierto' : 'cerrado'}`);
    
    const isOpen = this._abiertos.includes(index);
    let newAbiertos;
    
    if (isOpen) {
      // Si ya está abierto, cerrarlo
      newAbiertos = this._abiertos.filter(i => i !== index);
      console.log(`Cerrando panel ${index}`);
    } else {
      // Si está cerrado, abrirlo
      newAbiertos = [...this._abiertos];
      
      // Si ya hay máximo de paneles abiertos, cerrar el más antiguo
      if (newAbiertos.length >= this._maxAbiertos) {
        const panelCerrado = newAbiertos.shift(); // Eliminar el más antiguo
        console.log(`Cerrando panel más antiguo: ${panelCerrado}`);
      }
      
      newAbiertos.push(index);
      console.log(`Abriendo panel ${index}`);
    }
    
    this._abiertos = newAbiertos;
    console.log(`Nuevos paneles abiertos: ${this._abiertos.join(', ')}`);
    
    // Actualizar la UI para reflejar cambios
    this._updatePanelStates();
    
    // Disparar evento personalizado
    this.dispatchEvent(new CustomEvent('acordion-toggle', {
      bubbles: true,
      composed: true, // Permite que el evento atraviese el Shadow DOM
      detail: {
        index,
        isOpen: !isOpen,
        activeIndices: [...this._abiertos]
      }
    }));
  }
  
  // Actualizar la UI para reflejar el estado actual
  _updatePanelStates() {
    const headers = this.shadowRoot.querySelectorAll('.acordion-header');
    const panels = this.shadowRoot.querySelectorAll('.acordion-panel');
    
    headers.forEach((header, index) => {
      const isActive = this._abiertos.includes(index);
      if (isActive) {
        header.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      } else {
        header.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
      }
    });
    
    panels.forEach((panel, index) => {
      const isActive = this._abiertos.includes(index);
      if (isActive) {
        panel.classList.add('active');
        console.log(`Panel ${index} activado`);
      } else {
        panel.classList.remove('active');
      }
    });
  }
  
  // Renderizar el componente
  render() {
    // Obtener valores de atributos
    const titulo = this.getAttribute('titulo') || '';
    
    // Temas y clases
    let themeClass = '';
    if (this.classList.contains('theme-dark')) themeClass = 'theme-dark';
    if (this.classList.contains('theme-premium')) themeClass = 'theme-premium';
    
    // Crear el HTML del componente
    this.shadowRoot.innerHTML = `
      <style>
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
        :host(.theme-dark) {
          --primary-color: #7b68ee;
          --secondary-color: #6a5acd;
          --text-color: #f5f5f5;
          --background-color: #2c3e50;
          --border-color: #34495e;
          --highlight-color: #3c4d5f;
          --header-bg: #34495e;
          --header-bg-active: #2c3e50;
        }
        
        :host(.theme-premium) {
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
          max-height: 1000px; /* Altura máxima para la animación */
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
      </style>
      
      <div class="acordion-container ${themeClass}">
        ${titulo ? `<div class="acordion-titulo">${titulo}</div>` : ''}
        
        ${this._items.map((item, index) => {
          const isActive = this._abiertos.includes(index);
          
          return `
            <div class="acordion-item">
              <div class="acordion-header ${isActive ? 'active' : ''}" 
                   role="button"
                   aria-expanded="${isActive ? 'true' : 'false'}"
                   tabindex="0">
                <span>${item.titulo}</span>
                <span class="acordion-icon">►</span>
                <span class="sr-only">Expandir</span>
              </div>
              <div class="acordion-panel ${isActive ? 'active' : ''}">
                <div class="acordion-content">${item.contenido}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    
    // Volver a configurar event listeners después de renderizar
    setTimeout(() => {
      this._setupEventListeners();
      console.log('Event listeners configurados después de render');
    }, 0);
  }
}

// Registrar el componente como un elemento personalizado
customElements.define('acordion-plan', AcordionPlan);