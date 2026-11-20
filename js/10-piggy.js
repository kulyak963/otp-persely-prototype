/* ================= 3D piggy (our own design: smooth glossy piggy bank in OTP green) =================
   One WebGL canvas, moved into whichever .pig3d placeholder is on screen.
   Drag to turn, tap to make it jump. Moods: happy, proud, concerned, sleepy. pig3d.celebrate() drops a coin. */
const pig3d = (() => {
  if(!window.THREE) return null;
  const T = THREE;
  const renderer = new T.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = T.sRGBEncoding;
  const canvas = renderer.domElement;
  // The canvas is taller than the slot (HEAD extra above it, transparent, ignores the pointer) so a jump or the falling coin is never cut off.
  // The camera is offset so the resting piggy keeps exactly the same size and place inside the slot.
  const HEAD = 0.55;
  canvas.style.cssText = 'position:absolute;left:0;bottom:0;width:100%;height:' + (100*(1+HEAD)) + '%;display:block;pointer-events:none';
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0.6, 5.5); camera.lookAt(0, -0.1, 0);
  scene.add(new T.HemisphereLight(hexInt(PALETTE.white), hexInt(mixHex(PALETTE.greenL, -.25)), 0.95));
  const key = new T.DirectionalLight(hexInt(PALETTE.white), 0.85); key.position.set(2.5, 3.5, 4); scene.add(key);
  const rim = new T.DirectionalLight(hexInt(PALETTE.greenL), 0.35); rim.position.set(-3, 1.5, -2); scene.add(rim);

  // colours are given as normal web colours; convert so they look the same on screen (not washed out)
  const mat = (color, o = {}) => new T.MeshStandardMaterial(Object.assign({ color:new T.Color(color).convertSRGBToLinear(), roughness:0.35, metalness:0.04 }, o));
  const GREEN = mat(hexInt(PIG.body)), DARK = mat(hexInt(PIG.dark), {roughness:0.5}), LIGHT = mat(hexInt(PIG.snout)),   // the same palette colours as pigSvg (PIG)
        PINK = mat(hexInt(PIG.cheek), {transparent:true, opacity:0.55, roughness:0.8}), INK = mat(hexInt(mixHex(PALETTE.greenDk, -.55)), {roughness:0.3}),
        WHITE = mat(hexInt(PALETTE.white), {roughness:0.2}), SLOT = mat(hexInt(PALETTE.actD), {roughness:0.7}),
        GOLD = mat(hexInt(PIG.gold), {metalness:0.55, roughness:0.28});
  const add = (parent, geo, m, x=0, y=0, z=0) => { const o = new T.Mesh(geo, m); o.position.set(x, y, z); parent.add(o); return o; };

  const root = new T.Group(); scene.add(root);       // turned by the user
  const pigG = new T.Group(); root.add(pigG);        // bobbing / jumping
  // body
  const body = add(pigG, new T.SphereGeometry(1, 56, 40), GREEN); body.scale.set(1.12, 0.98, 1.02);
  add(pigG, new T.BoxGeometry(0.52, 0.05, 0.12), SLOT, 0, 0.975, -0.08);      // coin slot on the back
  // snout
  const snout = add(pigG, new T.SphereGeometry(0.36, 40, 30), LIGHT, 0, -0.06, 0.95); snout.scale.set(1, 0.8, 0.55);
  [-0.12, 0.12].forEach(x => { const n = add(pigG, new T.SphereGeometry(0.06, 20, 16), INK, x, -0.06, 1.14); n.scale.set(0.75, 1.15, 0.5); });
  // eyes (each in a group so it can blink)
  const eyes = [-0.3, 0.3].map(x => {
    const g = new T.Group(); g.position.set(x, 0.34, 0.86); pigG.add(g);
    add(g, new T.SphereGeometry(0.19, 32, 24), WHITE);
    const pupil = add(g, new T.SphereGeometry(0.11, 24, 18), INK, 0, 0.01, 0.12);
    add(g, new T.SphereGeometry(0.035, 12, 10), WHITE, 0.04, 0.06, 0.22);
    g.userData.pupil = pupil; return g;
  });
  // brows, shown when concerned
  const brows = [-1, 1].map(s => { const b = add(pigG, new T.BoxGeometry(0.22, 0.045, 0.05), INK, s*0.34, 0.57, 0.86); b.rotation.z = s * 0.35; b.visible = false; return b; });
  // mouth: half torus, flipped for "concerned"
  const mouth = add(pigG, new T.TorusGeometry(0.1, 0.024, 10, 28, Math.PI), INK, 0, -0.34, 0.95);
  mouth.rotation.z = Math.PI;
  [-1, 1].forEach(s => { const c = add(pigG, new T.SphereGeometry(0.13, 20, 16), PINK, s*0.62, -0.08, 0.74); c.scale.set(1, 0.7, 0.4); });
  // ears: soft petal shapes (not horns)
  const ears = [-1, 1].map(s => {
    const g = new T.Group(); g.position.set(s*0.52, 0.8, 0.2); pigG.add(g);
    const outer = add(g, new T.SphereGeometry(0.24, 32, 24), DARK, 0, 0.2, 0); outer.scale.set(0.95, 1.25, 0.32);
    const inner = add(g, new T.SphereGeometry(0.15, 28, 20), PINK, 0, 0.19, 0.06); inner.scale.set(0.85, 1.1, 0.25);
    g.rotation.z = -s * 0.5; g.rotation.x = 0.25; return g;
  });
  // legs
  [[-0.5,0.45],[0.5,0.45],[-0.5,-0.45],[0.5,-0.45]].forEach(([x,z]) => add(pigG, new T.CylinderGeometry(0.17, 0.2, 0.44, 28), DARK, x, -0.86, z));
  // curly tail
  const tail = add(pigG, new T.TorusGeometry(0.12, 0.035, 10, 30, Math.PI*1.6), DARK, 0, 0.12, -1.1); tail.rotation.y = Math.PI/2;
  // soft shadow on the ground
  const sc = document.createElement('canvas'); sc.width = sc.height = 128;
  const sx = sc.getContext('2d'), gr = sx.createRadialGradient(64,64,4,64,64,62);
  gr.addColorStop(0, rgbaHex(mixHex(PALETTE.greenDk, -.5), .28)); gr.addColorStop(1, rgbaHex(mixHex(PALETTE.greenDk, -.5), 0)); sx.fillStyle = gr; sx.fillRect(0,0,128,128);
  const shadow = new T.Mesh(new T.PlaneGeometry(2.8, 2.8), new T.MeshBasicMaterial({ map:new T.CanvasTexture(sc), transparent:true, depthWrite:false }));
  shadow.rotation.x = -Math.PI/2; shadow.position.y = -1.1; scene.add(shadow);
  // gold coin for celebrate()
  const COIN_Y = 2.3, coin = add(scene, new T.CylinderGeometry(0.22, 0.22, 0.06, 40), GOLD, 0, COIN_Y, -0.08); coin.rotation.x = Math.PI/2; coin.visible = false;

  const BASE_Y = -0.4;   // three-quarter view by default
  root.rotation.y = BASE_Y;
  let mood = 'happy', holder = null, jumpT = -1, coinT = -1, blinkAt = 2, idleAt = 0;
  let dragging = false, lastX = 0, lastY = 0, velY = 0, moved = 0;

  function setMood(m){
    mood = m;
    const concerned = m === 'concerned';
    brows.forEach(b => b.visible = concerned);
    mouth.rotation.z = concerned ? 0 : Math.PI;
    mouth.position.y = concerned ? -0.38 : -0.34;
  }
  function jump(){ jumpT = 0; }
  function celebrate(){ coin.visible = true; coinT = 0; jumpT = -1; }

  // drag / tap handled on the slot (the canvas itself is pointer-transparent, so the headroom never blocks taps)
  const onDown = e => { dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY; velY = 0; try{ e.currentTarget.setPointerCapture(e.pointerId); }catch(_){} e.currentTarget.style.cursor = 'grabbing'; e.stopPropagation(); };
  const onMove = e => {
    if(!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
    velY = dx * 0.012; root.rotation.y += velY;
    root.rotation.x = Math.max(-0.35, Math.min(0.35, root.rotation.x + dy * 0.006));
    idleAt = clock.getElapsedTime() + 2.5;
  };
  const onEnd = e => { if(!dragging) return; dragging = false; e.currentTarget.style.cursor = 'grab'; if(moved < 6) jump(); };
  const onClick = e => e.stopPropagation();
  function bind(el, on){ const f = on ? 'addEventListener' : 'removeEventListener';
    el[f]('pointerdown', onDown); el[f]('pointermove', onMove); el[f]('pointerup', onEnd); el[f]('pointercancel', onEnd); el[f]('click', onClick); }

  function mount(){
    // priority: onboarding, then the update pop-up, then the screen on top
    const el = document.querySelector('.story.on .pig3d') || document.querySelector('.onb.on .pig3d') || document.querySelector('.wn.on .pig3d') || document.querySelector('#back.on #sheet .pig3d') || [...document.querySelectorAll('.view.on .pig3d, .page .pig3d')].pop();
    if(!el){ holder = null; return; }
    if(holder && holder !== el){ bind(holder, false); dragging = false; }
    if(holder !== el){ bind(el, true); el.style.cursor = 'grab'; el.style.touchAction = 'none'; }
    holder = el; setMood(el.dataset.mood || 'happy');
    if(canvas.parentNode !== el) el.appendChild(canvas);
    if(getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.style.overflow = 'visible';
    const w = el.clientWidth || 120, h = el.clientHeight || 120, H = Math.round(h * (1 + HEAD));
    renderer.setSize(w, H, false);
    camera.aspect = w / h; camera.setViewOffset(w, h, 0, -(H - h), w, H);   // taller window, same scale as the slot
  }

  const clock = new T.Clock(), PIG_RM = matchMedia('(prefers-reduced-motion:reduce)');
  function frame(){
    requestAnimationFrame(frame);
    if(!holder || !document.body.contains(canvas) || document.hidden) return;
    const t = PIG_RM.matches ? 0 : clock.getElapsedTime();   // reduced motion: the piggy holds still (taps still make it jump)
    const calm = mood === 'concerned' || mood === 'sleepy';
    // turn: momentum while free, then ease back to the three-quarter view
    if(!dragging){
      root.rotation.y += velY; velY *= 0.92;
      if(t > idleAt){ root.rotation.y += (BASE_Y + Math.sin(t*0.6)*0.12 - root.rotation.y) * 0.03; root.rotation.x *= 0.92; }
    }
    // breathing and bobbing
    let y = Math.sin(t * (calm ? 1.4 : 2.2)) * (calm ? 0.025 : 0.045);
    if(mood === 'proud' && Math.sin(t*1.3) > 0.97 && jumpT < 0) jump();
    if(jumpT >= 0){ jumpT += 0.045; y += Math.sin(Math.min(jumpT,1) * Math.PI) * 0.55; pigG.rotation.y = Math.sin(Math.min(jumpT,1)*Math.PI*2) * 0.25; if(jumpT >= 1){ jumpT = -1; pigG.rotation.y = 0; } }
    pigG.position.y = y;
    const squash = 1 + Math.sin(t * (calm ? 1.4 : 2.2)) * 0.012;
    pigG.scale.set(1/squash, squash, 1/squash);
    pigG.rotation.z = mood === 'concerned' ? 0.12 : Math.sin(t*0.9) * 0.03;
    shadow.scale.setScalar(1 - Math.max(0, y) * 0.5);
    // ears wiggle, eyes blink / sleep, pupils follow the turn a little
    ears.forEach((g, i) => { const s = i ? 1 : -1; g.rotation.z = -s*0.42 + Math.sin(t*3 + i) * (calm ? 0.02 : 0.06); });
    let lid = 1;
    if(mood === 'sleepy') lid = 0.12;
    else { if(t > blinkAt){ blinkAt = t + 2.5 + Math.random()*3; } const d = blinkAt - t; if(d > 2.36) lid = 0.1; }
    eyes.forEach(g => { g.scale.y = lid; g.userData.pupil.position.y = mood === 'concerned' ? 0.05 : 0.01; });
    // coin falls into the slot, then a happy jump
    if(coinT >= 0){
      coinT += 0.03;
      coin.position.y = COIN_Y - Math.min(coinT, 1) * (COIN_Y - 1.02);
      coin.rotation.z += 0.25;
      coin.position.x = 0; coin.position.z = -0.08;
      if(coinT >= 1){ coin.visible = false; coinT = -1; jump(); }
    }
    renderer.render(scene, camera);
  }
  frame();
  // a still portrait of the piggy (used as the sender picture in notifications)
  let avatar = null;
  function snapshot(){
    if(avatar) return avatar;
    const keep = renderer.getSize(new T.Vector2()), aspect = camera.aspect, rx = root.rotation.x, ry = root.rotation.y, py = pigG.position.y;
    root.rotation.set(0, BASE_Y, 0); pigG.position.y = 0; pigG.scale.set(1,1,1); setMood('happy'); eyes.forEach(g => g.scale.y = 1);
    shadow.visible = false; coin.visible = false; camera.clearViewOffset(); renderer.setSize(180, 180, false); camera.aspect = 1; camera.updateProjectionMatrix();
    renderer.render(scene, camera); avatar = canvas.toDataURL('image/png');
    shadow.visible = true; coin.visible = coinT >= 0; renderer.setSize(keep.x, keep.y, false); camera.aspect = aspect; if(holder){ const h = holder.clientHeight || 120; camera.setViewOffset(keep.x, h, 0, -(keep.y - h), keep.x, keep.y); } else camera.updateProjectionMatrix();
    root.rotation.set(rx, ry, 0); pigG.position.y = py; if(holder) setMood(holder.dataset.mood || 'happy');
    return avatar;
  }
  return { mount, setMood, jump, celebrate, snapshot };
})();
function mountPig(){ if(pig3d) pig3d.mount(); }

