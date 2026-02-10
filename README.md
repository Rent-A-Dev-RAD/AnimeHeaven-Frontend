# AnimeHeaven Frontend

Ez a README leírja, hogyan telepítsd, futtasd és használd az **AnimeHeaven-Frontend** projekt jelenlegi verzióját.
---

## Elvárások (Prerequisites)

* Node.js (ajánlott: 18.x vagy újabb)
* npm (Node csomagkezelő) vagy Yarn
* Git (a forrás klónozásához)

Ellenőrizd a verziókat:

```bash
node -v
npm -v
# vagy
yarn -v
```

---

## Klónozás

```bash
git clone https://github.com/Rent-A-Dev-RAD/AnimeHeaven-Frontend.git
cd AnimeHeaven-Frontend
```

Ha egy meglévő távoli repót használhatsz ("használhatod a mostanit"), győződj meg róla, hogy a legfrissebb ágon vagy:

```bash
git checkout main   # vagy a projekt alapértelmezett ága
git pull origin main
```

---

## Telepítés

A projekt függőségeinek telepítése npm-mel:

```bash
npm install
```

---

## Környezeti változók

Hozz létre egy `.env.local` fájlt a szükséges kulcsokkal:

```text
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_USE_REAL_API=true
```

---

## Fejlesztői mód (Development)

A fejlesztői szerver indítása:

npm:

```bash
npm run dev
```

Yarn:

```bash
yarn dev
```

Ez elindítja a hot-reload-ot (vagy az adott build eszközhöz tartozó fejlesztői szervert). Nyisd meg a böngésződben a megadott címet (általában `http://localhost:5173` vagy `http://localhost:3000` — a konzolon látható).

---

## Használat

* A fejlesztői szerver elindítása után nyisd meg a böngészőt a helyi URL-en.
* Navigálj az alkalmazásban és teszteld a funkciókat: keresés, katergorizálás, bejelentkezés, stb.
* Győződj meg róla, hogy a `.env` beállítások helyesek.

---

## Hibakeresés (Troubleshooting)

* **Függőségi hibák**: töröld a `node_modules`-t és a lock file-t (`package-lock.json` vagy `yarn.lock`) és futtasd újra az installt:

  ```bash
  rm -rf node_modules
  rm package-lock.json # vagy yarn.lock
  npm install
  ```
* **Port foglalt**: változtasd meg a dev szerver portját a `package.json` scriptben vagy a konfigurációs fájlban.
* **Környezeti változók nem töltődnek be**: ellenőrizd, hogy a `.env` fájl a projekt gyökerében van, és a változónevek pontosan egyeznek a kódban használt nevekkel.

---

## Tippek a verziókezeléshez

* Mielőtt fejlesztenél, szinkronizálj a távoli ággal: `git pull origin main`.
* Hozz létre saját feature ágat: `git checkout -b feat/uj-funkcio`.
* Commitolj gyakran és írj érthető commit message-eket.

---

## Hozzájárulás

Ha szeretnél hozzájárulni:

1. Fork-old a repót.
2. Hozz létre egy feature branch-et.
3. Készíts PR-t a leírással és a változtatások magyarázatával.

---

## Kapcsolat

Ha kérdésed van vagy segítségre szorulsz, írhatsz egy issue-t a GitHub repóban vagy keress rá a projekt tulajdonosára.

---

*README a jelenlegi (f9899a0) állapotra készült - ha a távoli repo frissül, futtasd a `git pull`-t és ellenőrizd a változásokat.*
