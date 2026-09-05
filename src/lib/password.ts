import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number,
  options: { cost: number },
) => Promise<Buffer>

const COST = 16384
const KEY_LENGTH = 64

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const key = await scryptAsync(password, salt, KEY_LENGTH, { cost: COST })

  return `scrypt$${COST}$${salt}$${key.toString('hex')}`
}

export async function verifyPassword(password: string, digest: string) {
  const [scheme, cost, salt, key] = digest.split('$')
  if (scheme !== 'scrypt' || !cost || !salt || !key) {
    return false
  }

  const expected = Buffer.from(key, 'hex')
  const derived = await scryptAsync(password, salt, expected.length, { cost: Number(cost) })

  return timingSafeEqual(expected, derived)
}