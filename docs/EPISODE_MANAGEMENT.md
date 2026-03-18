# Epizódkezelés Rendszer

## Áttekintés

Az AnimeHeaven-Frontend mostantól átfogó epizódkezelési funkcionalitást tartalmaz, amely lehetővé teszi az adminisztrátornak az anime címekhez tartozó epizódok létrehozását, olvasását, frissítését és törlését (CRUD).

## Funkciók

### 1. **Epizódok hozzáadása** ➕
- Az adminisztrátorok új epizódokat adhatnak egy animéhez
- Minden epizódnak lehetnek:
  - Epizódszám (sorrend)
  - Epizódcím/leírás (resz)
  - Láthatósági állapot
  - Videoforráshivatkozások (Indavideo, Videa)

### 2. **Epizódok szerkesztése** ✏️
- Meglévő epizódadatok módosítása
- Videoforráshivatkozások frissítése
- Epizódláthatóság módosítása
- Epizódsorozat átrendezése

### 3. **Epizódok törlése** 🗑️
- Epizódok eltávolítása egy animéből
- Több epizód tömeges törlése
- Megerősítési párbeszéd az esetleges törlések elkerülésére

### 4. **Videoforráscok kezelése**
- Több videotárolási platform támogatása:
  - Indavideo
  - Videa
- Minden epizódnak több forrása lehet

### 5. **Láthatósági vezérlés** 👁️
- Epizódláthatóság váltása (látható/rejtett)
- Annak szabályozása, hogy mely epizódok látszanak a felhasználók számára

### 6. **Epizódok átrendezése**
- Epizódsorozat módosítása
- A sorrend mező automatikus frissítése (sorrend mező)

## Fájlok és Architektúra

### Szolgáltatásfájlok

#### 1. **`lib/api/anime.service.ts`**
- Alapvető anime-kezelési funkciók
- Tartalmaz: `getEpisodesByAnimeId()`, `getAllAnimes()`, `getAnimeById()`, `updateAnime()`, `deleteAnime()`
- Frissítve az epizódműveletek támogatására

#### 2. **`lib/api/episode.service.ts`** (ÚJ)
- Dedikált epizódkezelési szolgáltatás
- Funkciók:
  - `getEpisodeById(episodeId)` - Egyetlen epizód lekérése
  - `createEpisode(animeId, episodeData)` - Új epizód létrehozása
  - `updateEpisode(episodeId, episodeData)` - Epizód frissítése
  - `deleteEpisode(episodeId)` - Egyetlen epizód törlése
  - `deleteEpisodes(episodeIds)` - Epizódok tömeges törlése
  - `reorderEpisodes(animeId, episodes)` - Epizódok átrendezése sorrend szerint

### Felhasználói felület komponensei

#### **`app/admin/manage-anime/edit-anime/page.tsx`**
Az epizódok kezelésének fő oldala, ahol az adminisztrátorok:
- Az anime összes epizódját megtekinthetik
- Új epizódokat adhatnak hozzá az "Új epizód" gomb segítségével
- Beépített epizódadatokat szerkeszthetnek
- Megerősítéssel epizódokat törölhetnek
- Bekapcsolhatják/kikapcsolhatják az epizódláthatóságot
- Menthetik a módosításokat a háttérrendszerbe

#### **`app/admin/manage-anime/page.tsx`**
Az összes anime-cím listázása a következő lehetőségekkel:
- Anime-adatok szerkesztése
- Teljes anime törlése
- Navigációs link az epizódkezeléshez (via edit-anime oldal)

## Felhasználási Útmutató

### Adminisztrátorok számára

#### Epizód hozzáadása:
1. Navigáljon az Admin → Animék kezelése oldalra
2. Kattintson a "Szerkesztés" gombra a kívánt anime mellett
3. Görgessen az "Epizódok kezelése" szakaszhoz
4. Kattintson az "Új epizód" gombra
5. Töltse ki az epizódadatokat:
   - Epizódcím
   - Epizódszám
   - Videoforráshivatkozások (Indavideo/Videa)
6. Kattintson a mentés ikonra az epizód mentéséhez

#### Epizód szerkesztése:
1. Keresse meg az epizódot a listában
2. Módosítsa az epizódcímet vagy a forráshivatkozásokat
3. Kattintson a mentés ikonra a módosítások rögzítéséhez
4. A módosítások azonnal mentésre kerülnek a háttérrendszerre

#### Epizód törlése:
1. Kattintson az epizódon található szemetes ikont
2. Erősítse meg a törlést a párbeszédablakban
3. Az epizód eltávolítottan kerül az alkalmazásból és a háttérrendszerből

#### Láthatóság váltása:
1. Kattintson az epizódon található szem ikonra
2. Az ikon a láthatósági állapot jelzésére módosul
3. A módosítás azonnal megjelenik

## API Végpontok

Az epizódkezelőrendszer a következő API végpontokat használja:

```
GET  /api/episodes/:id        - Epizód lekérése ID alapján
POST /api/episodes            - Új epizód létrehozása
PUT  /api/episodes/:id        - Epizód frissítése
DELETE /api/episodes/:id      - Epizód törlése
DELETE /api/episodes/batch    - Epizódok tömeges törlése
PUT  /api/animes/:id/episodes/reorder - Epizódok átrendezése
```

