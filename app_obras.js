// ============================================================
// VISTA: CATÁLOGO
// ============================================================
function renderObras(){
  mainEl.innerHTML = `
    <section class="obras-head brand-band wrap">
      <div class="hh-kicker"><span class="dot"></span>Registro completo</div>
      <h1 style="font-family:var(--display); font-weight:700; font-size:clamp(30px,4.5vw,48px); line-height:1.08; max-width:820px;">Catálogo de piezas.</h1>
      <p class="hh-body">Cada pieza incluye su documento o sitio de origen y, cuando aplica, el resultado final — abiertos directamente aquí, no solo en captura.</p>
    </section>
    <div class="obras-groups wrap">
      ${CATALOG.map((g,i)=>renderGroup(g,i)).join('')}
    </div>
  `;
  document.querySelectorAll('.item-card').forEach(card=>{
    card.addEventListener('click', ()=> openDossier(card.dataset.group, card.dataset.piece));
    card.addEventListener('mousemove', (e)=>{
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
      card.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
      const dx = (e.clientX - (r.left+r.width/2)) / (r.width/2);
      const dy = (e.clientY - (r.top+r.height/2)) / (r.height/2);
      card.style.transform = `translate(${dx*8}px, ${dy*8-6}px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', ()=>{ card.style.transform = ''; });
  });
  requestAnimationFrame(initReveal);
}

function scrollToGroup(id){
  const el = document.getElementById('grp-'+id);
  if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
}

function thumbOrPlaceholder(piece){
  if(piece.thumb) return `<img src="${resolveAsset(piece.thumb)}" alt="${piece.title}">`;
  return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--tenue);font-size:13px;font-weight:600;">Ver sitio en vivo</div>`;
}

function renderGroup(g, i){
  return `
    <section class="og-section reveal" id="grp-${g.id}">
      <div class="og-title"><span><span class="og-num">${String((i??0)+1).padStart(2,'0')}/${String(CATALOG.length).padStart(2,'0')}</span>${g.title}</span><span class="og-count">${g.pieces.length} ${g.pieces.length===1?'entrada':'entradas'}</span></div>
      <p class="og-desc">${g.desc}</p>
      <div class="items-grid">
        ${g.pieces.map((p,i) => `
          <div class="item-card reveal" style="--i:${i}" data-group="${g.id}" data-piece="${p.id}">
            <div class="ic-thumb ${p.isLegacy ? 'origen' : 'resultado'}">
              ${thumbOrPlaceholder(p)}
              <span class="ic-badge ${p.isLegacy ? 'badge-legado' : 'badge-actual'}">${p.isLegacy ? 'ORIGEN' : 'RESULTADO'}</span>
            </div>
            <div class="ic-body">
              <div class="ic-title">${p.title}</div>
              <div class="ic-meta">${p.tag}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

// ============================================================
// DOSSIER (expediente de pieza — página completa)
// ============================================================
function findPiece(groupId, pieceId){
  const g = CATALOG.find(x=>x.id===groupId);
  const p = g.pieces.find(x=>x.id===pieceId);
  return {g,p};
}

let dossierActiveViewerIdx = 0;

function findComparePair(g, p){
  if(p.compareWith){
    const origen = g.pieces.find(x=>x.id===p.compareWith);
    if(origen) return {origen, resultado:p};
  }
  const resultado = g.pieces.find(x=>x.compareWith===p.id);
  if(resultado) return {origen:p, resultado};
  if(p.compareViewers){
    const [oi, ri] = p.compareViewers;
    if(p.viewers[oi] && p.viewers[ri]){
      return {
        origen: {...p, title:p.viewers[oi].label, viewers:[p.viewers[oi]]},
        resultado: {...p, title:p.viewers[ri].label, viewers:[p.viewers[ri]]},
      };
    }
  }
  return null;
}

// Orden de presentación: un representante por cada uno de los "seis frentes"
// ya establecidos en la entrada cinematográfica, para poder recorrerlos en
// vivo con Anterior/Siguiente sin volver cada vez a la grilla del catálogo.
const FRENTE_ORDER = [
  {g:"en1", p:"en1-sistema"},
  {g:"kit", p:"kit-julio"},
  {g:"buk", p:"buk-salud"},
  {g:"reconoce", p:"reconoce-actual"},
  {g:"onboarding", p:"onboarding-web"},
  {g:"mailings", p:"mailings-citaciones"},
];
function findFrenteIndex(groupId){
  return FRENTE_ORDER.findIndex(f => f.g === groupId);
}

function openDossier(groupId, pieceId){
  dossierActiveViewerIdx = 0;
  compareIdx = {left:0, right:0};
  const {g,p} = findPiece(groupId, pieceId);
  const pair = findComparePair(g,p);
  const overlay = document.getElementById('dossierOverlay');
  const card = document.querySelector(`.item-card[data-group="${groupId}"][data-piece="${pieceId}"]`);
  if(card) playMorphTransition(card);

  overlay.innerHTML = `
    <div class="dossier-topbar">
      <div style="font-family:var(--mono); font-size:12px; color:var(--tenue); text-transform:uppercase; letter-spacing:.04em;">${g.title} · Pieza ${p.num}</div>
      <button class="dossier-close" onclick="closeDossier()">Cerrar ✕</button>
    </div>
    <div class="dossier-body">
      <div class="dossier-eyebrow">Pieza ${p.num}</div>
      <div class="dossier-title">${p.title}</div>
      ${p.tag ? `<p class="dossier-summary">${p.tag}</p>` : ''}

      ${pair ? `
        <div class="compare-mode-tabs" id="compareModeTabs">
          <button class="cmt-btn is-on" data-mode="slider">⇔ Slider</button>
          <button class="cmt-btn" data-mode="compare">⇄ Paralelo</button>
          <button class="cmt-btn" data-mode="single">Solo esta pieza</button>
        </div>
      ` : ''}

      <div id="singleView" style="${pair ? 'display:none' : ''}">
        <div class="viewer-tabs" id="viewerTabs">
          ${p.viewers.map((v,i)=>`<button class="vt-btn ${i===0?'is-on':''}" data-idx="${i}">${v.label.length > 28 ? v.label.slice(0,28)+'…' : v.label}</button>`).join('')}
        </div>
        <div id="viewerFrame"></div>
      </div>
      <div id="compareView" style="display:none"></div>
      <div id="sliderView" style="${pair ? '' : 'display:none'}"></div>

      ${p.facts ? `
        <div class="dossier-facts">
          ${p.facts.map(([k,v])=>`<div class="df-item"><div class="df-k">${k}</div><div class="df-v">${v}</div></div>`).join('')}
        </div>
      ` : ''}

      ${p.variants ? `
        <div class="dossier-variants">
          <div class="dv-title">Las direcciones estéticas exploradas</div>
          <div class="dv-grid">
            ${p.variants.map(v => `
              <div class="dv-item" data-variant-file="${v.file}">
                <div class="dv-thumb"><img src="${resolveAsset(v.thumb)}" alt="${v.label}"></div>
                <div class="dv-label">${v.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${p.process ? `
        <div class="dossier-variants">
          <div class="dv-title">Proceso técnico</div>
          <div class="proc-list">
            ${p.process.map((step,i)=>`
              <div class="proc-item">
                <div class="proc-num">${String(i+1).padStart(2,'0')}</div>
                <div class="proc-text">${step}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${(()=>{ const fi = findFrenteIndex(groupId); if(fi<0) return ''; return `
        <div class="frente-nav">
          <div class="frente-count">Frente ${fi+1} / ${FRENTE_ORDER.length}</div>
          <div class="frente-btns">
            ${fi>0 ? `<button class="btn btn-line" id="frentePrev">← ${CATALOG.find(x=>x.id===FRENTE_ORDER[fi-1].g).title}</button>` : ''}
            ${fi<FRENTE_ORDER.length-1
              ? `<button class="btn btn-fill" id="frenteNext">${CATALOG.find(x=>x.id===FRENTE_ORDER[fi+1].g).title} →</button>`
              : `<button class="btn btn-fill" id="frenteNext" data-end="1">Ver el manual técnico →</button>`}
          </div>
        </div>
      `; })()}
    </div>
  `;

  overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  window.scrollTo({top:0, behavior:'instant'});

  overlay.querySelectorAll('.vt-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      overlay.querySelectorAll('.vt-btn').forEach(b=>b.classList.toggle('is-on', b===btn));
      dossierActiveViewerIdx = parseInt(btn.dataset.idx, 10);
      renderViewer(p);
    });
  });

  overlay.querySelectorAll('.dv-item').forEach(item=>{
    item.addEventListener('click', ()=>{
      renderViewerCustomFile(item.dataset.variantFile);
    });
  });

  const fi = findFrenteIndex(groupId);
  const frentePrev = document.getElementById('frentePrev');
  const frenteNext = document.getElementById('frenteNext');
  if(frentePrev){
    frentePrev.addEventListener('click', ()=>{
      const t = FRENTE_ORDER[fi-1];
      openDossier(t.g, t.p);
    });
  }
  if(frenteNext){
    frenteNext.addEventListener('click', ()=>{
      if(frenteNext.dataset.end){
        closeDossier();
        navigate('manual');
        return;
      }
      const t = FRENTE_ORDER[fi+1];
      openDossier(t.g, t.p);
    });
  }

  const rendered = {single:false, compare:false, slider:false};
  const modeTabs = document.getElementById('compareModeTabs');
  if(modeTabs && pair){
    modeTabs.querySelectorAll('.cmt-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        if(btn.classList.contains('is-on')) return;
        modeTabs.querySelectorAll('.cmt-btn').forEach(b=>b.classList.toggle('is-on', b===btn));
        const mode = btn.dataset.mode;
        document.getElementById('singleView').style.display = mode==='single' ? '' : 'none';
        document.getElementById('compareView').style.display = mode==='compare' ? '' : 'none';
        document.getElementById('sliderView').style.display = mode==='slider' ? '' : 'none';
        if(mode==='single' && !rendered.single){ renderViewer(p); rendered.single = true; }
        if(mode==='compare' && !rendered.compare){ renderCompareView(pair.origen, pair.resultado); rendered.compare = true; }
        if(mode==='slider' && !rendered.slider){ renderSliderView(pair.origen, pair.resultado); rendered.slider = true; }
      });
    });
  }

  if(pair){
    renderSliderView(pair.origen, pair.resultado);
    rendered.slider = true;
  } else {
    renderViewer(p);
    rendered.single = true;
  }
}

// ============================================================
// TRANSICIÓN "MORPH" — la miniatura de la card se transforma
// hacia el dossier en vez de un corte seco
// ============================================================
function playMorphTransition(card){
  const img = card.querySelector('.ic-thumb img');
  if(!img) return;
  const r = card.getBoundingClientRect();
  const ghost = document.createElement('img');
  ghost.src = img.src;
  ghost.className = 'morph-ghost';
  ghost.style.cssText = `position:fixed; left:${r.left}px; top:${r.top}px; width:${r.width}px; height:${r.height}px; object-fit:cover; z-index:999; border-radius:14px; pointer-events:none; box-shadow:0 30px 60px -20px rgba(0,23,12,.4);`;
  document.body.appendChild(ghost);
  const vw = innerWidth, vh = innerHeight;
  requestAnimationFrame(()=>{
    ghost.style.transition = 'left .5s cubic-bezier(.2,.8,.2,1), top .5s cubic-bezier(.2,.8,.2,1), width .5s cubic-bezier(.2,.8,.2,1), height .5s cubic-bezier(.2,.8,.2,1), border-radius .5s ease, opacity .45s ease .18s';
    ghost.style.left = (vw*0.2)+'px';
    ghost.style.top = (vh*0.22)+'px';
    ghost.style.width = (vw*0.6)+'px';
    ghost.style.height = (vh*0.5)+'px';
    ghost.style.borderRadius = '18px';
    ghost.style.opacity = '0';
  });
  setTimeout(()=> ghost.remove(), 650);
}

function closeDossier(){
  const overlay = document.getElementById('dossierOverlay');
  overlay.classList.remove('is-open');
  overlay.innerHTML = '';
  document.body.style.overflow = '';
}

// Barra espaciadora reproduce/pausa ambos videos a la vez cuando el dossier
// muestra dos videos (Paralelo o Slider) — p.ej. Henkia [Rec]onoce antes/después.
document.addEventListener('keydown', (e)=>{
  if(e.code !== 'Space') return;
  const overlay = document.getElementById('dossierOverlay');
  if(!overlay || !overlay.classList.contains('is-open')) return;
  const tag = (e.target.tagName || '').toLowerCase();
  if(tag==='button' || tag==='input' || tag==='textarea' || tag==='a') return;
  const videos = Array.from(document.querySelectorAll('#compareView video, #sliderView video'))
    .filter(v => v.offsetParent !== null);
  if(videos.length < 2) return;
  e.preventDefault();
  const anyPaused = videos.some(v => v.paused);
  videos.forEach(v => { if(anyPaused) v.play().catch(()=>{}); else v.pause(); });
});

// Muchas piezas resultado (HTML reconstruido) tienen un ancho fijo mayor al panel
// que las muestra, sobre todo en la vista de comparación. Esto escala el iframe
// para que el contenido completo sea visible sin recortes ni scroll interno.
function fitIframeContent(iframe){
  if(!iframe) return;
  try{
    iframe.style.transform = '';
    iframe.style.width = '';
    iframe.style.height = '';
    const baseHeight = iframe.offsetHeight;
    const doc = iframe.contentDocument;
    if(!doc || !doc.documentElement) return;
    const naturalWidth = Math.max(doc.documentElement.scrollWidth, doc.body ? doc.body.scrollWidth : 0) + 20;
    const containerWidth = iframe.clientWidth;
    if(containerWidth > 0 && naturalWidth > containerWidth + 4){
      const scale = containerWidth / naturalWidth;
      iframe.style.transformOrigin = 'top left';
      iframe.style.width = (100/scale) + '%';
      iframe.style.height = (baseHeight/scale) + 'px';
      iframe.style.transform = `scale(${scale})`;
    }
  }catch(e){ /* origen cruzado: no se puede medir, se deja tal cual */ }
}
window.addEventListener('resize', ()=>{
  document.querySelectorAll('.viewer-frame iframe').forEach(fitIframeContent);
});
// El evento 'load' del iframe no siempre llega a tiempo (o en absoluto) según el
// motor/caché, así que además se reintenta por polling hasta que el documento
// interno esté listo — barato e inofensivo si ya se aplicó por el evento.
function scheduleFit(iframe){
  if(!iframe) return;
  iframe.addEventListener('load', ()=>fitIframeContent(iframe));
  let attempts = 0;
  (function tryFit(){
    attempts++;
    let ready = false;
    try{ ready = !!(iframe.contentDocument && iframe.contentDocument.readyState === 'complete'); }catch(e){ return; }
    if(ready) fitIframeContent(iframe);
    if(attempts < 20) setTimeout(tryFit, 100);
  })();
}

function viewerFrameHTML(v, pdfContainerId){
  if(v.kind === 'pdf'){
    return `
      <div class="viewer-frame">
        <div class="viewer-toolbar"><span>ARCHIVO PDF ORIGINAL</span><a href="${resolveAsset(v.file)}" target="_blank">Abrir en pestaña nueva ↗</a></div>
        <div class="pdf-viewer" id="${pdfContainerId}"><div class="pdf-loading">Cargando documento…</div></div>
      </div>
    `;
  } else if(v.kind === 'html'){
    return `
      <div class="viewer-frame">
        <div class="viewer-toolbar"><span>MICROSITIO — NAVEGABLE</span><a href="${resolveAsset(v.file)}" target="_blank">Abrir en pestaña nueva ↗</a></div>
        <iframe src="${resolveAsset(v.file)}" title="${v.label}"></iframe>
      </div>
    `;
  } else if(v.kind === 'video'){
    return `
      <div class="viewer-frame">
        <div class="viewer-toolbar"><span>VIDEO</span></div>
        <video src="${resolveAsset(v.file)}" controls preload="metadata"></video>
      </div>
    `;
  } else if(v.kind === 'iframe-external'){
    return `
      <div class="viewer-frame">
        <div class="viewer-toolbar"><span>SITIO EN PRODUCCIÓN</span><a href="${v.url}" target="_blank">Abrir en pestaña nueva ↗</a></div>
        <iframe src="${v.url}" title="sitio en vivo"></iframe>
      </div>
    `;
  } else if(v.kind === 'live-note' || v.kind === 'live'){
    return `
      <div class="viewer-frame" style="min-height:200px; display:flex; align-items:center; justify-content:center; padding:48px;">
        <p style="color:var(--tenue); text-align:center; max-width:480px; font-size:15px;">${v.label}</p>
      </div>
    `;
  } else if(v.kind === 'image'){
    return `
      <div class="viewer-frame">
        <div class="viewer-toolbar"><span>IMAGEN</span><a href="${resolveAsset(v.file)}" target="_blank">Abrir en pestaña nueva ↗</a></div>
        <div class="pdf-viewer"><img src="${resolveAsset(v.file)}" alt="${v.label}" style="max-width:100%; height:auto; display:block; margin:0 auto; border-radius:6px; box-shadow:0 6px 24px rgba(0,23,12,.15);"></div>
      </div>
    `;
  }
  return '';
}

function renderViewer(p){
  const v = p.viewers[dossierActiveViewerIdx];
  const frame = document.getElementById('viewerFrame');
  if(!frame) return;
  frame.innerHTML = viewerFrameHTML(v, 'pdfContainer');
  if(v.kind === 'pdf') renderPdfPages(v.file, 'pdfContainer');
  if(v.kind === 'html'){
    const iframe = frame.querySelector('iframe');
    if(iframe) scheduleFit(iframe);
  }
}

// ============================================================
// COMPARACIÓN LADO A LADO (origen ↔ resultado)
// ============================================================
let compareIdx = {left:0, right:0};

function renderCompareSide(piece, side){
  const v = piece.viewers[compareIdx[side]];
  const containerId = side === 'left' ? 'viewerFrameLeft' : 'viewerFrameRight';
  const pdfId = side === 'left' ? 'pdfContainerLeft' : 'pdfContainerRight';
  const frame = document.getElementById(containerId);
  if(!frame) return;
  frame.innerHTML = viewerFrameHTML(v, pdfId);
  if(v.kind === 'pdf') renderPdfPages(v.file, pdfId);
  if(v.kind === 'html'){
    const iframe = frame.querySelector('iframe');
    if(iframe) scheduleFit(iframe);
  }
}

function renderCompareView(origen, resultado){
  const view = document.getElementById('compareView');
  view.innerHTML = `
    <div class="sync-indicator" id="syncIndicator"></div>
    <div class="compare-grid">
      <div class="compare-col">
        <div class="compare-label"><span class="ic-badge badge-legado">ORIGEN</span>${origen.title}</div>
        ${origen.viewers.length>1 ? `<div class="viewer-tabs compare-tabs" data-side="left">${origen.viewers.map((v,i)=>`<button class="vt-btn ${i===compareIdx.left?'is-on':''}" data-idx="${i}">${v.label.length>22?v.label.slice(0,22)+'…':v.label}</button>`).join('')}</div>` : ''}
        <div id="viewerFrameLeft"></div>
      </div>
      <div class="compare-col">
        <div class="compare-label"><span class="ic-badge badge-actual">RESULTADO</span>${resultado.title}</div>
        ${resultado.viewers.length>1 ? `<div class="viewer-tabs compare-tabs" data-side="right">${resultado.viewers.map((v,i)=>`<button class="vt-btn ${i===compareIdx.right?'is-on':''}" data-idx="${i}">${v.label.length>22?v.label.slice(0,22)+'…':v.label}</button>`).join('')}</div>` : ''}
        <div id="viewerFrameRight"></div>
      </div>
    </div>
  `;
  view.querySelectorAll('.compare-tabs').forEach(tabGroup=>{
    const side = tabGroup.dataset.side;
    tabGroup.querySelectorAll('.vt-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        tabGroup.querySelectorAll('.vt-btn').forEach(b=>b.classList.toggle('is-on', b===btn));
        compareIdx[side] = parseInt(btn.dataset.idx, 10);
        renderCompareSide(side==='left' ? origen : resultado, side);
        maybeWireSync(origen, resultado);
      });
    });
  });
  renderCompareSide(origen, 'left');
  renderCompareSide(resultado, 'right');
  maybeWireSync(origen, resultado);
}

