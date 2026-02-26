# Role-Based Access Control (RBAC)

Az AnimeHeaven role-alapú hozzáférés-vezérlést (RBAC) használ a különböző jogosultsági szintek kezelésére.

## Szerepkörök (Role-ok)

A rendszer 5 különböző szerepkört támogat:

| Szerepkör | Szint | Leírás |
|-----------|-------|--------|
| **Tulajdonos** | 5 | Teljes hozzáférés minden funkcióhoz |
| **Admin** | 4 | Felhasználók és animék kezelése |
| **Főszerkesztő** | 3 | Animék hozzáadása, szerkesztése és törlése |
| **Szerkesztő** | 2 | Animék hozzáadása és szerkesztése |
| **Felhasználó** | 1 | Alapértelmezett felhasználói jogok |

## Jogosultságok

### Admin Panel hozzáférés
- **Minimális szint:** Szerkesztő (2)
- **Elérhető:** Szerkesztő, Főszerkesztő, Admin, Tulajdonos
- **Funkció:** `canAccessAdmin(userRole)`

### Felhasználók kezelése
- **Minimális szint:** Admin (4)
- **Elérhető:** Admin, Tulajdonos
- **Funkció:** `canManageUsers(userRole)`
- **Mit lehet csinálni:**
  - Felhasználók megtekintése
  - Szerepkörök módosítása
  - Felhasználók törlése

### Animék szerkesztése
- **Minimális szint:** Szerkesztő (2)
- **Elérhető:** Szerkesztő, Főszerkesztő, Admin, Tulajdonos
- **Funkció:** `canEditAnimes(userRole)`
- **Mit lehet csinálni:**
  - Anime adatok szerkesztése
  - Epizódok hozzáadása
  - Cover képek módosítása

### Animék törlése
- **Minimális szint:** Főszerkesztő (3)
- **Elérhető:** Főszerkesztő, Admin, Tulajdonos
- **Funkció:** `canDeleteAnimes(userRole)`

## Használat

### Helper függvények

```typescript
import { 
  canAccessAdmin, 
  canManageUsers, 
  canEditAnimes, 
  canDeleteAnimes,
  hasRole 
} from '@/lib/utils/roles';

// Példa komponensben
const { user } = useAuth();

// Admin panel megjelenítése
{canAccessAdmin(user?.role) && (
  <Link href="/admin">Admin</Link>
)}

// Felhasználók kezelése
{canManageUsers(user?.role) && (
  <Link href="/admin/manage-profiles">Felhasználók</Link>
)}

// Törlés gomb megjelenítése
{canDeleteAnimes(user?.role) && (
  <Button onClick={handleDelete}>Törlés</Button>
)}
```

### Védett oldalak

```typescript
"use client";

import { useAuth } from '@/lib/contexts/AuthContext';
import { canAccessAdmin } from '@/lib/utils/roles';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !canAccessAdmin(user?.role)) {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  return (
    // ... oldal tartalma
  );
}
```

## Backend integráció

A backend-en ugyanezeket a szerepköröket kell használni:

**Backend role mapping:**
```json
{
  "Tulajdonos": 5,
  "Admin": 4,
  "Főszerkesztő": 3,
  "Szerkesztő": 2,
  "Felhasználó": 1
}
```

**Példa backend válasz:**
```json
{
  "user": {
    "id": "123",
    "username": "admin",
    "email": "admin@example.com",
    "role": "Admin"
  }
}
```

## Láthatóság szabályok

### Header menü
- **Kezdőlap** - Mindenki
- **Random anime** - Mindenki
- **Kategóriák** - Mindenki
- **Admin** - Csak Szerkesztő vagy magasabb

### Admin Panel
- **Anime hozzáadása** - Szerkesztő vagy magasabb
- **Animék kezelése** - Szerkesztő vagy magasabb
- **Felhasználók kezelése** - Csak Admin vagy Tulajdonos

## Biztonsági megjegyzések

1. **Frontend ellenőrzés önmagában NEM biztonságos**
   - A frontend csak a UI-t rejti/mutatja
   - Backend-en is ellenőrizni kell a jogosultságokat

2. **Backend védelem kötelező**
   - Minden API endpoint ellenőrizze a role-t
   - JWT token-ben tárold a role-t
   - Middleware használata ajánlott

3. **Példa backend middleware:**
```typescript
function requireRole(minRole: string) {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (hasRole(userRole, minRole)) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
}

// Használat
app.delete('/api/anime/:id', requireRole('Főszerkesztő'), deleteAnime);
```

## Tesztelés

Különböző role-okkal tesztelj:

1. **Felhasználó** - Ne lássa az Admin menüt
2. **Szerkesztő** - Lássa az Admin menüt, de ne a Felhasználók kezelését
3. **Admin** - Lásson mindent kivéve a speciális Tulajdonos funkciókat
4. **Tulajdonos** - Teljes hozzáférés
