# Architecture - Book-By-Click

## Schema Global

```mermaid
graph TB
    A[Navigateur] -->|HTTP| B[React App<br/>Port 5173]
    B -->|API Calls| C[Flask API<br/>Port 5000]
    C -->|SQL| D[(PostgreSQL 15<br/>Port 5432)]
    C -->|SMTP| E[Mail Server<br/>Port 25]

    F[Docker] -.->|Container| D
    F -.->|Container| E

    style A fill:#e1f5ff
    style B fill:#61dafb
    style C fill:#000
    style D fill:#4479a1
    style E fill:#10b981
```

## Stack

**Frontend:** React 19, Vite, React Router, TailwindCSS, Recharts

**Backend:** Flask, SQLAlchemy, Flask-CORS

**Database:** PostgreSQL 15

**Services Docker:** PostgreSQL (5432), Mail Server (25)

## Communication

API REST en JSON sur `http://localhost:5000`
