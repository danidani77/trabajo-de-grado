// ============================================================
// VISTA: CATÁLOGO
// ============================================================
function renderObras(){
  mainEl.innerHTML = `
    <section class="obras-hero">
      <h1>Catálogo de piezas.</h1>
      <p>Cada pieza incluye su documento o sitio de origen y, cuando aplica, el resultado final — abiertos directamente aquí, no solo en captura.</p>
    </section>
    ${CATALOG.map(renderGroup).join('')}
  `;
  document.querySelectorAll('.item-card').forEach(card=>{
    card.addEventListener('click', ()=> openDossier(card.dataset.group, card.dataset.piece));
  });
  requestAnimationFrame(initReveal);
}

function scrollToGroup(id){
  const el = document.getElementById('grp-'+id);
  if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
}

function thumbOrPlaceholder(piece){
  if(piece.thumb) return `<img src="${resolveAsset(piece.thumb)}" alt="${piece.title}">`;
  return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:var(--gris-medio);color:var(--tenue);font-size:13px;font-weight:600;">Ver sitio en vivo</div>`;
}

function renderGroup(g){
  return `
    <section class="grupo-section wrap" id="grp-${g.id}">
      <div class="grupo-head reveal">
        <div class="grupo-title">${g.title}</div>
        <p class="grupo-desc">${g.desc}</p>
      </div>
      <div class="items-row">
        ${g.pieces.map(p => `
          <div class="item-card reveal" data-group="${g.id}" data-piece="${p.id}">
            <div class="ic-media">
              ${thumbOrPlaceholder(p)}
              <span class="ic-tag ${p.isLegacy ? 'tag-antes' : 'tag-despues'}">${p.isLegacy ? 'Antes' : (p.compareWith ? 'Después' : '')}</span>
            </div>
            <div class="ic-info">
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
// DOSSIER
// ============================================================
function findPiece(groupId, pieceId){
  const g = CATALOG.find(x=>x.id===groupId);
  const p = g.pieces.find(x=>x.id===pieceId);
  return {g,p};
}
function findPieceById(pieceId){
  for(const g of CATALOG){
    const p = g.pieces.find(x=>x.id===pieceId);
    if(p) return p;
  }
  return null;
}

let dossierActiveViewerIdx = 0;

function openDossier(groupId, pieceId){
  dossierActiveViewerIdx = 0;
  const {g,p} = findPiece(groupId, pieceId);
  const overlay = document.getElementById('dossierOverlay');

  const before = p.compareWith ? findPieceById(p.compareWith) : null;

  overlay.innerHTML = `
    <nav class="dossier-nav">
      <div style="font-size:13px; font-weight:600; color:var(--tenue);">${g.title}</div>
      <button class="dossier-close" onclick="closeDossier()">Cerrar</button>
    </nav>

    <div class="compare-stage">
      <div class="compare-eyebrow reveal">Pieza ${p.num}</div>
      <div class="compare-title reveal">${p.title}</div>
      ${p.tag ? `<p class="compare-summary reveal">${p.tag}</p>` : ''}
    </div>

    ${before ? renderCompareBlocks(before, p) : ''}

    <div class="viewer-tabs-wrap reveal">
      <div class="viewer-tabs" id="viewerTabs">
        ${p.viewers.map((v,i)=>`<button class="vt-btn ${i===0?'is-on':''}" data-idx="${i}">${v.label}</button>`).join('')}
      </div>
    </div>
    <div class="viewer-embed-wrap"><div id="viewerFrame"></div></div>

    ${p.facts ? `
      <div class="facts-wrap reveal">
        <div class="facts-grid">
          ${p.facts.map(([k,v])=>`<div class="fact-card"><div class="fact-k">${k}</div><div class="fact-v">${v}</div></div>`).join('')}
        </div>
      </div>
    ` : ''}

    ${p.variants ? `
      <div class="variants-wrap reveal">
        <div class="variants-title">Las direcciones estéticas exploradas</div>
        <div class="variants-grid">
          ${p.variants.map(v => `
            <div class="variant-item" data-variant-file="${v.file}">
              <div class="variant-thumb"><img src="${resolveAsset(v.thumb)}" alt="${v.label}"></div>
              <div class="variant-label">${v.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${p.process ? `
      <div class="process-wrap reveal">
        <div class="process-title">Proceso técnico</div>
        ${p.process.map((step,i)=>`
          <div class="process-item">
            <div class="process-num">${String(i+1).padStart(2,'0')}</div>
            <div class="process-text">${step}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}
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
  overlay.querySelectorAll('.variant-item').forEach(item=>{
    item.addEventListener('click', ()=> renderViewerCustomFile(item.dataset.variantFile));
  });

  renderViewer(p);

  // Reveal dentro del overlay (scroll interno)
  const els = overlay.querySelectorAll('.reveal, .reveal-scale');
  if(typeof IntersectionObserver === 'undefined'){
    els.forEach(el=>el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, {threshold:.12, rootMargin:"0px 0px -40px 0px"});
    els.forEach(el=>io.observe(el));
  }
  setTimeout(()=>{ els.forEach(el=>el.classList.add('is-visible')); }, 2500);
}

function renderCompareBlocks(before, after){
  const beforeMedia = before.thumb
    ? `<img src="${resolveAsset(before.thumb)}" alt="${before.title}">`
    : `<div style="aspect-ratio:16/10; display:flex; align-items:center; justify-content:center; background:var(--gris-medio); color:var(--tenue); font-weight:600;">Ver sitio en vivo</div>`;

  const afterMedia = after.thumb
    ? `<img src="${resolveAsset(after.thumb)}" alt="${after.title}">`
    : `<div style="aspect-ratio:16/10; display:flex; align-items:center; justify-content:center; background:#2c2c2e; color:#aaa; font-weight:600;">Ver sitio en vivo, más abajo</div>`;

  return `
    <div class="cmp-block antes reveal-scale">
      <div class="cmp-label">Antes</div>
      <div class="cmp-media">${beforeMedia}</div>
      <p class="cmp-caption">${before.title} — ${before.tag}</p>
    </div>
    <div style="text-align:center; background:var(--antes-bg);"><div class="cmp-arrow">↓</div></div>
    <div class="cmp-block despues reveal-scale">
      <div class="cmp-label">Después</div>
      <div class="cmp-media">${afterMedia}</div>
      <p class="cmp-caption">${after.title} — ${after.tag}</p>
    </div>
  `;
}

function closeDossier(){
  const overlay = document.getElementById('dossierOverlay');
  overlay.classList.remove('is-open');
  overlay.innerHTML = '';
  document.body.style.overflow = '';
}

function renderViewer(p){
  const v = p.viewers[dossierActiveViewerIdx];
  const frame = document.getElementById('viewerFrame');
  if(!frame) return;

  if(v.kind === 'pdf'){
    frame.innerHTML = `
      <div class="viewer-frame">
        <div class="viewer-toolbar"><span>PDF original</span><a href="${resolveAsset(v.file)}" target="_blank">Abrir en pestaña nueva ↗</a></div>
        <div class="pdf-viewer" id="pdfContainer"><div class="pdf-loading">Cargando documento…</div></div>
      </div>
    `;
    renderPdfPages(v.file, 'pdfContainer');
  } else if(v.kind === 'html'){
    frame.innerHTML = `
      <div class="viewer-frame">
        <div class="viewer-toolbar"><span>Micrositio navegable</span><a href="${resolveAsset(v.file)}" target="_blank">Abrir en pestaña nueva ↗</a></div>
        <iframe src="${resolveAsset(v.file)}" title="${v.label}"></iframe>
      </div>
    `;
  } else if(v.kind === 'video'){
    frame.innerHTML = `
      <div class="viewer-frame">
        <div class="viewer-toolbar"><span>Video</span></div>
        <video src="${resolveAsset(v.file)}" controls preload="metadata"></video>
      </div>
    `;
  } else if(v.kind === 'iframe-external'){
    frame.innerHTML = `
      <div class="viewer-frame">
        <div class="viewer-toolbar"><span>Sitio en producción</span><a href="${v.url}" target="_blank">Abrir en pestaña nueva ↗</a></div>
        <iframe src="${v.url}" title="sitio en vivo"></iframe>
      </div>
    `;
  } else if(v.kind === 'live-note' || v.kind === 'live'){
    frame.innerHTML = `
      <div class="viewer-frame" style="min-height:200px; display:flex; align-items:center; justify-content:center; padding:48px;">
        <p style="color:var(--tenue); text-align:center; max-width:480px; font-size:15px;">${v.label}</p>
      </div>
    `;
  }
}

function renderViewerCustomFile(file){
  const frame = document.getElementById('viewerFrame');
  if(!frame) return;
  document.querySelectorAll('.vt-btn').forEach(b=>b.classList.remove('is-on'));
  frame.innerHTML = `
    <div class="viewer-frame">
      <div class="viewer-toolbar"><span>Variante seleccionada</span><a href="${resolveAsset(file)}" target="_blank">Abrir en pestaña nueva ↗</a></div>
      <iframe src="${resolveAsset(file)}" title="variante"></iframe>
    </div>
  `;
  frame.scrollIntoView({behavior:'smooth', block:'nearest'});
}

// ============================================================
// VISOR DE PDF VÍA PDF.JS
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
      note.textContent = `Mostrando las primeras ${maxPages} páginas de ${pdf.numPages}.`;
      container.appendChild(note);
    }
  }catch(err){
    container.innerHTML = `<div class="pdf-loading">No se pudo previsualizar el documento aquí. Usa "Abrir en pestaña nueva" arriba.</div>`;
    console.error('Error renderizando PDF:', err);
  }
}
