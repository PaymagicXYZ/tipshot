// 2D Physics utilities

export interface Vector2D {
  x: number;
  y: number;
}

export interface PhysicsBody {
  position: Vector2D;
  velocity: Vector2D;
  mass: number;
  radius: number;
  restitution: number;
}

export function distance(a: Vector2D, b: Vector2D): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function magnitude(v: Vector2D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function normalize(v: Vector2D): Vector2D {
  const mag = magnitude(v);
  if (mag === 0) return { x: 0, y: 0 };
  return { x: v.x / mag, y: v.y / mag };
}

export function clampMagnitude(v: Vector2D, max: number): Vector2D {
  const mag = magnitude(v);
  if (mag > max) {
    const normalized = normalize(v);
    return { x: normalized.x * max, y: normalized.y * max };
  }
  return v;
}

export function checkCircleCollision(a: PhysicsBody, b: PhysicsBody): boolean {
  const dist = distance(a.position, b.position);
  return dist < (a.radius + b.radius);
}

export function resolveCircleCollision(a: PhysicsBody, b: PhysicsBody): void {
  const dist = distance(a.position, b.position);
  const minDist = a.radius + b.radius;
  
  if (dist >= minDist) return;
  
  // Calculate collision normal
  const dx = b.position.x - a.position.x;
  const dy = b.position.y - a.position.y;
  const normal = normalize({ x: dx, y: dy });
  
  // Separate the objects
  const overlap = minDist - dist;
  const totalMass = a.mass + b.mass;
  const aMove = (b.mass / totalMass) * overlap;
  const bMove = (a.mass / totalMass) * overlap;
  
  a.position.x -= normal.x * aMove;
  a.position.y -= normal.y * aMove;
  b.position.x += normal.x * bMove;
  b.position.y += normal.y * bMove;
  
  // Calculate relative velocity
  const relVelX = a.velocity.x - b.velocity.x;
  const relVelY = a.velocity.y - b.velocity.y;
  const velAlongNormal = relVelX * normal.x + relVelY * normal.y;
  
  // Don't resolve if velocities are separating
  if (velAlongNormal > 0) return;
  
  // Calculate restitution (bounciness)
  const restitution = Math.min(a.restitution, b.restitution);
  
  // Calculate impulse scalar
  const impulse = -(1 + restitution) * velAlongNormal / (1/a.mass + 1/b.mass);
  
  // Apply impulse
  a.velocity.x += (impulse / a.mass) * normal.x;
  a.velocity.y += (impulse / a.mass) * normal.y;
  b.velocity.x -= (impulse / b.mass) * normal.x;
  b.velocity.y -= (impulse / b.mass) * normal.y;
}

export function applyFriction(velocity: Vector2D, friction: number): Vector2D {
  return {
    x: velocity.x * friction,
    y: velocity.y * friction,
  };
}

export function isStationary(velocity: Vector2D, threshold: number = 0.1): boolean {
  return Math.abs(velocity.x) < threshold && Math.abs(velocity.y) < threshold;
}