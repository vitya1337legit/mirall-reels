import { Effect } from 'postprocessing';

const frag = `
uniform vec2 resolution;
uniform float radius;

float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 px = radius / resolution;
  vec3 best = inputColor.rgb;
  float bestVar = 1e9;
  for (int q = 0; q < 4; q++) {
    vec2 dir = vec2(q == 0 || q == 3 ? -1.0 : 1.0, q < 2 ? -1.0 : 1.0);
    vec3 sum = vec3(0.0);
    float sumL = 0.0, sumL2 = 0.0;
    for (int i = 0; i < 4; i++) {
      vec2 o = dir * px * (0.35 + float(i) * 0.55);
      vec3 c = texture2D(inputBuffer, uv + o).rgb;
      float l = lum(c);
      sum += c; sumL += l; sumL2 += l * l;
    }
    vec3 mean = sum / 4.0;
    float v = max(0.0, sumL2 / 4.0 - (sumL / 4.0) * (sumL / 4.0));
    if (v < bestVar) { bestVar = v; best = mean; }
  }
  outputColor = vec4(best, inputColor.a);
}
`;

export class KuwaharaEffect extends Effect {
  constructor(radius = 2.0) {
    super('KuwaharaEffect', frag, {
      uniforms: new Map<string, any>([
        ['resolution', { value: [1080, 1920] }],
        ['radius', { value: radius }],
      ]),
    });
  }
}
