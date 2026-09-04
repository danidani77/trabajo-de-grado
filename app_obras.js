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
  return null;
}

function openDossier(groupId, pieceId){
  dossierActiveViewerIdx = 0;
  const {g,p} = findPiece(groupId, pieceId);
  const pair = findComparePair(g,p);
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

      ${pair ? `<button class="compare-toggle" id="compareToggle">⇄ Ver origen y resultado en paralelo</button>` : ''}

      <div id="singleView">
        <div class="viewer-tabs" id="viewerTabs">
          ${p.viewers.map((v,i)=>`<button class="vt-btn ${i===0?'is-on':''}" data-idx="${i}">${v.label.length > 28 ? v.label.slice(0,28)+'…' : v.label}</button>`).join('')}
        </div>
        <div id="viewerFrame"></div>
      </div>
      <div id="compareView" style="display:none"></div>

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

  const compareToggle = document.getElementById('compareToggle');
  if(compareToggle && pair){
    compareToggle.addEventListener('click', ()=>{
      const single = document.getElementById('singleView');
      const compare = document.getElementById('compareView');
      const isComparing = compare.style.display !== 'none';
      if(isComparing){
        compare.style.display = 'none';
        single.style.display = '';
        compareToggle.textContent = '⇄ Ver origen y resultado en paralelo';
        compareToggle.classList.remove('is-active');
      } else {
        single.style.display = 'none';
        compare.style.display = '';
        compareToggle.textContent = '✕ Cerrar comparación';
        compareToggle.classList.add('is-active');
        renderCompareView(pair.origen, pair.resultado);
      }
    });
  }

  renderViewer(p);
}

function closeDossier(){
  const overlay = document.getElementById('dossierOverlay');
  overlay.classList.remove('is-open');
  overlay.innerHTML = '';
  document.body.style.overflow = '';
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
  }
  return '';
}

function renderViewer(p){
  const v = p.viewers[dossierActiveViewerIdx];
  const frame = document.getElementById('viewerFrame');
  if(!frame) return;
  frame.innerHTML = viewerFrameHTML(v, 'pdfContainer');
  if(v.kind === 'pdf') renderPdfPages(v.file, 'pdfContainer');
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
}

function renderCompareView(origen, resultado){
  const view = document.getElementById('compareView');
  compareIdx = {left:0, right:0};
  view.innerHTML = `
    <div class="sync-indicator" id="syncIndicator"></div>
    <div class="compare-grid">
      <div class="compare-col">
        <div class="compare-label"><span class="ic-badge badge-legado">ORIGEN</span>${origen.title}</div>
        ${origen.viewers.length>1 ? `<div class="viewer-tabs compare-tabs" data-side="left">${origen.viewers.map((v,i)=>`<button class="vt-btn ${i===0?'is-on':''}" data-idx="${i}">${v.label.length>22?v.label.slice(0,22)+'…':v.label}</button>`).join('')}</div>` : ''}
        <div id="viewerFrameLeft"></div>
      </div>
      <div class="compare-col">
        <div class="compare-label"><span class="ic-badge badge-actual">RESULTADO</span>${resultado.title}</div>
        ${resultado.viewers.length>1 ? `<div class="viewer-tabs compare-tabs" data-side="right">${resultado.viewers.map((v,i)=>`<button class="vt-btn ${i===0?'is-on':''}" data-idx="${i}">${v.label.length>22?v.label.slice(0,22)+'…':v.label}</button>`).join('')}</div>` : ''}
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
