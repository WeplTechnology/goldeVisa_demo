/**
 * Verifica si un email pertenece a un dominio de administrador
 */
export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false

  const adminDomains = [
    '@stagfund.com',
    '@goldenvisa.com'
  ]

  return adminDomains.some(domain => email.toLowerCase().endsWith(domain))
}
