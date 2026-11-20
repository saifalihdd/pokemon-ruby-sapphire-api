# Pokemon Ruby & Sapphire API

**Final Project Study Club Backend Basic - KSM Veterantech UPNVJ 2026**
**Nama:** (isi nama lengkap)
**NIM:** (isi NIM)

## Deskripsi Singkat

Aplikasi backend berbasis **REST API** untuk mengelola dunia Pokemon wilayah Hoenn (tema Pokemon Ruby & Sapphire).
Aplikasi mengelola tiga kelompok data: **Pokemon** (koleksi yang tersimpan di database), **Trainer** (pemilik Pokemon),
dan **Species** (katalog Pokedex). Pokemon dapat ditambahkan, dicari, diubah, dilatih (EXP dan naik level),
dievolusikan, dimiliki seorang Trainer, serta dipindahkan antara party dan box.

Data spesies dan aturan evolusi dikembangkan dari mini project sebelumnya:
[pokemon-ruby-sapphire](https://github.com/saifalihdd/pokemon-ruby-sapphire). Rumus stat dan HP mengikuti rumus Gen 3
dari mini project tersebut, dan dihitung otomatis oleh server.

## Fitur Utama

1. **CRUD lengkap** untuk Pokemon dan Trainer, tersimpan di MongoDB.
2. **Relasi** Pokemon ke Trainer (`trainerId`), dengan aturan party maksimal 6 Pokemon dan sisanya masuk box.
3. **Pencarian, filter, pengurutan, dan pagination** lewat Query Parameter.
4. **Training:** menambah EXP, naik level otomatis, stat dan HP dihitung ulang.
5. **Evolusi** berbasis level (contoh: Treecko menjadi Grovyle di level 16).
6. **Katalog spesies** (Pokedex) beserta info evolusinya.
7. **Statistik koleksi** menggunakan aggregation MongoDB.
8. **Validasi input dan error handling** dengan HTTP Status Code yang sesuai.

## Teknologi dan Dependencies

| Teknologi | Kegunaan |
|---|---|
| Node.js | Runtime JavaScript |
| Express.js | Framework server dan routing |
| MongoDB Atlas | Database |
| Mongoose | ODM untuk MongoDB |
| dotenv | Membaca variabel environment dari `.env` |
| nodemon (dev) | Restart server otomatis saat pengembangan |
| Postman | Pengujian API |

## Struktur Folder

```text
pokemon-ruby-sapphire-api/
├── config/
│   ├── db.js                    # Koneksi MongoDB
│   └── constants.js             # Konstanta (level maks, batas party, dll.)
├── controllers/                 # Menangani request dan response (HTTP layer)
│   ├── pokemonController.js
│   ├── trainerController.js
│   └── speciesController.js
├── data/                        # Data statis dari mini project
│   ├── pokedex.js
│   ├── evolvedSpecies.js
│   ├── legendarySpecies.js
│   └── evolutions.js
├── models/                      # Skema Mongoose
│   ├── Pokemon.js
│   └── Trainer.js
├── routes/                      # Definisi endpoint
│   ├── pokemonRoutes.js
│   ├── trainerRoutes.js
│   └── speciesRoutes.js
├── services/                    # Logika bisnis dan akses database
│   ├── pokemonService.js
│   ├── trainerService.js
│   └── speciesService.js
├── utils/                       # Fungsi bantu (validasi, pagination, rumus stat, dll.)
├── .env.example
├── .gitignore
├── index.js                     # Entry point server
└── package.json
```

## Langkah Instalasi dan Menjalankan Server

1. **Clone repository**
   ```bash
   git clone https://github.com/saifalihdd/pokemon-ruby-sapphire-api.git
   cd pokemon-ruby-sapphire-api
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Siapkan environment.** Salin `.env.example` menjadi `.env`, lalu isi:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/pokemon_api?appName=Cluster0
   ```
   `MONGO_URI` didapat dari MongoDB Atlas (Connect -> Drivers -> Node.js). Pastikan IP kamu sudah diizinkan di
   Network Access.
4. **Jalankan server**
   ```bash
   npm run dev     # mode development (nodemon)
   npm start       # mode biasa
   ```
5. Server berjalan di `http://localhost:5000`. Jika berhasil, terminal menampilkan
   `MongoDB terhubung` dan `Server berjalan di http://localhost:5000`.

## Daftar Endpoint API

Base URL: `http://localhost:5000`

### Umum

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/` | Cek server berjalan |

### Pokemon

| Method | Endpoint | Fungsi | Status sukses |
|---|---|---|---|
| POST | `/pokemon` | Menambahkan Pokemon baru (Create) | 201 |
| GET | `/pokemon` | Menampilkan Pokemon dengan search, filter, sort, pagination (Read) | 200 |
| GET | `/pokemon/stats` | Statistik koleksi Pokemon | 200 |
| GET | `/pokemon/:id` | Menampilkan satu Pokemon (Read) | 200 |
| PUT | `/pokemon/:id` | Mengubah nickname, level, atau held item (Update) | 200 |
| PATCH | `/pokemon/:id/exp` | Training: menambah EXP, naik level otomatis | 200 |
| PATCH | `/pokemon/:id/evolve` | Mengevolusikan Pokemon jika level mencukupi | 200 |
| PATCH | `/pokemon/:id/trainer` | Memberikan Pokemon ke Trainer, atau melepasnya (`null`) | 200 |
| PATCH | `/pokemon/:id/storage` | Memindahkan Pokemon antara `party` dan `box` | 200 |
| DELETE | `/pokemon/:id` | Menghapus Pokemon (Delete) | 200 |

### Trainer

| Method | Endpoint | Fungsi | Status sukses |
|---|---|---|---|
| POST | `/trainers` | Menambahkan Trainer (Create) | 201 |
| GET | `/trainers` | Menampilkan Trainer dengan search, filter, sort, pagination (Read) | 200 |
| GET | `/trainers/:id` | Detail Trainer beserta jumlah party dan box (Read) | 200 |
| GET | `/trainers/:id/pokemon` | Daftar Pokemon milik Trainer (party dan box) | 200 |
| PUT | `/trainers/:id` | Mengubah name, hometown, atau badges (Update) | 200 |
| DELETE | `/trainers/:id` | Menghapus Trainer; Pokemon miliknya dilepas (Delete) | 200 |

### Species (Pokedex)

| Method | Endpoint | Fungsi | Status sukses |
|---|---|---|---|
| GET | `/species` | Katalog spesies dengan filter dan pagination | 200 |
| GET | `/species/:id` | Detail spesies, base stats, dan info evolusi | 200 |

### Query Parameter

| Endpoint | Parameter | Contoh | Keterangan |
|---|---|---|---|
| `GET /pokemon` | `search` | `?search=tree` | Cari berdasarkan nama spesies atau nickname |
| | `type` | `?type=Grass` | Filter berdasarkan tipe |
| | `trainerId` | `?trainerId=<id>` | Filter berdasarkan pemilik |
| | `storage` | `?storage=box` | `party` atau `box` |
| | `minLevel`, `maxLevel` | `?minLevel=10&maxLevel=30` | Rentang level |
| | `sort` | `?sort=-level` | `level`, `-level`, `newest`, `oldest` |
| | `page`, `limit` | `?page=2&limit=5` | Pagination (default 1 dan 10, limit maks 50) |
| `GET /trainers` | `search` | `?search=bren` | Cari berdasarkan nama |
| | `hometown` | `?hometown=littleroot` | Filter kota asal |
| | `sort` | `?sort=name` | `name`, `-name`, `newest`, `oldest` |
| | `page`, `limit` | `?page=1&limit=5` | Pagination |
| `GET /species` | `type` | `?type=Water` | Filter tipe |
| | `search` | `?search=tree` | Cari berdasarkan nama |
| | `legendary` | `?legendary=true` | `true` atau `false` |
| | `page`, `limit` | `?page=2&limit=10` | Pagination (default 1 dan 20, limit maks 100) |

Parameter dapat digabung, misalnya `GET /pokemon?type=Grass&minLevel=10&sort=-level&page=1&limit=5`.

### Body Request

**POST /pokemon** (`speciesId` wajib; lihat `GET /species` untuk daftar id)
```json
{
  "speciesId": 252,
  "level": 10,
  "nickname": "Leafy",
  "heldItem": "oranBerry",
  "trainerId": "<id trainer, opsional>"
}
```

**PUT /pokemon/:id** (isi minimal salah satu)
```json
{ "nickname": "Sceptile Jr", "level": 20, "heldItem": null }
```

**PATCH /pokemon/:id/exp**
```json
{ "exp": 1000 }
```

**PATCH /pokemon/:id/trainer** (isi `null` untuk melepas)
```json
{ "trainerId": "<id trainer>" }
```

**PATCH /pokemon/:id/storage**
```json
{ "storage": "box" }
```

**POST /trainers** (`name` wajib, 2-20 karakter)
```json
{ "name": "Brendan", "hometown": "Littleroot Town", "badges": 0 }
```

### Aturan Bisnis

- **Level** Pokemon 1-100. Saat level diubah, EXP, stat, dan HP dihitung ulang.
- **Training:** EXP yang cukup menaikkan level (`EXP level N = N^3`). HP bertambah sesuai kenaikan HP maksimum.
  Pokemon level 100 tidak bisa menerima EXP lagi (400).
- **Party maksimal 6.** Pokemon yang diberikan ke Trainer masuk `party` jika masih ada slot, jika penuh otomatis
  masuk `box`. Memindahkan ke party saat sudah penuh dibalas 400.
- **Menghapus Trainer** tidak menghapus Pokemon-nya; Pokemon dilepas (`trainerId` dan `storage` menjadi `null`).
- **Evolusi** mengikuti `data/evolutions.js` dan hanya bisa dilakukan jika level mencukupi.

### Contoh Response

`GET /pokemon?page=1&limit=2`
```json
{
  "success": true,
  "count": 2,
  "pagination": { "page": 1, "limit": 2, "totalItems": 7, "totalPages": 4 },
  "data": [
    {
      "_id": "6650f1c2a1b2c3d4e5f60718",
      "speciesId": 252,
      "nickname": "Leafy",
      "level": 10,
      "exp": 1000,
      "hp": 33,
      "maxHp": 33,
      "stats": { "atk": 14, "def": 12, "spAtk": 18, "spDef": 16, "speed": 19 },
      "trainerId": null,
      "storage": null,
      "speciesName": "Treecko",
      "types": ["Grass"]
    }
  ]
}
```

`PATCH /pokemon/:id/exp` dengan `{ "exp": 1000 }`
```json
{
  "success": true,
  "message": "Training berhasil",
  "training": { "expGained": 1000, "previousLevel": 10, "currentLevel": 12, "levelsGained": 2, "expToNextLevel": 197 },
  "data": { "...": "data Pokemon terbaru" }
}
```

### HTTP Status Code

| Kode | Arti | Contoh kasus |
|---|---|---|
| 200 | OK | Data berhasil diambil, diubah, atau dihapus |
| 201 | Created | Pokemon atau Trainer baru berhasil dibuat |
| 400 | Bad Request | Input tidak valid, ID salah format, party penuh, level belum cukup untuk evolusi |
| 404 | Not Found | Data (Pokemon, Trainer, atau Spesies) dengan ID tersebut tidak ada, atau endpoint tidak dikenal |
| 500 | Internal Server Error | Kesalahan tak terduga di server |

## Pengujian API

Seluruh endpoint diuji menggunakan Postman. File koleksi tersedia di repository:
`collection.json` (112 request dalam 12 folder).

Folder `11 - Demo Presentasi` berisi alur demo yang berdiri sendiri dan membersihkan datanya sendiri; jalankan lewat klik kanan folder -> Run folder.

Cara memakai: buka Postman -> **Import** -> pilih file koleksi -> pastikan server berjalan -> **Run collection**
untuk menguji semua endpoint (folder 00-10). Variabel `pokemonId`, `trainerId`, `ownedPokemonId`, dan `boxPokemonId`
terisi otomatis oleh request Create.
Setiap request memiliki skrip tes untuk memeriksa status code dan isi response, mencakup CRUD, Path Parameter,
Query Parameter, pagination, relasi Trainer, training, statistik, dan kasus error (400/404).

## Catatan

Proyek belajar non-komersial. Pokemon dan semua nama terkait adalah milik Nintendo / Game Freak / The Pokemon Company.
