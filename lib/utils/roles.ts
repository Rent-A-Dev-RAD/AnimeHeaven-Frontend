// Role hierarchy és jogosultság ellenőrzés

export type UserRole = 'Tulajdonos' | 'Admin' | 'Főszerkesztő' | 'Szerkesztő' | 'Felhasználó';

// Role rangsorok (magasabb érték = több jogosultság)
const ROLE_HIERARCHY: Record<UserRole, number> = {
  'Tulajdonos': 5,
  'Admin': 4,
  'Főszerkesztő': 3,
  'Szerkesztő': 2,
  'Felhasználó': 1,
};

/**
 * Ellenőrzi, hogy a felhasználó role-ja eléri-e a minimálisan szükséges szintet
 */
export function hasRole(userRole: string | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false;
  
  const userLevel = ROLE_HIERARCHY[userRole as UserRole] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole];
  
  return userLevel >= requiredLevel;
}

/**
 * Ellenőrzi, hogy a felhasználónak van-e hozzáférése az admin panelhez
 * (Szerkesztő vagy magasabb szint)
 */
export function canAccessAdmin(userRole: string | undefined): boolean {
  return hasRole(userRole, 'Szerkesztő');
}

/**
 * Ellenőrzi, hogy a felhasználó kezelheti-e a többi felhasználót
 * (Admin vagy Tulajdonos)
 */
export function canManageUsers(userRole: string | undefined): boolean {
  return hasRole(userRole, 'Admin');
}

/**
 * Ellenőrzi, hogy a felhasználó szerkeszthet-e animéket
 * (Szerkesztő vagy magasabb)
 */
export function canEditAnimes(userRole: string | undefined): boolean {
  return hasRole(userRole, 'Szerkesztő');
}

/**
 * Ellenőrzi, hogy a felhasználó törölhet-e animéket
 * (Főszerkesztő vagy magasabb)
 */
export function canDeleteAnimes(userRole: string | undefined): boolean {
  return hasRole(userRole, 'Főszerkesztő');
}

/**
 * Ellenőrzi, hogy a felhasználó a legmagasabb szintű (Tulajdonos)
 */
export function isOwner(userRole: string | undefined): boolean {
  return userRole === 'Tulajdonos';
}
