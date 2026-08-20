// ============================================================
// DATOS — Grupos y piezas del catálogo (revisión 3: miniaturas reales)
// ============================================================

const EN1_VARIANTS = [
  { id:"gaceta3", label:"Gaceta", file:"assets/htmls/3enUno_GACETA_v3.html", thumb:"assets/thumbs/3enUno_GACETA_v3.jpg" },
  { id:"modular", label:"Modular", file:"assets/htmls/3enUno_MODULAR.html", thumb:"assets/thumbs/3enUno_MODULAR.jpg" },
  { id:"bitacora", label:"Bitácora", file:"assets/htmls/3enUno_BITACORA.html", thumb:"assets/thumbs/3enUno_BITACORA.jpg" },
  { id:"system2", label:"System", file:"assets/htmls/3enUno_SYSTEM_v2.html", thumb:"assets/thumbs/3enUno_SYSTEM_v2.jpg" },
  { id:"v6", label:"ARUS", file:"assets/htmls/3enUno_ARUS_v6.html", thumb:"assets/thumbs/3enUno_ARUS_v6.jpg" },
];

const GROUP_EN1 = {
  id:"en1",
  title:"Boletín 3 en Uno",
  desc:"Comunicación interna quincenal enviada por correo a toda la compañía. El boletín ya tenía un formato y un ritmo editorial propios — el trabajo consistió en llevar su producción a código, explorando distintas direcciones gráficas para la misma estructura de contenido.",
  pieces: [
    {
      id:"en1-manual", num:"01", title:"Ediciones manuales, editadas en MailUp",
      tag:"Editor visual de MailUp",
      thumb:"assets/thumbs/en1_v1.jpg",
      isLegacy:true,
      viewers:[
        {kind:"pdf", label:"Edición 1", file:"assets/pdfs/en1_v1.pdf"},
        {kind:"pdf", label:"Edición 2", file:"assets/pdfs/en1_v2.pdf"},
        {kind:"pdf", label:"Edición 3", file:"assets/pdfs/en1_v3.pdf"},
      ],
      facts:[["Herramienta","Editor visual de MailUp"],["Formato","Imágenes apiladas por bloque"],["Ediciones de referencia","3"]],
    },
    {
      id:"en1-sistema", num:"02", title:"Sistema HTML propio",
      tag:"Código propio · Compatible Gmail, Outlook y Apple Mail",
      thumb:"assets/thumbs/3enUno_BITACORA.jpg",
      compareWith:"en1-manual",
      viewers: EN1_VARIANTS.map(v => ({kind:"html", label:v.label, file:v.file})),
      variants: EN1_VARIANTS,
      facts:[["Direcciones exploradas","5"],["Clientes verificados","Gmail, Outlook, Apple Mail"],["Formato","HTML autocontenido"]],
      process:[
        "Se mantuvo el formato y ritmo editorial existente (tres noticias más un banner de cierre) — el cambio fue de producción, no de concepto.",
        "Gmail elimina el bloque &lt;style&gt; del correo: todo el CSS se convirtió a estilos inline.",
        "Los íconos de fuente (Font Awesome) no se renderizan en clientes de correo: se construyó un pipeline con Lucide Icons y cairosvg para exportar PNG recoloreados.",
        "Outlook de escritorio no soporta background-image: se agregaron colores sólidos de respaldo en cada sección.",
      ]
    },
  ]
};

