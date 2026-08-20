// ============================================================
// VISTA: CATÁLOGO
// ============================================================
function renderObras(){
  mainEl.innerHTML = `
    <section class="obras-head wrap">
      <div class="hh-kicker"><span class="dot"></span>Registro completo</div>
      <h1 style="font-family:var(--display); font-weight:700; font-size:clamp(30px,4.5vw,48px); line-height:1.08; max-width:820px;">Catálogo de piezas.</h1>
      <p class="hh-body">Cada pieza incluye su documento o sitio de origen y, cuando aplica, el resultado final — abiertos directamente aquí, no solo en captura.</p>
    </section>
    <div class="obras-groups wrap">
      ${CATALOG.map(renderGroup).join('')}
    </div>
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
  return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--tenue);font-size:13px;font-weight:600;">Ver sitio en vivo</div>`;
}

function renderGroup(g){
  return `
    <section class="og-section reveal" id="grp-${g.id}">
      <div class="og-title">${g.title}<span class="og-count">${g.pieces.length} ${g.pieces.length===1?'entrada':'entradas'}</span></div>
      <p class="og-desc">${g.desc}</p>
      <div class="items-grid">
        ${g.pieces.map(p => `
          <div class="item-card" data-group="${g.id}" data-piece="${p.id}">
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

function openDossier(groupId, pieceId){
  dossierActiveViewerIdx = 0;
  const {g,p} = findPiece(groupId, pieceId);
  const overlay = document.getElementById('dossierOverlay');

  overlay.innerHTML = `
    <div class="dossier-topbar">
      <div style="font-family:var(--mono); font-size:12px; color:var(--tenue); text-transform:uppercase; letter-spacing:.04em;">${g.title} · Pieza ${p.num}</div>
      <button class="dossier-close" onclick="closeDossier()">Cerrar ✕</button>
    </div>
    <div class="dossier-body">
      <div class="dossier-eyebrow">Pieza ${p.num}</div>
      <div class="dossier-title">${p.title}</div>
      ${p.tag ? `<p class="dossier-summary">${p.tag}</p>` : ''}

      <div class="viewer-tabs" id="viewerTabs">
        ${p.viewers.map((v,i)=>`<button class="vt-btn ${i===0?'is-on':''}" data-idx="${i}">${v.label.length > 28 ? v.label.slice(0,28)+'…' : v.label}</button>`).join('')}
      </div>
      <div id="viewerFrame"></div>

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

  renderViewer(p);
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
        <div class="viewer-toolbar"><span>ARCHIVO PDF ORIGINAL</span><a href="${resolveAsset(v.file)}" target="_blank">Abrir en pestaña nueva ↗</a></div>
        <div class="pdf-viewer" id="pdfContainer"><div class="pdf-loading">Cargando documento…</div></div>
      </div>
    `;
    renderPdfPages(v.file, 'pdfContainer');
  } else if(v.kind === 'html'){
    frame.innerHTML = `
      <div class="viewer-frame">
        <div class="viewer-toolbar"><span>MICROSITIO — NAVEGABLE</span><a href="${resolveAsset(v.file)}" target="_blank">Abrir en pestaña nueva ↗</a></div>
        <iframe src="${resolveAsset(v.file)}" title="${v.label}"></iframe>
      </div>
    `;
  } else if(v.kind === 'video'){
    frame.innerHTML = `
      <div class="viewer-frame">
        <div class="viewer-toolbar"><span>VIDEO</span></div>
        <video src="${resolveAsset(v.file)}" controls preload="metadata"></video>
      </div>
    `;
  } else if(v.kind === 'iframe-external'){
    frame.innerHTML = `
      <div class="viewer-frame">
        <div class="viewer-toolbar"><span>SITIO EN PRODUCCIÓN</span><a href="${v.url}" target="_blank">Abrir en pestaña nueva ↗</a></div>
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
      <div class="viewer-toolbar"><span>VARIANTE SELECCIONADA</span><a href="${resolveAsset(file)}" target="_blank">Abrir en pestaña nueva ↗</a></div>
      <iframe src="${resolveAsset(file)}" title="variante"></iframe>
    </div>
  `;
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
