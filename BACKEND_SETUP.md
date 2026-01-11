# Backend Átállási Útmutató - Gyors Referencia

## 🎯 Mit csináltunk?

Az alkalmazás **már előkészítve** van a backend API integrációra, de **jelenleg mock adatokkal működik**.

## 📂 Létrehozott Fájlok

```
lib/
├── types/
│   └── anime.ts                    # TypeScript típusok
├── config/
│   └── api.config.ts               # API konfiguráció
└── api/
    └── anime.service.ts            # API szolgáltatások

docs/
└── API_INTEGRATION.md              # Részletes dokumentáció

.env.local.example                  # Környezeti változók példa
```

## ⚡ Gyors Átállás (amikor a backend kész)

### 1️⃣ Környezeti változók beállítása

Másold és nevezd át:
```bash
cp .env.local.example .env.local
```

Módosítsd a `.env.local` fájlt:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_USE_REAL_API=true
```

### 2️⃣ Backend API URL-jei

A backend-nek ezeket az endpoint-okat kell biztosítania:

| Endpoint | Metódus | Leírás |
|----------|---------|--------|
| `/api/animes` | GET | Összes anime |
| `/api/animes/:id` | GET | Egy anime ID alapján |
| `/api/animes/search?query=...` | GET | Keresés és szűrés |

### 3️⃣ Válasz Formátum

**Sikeres válasz:**
```json
{
  "success": true,
  "data": { /* anime vagy anime[] */ }
}
```

**Hiba esetén:**
```json
{
  "success": false,
  "error": "Hibaüzenet"
}
```

### 4️⃣ Újraindítás
```bash
npm run dev
```

## 🗄️ MySQL Tábla (Backend)

```sql
CREATE TABLE animes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title_japanese VARCHAR(255) NOT NULL,
  title_english VARCHAR(255) NOT NULL,
  borito TEXT,
  hatter TEXT,
  rating DECIMAL(3,1) DEFAULT 0.0,
  genre VARCHAR(255),
  malId INT,
  leiras TEXT,
  studio VARCHAR(255),
  statusz VARCHAR(50),
  tipus VARCHAR(50),
  osszes_epizod INT,
  jelenlegi_epizod INT,
  megjelenes VARCHAR(100),
  fordito VARCHAR(255),
  besorolas VARCHAR(50),
  feltoltesDatuma DATE,
  trailer TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔍 Hogyan Működik Most?

### Mock Mód (Jelenlegi)
```typescript
// lib/api/anime.service.ts
if (API_CONFIG.USE_REAL_API) {
  // Backend API hívás - NEM AKTíV
} else {
  // JSON fájlból olvasás - AKTÍV ✅
  return { success: true, data: mockAnimes }
}
```

### API Mód (Késöbb)
Csak a `.env.local`-ban kell átállítani a `USE_REAL_API=true`-ra!

## 📊 Használt Helyek

Az új service-t ezeken a helyeken használjuk:

1. **Főoldal** (`app/page.tsx`)
   ```typescript
   const result = await getAllAnimes()
   ```

2. **Anime részletek oldal** (`app/anime/[id]/page.tsx`)
   ```typescript
   const result = await getAnimeById(parseInt(id))
   ```

3. **Anime grid komponens** (`components/anime-grid.tsx`)
   - Props-ból kapja az animéket

## ✅ Előnyök

### Most (Mock mód)
- ✅ Teljes működőképes frontend
- ✅ Gyors fejlesztés
- ✅ Nincs backend függőség
- ✅ Könnyű tesztelés

### Később (API mód)
- ✅ Egyszerű átállás (1 környezeti változó!)
- ✅ Automatikus cache-elés (Next.js)
- ✅ Típusbiztos (TypeScript)
- ✅ Egységes hibakezelés

## 🧪 Tesztelés

### Mock adatok módosítása
Szerkeszd: `app/data/animes.json`

### API tesztelés (később)
1. Backend indítása
2. `.env.local` átállítása
3. Frontend újraindítása
4. Böngésző konzol ellenőrzése

## 🔧 Konfigurációs Opciók

### Cache idő módosítása
`lib/config/api.config.ts`:
```typescript
CACHE: {
  REVALIDATE: 3600, // másodperc (jelenleg 1 óra)
}
```

### Timeout módosítása
```typescript
TIMEOUT: 10000, // milliszekundum (jelenleg 10 mp)
```

## 🚨 Gyakori Hibák & Megoldások

### "Anime nem található"
- ✅ Mock módban: Ellenőrizd az `animes.json` fájlt
- ✅ API módban: Ellenőrizd a backend URL-t és a válasz formátumot

### CORS hiba
Backend oldalon (Express példa):
```javascript
app.use(cors({
  origin: 'http://localhost:3000'
}))
```

### "USE_REAL_API is not defined"
Hozd létre a `.env.local` fájlt az example alapján!

## 📝 Következő Lépések

1. **Most:** Fejleszd tovább a frontend-et mock adatokkal
2. **Backend készül:** Implementáld az API endpoint-okat
3. **Backend kész:** Állítsd át az env változót
4. **Éles:** Deploy mindkét oldal

## 🎓 További Információ

Részletes dokumentáció: `docs/API_INTEGRATION.md`

---

**Státusz:** ✅ Működik mock adatokkal  
**Backend státusz:** ⏳ Várja az implementációt  
**Átállítási idő:** ~2 perc (környezeti változó)