const GROUP_KIT = {
  id:"kit",
  title:"Kit del Líder",
  desc:"Comunicación mensual dirigida a los líderes de la compañía. El contenido y la estructura narrativa (Recuerda / Cuenta / Posibilita) ya estaban definidos por Talento Humano — el formato de entrega y la experiencia de lectura evolucionaron edición tras edición, durante seis meses.",
  pieces:[
    {
      id:"kit-marzo", num:"01", title:"Marzo — documento de una lámina",
      tag:"Formato estático, sin navegación",
      thumb:"assets/thumbs/kit_marzo.jpg",
      isLegacy:true,
      viewers:[{kind:"pdf", label:"Ver documento completo", file:"assets/pdfs/kit_marzo.pdf"}],
      facts:[["Formato","PDF, una lámina"],["Navegación","Ninguna"],["Distribución","Correo corporativo"]],
    },
    {
      id:"kit-julio", num:"02", title:"Julio — edición 03",
      tag:"Tres universos gráficos, animaciones, integraciones reales",
      thumb:null,
      compareWith:"kit-marzo",
      viewers:[{kind:"iframe-external", label:"Abrir sitio en vivo", url:"https://kitdelliderjulio.netlify.app/"}],
      facts:[["Concepto","Tres universos gráficos unidos por un sistema común"],["Integraciones","Humand, SharePoint"],["Animaciones","Título letra por letra, transición de logos"]],
      process:[
        "El copy y las prioridades ya venían definidos por Talento Humano — el trabajo fue de forma, jerarquía y experiencia, no de contenido.",
        "Un cursor personalizado dificultaba la navegación en trackpad: se restringió a dispositivos con mouse de precisión (pointer:fine).",
        "Las fuentes personalizadas no cargaban en la exportación de portadas estáticas: se incrustaron como base64 dentro del archivo.",
        "El indicador de sección activa fallaba durante el scroll: se corrigió el rootMargin del IntersectionObserver.",
      ]
    },
    {
      id:"kit-agosto", num:"03", title:"Agosto — edición Henkia",
      tag:"Ya bajo la nueva identidad de marca",
      thumb:null,
      viewers:[{kind:"live-note", label:"Sitio institucional — captura pendiente de autorización.", url:null}],
      facts:[["Marca","Henkia (transición desde ARUS)"],["Novedad","Contadores en vivo, video-manifiesto"],["Contexto","Coincide con el cambio de marca de la compañía"]],
    },
  ]
};

