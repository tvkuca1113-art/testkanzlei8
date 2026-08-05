/* ==========================================================================
   KANZLEI JASMINA HODZIC — assets/js/scenes.js
   3D-Szenen: Papier-Choreografie, Struktur-Modell, Jahresring.
   Wird von site.js nachgeladen, sobald eine Szene in die Nähe kommt.
   Setzt window.THREE voraus.
   ========================================================================== */
(function () {
  "use strict";
  if (!window.THREE) return;

  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SM = matchMedia('(max-width:1080px)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };

  /* ================================================================
     3D — helles Architekturmodell: Papier, Tinte, Bordeaux
     ================================================================ */
  var SZ=[];
  function buehne(cv,setup,px){
    if(!cv||!window.THREE) return;
    var box=cv.parentElement, rd;
    try{ rd=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true}); }catch(e){ return; }
    rd.setClearColor(0x000000,0); rd.setPixelRatio(Math.min(devicePixelRatio||1,px||1.7));
    rd.shadowMap.enabled=true; rd.shadowMap.type=THREE.PCFSoftShadowMap;
    if(THREE.sRGBEncoding) rd.outputEncoding=THREE.sRGBEncoding;
    var sc=new THREE.Scene(), cam=new THREE.PerspectiveCamera(36,1,0.1,80);
    var st={sc:sc,cam:cam,rd:rd,box:box,mx:0,my:0,gx:0,gy:0,sicht:false,t0:performance.now()};
    box.addEventListener('pointermove',function(e){var r=box.getBoundingClientRect();
      st.mx=(e.clientX-r.left)/r.width-.5; st.my=(e.clientY-r.top)/r.height-.5;});
    box.addEventListener('pointerleave',function(){st.mx=0;st.my=0});
    function size(){var r=box.getBoundingClientRect(),w=Math.max(1,r.width),h=Math.max(1,r.height);
      rd.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();if(st.onSize)st.onSize(w,h);}
    st.tick=setup(st); size(); addEventListener('resize',size);
    new IntersectionObserver(function(e){st.sicht=e[0].isIntersecting},{threshold:0}).observe(box);
    SZ.push(st);
  }
  document.addEventListener('visibilitychange',function(){if(document.hidden)SZ.forEach(function(s){s.sicht=false})});
  (function loop(){requestAnimationFrame(loop);
    for(var i=0;i<SZ.length;i++){var s=SZ[i];if(!s.sicht)continue;
      var t=(performance.now()-s.t0)*.001;
      s.gx+=(s.mx-s.gx)*.05;s.gy+=(s.my-s.gy)*.05;
      s.tick(t,RM?0:1); s.rd.render(s.sc,s.cam);}
  })();

  function licht(sc){
    sc.add(new THREE.HemisphereLight(0xFFFFFF,0xD9D3C4,1.15));
    var d=new THREE.DirectionalLight(0xFFF6E6,1.45);
    d.position.set(4.5,9,5.5); d.castShadow=true;
    d.shadow.mapSize.set(1024,1024);
    d.shadow.camera.left=-7;d.shadow.camera.right=7;d.shadow.camera.top=7;d.shadow.camera.bottom=-7;
    d.shadow.camera.near=1;d.shadow.camera.far=26;d.shadow.radius=4;d.shadow.bias=-0.0011;
    sc.add(d);
    return d;
  }

  /* --- Struktur: weißes Modell, Bordeaux-Bausteine --- */
  function szeneCheck(st){
    var sc=st.sc,cam=st.cam;
    cam.position.set(0,3.4,9.6); cam.lookAt(0,.1,0);
    sc.add(new THREE.HemisphereLight(0xFFFFFF,0x8A8578,0.66));
    var kl2=new THREE.DirectionalLight(0xFFF3E2,0.95);
    kl2.position.set(4,8.5,5); kl2.castShadow=true;
    kl2.shadow.mapSize.set(1024,1024);
    kl2.shadow.camera.left=-6;kl2.shadow.camera.right=6;kl2.shadow.camera.top=6;kl2.shadow.camera.bottom=-6;
    kl2.shadow.camera.near=1;kl2.shadow.camera.far=24;kl2.shadow.radius=4;kl2.shadow.bias=-0.0011;
    sc.add(kl2);
    var boden=new THREE.Mesh(new THREE.PlaneGeometry(40,40), new THREE.ShadowMaterial({opacity:.15}));
    boden.rotation.x=-Math.PI/2; boden.position.y=-1.02; boden.receiveShadow=true; sc.add(boden);

    var grp=new THREE.Group(); sc.add(grp);
    var mWeiss=new THREE.MeshLambertMaterial({color:0xF7F4ED});
    var mWein=new THREE.MeshLambertMaterial({color:0x7C2B34});
    var mGold=new THREE.MeshLambertMaterial({color:0xB08A4A});

    var sockel=new THREE.Mesh(new THREE.CylinderGeometry(1.62,1.74,0.2,6), mWeiss);
    sockel.position.y=-.92; sockel.castShadow=true; sockel.receiveShadow=true; grp.add(sockel);
    var kern=new THREE.Mesh(new THREE.BoxGeometry(.46,1,.46), mGold);
    kern.geometry.translate(0,.5,0); kern.position.y=-.82; kern.castShadow=true; grp.add(kern);

    var BL=[],M=6;
    for(var i=0;i<M;i++){
      var b=new THREE.Mesh(new THREE.BoxGeometry(.58,.34,.58), i%2?mWeiss:mWein);
      b.castShadow=true; b.receiveShadow=true; grp.add(b);
      BL.push({m:b,a:(i/M)*Math.PI*2,an:false,p:0,r:1.18});
    }
    /* Verbindungslinien vom Kern zu jedem Baustein */
    var VB=[];
    for(var v=0;v<M;v++){
      var lg=new THREE.BufferGeometry();
      lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6),3));
      var ln=new THREE.Line(lg, new THREE.LineBasicMaterial({color:0xB08A4A,transparent:true,opacity:0}));
      grp.add(ln); VB.push(ln);
    }
    /* Ring auf dem Sockel */
    var sring=new THREE.Mesh(new THREE.TorusGeometry(1.34,0.01,8,90),
      new THREE.MeshBasicMaterial({color:0x7C2B34,transparent:true,opacity:.42}));
    sring.rotation.x=Math.PI/2; sring.position.y=-.8; grp.add(sring);
    var kz=1;
    window.checkSetzen=function(n,vol){ for(var i=0;i<M;i++)BL[i].an=i<n; kz=.55+Math.min(vol/1200000,1)*2.0; };
    st.onSize=function(w,h){
      var a=Math.max(w/h,0.001), D=9.4;
      var vh2=2*D*Math.tan(18*Math.PI/180), vw2=vh2*a;
      var k=Math.min(vw2/4.4, vh2/3.6)*0.9;
      grp.scale.setScalar(Math.max(0.45, Math.min(1.25, k)));
      cam.position.set(0,D*0.34,D); cam.lookAt(0,-0.1,0);
    };
    return function(t,takt){
      grp.rotation.y=t*.15*takt+st.gx*.75; grp.rotation.x=-st.gy*.18;
      kern.scale.y+=(kz-kern.scale.y)*.07;
      for(var i=0;i<M;i++){
        var b=BL[i]; b.p+=((b.an?1:0)-b.p)*.08;
        var a=b.a+t*.07*takt, r=b.r+(1-b.p)*2.2;
        b.m.position.set(Math.cos(a)*r, -.66+i*.15*b.p+(1-b.p)*1.7, Math.sin(a)*r);
        b.m.rotation.y=-a+(1-b.p)*2;
        b.m.scale.setScalar(.5+b.p*.5);
        b.m.visible=b.p>.03;
        var ar=VB[i].geometry.attributes.position.array;
        ar[0]=0; ar[1]=-.82+kern.scale.y*.5; ar[2]=0;
        ar[3]=b.m.position.x; ar[4]=b.m.position.y; ar[5]=b.m.position.z;
        VB[i].geometry.attributes.position.needsUpdate=true;
        VB[i].material.opacity=b.p*.5;
      }
      sring.rotation.z=t*.2*takt;
    };
  }

  /* --- Jahresring: drehbar, antippbar --- */
  var jahrSetzen=null, jahrGewaehlt=null;
  function szeneJahr(st){
    var sc=st.sc,cam=st.cam;
    sc.add(new THREE.HemisphereLight(0xFFFFFF,0x8A8578,0.62));
    var kl=new THREE.DirectionalLight(0xFFF3E2,0.92);
    kl.position.set(3.5,8,5); kl.castShadow=true;
    kl.shadow.mapSize.set(1024,1024);
    kl.shadow.camera.left=-6;kl.shadow.camera.right=6;kl.shadow.camera.top=6;kl.shadow.camera.bottom=-6;
    kl.shadow.camera.near=1;kl.shadow.camera.far=24;kl.shadow.radius=4;kl.shadow.bias=-0.0011;
    sc.add(kl);
    var boden=new THREE.Mesh(new THREE.PlaneGeometry(50,50), new THREE.ShadowMaterial({opacity:.26}));
    boden.rotation.x=-Math.PI/2; boden.position.y=-.02; boden.receiveShadow=true; sc.add(boden);

    var grp=new THREE.Group(); grp.rotation.x=0.44; sc.add(grp);
    var dreh=new THREE.Group(); grp.add(dreh);          /* dreht sich — enthält Monate */
    var ring=new THREE.Mesh(new THREE.TorusGeometry(2.62,0.013,8,180),
      new THREE.MeshBasicMaterial({color:0xB08A4A,transparent:true,opacity:.4}));
    ring.rotation.x=Math.PI/2; dreh.add(ring);

    var tp=[];
    for(var k=0;k<48;k++){
      var aa=(k/48)*Math.PI*2, gr=k%4===0?.16:.075;
      tp.push(Math.cos(aa)*2.86,0,Math.sin(aa)*2.86, Math.cos(aa)*(2.86+gr),0,Math.sin(aa)*(2.86+gr));
    }
    var tg=new THREE.BufferGeometry();
    tg.setAttribute('position', new THREE.Float32BufferAttribute(tp,3));
    dreh.add(new THREE.LineSegments(tg, new THREE.LineBasicMaterial({color:0xB08A4A,transparent:true,opacity:.45})));

    var MN=[], akt=3, treffer=[];
    for(var i2=0;i2<12;i2++){
      var g=new THREE.BoxGeometry(.26,1,.26); g.translate(0,.5,0);
      var m=new THREE.MeshLambertMaterial({color:0xF7F4ED});
      var b=new THREE.Mesh(g,m); b.castShadow=true; b.receiveShadow=true;
      var a2=(i2/12)*Math.PI*2-Math.PI/2;
      b.position.set(Math.cos(a2)*2.62,0,Math.sin(a2)*2.62);
      b.userData.q=Math.floor(i2/3);
      dreh.add(b); MN.push({m:b,q:Math.floor(i2/3),h:.45,ziel:.45});
      /* unsichtbarer, größerer Trefferbereich fürs Antippen */
      var t2=new THREE.Mesh(new THREE.BoxGeometry(.9,2.2,.9), new THREE.MeshBasicMaterial({visible:false}));
      t2.position.copy(b.position); t2.position.y=.7; t2.userData.q=Math.floor(i2/3);
      dreh.add(t2); treffer.push(t2);
    }
    var zeiger=new THREE.Mesh(new THREE.ConeGeometry(.13,.38,4), new THREE.MeshLambertMaterial({color:0x7C2B34}));
    zeiger.rotation.x=Math.PI; zeiger.castShadow=true; grp.add(zeiger);

    jahrSetzen=function(q){ akt=q; };

    st.onSize=function(w,h){
      var a=Math.max(w/h,0.001), D=11;
      var vh2=2*D*Math.tan(18*Math.PI/180), vw2=vh2*a;
      var k2=Math.min(vw2/(2*(2.62+0.35)), vh2/(2*(2.62+0.35)*Math.sin(0.44)+1.7))*0.9;
      grp.scale.setScalar(Math.max(0.42, Math.min(1.3, k2)));
      cam.position.set(0,D*0.38,D); cam.lookAt(0,-0.1,0);
    };

    /* --- Drehen und Antippen --- */
    var box=st.box, ziehen=false, startX=0, startRot=0, weg=0, schwung=0, rotZiel=0, rotIst=0;
    var ray=new THREE.Raycaster(), maus=new THREE.Vector2();
    function pruefen(cx,cy){
      var r=box.getBoundingClientRect();
      maus.set(((cx-r.left)/r.width)*2-1, -((cy-r.top)/r.height)*2+1);
      ray.setFromCamera(maus,cam);
      var tr=ray.intersectObjects(treffer,false);
      if(tr.length && jahrGewaehlt) jahrGewaehlt(tr[0].object.userData.q);
    }
    box.addEventListener('pointerdown',function(e){
      ziehen=true; startX=e.clientX; startRot=rotZiel; weg=0;
      box.setPointerCapture && box.setPointerCapture(e.pointerId);
    });
    box.addEventListener('pointermove',function(e){
      if(!ziehen) return;
      var d=e.clientX-startX; weg=Math.max(weg,Math.abs(d));
      rotZiel=startRot+d*0.008; schwung=0;
    });
    function los(e){
      if(!ziehen) return;
      ziehen=false;
      if(weg<8 && e.clientX!==undefined) pruefen(e.clientX,e.clientY);
    }
    box.addEventListener('pointerup',los);
    box.addEventListener('pointercancel',function(){ziehen=false});
    box.addEventListener('pointerleave',function(){ziehen=false});

    var zA=0;
    return function(t,takt){
      if(!ziehen) rotZiel+=0.0016*takt;              /* sanfte Eigendrehung */
      rotIst+=(rotZiel-rotIst)*0.1;
      dreh.rotation.y=rotIst;
      for(var q2=0;q2<12;q2++){
        var d2=MN[q2], an=d2.q===akt;
        d2.ziel=an?1.15:0.36; d2.h+=(d2.ziel-d2.h)*.08; d2.m.scale.y=d2.h;
        var c=d2.m.material.color;
        var r3=an?.62:.969,g3=an?.14:.957,b3=an?.19:.929;
        c.r+=(r3-c.r)*.08;c.g+=(g3-c.g)*.08;c.b+=(b3-c.b)*.08;
      }
      var za=((akt*3+1.5)/12)*Math.PI*2-Math.PI/2+rotIst;
      zA+=(za-zA)*.09;
      zeiger.position.set(Math.cos(zA)*1.9,.26,Math.sin(zA)*1.9);
    };
  }

  /* --- Papier-Choreografie: läuft von selbst, reagiert auf Klick --- */
  var papierSetzen=null;
  function szenePapier(st){
    var sc=st.sc,cam=st.cam;
    var key=licht(sc);
    key.intensity=1.4; key.position.set(2.2,11,3.4); key.shadow.radius=6;
    var boden=new THREE.Mesh(new THREE.PlaneGeometry(70,70), new THREE.ShadowMaterial({opacity:.3}));
    boden.rotation.x=-Math.PI/2; boden.position.y=-2.9; boden.receiveShadow=true; sc.add(boden);

    var N = SM?30:44;
    var geo=new THREE.BoxGeometry(1.9,0.035,2.55);          /* spürbar dickeres Blatt */
    var mA=new THREE.MeshLambertMaterial({color:0xFBF9F4});
    var mB=new THREE.MeshLambertMaterial({color:0xE8E3D6});
    var mC=new THREE.MeshLambertMaterial({color:0x8E3540});
    var BL=[], grp=new THREE.Group(); sc.add(grp);
    for(var i=0;i<N;i++){
      var deckel=(i===0||i===N-1);                          /* Bordeaux-Deckel oben und unten */
      var m=new THREE.Mesh(geo, deckel?mC:(i%3===0?mB:mA));
      m.castShadow=true; m.receiveShadow=true; grp.add(m);
      BL.push({m:m,i:i,ph:Math.random()*6.28,
        u:{x:Math.random()-.5,y:Math.random()-.5,z:Math.random()-.5,
           rx:(Math.random()-.5)*2,ry:(Math.random()-.5)*2.8,rz:(Math.random()-.5)*2},
        pos:new THREE.Vector3(), rot:new THREE.Euler()});
    }

    var hoch=false, BR=10, HO=5.6, BASIS=13, distIst=13, hoeheIst=4.2;
    var stufe=-1, zv=new THREE.Vector3(), ze=new THREE.Euler();
    function ziel(k,b){
      var i=b.i, f=N>1?i/(N-1):0;
      if(k===0){                                            /* Chaos */
        zv.set(b.u.x*BR, b.u.y*HO, b.u.z*4.2);
        ze.set(b.u.rx,b.u.ry,b.u.rz);
      }else if(k===1){                                      /* Fächer */
        var a=(f-.5)*2.2;
        zv.set(Math.sin(a)*BR*0.44, -2.2+i*0.052, Math.cos(a)*2.6-1.8);
        ze.set(0,-a,0);
      }else if(k===2){                                      /* Raster */
        var c=hoch?3:Math.ceil(Math.sqrt(N*1.5)), x=i%c, z=Math.floor(i/c), rw=Math.ceil(N/c);
        zv.set((x-(c-1)/2)*2.05, -2.45+(i%3)*0.02, (z-(rw-1)/2)*2.7);
        ze.set(0,0,0);
      }else{                                                /* Stapel — wie von Hand gelegt */
        zv.set(b.u.x*0.13, -2.55+i*0.062, b.u.z*0.13);
        ze.set(0, b.u.y*0.075, 0);
      }
    }
    function neuBerechnen(k){ for(var q=0;q<N;q++){ ziel(k,BL[q]); BL[q].pos.copy(zv); BL[q].rot.copy(ze); } }
    neuBerechnen(0);
    for(var q0=0;q0<N;q0++){ BL[q0].m.position.copy(BL[q0].pos); BL[q0].m.rotation.copy(BL[q0].rot); }

    st.onSize=function(w,h){
      var a=Math.max(w/h,0.001);
      hoch = a < 1.15;
      BR = hoch ? 4.4 : 10;  HO = hoch ? 3.6 : 2.9;
      neuBerechnen(Math.max(stufe,0));
      var vh2=2*BASIS*Math.tan(18*Math.PI/180), vw2=vh2*a;
      var k=Math.min(vw2/(BR+2.6), vh2/(HO*2+2.8))*0.94;
      grp.scale.setScalar(Math.max(0.38, Math.min(1.3, k)));
    };

    var WORT=['Papier.','Übersicht.','Klarheit.','Ordnung.'];
    var wEl=document.getElementById('pp-wort');
    var sEls=[].slice.call(document.querySelectorAll('#pp-stufen .st'));
    papierSetzen=function(k){
      if(k===stufe) return;
      stufe=k; neuBerechnen(k);
      if(wEl) wEl.textContent=WORT[k];
      sEls.forEach(function(e,n){ e.classList.toggle('an', n===k); });
    };
    papierSetzen(0);

    return function(t,takt){
      for(var q=0;q<N;q++){
        var b=BL[q];
        b.m.position.lerp(b.pos,0.062);
        b.m.position.y+=Math.sin(t*.6+b.ph)*0.0016*takt;
        b.m.rotation.x+=(b.rot.x-b.m.rotation.x)*0.062;
        b.m.rotation.y+=(b.rot.y-b.m.rotation.y)*0.062;
        b.m.rotation.z+=(b.rot.z-b.m.rotation.z)*0.062;
      }
      grp.rotation.y=st.gx*0.45+Math.sin(t*.11)*0.05*takt;
      /* Beim Stapel rückt die Kamera heran — man soll die Lagen sehen */
      var dz = (stufe===3) ? 6.4 : (stufe===1 ? 12.2 : BASIS);
      var hz = (stufe===3) ? 1.9 : 4.2;
      distIst  += (dz-distIst)*0.045;
      hoeheIst += (hz-hoeheIst)*0.045;
      cam.position.set(0, hoeheIst - st.gy*1.0, distIst);
      cam.lookAt(0, (stufe===3 ? -1.75 : -0.7), 0);
    };
  }

  function start3d(){
    if(!window.THREE) return;
    buehne($('#pc3'),szenePapier,1.6);
    /* Papier läuft von selbst — Klick übernimmt, Selbstlauf startet danach wieder */
    (function(){
      var sek=$('#papier'), btns=$$('#pp-stufen .st'), k=0, sichtbar=false, timer=null, pause=0;
      new IntersectionObserver(function(e){ sichtbar=e[0].isIntersecting; },{threshold:.25}).observe(sek);
      btns.forEach(function(b,n){ b.addEventListener('click',function(){
        k=n; if(papierSetzen)papierSetzen(k); pause=Date.now()+9000; }); });
      timer=setInterval(function(){
        if(!sichtbar||document.hidden||Date.now()<pause) return;
        k=(k+1)%4; if(papierSetzen)papierSetzen(k);
      }, RM?100000:3200);
    })();
    buehne($('#cc3'),szeneCheck,1.7);
    buehne($('#jc3'),szeneJahr,1.7);
    if(window.__sync) window.__sync();
    var QN=['Vorbereitung','Abschluss','Einreichung','Gestaltung'];
    var jt=$('#jq-t'), js=$('#jq-s');
    var tabs=$$('#jahr-tabs button'), panels=$$('#jahr-panels .jq');
    var stopp=0;
    function setQ(i){
      if(jahrSetzen) jahrSetzen(i);
      if(jt) jt.textContent='Q'+(i+1);
      if(js) js.textContent=QN[i];
      tabs.forEach(function(b,n){b.classList.toggle('an',n===i)});
      panels.forEach(function(pn,n){pn.classList.toggle('an',n===i)});
    }
    jahrGewaehlt=function(q){ setQ(q); stopp=Date.now()+12000; };
    tabs.forEach(function(b,i){ b.addEventListener('click',function(){ setQ(i); stopp=Date.now()+12000; }); });
    var sichtbar=false;
    new IntersectionObserver(function(e){sichtbar=e[0].isIntersecting},{threshold:.25}).observe($('#jahr'));
    var jq=3;
    setInterval(function(){
      if(!sichtbar||document.hidden||Date.now()<stopp) return;
      jq=(jq+1)%4; setQ(jq);
    }, RM?100000:4200);
    setQ(3);
  }

  /* ---------- Start ---------- */
  function start3d() {
    buehne($('#pc3'), szenePapier, 1.6);

    /* Papier läuft von selbst — ein Klick übernimmt, danach läuft es weiter */
    (function () {
      var sek = $('#papier'); if (!sek) return;
      var btns = $$('#pp-stufen .st'), k = 0, sichtbar = false, pause = 0;
      new IntersectionObserver(function (e) { sichtbar = e[0].isIntersecting; }, { threshold: .25 }).observe(sek);
      btns.forEach(function (b, n) {
        b.addEventListener('click', function () {
          k = n; if (papierSetzen) papierSetzen(k); pause = Date.now() + 9000;
        });
      });
      setInterval(function () {
        if (!sichtbar || document.hidden || Date.now() < pause) return;
        k = (k + 1) % 4; if (papierSetzen) papierSetzen(k);
      }, RM ? 100000 : 3200);
    })();

    buehne($('#cc3'), szeneCheck, 1.7);
    buehne($('#jc3'), szeneJahr, 1.7);
    if (window.__sync) window.__sync();

    var QN = ['Vorbereitung', 'Abschluss', 'Einreichung', 'Gestaltung'];
    var jt = $('#jq-t'), js = $('#jq-s');
    var tabs = $$('#jahr-tabs button'), panels = $$('#jahr-panels .jq');
    var stopp = 0;
    function setQ(i) {
      if (jahrSetzen) jahrSetzen(i);
      if (jt) jt.textContent = 'Q' + (i + 1);
      if (js) js.textContent = QN[i];
      tabs.forEach(function (b, n) { b.classList.toggle('an', n === i); b.setAttribute('aria-selected', n === i ? 'true' : 'false'); });
      panels.forEach(function (pn, n) { pn.classList.toggle('an', n === i); });
    }
    jahrGewaehlt = function (q) { setQ(q); stopp = Date.now() + 12000; };
    tabs.forEach(function (b, i) { b.addEventListener('click', function () { setQ(i); stopp = Date.now() + 12000; }); });

    var jsek = $('#jahr');
    if (jsek) {
      var sichtbar2 = false;
      new IntersectionObserver(function (e) { sichtbar2 = e[0].isIntersecting; }, { threshold: .25 }).observe(jsek);
      var jq = 3;
      setInterval(function () {
        if (!sichtbar2 || document.hidden || Date.now() < stopp) return;
        jq = (jq + 1) % 4; setQ(jq);
      }, RM ? 100000 : 4200);
    }
    setQ(3);
  }
  start3d();
})();
