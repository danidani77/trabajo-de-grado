// ============================================================
// VISTA: MANUAL TÉCNICO
// ============================================================
function renderManual(){
  mainEl.innerHTML = `
    <section class="manual-head brand-band wrap">
      <div class="hh-kicker"><span class="dot"></span>Documentación técnica · Para quien continúe este trabajo</div>
      <h1 style="font-family:var(--display); font-weight:300; font-size:clamp(28px,4.2vw,46px); max-width:760px; line-height:1.1;">Notas de proceso.</h1>
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

const MANUAL_ICONS = {
  lock: '<path d="M6 11V7a6 6 0 0 1 12 0v4"/><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M12 15.5v2.5"/>',
  layers: '<path d="M12 3 2 8l10 5 10-5-10-5Z"/><path d="M2 13l10 5 10-5"/><path d="M2 18l10 5 10-5"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  "check-device": '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="m8.5 10.5 2 2 4.5-4.5"/>',
  section_principios: '<path d="M12 3 4 6v6c0 4.4 3.3 7.8 8 9 4.7-1.2 8-4.6 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
  section_prompts: '<path d="M4 4h16v12H8l-4 4V4Z"/><path d="M8 9h8M8 12h5"/>',
  section_problemas: '<path d="m14.7 6.3 3 3-1.9 1.9a4 4 0 0 1-5.4 5.4L5 22l-2-2 5.4-5.4a4 4 0 0 1 5.4-5.4l1.9-1.9Z"/>',
  section_flujo: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8 7c3 0 2 8 5 8.5"/><path d="M13 7h5a2 2 0 0 1 2 2v0"/>',
};
function icon(name, size){
  return `<svg viewBox="0 0 24 24" width="${size||18}" height="${size||18}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${MANUAL_ICONS[name]||''}</svg>`;
}

function renderManualSection(sec){
  const sectionIcon = `<span class="h2-icon">${icon('section_'+sec.id, 19)}</span>`;
  if(sec.id === 'flujo'){
    return `
      <section id="sec-${sec.id}" class="man-section reveal-scale">
        <h2 class="man-h2">${sectionIcon}${sec.title}</h2>
        <div class="man-steps">
          ${sec.steps.map((s,i)=>`
            <div class="man-step reveal" style="--i:${i}">
              <div class="ms-num">${i+1}</div>
              <div class="ms-text">${s}</div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }
  if(sec.id === 'principios'){
    return `
      <section id="sec-${sec.id}" class="man-section reveal-scale">
        <h2 class="man-h2">${sectionIcon}${sec.title}</h2>
        <div class="principles-grid">
          ${sec.items.map((it,i) => `
            <div class="principle-card reveal" style="--i:${i}">
              <div class="pc-icon">${icon(it.icon, 20)}</div>
              <h3 class="pc-h">${it.h}</h3>
              <p class="pc-body">${it.body}</p>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }
  if(sec.id === 'prompts'){
    return `
      <section id="sec-${sec.id}" class="man-section reveal-scale">
        <h2 class="man-h2">${sectionIcon}${sec.title}</h2>
        <div class="prompts-grid">
          ${sec.items.map((it,i) => `
            <div class="prompt-card reveal" style="--i:${i}">
              <div class="pr-label">${icon('section_prompts', 15)}<span>${it.h}</span></div>
              <pre class="pr-code">${it.code}</pre>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }
  if(sec.id === 'problemas'){
    return `
      <section id="sec-${sec.id}" class="man-section reveal-scale">
        <h2 class="man-h2">${sectionIcon}${sec.title}</h2>
        <div class="man-items">
          ${sec.items.map((it,i) => `
            <div class="man-item problem-card reveal" style="--i:${i}">
              <span class="tag-problem">${icon('section_problemas',11)}Problema</span>
              <h3 class="mi-h">${it.h}</h3>
              <span class="tag-solution">${icon('check-device',11)}Solución</span>
              <p class="mi-body">${it.body}</p>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }
  return `
    <section id="sec-${sec.id}" class="man-section reveal-scale">
      <h2 class="man-h2">${sectionIcon}${sec.title}</h2>
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
          <p>Practicante de Diseño Gráfico de la Institución Universitaria Pascual Bravo, en Henkia (antes ARUS). Este sitio documenta el trabajo desarrollado durante mi práctica profesional: potenciar, con Claude, procesos de comunicación interna que la compañía ya tenía en marcha.</p>
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
