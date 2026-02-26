# Auth API Route Tesztelés

## Ellenőrizd, hogy a backend elérhető-e

Nyisd meg a böngésző konzolt (F12) és futtasd:

```javascript
// 1. Regisztráció teszt
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  })
})
.then(r => r.json())
.then(data => console.log('Register:', data))
.catch(err => console.error('Register error:', err));

// 2. Login teszt
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
})
.then(r => r.json())
.then(data => {
  console.log('Login:', data);
  if (data.token) {
    localStorage.setItem('token', data.token);
    console.log('Token mentve!');
  }
})
.catch(err => console.error('Login error:', err));

// 3. GetMe teszt (először jelentkezz be!)
const token = localStorage.getItem('token');
fetch('/api/auth/me', {
  method: 'GET',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(data => console.log('GetMe:', data))
.catch(err => console.error('GetMe error:', err));
```

## Ellenőrzési pontok:

1. ✅ `.env.local` fájl létezik és tartalmazza:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_USE_REAL_API=true
   ```
   **Fontos:** Az URL már tartalmazza a `/api` részt!

2. ✅ Backend fut a `http://localhost:3001` címen

3. ✅ Backend Swagger működik: `http://localhost:3001/api-docs`

4. ✅ Next.js dev szerver fut: `npm run dev`

5. ✅ Network tab-ban látod hogy `/api/auth/*` hívások a Next.js szervert hívják

6. ✅ A Next.js API route továbbítja a backend-nek

## Hibaelhárítás:

### 404 hiba:
- Ellenőrizd hogy a Next.js dev szerver újra lett-e indítva az új route-ok létrehozása után
- Ctrl+C majd `npm run dev` újra

### 500 hiba "NEXT_PUBLIC_API_URL nincs beállítva":
- Hozd létre a `.env.local` fájlt a projekt gyökerében
- Indítsd újra a Next.js szervert

### Backend connection error:
- Ellenőrizd hogy a backend szerver fut
- Ellenőrizd a backend URL-t a `.env.local` fájlban
- Próbáld közvetlenül Swagger-ből is

### CORS hiba:
- A backend-en engedélyezd a CORS-t a Next.js szerver számára (általában `http://localhost:3000`)