## Adatstruktúra

### Epizód objektum
```typescript
interface Episode {
  id: number                    // Egyedi epizódazonosító
  sorrend: number              // Epizód sorszáma
  resz: string                 // Epizódcím/leírás
  lathatosag: boolean | number // Láthatóság (1 = látható, 0 = rejtett)
  anime_id?: number            // Referencia a szülő animéhez
  forras_elems?: EpisodeSource[]  // Videoforráslista
}

interface EpisodeSource {
  id: number
  resz_id: number              // Referencia az epizódhoz
  forras_id: number            // Referencia a forrástípushoz
  link: string                 // Video URL
  forra: {
    id: number
    nev: string                // Forrásnév (pl. "Indavideo", "Videa")
  }
}
```

## Implementációs Részletek

### Frontend állapotkezelés
- Az epizódok az animéből kerülnek betöltésre és az edit-anime oldalon jelennek meg
- Helyi állapot használható a UI-frissítésekhez a háttérrendszerre mentés előtt
- Lapozási támogatás (12 epizód oldalonként) sok epizóddal rendelkező animék számára
- A nem mentett módosítások mentés gombokkal vannak kiemelve

### Háttérrendszer integráció
- Az összes epizódművelet a háttérrendszer API-jára kerül mentésre
- Megerősítési párbeszédek megelőzik az esetleges törléseket
- Hibakezelés felhasználóbarát üzenetekkel
- Valósidejű érvényesítés és visszajelzés

### Epizódlétrehozási folyamat
1. Új epizód ideiglenes azonosítóval (Date.now()) kerül helyi létrehozásra
2. Mentéskor egy POST kérés létrehozza az epizódot a háttérrendszeren
3. A háttérrendszer visszaadja a tényleges epizódazonosítót
4. A helyi állapot frissül a valós azonosítóval

### Epizódtörlési folyamat
1. Ha epizód ID > 1000000000000 → Csak helyi törlés (új epizód még nem mentve)
2. Ha epizód ID ≤ 1000000000000 → DELETE kérés küldése a háttérrendszerre először
3. Sikeresség után az epizód eltávolítottan kerül az UI-ból

## Konfiguráció

Az epizódkezelés az admin panelba van integrálva és megfelelő hitelesítést/engedélyezést igényel. Győződjön meg arról, hogy a környezetében az alábbi beállítások találhatók:
- `API_CONFIG.USE_REAL_API` beállítása `true` ha valós háttérrendszert használ
- Megfelelő API végpont konfiguráció a `lib/config/api.config.ts` fájlban
- A háttérrendszernek ellenőriznie kell az anime tulajdonjogát az epizódmódosítások engedélyezése előtt

## Jövőbeli fejlesztések

A lehetséges javítások az epizódkezelőrendszerre:

1. **Tömeges feltöltés** - Epizódok tömeges feltöltése CSV/JSON fájlból
2. **Epizódminiatűrök** - Egyéni miniatűrök hozzáadása minden epizódhoz
3. **Epizódütemezés** - Epizód-kiadási dátumok ütemezése
4. **Felirat kezelése** - Feliratok hozzáadása/kezelése az epizódokhoz
5. **Minőségi változatok** - Több felbontás-verziók támogatása
6. **Elemzések** - Epizódmegtekintések és felhasználói aktivitás nyomon követése
7. **Megjegyzések/Értékelések** - Felhasználói megjegyzések engedélyezése az epizódokhoz
8. **Letöltési lehetőség** - Epizódok letöltésének lehetővé tétele premium felhasználók számára
9. **Automatikus lekérés** - Epizódok automatikus lekérése külső forrásokból (MAL stb.)
10. **Fejlett átrendezés** - Drag-and-drop epizódátrendezési UI

## Hibaelhárítás

### Az epizódok nem mentődnek?
- Ellenőrizze az API végpont konfigurációját
- Vizsgálja meg, hogy a háttérrendszer elérhető és működik-e
- Tekintse meg a böngésző konzolját hibákat keresve
- Győződjön meg arról, hogy a hitelesítési token (ha szükséges) érvényes

### Ideiglenes epizódok ragadnak a listában?
- Frissítse az oldalt a háttérrendszerről való újratöltéshez
- Ellenőrizze, hogy a háttérrendszer létrehozása nem sikerült-e (konzol naplók megtekintése)
- Az összes új epizód ideiglenes azonosítóval kezdődik; a mentés gomb rögzíti őket

### Hiányzó videoforráscok?
- Győződjön meg arról, hogy a forrás URL-ek megfelelően formázottak
- Ellenőrizze, hogy az Indavideo/Videa URL-ek érvényesek-e
- Vizsgálja meg, hogy a videóforrástípus nevek egyeznek-e a háttérrendszer elvárásaival

## Kapcsolódó dokumentáció
- A hitelesítés részleteiért lásd az [AUTH.md](../docs/AUTH.md) fájlt
- Az admin szerephez lásd az [ROLES.md](../docs/ROLES.md) fájlt
- Az általános projekt beállításáról lásd a fő [README.md](../README.md) fájlt
