# CloudSolutions - Web Components

Este proyecto implementa una página web interactiva para una empresa ficticia de soluciones cloud, utilizando Web Components. La particularidad de este proyecto es que cada componente se ha implementado de dos formas diferentes:

1. **Componentes Nativos**: Utilizando estándares web puros (HTML Templates, Custom Elements y Shadow DOM)
2. **Componentes LitElement**: Utilizando la biblioteca LitElement para una implementación más declarativa

La página permite al usuario alternar entre estas dos implementaciones para comparar su funcionamiento.

## Componentes Implementados

El proyecto incluye dos tipos de componentes reutilizables:

### Componente de Suscripción

- **Versión nativa**: `<suscripcion-plan>`
- **Versión con LitElement**: `<suscripcion-lit>`

Este componente muestra planes de suscripción con las siguientes características:
- Título y precio del plan
- Lista de características incluidas
- Botón de llamada a la acción
- Temas visuales (default, dark, premium)

### Componente de Acordeón

- **Versión nativa**: `<acordion-plan>`
- **Versión con LitElement**: `<acordion-lit>`

Este componente muestra información en secciones colapsables con:
- Paneles con títulos y contenido expandible
- Soporte para HTML en el contenido
- Configuración de máximo número de paneles abiertos
- Temas visuales (default, dark, premium)
- Animaciones suaves de apertura/cierre

## Estructura del Proyecto

```
/
├── index.html              # Página principal que usa los componentes
├── package.json            # Configuración del proyecto
├── README.md               # Este archivo
├── .gitignore              # Archivos ignorados por Git
└── src/
    ├── suscripcion-template.js  # Componente de suscripción nativo
    ├── suscripcion-lit.js       # Componente de suscripción con LitElement
    ├── acordion-template.js     # Componente de acordeón nativo
    └── acordion-lit.js          # Componente de acordeón con LitElement
```

## Cómo Ejecutar el Proyecto

### Requisitos Previos

- Node.js (v14 o superior)
- npm (v6 o superior)

### Instalación

1. Clona este repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd [NOMBRE_DEL_DIRECTORIO]
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
```

El navegador se abrirá automáticamente mostrando la página.

## Modo de Uso

### Alternando entre Implementaciones

En cada sección de la página (Planes, Características, FAQ), encontrarás botones para cambiar entre las implementaciones:

- **Web Components**: Utiliza los componentes nativos
- **LitElement**: Utiliza los componentes basados en LitElement

Esto te permite comparar ambas implementaciones mientras mantienes el mismo diseño y funcionalidad.

### Personalización de Componentes

#### Componente de Suscripción

```html
<!-- Ejemplo de uso del componente de suscripción -->
<suscripcion-plan 
  titulo="Plan Básico" 
  precio="9.99" 
  moneda="$" 
  periodo="mo"
  caracteristicas="10 GB de almacenamiento, Hasta 2 usuarios, Soporte por email"
  url-boton="#basic"
  texto-boton="Comenzar">
</suscripcion-plan>

<!-- Con tema -->
<suscripcion-lit 
  tema="dark"
  titulo="Plan Profesional" 
  precio="24.99" 
  moneda="$" 
  periodo="mo"
  caracteristicas="100 GB de almacenamiento, Hasta 10 usuarios"
  url-boton="#pro"
  texto-boton="Elegir Plan">
</suscripcion-lit>
```

#### Componente de Acordeón

```html
<!-- Ejemplo de uso del componente de acordeón -->
<acordion-plan
  titulo="Título del Acordeón"
  items='[
    {
      "titulo": "Título del Panel 1",
      "contenido": "<p>Contenido HTML del panel</p>"
    },
    {
      "titulo": "Título del Panel 2",
      "contenido": "<p>Más contenido HTML</p>"
    }
  ]'
  max-abiertos="2">
</acordion-plan>

<!-- Con tema -->
<acordion-lit
  tema="premium"
  titulo="FAQ"
  items='[...]'
  max-abiertos="1">
</acordion-lit>
```

## Eventos Personalizados

Los componentes emiten eventos que pueden ser capturados para interactuar con ellos:

### Evento de Suscripción

```javascript
document.addEventListener('suscripcion-click', function(event) {
  console.log('Plan seleccionado:', event.detail.titulo);
  console.log('Precio:', event.detail.moneda + event.detail.precio + '/' + event.detail.periodo);
  
  // Se puede prevenir la navegación por defecto
  event.preventDefault();
});
```

### Evento de Acordeón

```javascript
document.addEventListener('acordion-toggle', function(event) {
  console.log(`Panel ${event.detail.index} ${event.detail.isOpen ? 'abierto' : 'cerrado'}`);
  console.log('Paneles activos:', event.detail.activeIndices);
});
```

## Notas Técnicas

### Implementación Nativa

Los componentes nativos utilizan:
- `customElements.define()` para registrar elementos personalizados
- `attachShadow()` para crear un Shadow DOM aislado
- Gestión manual del ciclo de vida y eventos

### Implementación con LitElement

Los componentes LitElement aprovechan:
- Sistema de propiedades reactivas
- Renderizado declarativo con plantillas de etiquetas literales
- Gestión automática de re-renderizados

### Renderizado de HTML en Acordeón

Para mostrar HTML en el contenido del acordeón:

- **Versión nativa**: Se usa directamente `innerHTML`
- **Versión LitElement**: Se usa la directiva `.innerHTML="${content}"` en lugar de `unsafeHTML`

```javascript
// En LitElement
<div class="acordion-content" .innerHTML="${item.contenido}"></div>
```

## Compatibilidad

Los componentes han sido probados y funcionan correctamente en:

- Google Chrome (última versión)
- Mozilla Firefox (última versión)
- Microsoft Edge (última versión)
- Safari (última versión)

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.

