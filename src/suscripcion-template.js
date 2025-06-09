class Suscripcion extends HTMLElement {
  constructor() {
    super();
    
    // Crear shadow DOM para encapsulación
    this.attachShadow({ mode: 'open' });
    
    // Aplicar el template
    this.render();
    
    // Referencias a elementos del DOM que necesitaremos manipular
    this._btnAction = this.shadowRoot.querySelector('.btn-action');
    
    // Configurar evento de clic
    this._btnAction.addEventListener('click', this._handleClick.bind(this));
  }
  
  // Propiedades observadas (atributos que provocan re-render cuando cambian)
  static get observedAttributes() {
    return [
      'titulo', 
      'precio', 
      'moneda', 
      'periodo', 
      'caracteristicas', 
      'url-boton', 
      'texto-boton',
      'tema'
    ];
  }
  
  // Ciclo de vida: cuando cambia un atributo
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }
  
  // Ciclo de vida: cuando se conecta al DOM
  connectedCallback() {
    // Actualizar referencias después de renderizar
    this._btnAction = this.shadowRoot.querySelector('.btn-action');
    this._btnAction.addEventListener('click', this._handleClick.bind(this));
  }
  
  // Ciclo de vida: cuando se desconecta del DOM
  disconnectedCallback() {
    // Limpieza de event listeners para evitar memory leaks
    if (this._btnAction) {
      this._btnAction.removeEventListener('click', this._handleClick);
    }
  }
  
  // Método para manejar el clic en el botón
  _handleClick(event) {
    event.preventDefault();
    
    // Crear y disparar evento personalizado con detalles del plan
    const customEvent = new CustomEvent('suscripcion-click', {
      bubbles: true,
      composed: true, // Permite que el evento atraviese el Shadow DOM
      detail: {
        titulo: this.getAttribute('titulo'),
        precio: this.getAttribute('precio'),
        moneda: this.getAttribute('moneda') || '$',
        periodo: this.getAttribute('periodo') || 'mo',
        url: this.getAttribute('url-boton') || '#'
      }
    });
    
    this.dispatchEvent(customEvent);
    
    // Si hay una URL, navegar a ella
    const url = this.getAttribute('url-boton');
    if (url) {
      window.location.href = url;
    }
  }
  
  // Renderizar el componente
  render() {
    // Obtener valores de atributos con valores por defecto
    const titulo = this.getAttribute('titulo') || 'Plan Básico';
    const precio = this.getAttribute('precio') || '9.99';
    const moneda = this.getAttribute('moneda') || '$';
    const periodo = this.getAttribute('periodo') || 'mo';
    const caracteristicasStr = this.getAttribute('caracteristicas') || '';
    const caracteristicas = caracteristicasStr.split(',').map(item => item.trim()).filter(Boolean);
    const urlBoton = this.getAttribute('url-boton') || '#';
    const textoBoton = this.getAttribute('texto-boton') || 'Get Started';
    const tema = this.getAttribute('tema') || 'default';
    
    // Definir clases CSS basadas en el tema
    const temaClass = tema !== 'default' ? `theme-${tema}` : '';
    
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
        }
        
        /* Temas */
        :host(.theme-dark) {
          --primary-color: #7b68ee;
          --secondary-color: #6a5acd;
          --text-color: #f5f5f5;
          --background-color: #2c3e50;
          --border-color: #34495e;
          --highlight-color: #3c4d5f;
        }
        
        :host(.theme-premium) {
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
        
        /* Aplicar clases de tema */
        .${temaClass} {
          /* Las clases de tema se aplican automáticamente a través de las variables CSS */
        }
      </style>
      
      <div class="suscripcion-card ${temaClass}">
        <div class="suscripcion-titulo">${titulo}</div>
        <div class="suscripcion-precio">
          <span class="suscripcion-moneda">${moneda}</span>${precio}
          <span class="suscripcion-periodo">/${periodo}</span>
        </div>
        
        <ul class="suscripcion-caracteristicas">
          ${caracteristicas.map(item => `
            <li class="suscripcion-caracteristica">${item}</li>
          `).join('')}
        </ul>
        
        <a href="${urlBoton}" class="btn-action">${textoBoton}</a>
      </div>
    `;
  }
}

// Registrar el componente como un elemento personalizado
customElements.define('suscripcion-plan', Suscripcion);