const GROUP_BUK = {
  id:"buk",
  title:"Micrositios del portal BUK",
  desc:"Documentos de consulta permanente para todos los colaboradores: legal, compensación, salud, cultura, servicios administrativos. La información ya estaba completa y correcta en los PDFs existentes — el reto era exclusivamente de mantenimiento: actualizar un dato significaba editar PDF por PDF y verificar hipervínculo por hipervínculo.",
  pieces:[
    {
      id:"buk-salud", num:"01", title:"Salud Integral",
      tag:"Autocuidado · Bienestar físico, emocional y financiero",
      thumb:"assets/thumbs/salud-integral_15.jpg",
      compareThumbBefore:"assets/thumbs/buk_salud.jpg",
      viewers:[
        {kind:"pdf", label:"PDF original", file:"assets/pdfs/buk_salud.pdf"},
        {kind:"html", label:"Micrositio actual", file:"assets/htmls/salud-integral_15.html"},
      ],
      facts:[["Antes","PDF con hipervínculos"],["Después","Micrositio con categorías y migas de pan"],["Contenido","Salud física, emocional, financiera"]],
    },
    {
      id:"buk-mosaico", num:"02", title:"Mosaico",
      tag:"Mosaico Integrador y Mosaico Administrativo",
      thumb:"assets/thumbs/Henkia_Mosaico_1.jpg",
      compareThumbBefore:"assets/thumbs/buk_mosaico.jpg",
      viewers:[
        {kind:"pdf", label:"PDF original", file:"assets/pdfs/buk_mosaico.pdf"},
        {kind:"html", label:"Micrositio actual", file:"assets/htmls/Henkia_Mosaico_1.html"},
      ],
      facts:[["Antes","PDF, splash page estática"],["Después","Micrositio navegable"],["Identidad","Ya integra paleta Henkia"]],
    },
    {
      id:"buk-convivencia", num:"03", title:"Comité de Convivencia y COPASST",
      tag:"Reporte de acoso · Seguridad y salud en el trabajo",
      thumb:"assets/thumbs/comite_convivencia_henkia_9.jpg",
      compareThumbBefore:"assets/thumbs/buk_convivencia.jpg",
      viewers:[
        {kind:"pdf", label:"PDF original", file:"assets/pdfs/buk_convivencia.pdf"},
        {kind:"html", label:"Micrositio actual", file:"assets/htmls/comite_convivencia_henkia_9.html"},
      ],
      facts:[["Contenido","Comité paritario, integrantes, canal de reporte"],["Sensibilidad","Contenido normativo, preservado sin alteraciones"],["Identidad","Ya integra paleta Henkia"]],
    },
    {
      id:"buk-servicios", num:"04", title:"Servicios Administrativos",
      tag:"Transportes, viáticos, papelería, archivo",
      thumb:"assets/thumbs/Servicios_Administrativos_-_Henkia_5.jpg",
      compareThumbBefore:"assets/thumbs/buk_servicios.jpg",
      viewers:[
        {kind:"pdf", label:"PDF original", file:"assets/pdfs/buk_servicios.pdf"},
        {kind:"html", label:"Micrositio actual", file:"assets/htmls/Servicios_Administrativos_-_Henkia_5.html"},
      ],
      facts:[["Antes","PDF con formularios enlazados"],["Después","Micrositio con accesos directos"],["Identidad","Ya integra paleta Henkia"]],
    },
    {
      id:"buk-compensacion", num:"05", title:"Mi Compensación",
      tag:"Kiosko, Pentaho, cesantías, incapacidades, dotación",
      thumb:"assets/thumbs/mi-compensacion-henkia_6.jpg",
      compareThumbBefore:"assets/thumbs/buk_compensacion.jpg",
      viewers:[
        {kind:"pdf", label:"PDF original", file:"assets/pdfs/buk_compensacion.pdf"},
        {kind:"html", label:"Micrositio actual", file:"assets/htmls/mi-compensacion-henkia_6.html"},
      ],
      facts:[["Antes","PDF con accesos listados"],["Después","Micrositio con navegación por trámite"],["Identidad","Ya integra paleta Henkia"]],
    },
    {
      id:"buk-estrategia", num:"06", title:"Estrategia y Cultura",
      tag:"Posicionamiento, cadena de valor, atributos de cultura",
      thumb:"assets/thumbs/Henkia_Estrategia_y_Cultura_18.jpg",
      compareThumbBefore:"assets/thumbs/buk_estrategia.jpg",
      viewers:[
        {kind:"pdf", label:"PDF original", file:"assets/pdfs/buk_estrategia.pdf"},
        {kind:"html", label:"Micrositio actual", file:"assets/htmls/Henkia_Estrategia_y_Cultura_18.html"},
      ],
      facts:[["Contenido","Cinco pilares estratégicos, declaración de cultura"],["Complejidad","La pieza más extensa del portal"],["Identidad","Ya integra paleta Henkia"]],
      process:[
        "Regla de trabajo no negociable: el contenido estratégico y de cultura nunca se resume ni reinterpreta, solo se diagrama tal cual está aprobado.",
        "Se estableció distinción explícita entre marca propia y marcas aliadas (por ejemplo, menciones a Grupo Sura) para no generar confusión de identidad.",
        "Imágenes generadas por IA que no cumplían el estándar visual se descartaron y se reemplazaron por fotografía corporativa real.",
        "Pendiente de decisión organizacional: alojar en SharePoint o HubSpot antes del lanzamiento definitivo.",
      ]
    },
  ]
};

