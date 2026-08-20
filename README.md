# Archivo D.S.F.R.

Registro del trabajo de grado de **Daniel Stiven Fabra Rodríguez**, practicante de Diseño Gráfico de la Institución Universitaria Pascual Bravo, desarrollado durante su práctica profesional en **Henkia** (antes ARUS).

Este sitio documenta cómo se usó **Claude** para potenciar procesos de comunicación interna que la compañía ya tenía en marcha: el Boletín 3 en Uno, el Kit del Líder, los micrositios del portal BUK, ARUS [Rec]onoce y la Guía de Onboarding.

## Estructura del proyecto

```
index.html         → página principal (todas las vistas viven aquí)
data.js             → contenido de las piezas del catálogo
data_manual.js       → contenido del manual técnico
app_home.js          → lógica de la vista de presentación
app_obras.js          → lógica del catálogo y el visor de piezas
app_manual.js        → lógica del manual técnico y la vista de autor
resolveAsset.js       → resuelve rutas de archivos (PDF, HTML, video)
vendor/              → PDF.js, usado para previsualizar los PDF sin depender de un CDN externo
assets/
  ├── pdfs/           → documentos originales (boletines, kit del líder, micrositios BUK)
  ├── htmls/          → micrositios y variantes del boletín ya construidos
  ├── video/          → piezas de Arus [Rec]onoce
  ├── img/             → foto del autor
  └── thumbs/          → miniaturas reales generadas de cada pieza
```

## Cómo publicar cambios

Este proyecto está pensado para desplegarse en **Vercel**, conectado a este repositorio de GitHub. Cualquier archivo que subas aquí (por la web de GitHub o con Git) se publica automáticamente en el sitio en vivo en un par de minutos.

Para agregar o reemplazar contenido:
1. Sube los archivos nuevos a la carpeta `assets/` correspondiente (por ejemplo, un PDF nuevo en `assets/pdfs/`).
2. Si es una pieza nueva, avísale a Claude para que actualice `data.js` con la referencia a ese archivo.

## Por qué el visor de PDF necesita un servidor real

Los navegadores bloquean, por seguridad, que un archivo abierto con doble clic (`file://`) cargue ciertos recursos. Por eso este sitio debe verse siempre desde su URL de Vercel — no funciona correctamente si se abre `index.html` directamente desde el explorador de archivos de Windows o Mac.
