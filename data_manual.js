const MANUAL_SECTIONS = [
  {
    id: "principios",
    title: "Principios de trabajo",
    items: [
      {
        h: "El contenido no es tuyo para reinterpretar",
        body: "Si el texto viene de una política, un documento legal, o una comunicación ya aprobada por otra área (Talento Humano, Legal, Comunicaciones), tu trabajo es diagramarlo — no resumirlo, no mejorarlo, no reescribirlo. Pide a Claude explícitamente: <code>no resumas ni reinterpretes este contenido, solo ajústalo al formato</code>. Si Claude produce un resumen por iniciativa propia, corrígelo de inmediato: es el error más costoso posible en este tipo de piezas."
      },
      {
        h: "Cada pieza nueva no empieza de cero",
        body: "Antes de pedir una pieza nueva, dale a Claude el contexto de marca ya definido (paleta, tipografía, componentes existentes) en vez de dejar que lo reinvente. Esto es lo que permitió que el Kit del Líder evolucionara cinco veces sin reconstruirse desde cero cada mes: cada conversación nueva parte del sistema de diseño de la anterior, no de una hoja en blanco."
      },
      {
        h: "Nunca aceptes la primera imagen generada por IA",
        body: "Si necesitas una imagen (no una foto real de la compañía), Claude puede generarla, pero revisa con ojo crítico: logotipos deformados, texto ilegible, manos con dedos de más, texturas que no encajan con la identidad de marca. En más de una pieza se descartaron imágenes generadas por IA y se reemplazaron por fotografía corporativa real — es una decisión de calidad, no un capricho."
      },
      {
        h: "Verifica en el medio real antes de dar por terminada una pieza",
        body: "Un HTML que se ve perfecto en el navegador puede romperse en Gmail, Outlook o al exportarse a imagen. Antes de entregar, prueba la pieza en el entorno real donde va a vivir: renderiza el correo, abre el micrositio en móvil, reproduce el video completo."
      }
    ]
  },
  {
    id: "prompts",
    title: "Prompts que funcionaron",
    items: [
      {
        h: "Para explorar direcciones estéticas antes de construir (usado en el Boletín 3 en Uno)",
        code: `"la estructura del boletín me gusta, pero quiero darle
una dirección gráfica distinta a las que hemos probado.
Antes de construir nada, hazme 3 o 4 propuestas visuales
distintas usando el mismo contenido de prueba, para que
pueda elegir una dirección antes de que la desarrolles
completa."`
      },
      {
        h: "Para pedir un sistema con múltiples identidades unificadas (usado en Kit del Líder, edición de julio)",
        code: `"me gustaría que cada sección pueda tener su propio
universo gráfico, pero que al mismo tiempo comparta una
unidad gráfica con las demás. Preséntalo de una forma
nunca antes vista, pero con muy buena experiencia de
lectura: que no sea enredado."`
      },
      {
        h: "Para proteger contenido normativo (usado en los micrositios del portal BUK)",
        code: `"esto es una política / documento legal. No resumas,
no reinterpretes, no cambies el orden de las ideas.
Tu única tarea es diagramarlo respetando el contenido
exacto que te estoy pasando."`
      },
      {
        h: "Para gestionar recursos de forma eficiente",
        code: `"no me generes los íconos/assets finales todavía —
solo avísame cuándo estén listos para exportar. Prefiero
confirmar la dirección final primero, así no gastamos
tiempo regenerando si algo cambia."`
      }
    ]
  },
  {
    id: "problemas",
    title: "Problemas técnicos recurrentes y su solución",
    items: [
      {
        h: "Gmail elimina el bloque &lt;style&gt; del correo",
        body: "Todo el CSS debe convertirse a estilos <code>inline</code> en cada elemento. No hay forma de evitarlo: es una limitación de seguridad de Gmail, no un bug. Pide a Claude directamente que escriba el HTML del correo con estilos inline desde el principio."
      },
      {
        h: "Los íconos de fuente (Font Awesome, etc.) no se ven en ningún cliente de correo",
        body: "Solución probada: descargar íconos SVG de una librería abierta (se usó Lucide Icons), recolorear programáticamente, y exportar a PNG con <code>cairosvg</code> (Python). Se entregan como imágenes reales, nunca como fuente de ícono."
      },
      {
        h: "Outlook de escritorio no soporta background-image",
        body: "Siempre define un <code>background-color</code> sólido de respaldo en cualquier sección que use imagen de fondo. Outlook lo ignorará y mostrará el color plano — mejor eso que una sección vacía."
      },
      {
        h: "Las fuentes personalizadas no cargan al exportar imágenes estáticas (portadas, PNG)",
        body: "El entorno de exportación no siempre tiene acceso a Google Fonts en tiempo de render. Solución: incrustar la fuente directamente en el CSS como <code>base64</code> con <code>@font-face</code>, para que no dependa de una conexión externa."
      },
      {
        h: "Cursores o interacciones personalizadas rompen la accesibilidad",
        body: "Un cursor personalizado se veía bien pero impedía la navegación fluida en trackpad. Solución: usar <code>@media (pointer:fine)</code> para activar personalizaciones solo en dispositivos con mouse de precisión, nunca de forma universal."
      },
      {
        h: "El indicador de sección activa no sigue el scroll correctamente",
        body: "Si usas <code>IntersectionObserver</code> para saber en qué sección está el usuario, ajusta el <code>rootMargin</code> a una línea de disparo central en vez de los bordes del viewport — evita que el indicador se quede pegado en la sección anterior."
      }
    ]
  },
  {
    id: "flujo",
    title: "Flujo de trabajo recomendado, paso a paso",
    steps: [
      "Reúne el contenido real (texto aprobado, imágenes de marca, enlaces) antes de escribir el primer prompt. Nunca dejes que Claude invente contenido que debería venir de otra área.",
      "Si la pieza es nueva o va a tener una dirección estética distinta, pide primero 2-4 propuestas visuales comparativas con contenido de prueba, antes de construir la versión completa.",
      "Una vez elegida la dirección, constrúyela completa, pieza por pieza, revisando cada sección antes de pasar a la siguiente.",
      "Prueba en el medio real: renderiza el correo en un cliente real, abre el micrositio en móvil y escritorio, reproduce el video completo.",
      "Antes de entregar, revisa una última vez que no haya contenido generado por IA (imágenes, textos) que no cumpla el estándar de marca o que altere información normativa.",
      "Guarda el archivo final y, si es una pieza recurrente, documenta qué cambiaría en la próxima edición para no repetir el proceso de definición desde cero."
    ]
  }
];