function maybeWireSync(origen, resultado){
  const indicator = document.getElementById('syncIndicator');
  const lv = origen.viewers[compareIdx.left];
  const rv = resultado.viewers[compareIdx.right];
  if(lv.kind === 'html' && rv.kind === 'html'){
    setTimeout(()=>{
      const leftIframe = document.querySelector('#viewerFrameLeft iframe');
      const rightIframe = document.querySelector('#viewerFrameRight iframe');
      if(leftIframe && rightIframe) wireScrollSync(leftIframe, rightIframe);
    }, 50);
    if(indicator) indicator.innerHTML = `<span class="dot"></span>Scroll sincronizado entre ambos paneles`;
  } else {
    if(indicator) indicator.innerHTML = '';
  }
}

let _syncToken = 0;
function wireScrollSync(leftIframe, rightIframe){
  const myToken = ++_syncToken;
  let lastLeft = null, lastRight = null;
  function loop(){
    if(myToken !== _syncToken) return;
    if(!leftIframe.isConnected || !rightIframe.isConnected) return;
    try{
      const lw = leftIframe.contentWindow, rw = rightIframe.contentWindow;
      const lEl = leftIframe.contentDocument.documentElement;
      const rEl = rightIframe.contentDocument.documentElement;
      const lMax = lEl.scrollHeight - lw.innerHeight;
      const rMax = rEl.scrollHeight - rw.innerHeight;
      if(lMax > 0 && rMax > 0){
        const ly = lw.scrollY, ry = rw.scrollY;
        if(lastLeft === null){ lastLeft = ly; lastRight = ry; }
        if(ly !== lastLeft){
          rw.scrollTo(0, (ly / lMax) * rMax);
          lastLeft = ly; lastRight = rw.scrollY;
        } else if(ry !== lastRight){
          lw.scrollTo(0, (ry / rMax) * lMax);
          lastRight = ry; lastLeft = lw.scrollY;
        }
      }
    }catch(e){ return; /* cross-origin: dejar de sincronizar */ }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// ============================================================
// SLIDER DE ARRASTRE (origen ↔ resultado superpuestos)
// ============================================================
function viewerBareHTML(v, pdfContainerId){
  if(v.kind === 'pdf'){
    return `<div class="sc-pdf" id="${pdfContainerId}"><div class="pdf-loading">Cargando documento…</div></div>`;
  } else if(v.kind === 'html'){
    return `<iframe src="${resolveAsset(v.file)}" title="${v.label}"></iframe>`;
  } else if(v.kind === 'video'){
    return `<video src="${resolveAsset(v.file)}" controls preload="metadata"></video>`;
  } else if(v.kind === 'iframe-external'){
    return `<iframe src="${v.url}" title="sitio en vivo"></iframe>`;
  } else if(v.kind === 'live-note' || v.kind === 'live'){
    return `<div style="display:flex;align-items:center;justify-content:center;height:100%;padding:24px;"><p style="color:var(--tenue);text-align:center;">${v.label}</p></div>`;
  } else if(v.kind === 'image'){
    return `<div class="sc-pdf"><img src="${resolveAsset(v.file)}" alt="${v.label}" style="max-width:100%; height:auto; display:block; margin:0 auto; border-radius:6px; box-shadow:0 6px 24px rgba(0,23,12,.15);"></div>`;
  }
  return '';
}

function renderSliderView(origen, resultado){
  const view = document.getElementById('sliderView');
  if(!view) return;
  const edTabsHTML = (piece, side)=> piece.viewers.length>1 ? `
    <div class="sc-edition-tabs" data-side="${side}">
      ${piece.viewers.map((v,i)=>`<button class="sc-ed-btn ${i===compareIdx[side]?'is-on':''}" data-idx="${i}">${v.label}</button>`).join('')}
    </div>` : '';
  view.innerHTML = `
    <div class="slide-compare" id="sliderStage" style="--split:50%;">
      <div class="sc-pane sc-bottom" id="sliderBottom"></div>
      <div class="sc-pane sc-top" id="sliderTop"></div>
      <div class="sc-badge sc-badge-left"><span class="ic-badge badge-legado">ORIGEN</span>${edTabsHTML(origen,'left')}</div>
      <div class="sc-badge sc-badge-right"><span class="ic-badge badge-actual">RESULTADO</span>${edTabsHTML(resultado,'right')}</div>
      <div class="sc-hint" id="sliderHint">Arrastra para comparar</div>
      <div class="sc-handle" id="sliderHandle" tabindex="0" role="slider" aria-label="Deslizar para comparar origen y resultado" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
        <div class="sc-grip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 8l-4 4 4 4M16 8l4 4-4 4"/></svg></div>
      </div>
    </div>
  `;
  renderSliderSide(origen, resultado, 'left');
  renderSliderSide(origen, resultado, 'right');
  view.querySelectorAll('.sc-edition-tabs').forEach(group=>{
    const side = group.dataset.side;
    group.querySelectorAll('.sc-ed-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        if(btn.classList.contains('is-on')) return;
        compareIdx[side] = parseInt(btn.dataset.idx, 10);
        group.querySelectorAll('.sc-ed-btn').forEach((b,i)=>b.classList.toggle('is-on', i===compareIdx[side]));
        renderSliderSide(origen, resultado, side);
      });
    });
  });
  initSliderDrag(document.getElementById('sliderStage'), document.getElementById('sliderHandle'));
}

