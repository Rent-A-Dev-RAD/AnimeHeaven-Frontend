# Autentikáció és JWT Token Használat

## Áttekintés

Az AnimeHeaven frontend JWT (JSON Web Token) alapú autentikációt használ. A backend API-val való kommunikáció során a tokeneket a localStorage-ban tároljuk.

## Fájlstruktúra

```
lib/
├── api/
│   └── auth.service.ts          # Auth szolgáltatás (frontend logic)
├── contexts/
│   └── AuthContext.tsx          # Auth context és provider
└── config/
    └── api.config.ts            # API konfiguráció

app/
├── api/
│   └── auth/
│       ├── register/
│       │   └── route.ts         # POST /api/auth/register (Next.js API route)
│       ├── login/
│       │   └── route.ts         # POST /api/auth/login (Next.js API route)
│       └── me/
│           └── route.ts         # GET /api/auth/me (Next.js API route)
├── login/
│   └── page.tsx                 # Bejelentkezési oldal
├── register/
│   └── page.tsx                 # Regisztrációs oldal
└── layout.tsx                   # AuthProvider wrapper

components/
├── protected-route.tsx          # Védett útvonalak komponense
└── header.tsx                   # Fejléc (user menu)
```

## Hogyan működik?

1. **Frontend** (React komponens) → meghívja az `authService.login()` függvényt
2. **Auth Service** (`lib/api/auth.service.ts`) → fetch hívás a `/api/auth/login` Next.js API route-hoz
3. **Next.js API Route** (`app/api/auth/login/route.ts`) → továbbítja a kérést a backend-nek (`${BACKEND}/api/auth/login`)
4. **Backend API** → feldolgozza a kérést, visszaadja a JWT tokent
5. **Válasz** → visszafelé ugyanezen az úton a frontend-hez

## Használat

### 1. Környezeti változók beállítása

Hozz létre egy `.env.local` fájlt:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_USE_REAL_API=true
```

**Fontos:** A `NEXT_PUBLIC_API_URL` már tartalmazza a `/api` részt!

### 2. Auth Context használata komponensekben

```tsx
import { useAuth } from '@/lib/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (isAuthenticated) {
    return <p>Üdv, {user?.username}!</p>;
  }

  return <p>Nincs bejelentkezve</p>;
}
```

### 3. Védett oldalak

```tsx
import ProtectedRoute from '@/components/protected-route';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div>Ez egy védett oldal</div>
    </ProtectedRoute>
  );
}
```

### 4. Autentikált API hívások

```tsx
import { authService } from '@/lib/api/auth.service';

async function fetchProtectedData() {
  const response = await authService.authenticatedFetch(
    'http://localhost:3001/api/protected-endpoint'
  );
  const data = await response.json();
  return data;
}
```

## Backend Endpoint-ok

A **Next.js API route-ok** az alábbi backend endpoint-okat hívják meg:

### Backend: POST `/api/auth/register`
**Frontend hívja:** POST `/api/auth/register` (Next.js API route)  
**Backend URL:** `${NEXT_PUBLIC_API_URL}/auth/register` → `http://localhost:3001/api/auth/register`

**Request:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sikeres regisztráció",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "email@example.com",
    "role": "user"
  }
}
```

### Backend: POST `/api/auth/login`
**Frontend hívja:** POST `/api/auth/login` (Next.js API route)  
**Backend URL:** `${NEXT_PUBLIC_API_URL}/auth/login` → `http://localhost:3001/api/auth/login`

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sikeres bejelentkezés",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "email@example.com",
    "role": "user"
  }
}
```

### Backend: GET `/api/auth/me`
**Frontend hívja:** GET `/api/auth/me` (Next.js API route)  
**Backend URL:** `${NEXT_PUBLIC_API_URL}/auth/me` → `http://localhost:3001/api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "email@example.com",
    "role": "user"
  }
}
```

## Funkciók

### `authService`

- **`register(data)`** - Regisztráció
- **`login(data)`** - Bejelentkezés
- **`logout()`** - Kijelentkezés (token törlése)
- **`getMe()`** - Bejelentkezett user adatok lekérése
- **`isAuthenticated()`** - Ellenőrzi, hogy be van-e jelentkezve
- **`getToken()`** - Token lekérése
- **`setToken(token)`** - Token mentése
- **`getUser()`** - User adatok lekérése localStorage-ból
- **`setUser(user)`** - User adatok mentése
- **`authenticatedFetch(url, options)`** - Fetch helper automatikus token hozzáadással

### `useAuth()` Hook

A hook az alábbi tulajdonságokat és függvényeket adja vissza:

- **`user`** - Bejelentkezett user objektuma (`User | null`)
- **`loading`** - Betöltési állapot (`boolean`)
- **`isAuthenticated`** - Be van-e jelentkezve (`boolean`)
- **`login(email, password)`** - Bejelentkezési függvény
- **`register(username, email, password)`** - Regisztrációs függvény
- **`logout()`** - Kijelentkezés
- **`refreshUser()`** - User adatok frissítése

## Biztonsági megjegyzések

1. **Token tárolás**: A tokeneket a localStorage-ban tároljuk. Productiónban fontold meg a httpOnly cookie használatát.
2. **Token lejárat**: A backend-en állítsd be a tokenek lejárati idejét.
3. **HTTPS**: Éles környezetben mindig HTTPS-t használj.
4. **CORS**: Állítsd be megfelelően a CORS policy-t a backend-en.

## Példa használat

### Bejelentkezés

```tsx
const { login } = useAuth();
const result = await login('email@example.com', 'password123');

if (result.success) {
  router.push('/');
} else {
  console.error(result.message);
}
```

### Regisztráció

```tsx
const { register } = useAuth();
const result = await register('username', 'email@example.com', 'password123');

if (result.success) {
  router.push('/login');
} else {
  console.error(result.message);
}
```

### Kijelentkezés

```tsx
const { logout } = useAuth();
logout();
router.push('/');
```
