# 🐾 MeowAtlas

<p align="center">
  <h3 align="center">Every Cat Has a Place on the Map.</h3>
  <p align="center">
   MeowAtlas is an interactive world map where anyone can discover and add cats from across the globe-whether they are pets, shelter cats, or beloved street cats. Every cat gets a digital profile, a story, photos, and a place on the map, celebrating the idea that every cat matters.
  </p>
</p>

---

## 🚀 Live Demo

🌐 **https://meowatlas.appwrite.network/**

---

# 📖 About

Millions of community cats quietly live among us, yet very little information about them is ever documented.

**MeowAtlas** transforms scattered cat sightings into a living, community-powered map where every cat receives a unique **Digital Meow Passport**.

Whether it's a friendly neighborhood stray, a rescued shelter cat, or someone's outdoor companion, anyone can instantly add them to the map—without creating an account.

By combining geolocation and real-time updates, MeowAtlas bridges the gap between individual compassion and community-driven feline welfare.

---

## ✨ Key Features
* 🗺️ **Interactive Global Map:** Fluid, high-performance mapping using MapLibre GL JS.
* 📍 **Precise Landmark Geocoding:** Uses the open-source Photon API (by Komoot) to tag exact local landmarks, streets, and parks (not just broad cities).
* 🛂 **Digital Meow Passport:** A beautifully animated, interactive UI displaying a cat's identity, story, and photos.
* ❤️ **Global Community Interaction:** Users worldwide can leave a "Love" (Heart) or feed a "Fish" to any cat. Counts are synced globally in real-time.
* 📊 **Live Stats Dashboard:** Real-time metrics showing Total Cats, Categories (Pet/Street/Shelter), Top Breeds, and Active Countries.
* 🚫 **Frictionless Entry:** No login platform. Anyone can spot and add a cat to the map instantly.

---

# 🏗️ Architecture

```text
                    User
                      │
                      ▼
              React + Vite Frontend
                      │
      ┌───────────────┼───────────────┐
      ▼                               ▼
 MapLibre GL JS                 Photon API
      │                      (Reverse Geocoding)
      │
      ▼
      Appwrite Database
      │
      ▼
 Appwrite Storage Bucket
```

---

# 🛠️ Tech Stack

| Technology        | Purpose                       |
| ----------------- | ----------------------------- |
| React             | Frontend Framework            |
| Vite              | Fast Development & Build Tool |
| CSS Modules       | Component Styling             |
| Framer Motion     | UI Animations                 |
| MapLibre GL JS    | Interactive Maps              |
| Photon API        | Reverse Geocoding             |
| OpenStreetMap     | Map Data                      |
| Appwrite Database | Backend Database              |
| Appwrite Storage  | Image Storage                 |
| Appwrite Hosting  | Deployment                    |

---

---

# 🚀 Getting Started

## 1️⃣ Prerequisites

Make sure you have:

* Node.js (v18 or newer)
* npm
* An Appwrite Cloud account

---

## 2️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/meowatlas.git

cd meowatlas
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

# ⚙️ Appwrite Setup

Create a new Appwrite project.

### Database

Create a database and collection named **Cats**.

Add the following attributes:

| Attribute       | Type                |
| --------------- | ------------------- |
| name            | String              |
| category        | String              |
| country         | String              |
| city            | String              |
| lat             | Double              |
| lng             | Double              |
| age             | String              |
| breed           | String              |
| story           | String              |
| tags            | String              |
| profileImageId  | String              |
| galleryImageIds | Array               |
| loves           | Integer (Default 0) |
| fishes          | Integer (Default 0) |

---

### Permissions

Grant **Any** role:

* Create
* Read
* Update

---

### Storage

Create one storage bucket.

Grant **Any** role:

* Create
* Read

---

# 🔐 Environment Variables

Create a `.env` file.

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1

VITE_APPWRITE_PROJECT_ID=your_project_id

VITE_APPWRITE_DATABASE_ID=your_database_id

VITE_APPWRITE_COLLECTION_ID=your_collection_id

VITE_APPWRITE_STORAGE_BUCKET_ID=your_bucket_id
```

---

# ▶️ Run Locally

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

Start spotting and adding cats! 🐾

---

# 🤝 Contributing

Contributions are always welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/my-feature
```

3. Commit your changes

```bash
git commit -m "Add awesome feature"
```

4. Push to GitHub

```bash
git push origin feature/my-feature
```

5. Open a Pull Request 🎉

---

# 📄 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you enjoyed MeowAtlas or found it inspiring, consider giving the repository a ⭐.

It helps more people discover the project and supports future development.

---

<p align="center">
Made with ❤️ for every curious whisker around the world. 🐾
</p>
