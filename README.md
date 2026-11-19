# Game Library

Una libreria de juegos creada usando rust y typescript.

## Tecnologia

- Rust
- Sqlite
- Typescript
- Bootstrap

## Requisitos

- Rust toolchain
- NodeJs
- Sqlite3

## Como ejecutar

1. Crear la base de datos `sqlite3 database/games.db < database/dump.sql`
2. Compilar typescript `cd frontend && npm run build`
3. Ejecutar el server `cd backend && cargo run`
4. Abrir http://localhost:8080

## Estructura del projecto


## API
- GET /api/games
- POST /api/games
- DELETE /api/games/{id}