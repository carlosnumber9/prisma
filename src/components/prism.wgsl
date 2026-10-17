struct Params {
  time: f32,
  aspect: f32,
  seed: f32,
  worldHeight: f32,
  centerY: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

struct BeamPalette {
  blue: vec3f,
  red: vec3f,
  green: vec3f,
  violet: vec3f,
}
@group(0) @binding(1) var<uniform> beamPalette: BeamPalette;

const BACKGROUND = vec3f(0.960588, 0.963725, 0.966275);
const FORWARD = vec3f(-0.04871543, -0.01705040, -0.99866730);
const RIGHT = vec3f(0.99881235, 0.0, -0.04872255);
const UP = vec3f(-0.00083075, 0.99985463, -0.01703015);
const CAMERA = vec3f(0.2, 0.07, 4.1);
const CAMERA_FOCAL_DISTANCE = 4.1;
const GLASS_IOR = 1.645;
const GLASS_REFLECTION_GAIN = 2.7;
const GLASS_ABSORPTION = vec3f(0.025, 0.012, 0.006);
const GLASS_BEVEL_RADIUS = 0.028;
const INTERIOR_FLAG_RED = vec3f(0.84, 0.025, 0.075);
const INTERIOR_FLAG_YELLOW = vec3f(1.0, 0.78, 0.015);
const NORMALS = array<vec3f, 5>(
  vec3f(0.861934, 0.507020, 0.0),
  vec3f(-0.861934, 0.507020, 0.0),
  vec3f(0.0, -1.0, 0.0),
  vec3f(0.0, 0.0, 1.0),
  vec3f(0.0, 0.0, -1.0),
);
const OFFSETS = array<f32, 5>(0.507020, 0.507020, 0.7, 0.48, 0.48);
const INDICES = array<f32, 4>(1.58, 1.39, 1.49, 1.68);
const ENTRY = vec3f(-0.58, 0.014, 0.06);
const INCIDENT = vec3f(0.9014, 0.4327, 0.0180);

struct LightPath {
  exit: vec3f,
  direction: vec3f,
}

struct InteriorPath {
  exit: vec3f,
  direction: vec3f,
  normal: vec3f,
}

fn beamColor(index: u32) -> vec3f {
  let colors = array<vec3f, 4>(beamPalette.blue, beamPalette.red, beamPalette.green, beamPalette.violet);
  return colors[index];
}

fn project(point: vec3f) -> vec2f {
  return vec2f(dot(point, RIGHT), dot(point, UP));
}

// Analytic slab intersections also locate the light's actual exit from the glass.
fn intersect(origin: vec3f, direction: vec3f) -> vec4f {
  var near = -100.0;
  var far = 100.0;
  var nearFace = 0.0;
  var farFace = 0.0;
  for (var index = 0u; index < 5u; index++) {
    let denominator = dot(NORMALS[index], direction);
    let distance = OFFSETS[index] - dot(NORMALS[index], origin);
    if (abs(denominator) < 0.00001) {
      if (distance < 0.0) { return vec4f(-1.0); }
    } else {
      let hit = distance / denominator;
      if (denominator < 0.0 && hit > near) {
        near = hit;
        nearFace = f32(index);
      }
      if (denominator > 0.0 && hit < far) {
        far = hit;
        farFace = f32(index);
      }
    }
  }
  if (near > far || far < 0.0) { return vec4f(-1.0); }
  return vec4f(near, far, nearFace, farFace);
}

fn segmentDistance(point: vec2f, start: vec2f, end: vec2f) -> f32 {
  let edge = end - start;
  return length(point - start - edge * clamp(dot(point - start, edge) / dot(edge, edge), 0.0, 1.0));
}

fn glassDistance(point: vec3f) -> f32 {
  let radius = GLASS_BEVEL_RADIUS;
  let side = max(
    max(dot(NORMALS[0].xy, point.xy), dot(NORMALS[1].xy, point.xy)) - (OFFSETS[0] - radius),
    -point.y - (OFFSETS[2] - radius),
  );
  var triangle = side;
  if (side > 0.0) {
    let top = vec2f(0.0, 1.0 - radius / NORMALS[0].y);
    let bottomY = -0.7 + radius;
    let bottomX = (OFFSETS[0] - radius - NORMALS[0].y * bottomY) / NORMALS[0].x;
    let left = vec2f(-bottomX, bottomY);
    let right = vec2f(bottomX, bottomY);
    triangle = min(segmentDistance(point.xy, top, left),
      min(segmentDistance(point.xy, left, right), segmentDistance(point.xy, right, top)));
  }
  let extrusion = vec2f(triangle, abs(point.z) - (0.48 - radius));
  return length(max(extrusion, vec2f(0.0))) + min(max(extrusion.x, extrusion.y), 0.0) - radius;
}

fn glassNormal(point: vec3f) -> vec3f {
  let epsilon = 0.0003;
  return normalize(vec3f(
    glassDistance(point + vec3f(epsilon, 0.0, 0.0)) - glassDistance(point - vec3f(epsilon, 0.0, 0.0)),
    glassDistance(point + vec3f(0.0, epsilon, 0.0)) - glassDistance(point - vec3f(0.0, epsilon, 0.0)),
    glassDistance(point + vec3f(0.0, 0.0, epsilon)) - glassDistance(point - vec3f(0.0, 0.0, epsilon)),
  ));
}

fn glassSurface(origin: vec3f, direction: vec3f, bounds: vec2f) -> vec4f {
  var travel = bounds.x;
  for (var step = 0u; step < 40u; step++) {
    let point = origin + direction * travel;
    let distance = glassDistance(point);
    if (abs(distance) < 0.00015) {
      return vec4f(glassNormal(point), travel);
    }
    travel += max(distance * 0.95, 0.00005);
    if (travel > bounds.y) { break; }
  }
  return vec4f(0.0, 0.0, 0.0, -1.0);
}

fn interiorPath() -> InteriorPath {
  let direction = normalize(refract(INCIDENT, NORMALS[1], 1.0 / 1.5));
  let crossing = intersect(ENTRY + direction * 0.001, direction);
  let exit = ENTRY + direction * (crossing.y + 0.001);
  return InteriorPath(exit, direction, NORMALS[u32(crossing.w)]);
}

fn lightPath(index: u32) -> LightPath {
  let path = interiorPath();
  let phase = params.seed + f32(index) * 5.7;
  let wander = sin(params.time * 0.13 + phase) * 0.024
    + sin(params.time * 0.073 + phase * 1.8) * 0.018;
  let ior = INDICES[index] + wander;
  let outgoing = normalize(refract(path.direction, -path.normal, ior)
    + vec3f(0.0, 0.0, sin(params.time * 0.09 + phase) * 0.055));
  return LightPath(path.exit, outgoing);
}

fn erf(value: f32) -> f32 {
  let x = abs(value);
  let t = 1.0 / (1.0 + 0.3275911 * x);
  let polynomial = (((((1.061405429 * t - 1.453152027) * t)
    + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t;
  return sign(value) * (1.0 - polynomial * exp(-x * x));
}

// Integrate a radial Gaussian through a finite cylinder along the viewing ray.
// The eye's interval clips scattering to the outside or inside of the crystal.
fn opticalDepth(
  origin: vec3f, direction: vec3f, interval: vec2f,
  start: vec3f, end: vec3f, radius: f32,
) -> f32 {
  let axis = normalize(end - start);
  let length = distance(start, end);
  let relative = origin - start;
  let axialOrigin = dot(relative, axis);
  let axialDirection = dot(direction, axis);
  let perpendicular = relative - axis * axialOrigin;
  let projected = direction - axis * axialDirection;
  let a = max(dot(projected, projected), 0.00001);
  let b = dot(perpendicular, projected);
  let centre = -b / a;
  let closest = perpendicular + projected * centre;
  let radialSquared = dot(closest, closest) / (radius * radius);
  if (radialSquared > 12.0) { return 0.0; }
  var limits = interval;
  if (abs(axialDirection) > 0.00001) {
    let caps = vec2f(-axialOrigin, length - axialOrigin) / axialDirection;
    limits = vec2f(max(limits.x, min(caps.x, caps.y)), min(limits.y, max(caps.x, caps.y)));
  } else if (axialOrigin < 0.0 || axialOrigin > length) {
    return 0.0;
  }
  if (limits.x >= limits.y) { return 0.0; }
  let scale = sqrt(a) / radius;
  let integral = erf((limits.y - centre) * scale) - erf((limits.x - centre) * scale);
  return max(0.0, exp(-radialSquared) * integral * 0.5 / sqrt(a));
}

fn addBeam(
  background: vec3f, origin: vec3f, direction: vec3f, interval: vec2f,
  start: vec3f, end: vec3f, tint: vec3f, radius: f32, white: bool,
) -> vec3f {
  let body = opticalDepth(origin, direction, interval, start, end, radius);
  if (!white) {
    // Layer translucent scattering and coloured glow without a white highlight.
    let glow = opticalDepth(origin, direction, interval, start, end, radius * 2.7);
    let filament = opticalDepth(origin, direction, interval, start, end, radius * 0.45);
    let glowOpacity = (1.0 - exp(-glow * 0.32)) * 0.32;
    let bodyOpacity = (1.0 - exp(-body * 1.65)) * 0.64;
    let filamentOpacity = (1.0 - exp(-filament * 1.4)) * 0.22;
    let glowColor = mix(background, tint, glowOpacity);
    let bodyColor = mix(glowColor, tint, bodyOpacity);
    return mix(bodyColor, tint, filamentOpacity);
  }
  let halo = opticalDepth(origin, direction, interval, start, end, radius * 3.4);
  let core = opticalDepth(origin, direction, interval, start, end, radius * 0.32);
  let color = mix(background, vec3f(0.66, 0.73, 0.77), 1.0 - exp(-halo * 0.17));
  return mix(color, vec3f(1.0), 1.0 - exp(-body * 3.6 - core * 2.0));
}

fn externalLight(background: vec3f, origin: vec3f, direction: vec3f, interval: vec2f) -> vec3f {
  var color = addBeam(background, origin, direction, interval,
    ENTRY - INCIDENT * 9.0, ENTRY, vec3f(1.0), 0.030, true);
  for (var index = 0u; index < 4u; index++) {
    let path = lightPath(index);
    color = addBeam(color, origin, direction, interval,
      path.exit, path.exit + path.direction * 9.0, beamColor(index), 0.023, false);
  }
  return color;
}

fn internalLight(background: vec3f, origin: vec3f, direction: vec3f, length: f32) -> vec3f {
  let path = interiorPath();
  let interval = vec2f(0.0, length);
  let radius = 0.055;
  let body = opticalDepth(origin, direction, interval, ENTRY, path.exit, radius);
  let halo = opticalDepth(origin, direction, interval, ENTRY, path.exit, radius * 2.0);

  // One continuous volume carries red-yellow-red bands in a 1:2:1 ratio.
  let relative = origin - ENTRY;
  let along = dot(direction, path.direction);
  let centre = (along * dot(relative, path.direction) - dot(relative, direction))
    / max(1.0 - along * along, 0.00001);
  let closest = origin + direction * clamp(centre, 0.0, length);
  let bandUp = normalize(cross(vec3f(0.0, 0.0, 1.0), path.direction));
  let across = dot(closest - ENTRY, bandUp) / radius;
  let redBand = smoothstep(0.46, 0.54, abs(across));
  let flagColor = mix(INTERIOR_FLAG_YELLOW, INTERIOR_FLAG_RED, redBand);
  let tint = mix(vec3f(1.0), flagColor, 0.92);
  let color = mix(background, tint, 1.0 - exp(-body * 2.6 - halo * 0.08));
  return mix(color, vec3f(1.0), (1.0 - exp(-body)) * 0.10);
}

fn studioPanel(direction: vec3f, axis: vec3f, size: vec2f, softness: f32) -> f32 {
  let normal = normalize(axis);
  let right = normalize(cross(vec3f(0.0, 1.0, 0.0), normal));
  let up = cross(normal, right);
  let facing = dot(direction, normal);
  if (facing <= 0.0) { return 0.0; }
  let local = abs(vec2f(dot(direction, right), dot(direction, up)) / facing);
  let edges = 1.0 - smoothstep(size, size + softness, local);
  return edges.x * edges.y;
}

fn environment(directionInput: vec3f) -> vec3f {
  let direction = normalize(directionInput);
  // Sparse directional studio lighting keeps the centre clear and the glints sharp.
  let back = studioPanel(direction, vec3f(-0.82, 0.08, 0.57), vec2f(1.35, 1.1), 0.22);
  let fill = studioPanel(direction, vec3f(0.0, -0.707, 0.707), vec2f(0.38, 0.62), 0.18);
  let key = studioPanel(direction, vec3f(0.612, 0.354, 0.707), vec2f(0.5, 0.16), 0.035);
  let floor = 1.0 - smoothstep(-0.22, -0.02, direction.y);
  var radiance = mix(vec3f(0.00025, 0.0003, 0.0004), vec3f(0.006, 0.007, 0.009), floor);
  radiance += vec3f(0.82, 0.84, 0.88) * back * 0.011;
  radiance += vec3f(1.0, 0.97, 0.91) * fill * 0.22;
  radiance += vec3f(0.76, 0.88, 1.0) * key * 20.0;
  return pow(1.0 - exp(-radiance * 4.0), vec3f(1.0 / 2.2));
}

fn glassTransmission(position: vec3f, direction: vec3f, normal: vec3f) -> vec3f {
  var origins: array<vec3f, 6>;
  var directions: array<vec3f, 6>;
  var distances: array<f32, 6>;
  var count = 0u;
  var innerDirection = normalize(refract(direction, normal, 1.0 / GLASS_IOR));
  var innerOrigin = position + innerDirection * 0.001;
  var transmitted = BACKGROUND;

  // Follow total internal reflection instead of filling side faces with a flat tint.
  for (var bounce = 0u; bounce < 6u; bounce++) {
    let crossing = intersect(innerOrigin, innerDirection);
    if (crossing.y <= 0.0) { break; }
    origins[count] = innerOrigin;
    directions[count] = innerDirection;
    distances[count] = crossing.y;
    count++;
    let exit = innerOrigin + innerDirection * crossing.y;
    let exitNormal = normalize(NORMALS[u32(crossing.w)]);
    let leaving = refract(innerDirection, -exitNormal, GLASS_IOR);
    if (dot(leaving, leaving) > 0.001) {
      if (leaving.z < 0.0) {
        transmitted = externalLight(BACKGROUND, exit, leaving, vec2f(0.001, 30.0));
      } else {
        transmitted = mix(BACKGROUND, environment(leaving), 0.28);
      }
      break;
    }
    innerDirection = normalize(reflect(innerDirection, exitNormal));
    innerOrigin = exit + innerDirection * 0.001;
    transmitted = mix(BACKGROUND, environment(innerDirection), 0.28);
  }

  // Resolve the recorded optical path from the environment back towards the eye.
  for (var index = i32(count) - 1; index >= 0; index--) {
    transmitted *= exp(-GLASS_ABSORPTION * distances[u32(index)]);
    transmitted = internalLight(transmitted, origins[u32(index)], directions[u32(index)], distances[u32(index)]);
  }
  return transmitted;
}

fn reflectionReturn(position: vec3f, normal: vec3f) -> f32 {
  // Broad internal returns keep clear glass legible on the pale page background.
  let left = OFFSETS[1] - dot(NORMALS[1], position);
  let right = OFFSETS[0] - dot(NORMALS[0], position);
  let base = OFFSETS[2] - dot(NORMALS[2], position);
  let distances = (vec3f(left, right, base) - 0.10) / 0.055;
  let bands = exp(-distances * distances);
  let returnStrength = max(bands.x, max(bands.y * 0.68, bands.z * 0.38));
  return returnStrength * smoothstep(0.35, 0.95, abs(normal.z));
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  // The canvas spans the page; the prism stays anchored to the opening viewport.
  let point = vec2f((uv.x - 0.5) * params.aspect, params.centerY - uv.y) * params.worldHeight;
  let drift = sin(params.time * 0.24) * 0.035;
  let offset = vec3f(-0.12, drift, 0.0);
  let origin = CAMERA - offset;
  let direction = normalize(FORWARD + (RIGHT * point.x + UP * point.y) / CAMERA_FOCAL_DISTANCE);
  let shadowPoint = (point - project(vec3f(-0.12, -1.05, 0.0))) / vec2f(0.9, 0.13);
  let shadow = exp(-dot(shadowPoint, shadowPoint));
  var color = BACKGROUND - vec3f(0.07, 0.06, 0.05) * shadow;
  let hit = intersect(origin, direction);

  var surface = vec4f(0.0, 0.0, 0.0, -1.0);
  if (hit.x > 0.0) { surface = glassSurface(origin, direction, hit.xy); }
  if (surface.w > 0.0) {
    let position = origin + direction * surface.w;
    let normal = surface.xyz;
    let transmitted = glassTransmission(position, direction, normal);
    let f0 = pow((GLASS_IOR - 1.0) / (GLASS_IOR + 1.0), 2.0);
    let fresnel = f0 + (1.0 - f0) * pow(clamp(1.0 - abs(dot(-direction, normal)), 0.0, 1.0), 5.0);
    let reflected = environment(reflect(direction, normal));
    color = transmitted * (1.0 - fresnel) + reflected * fresnel * GLASS_REFLECTION_GAIN;
    let panel = smoothstep(0.5, 0.82, dot(reflected, vec3f(0.2126, 0.7152, 0.0722)));
    let returnTone = mix(vec3f(0.25, 0.28, 0.31), reflected, panel);
    color = mix(color, returnTone, reflectionReturn(position, normal) * 0.26);
    // Filter the subpixel grazing edge without drawing a contour around the solid.
    let edgeCoverage = smoothstep(0.0, 0.22, abs(dot(-direction, normal)));
    color = mix(BACKGROUND, color, edgeCoverage);
    // The incoming volume terminates at the entry face, never over the front face.
    color = externalLight(color, origin, direction, vec2f(0.0, surface.w));
  } else {
    color = externalLight(color, origin, direction, vec2f(0.0, 30.0));
  }

  let vignette = 1.0 - smoothstep(0.70, 1.0, abs(uv.x - 0.5) * 2.0);
  color = mix(BACKGROUND, color, vignette);
  return vec4f(clamp(color, vec3f(0.0), vec3f(1.0)), 1.0);
}