function renderSliderSide(origen, resultado, side){
  const piece = side==='left' ? origen : resultado;
  const paneId = side==='left' ? 'sliderTop' : 'sliderBottom';
  const pdfId = side==='left' ? 'pdfContainerSliderTop' : 'pdfContainerSliderBottom';
  const pane = document.getElementById(paneId);
  if(!pane) return;
  const v = piece.viewers[compareIdx[side]] || piece.viewers[0];
  pane.innerHTML = viewerBareHTML(v, pdfId);
  if(v.kind === 'pdf') renderPdfPages(v.file, pdfId);
  if(v.kind === 'html') scheduleFit(pane.querySelector('iframe'));
}

function initSliderDrag(stage, handle){
  if(!stage || !handle) return;
  let dragging = false;
  const hint = document.getElementById('sliderHint');
  function setSplit(clientX){
    const r = stage.getBoundingClientRect();
    let pct = ((clientX - r.left) / r.width) * 100;
    pct = Math.max(4, Math.min(96, pct));
    stage.style.setProperty('--split', pct.toFixed(1) + '%');
    handle.setAttribute('aria-valuenow', String(Math.round(pct)));
    if(hint) hint.style.opacity = '0';
  }
  handle.addEventListener('pointerdown', (e)=>{ dragging = true; handle.setPointerCapture(e.pointerId); e.preventDefault(); });
  stage.addEventListener('pointerdown', (e)=>{
    if(handle.contains(e.target) || e.target.closest('.sc-edition-tabs')) return;
    dragging = true;
    setSplit(e.clientX);
  });
  window.addEventListener('pointermove', (e)=>{ if(dragging) setSplit(e.clientX); });
  window.addEventListener('pointerup', ()=>{ dragging = false; });
  handle.addEventListener('keydown', (e)=>{
    const cur = parseFloat(stage.style.getPropertyValue('--split')) || 50;
    if(e.key==='ArrowLeft'){ setSplit(stage.getBoundingClientRect().left + stage.getBoundingClientRect().width*(Math.max(4,cur-5)/100)); e.preventDefault(); }
    if(e.key==='ArrowRight'){ setSplit(stage.getBoundingClientRect().left + stage.getBoundingClientRect().width*(Math.min(96,cur+5)/100)); e.preventDefault(); }
  });
}

