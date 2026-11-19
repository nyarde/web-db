use crate::game::{Game, NewGame};
use axum::Json;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use sqlx::SqlitePool;

pub async fn list_games(State(pool): State<SqlitePool>) -> (StatusCode, Json<Vec<Game>>) {
    match sqlx::query_as::<_, Game>("SELECT * FROM games ORDER BY title")
        .fetch_all(&pool).await {
        Ok(games) => (StatusCode::OK, Json(games)),
        Err(_) => (StatusCode::INTERNAL_SERVER_ERROR, Json(vec![]))
    }
}

pub async fn insert_game(State(pool): State<SqlitePool>, Json(new): Json<NewGame>) -> StatusCode {
    match sqlx::query("INSERT INTO games (title, genre, platforms, year) VALUES (?, ?, ?, ?)")
        .bind(new.title)
        .bind(new.genre)
        .bind(new.platforms)
        .bind(new.year)
        .execute(&pool).await {
        Ok(_) => StatusCode::CREATED,
        Err(_) => StatusCode::BAD_REQUEST,
    }
}

pub async fn remove_game(State(pool): State<SqlitePool>, Path(game): Path<String>) -> StatusCode {
    match sqlx::query("DELETE FROM games WHERE id = ?")
        .bind(game)
        .execute(&pool).await {
        Ok(_) => StatusCode::OK,
        Err(_) => StatusCode::BAD_REQUEST,
    }
}