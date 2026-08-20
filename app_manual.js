// ============================================================
// VISTA: MANUAL TÉCNICO
// ============================================================
function renderManual(){
  mainEl.innerHTML = `
    <section class="manual-head wrap">
      <div class="hh-kicker"><span class="dot"></span>Documentación técnica · Para quien continúe este trabajo</div>
      <h1 style="font-family:var(--display); font-weight:700; font-size:clamp(28px,4.2vw,46px); max-width:760px; line-height:1.1;">Notas de proceso, para quien siga con esto.</h1>
      <p class="hh-body">Aquí dejo lo que aprendí en el camino: los principios que seguí, los prompts que funcionaron tal cual, y los problemas técnicos que ya resolví, por si le sirven a quien continúe con estas piezas más adelante.</p>
      <nav class="manual-toc">
        ${MANUAL_SECTIONS.map(s => `<a href="#sec-${s.id}" class="toc-pill">${s.title}</a>`).join('')}
      </nav>
    </section>
    <div class="wrap">
      ${MANUAL_SECTIONS.map(renderManualSection).join('')}
    </div>
  `;
  requestAnimationFrame(initReveal);
}

function renderManualSection(sec){
  if(sec.steps){
    return `
      <section id="sec-${sec.id}" class="man-section reveal">
        <h2 class="man-h2">${sec.title}</h2>
        <div class="man-steps">
          ${sec.steps.map((s,i)=>`
            <div class="man-step">
              <div class="ms-num">${String(i+1).padStart(2,'0')}</div>
              <div class="ms-text">${s}</div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }
  return `
    <section id="sec-${sec.id}" class="man-section reveal">
      <h2 class="man-h2">${sec.title}</h2>
      <div class="man-items">
        ${sec.items.map(it => `
          <div class="man-item">
            <h3 class="mi-h">${it.h}</h3>
            ${it.body ? `<p class="mi-body">${it.body}</p>` : ''}
            ${it.code ? `<pre class="mi-code">${it.code}</pre>` : ''}
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

// ============================================================
// VISTA: AUTOR
// ============================================================
function renderAutor(){
  mainEl.innerHTML = `
    <section class="autor-view">
      <div class="wrap autor-grid">
        <div class="autor-photo reveal">
          <img src="${resolveAsset('assets/img/daniel.png')}" alt="Daniel Stiven Fabra Rodríguez">
          <div class="autor-tag">Diseño gráfico · Institución Universitaria Pascual Bravo</div>
        </div>
        <div class="autor-body reveal">
          <div class="eyebrow">Sobre este trabajo</div>
          <h2>Daniel Stiven Fabra Rodríguez</h2>
          <p>Practicante de Diseño Gráfico de la Institución Universitaria Pascual Bravo, en Henkia (antes ARUS). Este archivo documenta el trabajo desarrollado durante mi práctica profesional: potenciar, con Claude, procesos de comunicación interna que la compañía ya tenía en marcha.</p>
          <p>Cada pieza reunida aquí partió de algo que ya funcionaba — el objetivo nunca fue reemplazar el criterio del equipo, sino darle más alcance con menos fricción técnica.</p>
          <div class="hh-row" style="margin-top:32px;">
            <button class="btn btn-fill" onclick="navigate('obras')">Ver el catálogo ↓</button>
            <button class="btn btn-line" onclick="navigate('manual')">Ver el manual técnico</button>
          </div>
        </div>
      </div>
    </section>
    <footer class="site-footer">
      <div class="wrap footer-row">
        <div>Daniel Stiven Fabra Rodríguez · Diseño Gráfico · 2026</div>
        <div>ARUS → Henkia</div>
      </div>
    </footer>
  `;
  requestAnimationFrame(initReveal);
}
