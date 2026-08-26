# Cloudr - Personal Music Streaming App

A fully deployed, full-stack personal music streaming platform.

* **Frontend URL:** [https://cloudr.pages.dev](https://cloudr.pages.dev)
* **Backend URL:** [https://cloudr-sg.onrender.com](https://cloudr-sg.onrender.com)

## System Architecture

<img width="751" height="565" alt="architecture drawio" src="https://github.com/user-attachments/assets/bf2a8157-3f54-47b8-87fa-392c6eabce5c" />


## Key Features

* **Auth:** Secure authentication using Supabase Auth with backend JWT verification via JWKS.
* **Upload:** Direct browser to R2 uploads using a `Presign → Upload (direct R2 PUT)  → Confirm` workflow eliminating backend upload bottlenecks.
* **Library Management:** My Space and Liked pages for browsing, searching, deleting, and liking songs.
* **Playback:** Stream audio through signed Cloudflare R2 URLs with recently played history tracking.
* **Storage Quotas:** Per user quota enforcement on upload (`MAXIMUM_STORAGE_PER_USER`).
* **Storage Cleanup:** Automated deletion of media files from Cloudflare R2 when removed by a user.

## Tech Stack
 
 * **Frontend** : React + Vite, Tailwind CSS
 * **Backend** : FastAPI
 * **Cloud Storage** : Cloudflare R2
 * **Database** : SQLAlchemy (async) +  PostgreSQL
 * **Auth** : Supabase and backend JWT verification via JWKS (JSON Web Key Set)
 * **Containerization** : Docker
 * **S3 compatible** : boto3(R2)
 * **Audio Metadata** : Mutagen

## Project Structure
```text
cloudr/  
├── frontend/  
│   ├── package.json  
│   ├── index.html  
│   └── src/  
│       ├── App.jsx  
│       ├── main.jsx  
│       ├── supabaseClient.js  
│       ├── api.js  
│       ├── components/  
│       │   ├── header/ (Header.jsx, storage/StorageCard.jsx, quick_actions/)  
│       │   ├── player/ (PlayerBar.jsx)  
│       │   ├── nav/ (LeftNav.jsx, NavItem.jsx)  
│       │   ├── library_stats/ (LibraryStats.jsx, StatCard.jsx)  
│       │   └── recent/ (Recent.jsx, RecentCard.jsx)  
│       └── pages/ (Upload.jsx, MySpace.jsx, Liked.jsx, Login.jsx, Signup.jsx, Playlists.jsx)  
└── backend/  
    ├── main.py  
    ├── pyproject.toml
    |-- alembic/
    |-- Dockerfile
    |-- uv.lock
    |-- .env.example
    └── app/  
        ├── core/ (config.py, db.py, auth.py, r2.py)  
        ├── routers/ (song.py, user.py, liked.py, recent.py)  
        ├── crud/ (song.py, user.py)  
        ├── models/ (song.py, liked.py, ...)  
        └── schemas/ (song.py, user.py, recently_played.py)  
```


Developed by [Hrithvik](https://github.com/hrithvikcodes) ♡
