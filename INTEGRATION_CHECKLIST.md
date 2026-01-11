# 📋 Backend Integration Checklist

Használd ezt a checklistet amikor a backend API-t integrálod.

## Előkészületek ✅

- [x] Frontend struktúra kész
- [x] API service layer implementálva
- [x] TypeScript típusok definiálva
- [x] Mock adatok működnek
- [x] Dokumentáció kész
- [x] Frontend tesztelve és működik

## Backend Fejlesztés 🔧

### Adatbázis
- [ ] MySQL telepítve és fut
- [ ] Adatbázis létrehozva (`animeheaven_db`)
- [ ] `animes` tábla létrehozva
- [ ] Indexek létrehozva (malId, rating, genre)
- [ ] Tesztadatok beillesztve
- [ ] Kapcsolat működik

### Backend Szerver
- [ ] Node.js projekt inicializálva
- [ ] Package-ek telepítve (express, mysql2, cors, dotenv)
- [ ] `.env` fájl beállítva
- [ ] Database konfiguráció kész
- [ ] Server.js létrehozva
- [ ] Szerver elindul és fut

### API Endpoints
- [ ] GET `/api/animes` - Összes anime
- [ ] GET `/api/animes/:id` - Egy anime
- [ ] GET `/api/animes/search` - Keresés és szűrés
- [ ] Válasz formátum helyes (`{success, data}`)
- [ ] Hibakezelés implementálva
- [ ] CORS beállítva frontend URL-re

### Tesztelés
- [ ] Health check endpoint működik
- [ ] Összes anime lekérése működik
- [ ] Egy anime lekérése működik
- [ ] Keresés működik
- [ ] Szűrés működik (genre, status, rating)
- [ ] Pagination működik
- [ ] Hibakezelés működik (404, 500)
- [ ] Postman/Insomnia tesztek sikeresek

## Frontend Integráció 🌐

### Környezeti Változók
- [ ] `.env.local` fájl létrehozva
- [ ] `NEXT_PUBLIC_API_URL` beállítva
- [ ] `NEXT_PUBLIC_USE_REAL_API=true` beállítva
- [ ] Értékek ellenőrizve

### Frontend Módosítások
- [ ] Nincs szükség kód változtatásra (service layer automatikusan vált!)
- [ ] Frontend újraindítva
- [ ] Browser console ellenőrizve (nincs hiba)
- [ ] Network tab ellenőrizve (API hívások láthatók)

### Funkció Tesztelés
- [ ] Főoldal betöltődik
- [ ] Animék megjelennek
- [ ] Anime részletek oldal működik
- [ ] Keresés működik
- [ ] Szűrés működik
- [ ] Kategória kezelés működik
- [ ] Képek betöltődnek
- [ ] Hibakezelés működik

## Optimalizáció 🚀

### Backend
- [ ] SQL query-k optimalizálva
- [ ] Indexek használata ellenőrizve
- [ ] Rate limiting implementálva (opcionális)
- [ ] Caching megfontolva (opcionális)
- [ ] Logolás beállítva

### Frontend
- [ ] Next.js cache működik (1 óra revalidate)
- [ ] Képek optimalizálva (Next.js Image)
- [ ] Lazy loading implementálva
- [ ] Loading states hozzáadva

## Biztonsági Ellenőrzések 🔒

### Backend
- [ ] SQL injection védelem (parameterized queries)
- [ ] CORS megfelelően beállítva
- [ ] Environment változók biztonságosan tárolva
- [ ] Érzékeny adatok nem logolva
- [ ] Rate limiting aktív (opcionális)
- [ ] Helmet middleware (opcionális)

### Frontend
- [ ] API URL environment változóban
- [ ] Nincs érzékeny adat a kódban
- [ ] HTTPS használata production-ben

## Deployment 🌍

### Backend
- [ ] Production database beállítva
- [ ] Environment változók átmásolva
- [ ] Szerver elindítható
- [ ] Health check endpoint elérhető
- [ ] Domain/IP beállítva

### Frontend
- [ ] Production build sikeres (`npm run build`)
- [ ] Environment változók production-re átállítva
- [ ] API URL production backend-re mutat
- [ ] Deploy sikeres
- [ ] Oldal elérhető és működik

## Final Check ✅

- [ ] Minden endpoint működik
- [ ] Nincs console error
- [ ] Teljesítmény megfelelő
- [ ] Mobile nézet működik
- [ ] Cross-browser tesztelés
- [ ] User experience megfelelő
- [ ] Dokumentáció frissítve

---

## 🎯 Sikerkritériumok

### Minimum Viable Product (MVP)
- ✅ Frontend betölt
- ✅ Backend elérhető
- ✅ Animék megjelennek
- ✅ Egy anime részletei megjelennek
- ✅ Nincs kritikus hiba

### Full Feature Set
- ✅ Minden endpoint működik
- ✅ Keresés és szűrés működik
- ✅ Hibakezelés megfelelő
- ✅ Teljesítmény optimalizált
- ✅ Biztonság implementálva

---

## 📞 Problémamegoldás

### Ha nem működik valamiért:

1. **Ellenőrizd a Backend-et:**
   ```bash
   curl http://localhost:3001/api/health
   curl http://localhost:3001/api/animes
   ```

2. **Ellenőrizd a Frontend-et:**
   - Browser console (F12)
   - Network tab
   - `.env.local` fájl létezik?

3. **Ellenőrizd a Database-t:**
   ```sql
   SELECT COUNT(*) FROM animes;
   ```

4. **CORS hiba?**
   - Backend CORS beállítások
   - Frontend URL egyezik?

5. **Újraindítás:**
   ```bash
   # Backend
   npm run dev

   # Frontend
   npm run dev
   ```

---

**Utolsó frissítés:** 2026. január 11.  
**Verzió:** 1.0  
**Státusz:** Várakozik backend integrációra
