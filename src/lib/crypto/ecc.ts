/**
 * Elliptic Curve Cryptography (ECC) over Finite Field F_p
 * Weierstrass form: y^2 ≡ x^3 + ax + b (mod p)
 * Condition for non-singularity: 4a^3 + 27b^2 != 0 (mod p)
 * Operations: Point addition, Point doubling, Scalar multiplication (kP)
 */

import { modInverse26 } from "./affine"

export interface ECPoint {
  x: number
  y: number
}

export type PointOrInf = ECPoint | null // null represents the point at infinity O

export interface ECCurve {
  a: number
  b: number
  p: number
}

// Check non-singularity: 4a^3 + 27b^2 != 0 (mod p)
export function isCurveNonSingular(curve: ECCurve): boolean {
  const { a, b, p } = curve
  const disc = (4 * a * a * a + 27 * b * b) % p
  return (disc + p) % p !== 0
}

// Verify if a point lies on the curve: y^2 ≡ x^3 + ax + b (mod p)
export function isPointOnCurve(point: PointOrInf, curve: ECCurve): boolean {
  if (point === null) return true // Infinity is on the curve
  const { a, b, p } = curve
  const lhs = (point.y * point.y) % p
  const rhs = ((point.x * point.x * point.x) + a * point.x + b) % p
  return ((lhs % p) + p) % p === ((rhs % p) + p) % p
}

// Modular inverse mod p using Extended Euclidean algorithm
function modInv(val: number, p: number): number | null {
  return modInverse26(val, p)
}

// Point Addition: P + Q
export function ecAdd(p1: PointOrInf, p2: PointOrInf, curve: ECCurve): PointOrInf {
  if (p1 === null) return p2
  if (p2 === null) return p1

  const { a, p } = curve

  // If x1 == x2 and y1 == -y2 mod p, result is infinity
  if (p1.x === p2.x && (p1.y + p2.y) % p === 0) {
    return null
  }

  let lambda: number
  if (p1.x === p2.x && p1.y === p2.y) {
    // Point Doubling: lambda = (3*x1^2 + a) / (2*y1) mod p
    if (p1.y === 0) return null
    const num = (3 * p1.x * p1.x + a) % p
    const den = (2 * p1.y) % p
    const invDen = modInv(((den % p) + p) % p, p)
    if (invDen === null) return null
    lambda = (((num * invDen) % p) + p) % p
  } else {
    // Point Addition: lambda = (y2 - y1) / (x2 - x1) mod p
    const num = (p2.y - p1.y) % p
    const den = (p2.x - p1.x) % p
    const invDen = modInv(((den % p) + p) % p, p)
    if (invDen === null) return null
    lambda = (((num * invDen) % p) + p) % p
  }

  // x3 = lambda^2 - x1 - x2 mod p
  let x3 = (lambda * lambda - p1.x - p2.x) % p
  x3 = ((x3 % p) + p) % p

  // y3 = lambda*(x1 - x3) - y1 mod p
  let y3 = (lambda * (p1.x - x3) - p1.y) % p
  y3 = ((y3 % p) + p) % p

  return { x: x3, y: y3 }
}

// Scalar Multiplication: k * P (Double-and-Add)
export function ecMultiply(k: number, point: PointOrInf, curve: ECCurve): PointOrInf {
  if (k === 0 || point === null) return null
  if (k < 0) {
    // -P = (x, -y mod p)
    const negPoint = { x: point.x, y: ((curve.p - point.y) % curve.p) }
    return ecMultiply(-k, negPoint, curve)
  }

  let result: PointOrInf = null
  let addend: PointOrInf = point
  let tempK = k

  while (tempK > 0) {
    if (tempK & 1) {
      result = ecAdd(result, addend, curve)
    }
    addend = ecAdd(addend, addend, curve)
    tempK >>>= 1
  }

  return result
}

// Enumerate all rational points (x, y) on the curve over F_p
export function findCurvePoints(curve: ECCurve): ECPoint[] {
  const points: ECPoint[] = []
  const { a, b, p } = curve
  for (let x = 0; x < p; x++) {
    const rhs = (((x * x * x) + a * x + b) % p + p) % p
    for (let y = 0; y < p; y++) {
      if ((y * y) % p === rhs) {
        points.push({ x, y })
      }
    }
  }
  return points
}