function renderViewerCustomFile(file){
  const frame = document.getElementById('viewerFrame');
  if(!frame) return;
  document.querySelectorAll('.vt-btn').forEach(b=>b.classList.remove('is-on'));
  frame.innerHTML = `
    <div class="viewer-frame">
      <div class="viewer-toolbar"><span>VARIANTE SELECCIONADA</span><a href="${resolveAsset(file)}" target="_blank">Abrir en pestaña nueva ↗</a></div>
      <iframe src="${resolveAsset(file)}" title="variante"></iframe>
    </div>
  `;
  const iframe = frame.querySelector('iframe');
  if(iframe) scheduleFit(iframe);
  frame.scrollIntoView({behavior:'smooth', block:'nearest'});
}

// ============================================================
// VISOR DE PDF VÍA PDF.JS (archivo local, no CDN externo)
// ============================================================
let _pdfjsLoaded = false;
function ensurePdfJs(){
  return new Promise((resolve, reject)=>{
    if(_pdfjsLoaded && window.pdfjsLib){ resolve(); return; }
    const script = document.createElement('script');
    script.src = "vendor/pdf.min.js";
    script.onload = ()=>{
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js";
      _pdfjsLoaded = true;
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function renderPdfPages(assetPath, containerId){
  const container = document.getElementById(containerId);
  try{
    await ensurePdfJs();
    const dataUrl = resolveAsset(assetPath);
    const loadingTask = window.pdfjsLib.getDocument(dataUrl);
    const pdf = await loadingTask.promise;
    container.innerHTML = '';
    const maxPages = Math.min(pdf.numPages, 12);
    for(let i=1;i<=maxPages;i++){
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({scale: 1.4});
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      container.appendChild(canvas);
      await page.render({canvasContext: ctx, viewport}).promise;
    }
    if(pdf.numPages > maxPages){
      const note = document.createElement('p');
      note.style.textAlign = 'center';
      note.style.fontSize = '12px';
      note.style.color = 'var(--tenue)';
      note.style.fontFamily = 'var(--mono)';
      note.textContent = `Mostrando las primeras ${maxPages} páginas de ${pdf.numPages}.`;
      container.appendChild(note);
    }
  }catch(err){
    container.innerHTML = `<div class="pdf-loading">No se pudo previsualizar el documento aquí. Usa "Abrir en pestaña nueva" arriba.</div>`;
    console.error('Error renderizando PDF:', err);
  }
}
