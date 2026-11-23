// web/toon.js
import * as THREE from 'three';

let sharedGrad = null;
export function getToonGradient() {
  if (sharedGrad) return sharedGrad;
  const data = new Uint8Array([
    82, 82, 86, 255,
    176, 176, 180, 255,
    255, 255, 255, 255,
  ]);
  const tex = new THREE.DataTexture(data, 3, 1);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  sharedGrad = tex;
  return tex;
}

export function toonMat(opts = {}) {
  return new THREE.MeshToonMaterial({
    gradientMap: getToonGradient(),
    ...opts,
  });
}

export function createCardNdMaterial(map) {
  return new THREE.ShaderMaterial({
    uniforms: { map: { value: map } },
    vertexShader: `
      varying vec2 vUv;
      varying float vD;
      void main() {
        vUv = uv;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vD = -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      varying vec2 vUv;
      varying float vD;
      void main() {
        if (texture2D(map, vUv).a < 0.45) discard;
        gl_FragColor = vec4(0.0, 0.0, 0.0, vD);
      }
    `,
    side: THREE.DoubleSide,
  });
}

export function createToonInkPipeline(renderer, scene, camera, width, height) {
  const rtColor = new THREE.WebGLRenderTarget(width, height, {
    samples: 4,
    type: THREE.HalfFloatType,
  });
  const rtNd = new THREE.WebGLRenderTarget(width, height, {
    type: THREE.HalfFloatType,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
  });

  const ndMat = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vN;
      varying float vD;
      void main() {
        vN = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vD = -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3 vN;
      varying float vD;
      void main() {
        vec3 n = normalize(vN);
        if (!gl_FrontFacing) n = -n;
        gl_FragColor = vec4(n * 0.5 + 0.5, vD);
      }
    `,
    side: THREE.DoubleSide,
  });

  const inkUniforms = {
    col: { value: rtColor.texture },
    nd: { value: rtNd.texture },
    res: { value: new THREE.Vector2(width, height) },
    px: { value: 2.35 },
    sat: { value: 1.08 },
    vig: { value: 0.24 },
    lift: { value: new THREE.Color(0x000000) },
    gain: { value: new THREE.Color(0xffffff) },
  };

  const postScene = new THREE.Scene();
  const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const postMat = new THREE.ShaderMaterial({
    uniforms: inkUniforms,
    toneMapped: false,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D col, nd;
      uniform vec2 res;
      uniform float px, sat, vig;
      uniform vec3 lift, gain;
      varying vec2 vUv;

      float edgeAt(vec2 uv, float r) {
        vec4 c = texture2D(nd, uv);
        if (dot(c.rgb, c.rgb) < 0.01) return 0.0;
        float d = c.a;
        vec3 n = c.rgb * 2.0 - 1.0;
        float e = 0.0;
        float rr = r * clamp(6.5 / max(d, 0.5), 0.72, 1.35);
        for (int i = 0; i < 16; i++) {
          float a = float(i) * 0.785398 + (i > 7 ? 0.39 : 0.0);
          float k = i > 7 ? 0.5 : 1.0;
          vec2 o = vec2(cos(a), sin(a)) * rr * k / res;
          vec4 s = texture2D(nd, uv + o);
          float ds = s.a;
          bool isCard = dot(s.rgb, s.rgb) < 0.01;
          if (isCard && ds > 0.0) continue;
          if (isCard) ds = 1e4;
          vec3 ns = s.rgb * 2.0 - 1.0;
          e = max(e, smoothstep(0.005, 0.018, (ds - d) / max(d, 0.05)));
          if (!isCard && abs(ds - d) / max(d, 0.05) < 0.065) {
            e = max(e, smoothstep(0.89, 0.72, dot(n, ns)) * 0.92);
          }
        }
        return e * (1.0 - smoothstep(90.0, 220.0, d) * 0.8);
      }

      void main() {
        vec3 c = texture2D(col, vUv).rgb;
        float e = edgeAt(vUv, px);
        c = mix(c, vec3(0.015, 0.012, 0.018), e);
        float l = dot(c, vec3(0.299, 0.587, 0.114));
        c = mix(vec3(l), c, sat);
        c = c * gain + lift;
        vec2 q = vUv - 0.5;
        c *= 1.0 - vig * dot(q * vec2(1.0, 0.75), q * vec2(1.0, 0.75)) * 2.1;
        gl_FragColor = linearToOutputTexel(vec4(max(c, vec3(0.0)), 1.0));
      }
    `,
  });
  postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat));

  function swapNd(enable) {
    scene.traverse((obj) => {
      if (!obj.isMesh) return;
      if (enable) {
        obj.userData._mat0 = obj.material;
        if (obj.userData.ndSkip || obj.userData.sky) {
          obj.userData._vis0 = obj.visible;
          obj.visible = false;
          return;
        }
        obj.material = obj.userData.nd || ndMat;
      } else {
        if (obj.userData._mat0) {
          obj.material = obj.userData._mat0;
          delete obj.userData._mat0;
        }
        if (obj.userData._vis0 !== undefined) {
          obj.visible = obj.userData._vis0;
          delete obj.userData._vis0;
        }
      }
    });
  }

  function render(grade = {}) {
    inkUniforms.px.value = grade.px ?? 2.35;
    inkUniforms.sat.value = grade.sat ?? 1.08;
    inkUniforms.vig.value = grade.vig ?? 0.24;
    inkUniforms.lift.value.set(grade.lift || '#000000');
    inkUniforms.gain.value.set(grade.gain || '#ffffff');

    renderer.setRenderTarget(rtColor);
    renderer.setClearColor(0x090b10, 1);
    renderer.clear();
    renderer.render(scene, camera);

    const oldFog = scene.fog;
    const oldShadow = renderer.shadowMap.enabled;
    scene.fog = null;
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.autoUpdate = false;

    swapNd(true);
    renderer.setRenderTarget(rtNd);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(scene, camera);
    swapNd(false);

    scene.fog = oldFog;
    renderer.shadowMap.enabled = oldShadow;
    renderer.shadowMap.autoUpdate = true;

    renderer.setRenderTarget(null);
    renderer.render(postScene, postCam);
  }

  return { render };
}