const GROUP_RECONOCE = {
  id:"reconoce",
  title:"ARUS [Rec]onoce",
  desc:"Espacio de reconocimiento a colaboradores, equipos, clientes y proveedores. La pieza ya era un espacio valorado dentro de la compañía — se amplió su capacidad de contar más historias con más cuidado visual.",
  pieces:[
    {
      id:"reconoce-antiguo", num:"01", title:"Versión en CapCut",
      tag:"Plantilla fija tipo insignia · 46 segundos",
      thumb:"assets/thumbs/reconoce_antiguo.jpg",
      isLegacy:true,
      viewers:[{kind:"video", label:"Ver video completo", file:"assets/video/arus_reconoce_antiguo.mp4"}],
      facts:[["Herramienta","CapCut"],["Duración","46 segundos"],["Formato","Insignia repetida por reconocimiento"]],
    },
    {
      id:"reconoce-actual", num:"02", title:"Animación con Claude",
      tag:"Tipografía cinética · 105 segundos",
      thumb:"assets/thumbs/reconoce_actual.jpg",
      compareWith:"reconoce-antiguo",
      viewers:[{kind:"video", label:"Ver video completo", file:"assets/video/arus_reconoce_actual.mp4"}],
      facts:[["Duración","105 segundos"],["Crecimiento","Más del doble de la versión anterior"],["Formato","Grid editorial de colaboradores"]],
      process:[
        "Se definió un sistema de animación tipográfica (texto grande más ícono por valor) como evolución de la insignia repetida.",
        "Se incorporó resaltado selectivo de frases clave dentro del texto para dirigir la lectura del espectador.",
        "El formato de presentación de colaboradores pasó a un grid de retrato uniforme con nombre y cargo.",
        "La mayor duración permitió incorporar más reconocimientos por edición sin sacrificar claridad visual.",
      ]
    },
  ]
};

const GROUP_ONBOARDING = {
  id:"onboarding",
  title:"Guía de Onboarding",
  desc:"Bienvenida a nuevos colaboradores a nivel nacional. La guía ya cubría todo lo esencial — se transformó el formato para que esa información se sintiera como una experiencia guiada en lugar de un documento extenso.",
  pieces:[
    {
      id:"onboarding-ppt", num:"01", title:"Tríptico en PowerPoint",
      tag:"Zona Antioquia · Seis páginas fijas",
      thumb:"assets/thumbs/onboarding_ppt.jpg",
      isLegacy:true,
      viewers:[{kind:"pdf", label:"Ver documento completo", file:"assets/pdfs/onboarding_ppt.pdf"}],
      facts:[["Formato","PowerPoint / PDF"],["Páginas","6 fijas"],["Alcance","Zona Antioquia"]],
    },
    {
      id:"onboarding-web", num:"02", title:"Guía interactiva nacional",
      tag:"15 pasos navegables · Accesos por categoría",
      thumb:null,
      compareWith:"onboarding-ppt",
      viewers:[{kind:"iframe-external", label:"Abrir sitio en vivo", url:"https://onboardingnacionalarus.netlify.app/"}],
      facts:[["Pasos","15 navegables"],["Accesos","Perfil, Nómina, Interno, Compras, Bienestar, Equipos"],["Alcance","Nacional"]],
      process:[
        "Se mantuvo cada bloque de contenido original — el rediseño fue de secuencia y ritmo de lectura, no de mensaje.",
        "Se añadió navegación explícita (Continuar / Volver atrás) con contador de progreso.",
        "Los enlaces de interés (BUK, MAYA, Tienda ARUS, beneficios, organigrama) se conectaron como accesos reales.",
        "Un botón de WhatsApp corporativo se integró como salida rápida de soporte durante los primeros días.",
      ]
    },
  ]
};

const GROUP_MAILINGS = {
  id:"mailings",
  title:"Mailings, ecards y portadas",
  desc:"Comunicaciones puntuales de uso casi diario — mailings de campañas, ecards de celebración y portadas de piezas internas — migradas al mismo flujo de trabajo con código propio.",
  pieces:[
    {
      id:"mailings-pendiente", num:"01", title:"Contenido en preparación",
      tag:"Esta sección se completará próximamente",
      thumb:null,
      viewers:[{kind:"live-note", label:"Esta sección está en preparación. El material se incorporará próximamente.", url:null}],
      facts:[["Estado","Pendiente de material"],["Piezas previstas","Mailings, ecards, portadas"],["Actualización","Próxima revisión del archivo"]],
    },
  ]
};

const CATALOG = [GROUP_EN1, GROUP_KIT, GROUP_BUK, GROUP_RECONOCE, GROUP_ONBOARDING, GROUP_MAILINGS];
