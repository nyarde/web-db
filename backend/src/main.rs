mod db;
mod game;

use anyhow::Result;
use axum::routing::{delete, get};
use axum::Router;
use sqlx::sqlite::SqlitePoolOptions;
use std::net::{Ipv6Addr, SocketAddr};
use tokio::net::TcpListener;
use tower_http::services::ServeDir;

#[tokio::main]
async fn main() -> Result<()> {
    let pool = SqlitePoolOptions::new()
        .connect("sqlite:../database/games.db").await?;

    let addr = SocketAddr::new(Ipv6Addr::LOCALHOST.into(), 25564);
    let listener = TcpListener::bind(addr).await?;

    let api = Router::new()
        .route("/health", get(|| async { "ok" }))
        .route("/games", get(db::list_games).post(db::insert_game))
        .route("/games/{id}", delete(db::remove_game))
        .with_state(pool);

    let router = Router::new()
        .nest("/api", api)
        .fallback_service(ServeDir::new("../frontend/dist"));

    println!("Running server on {}", addr);
    axum::serve(listener, router).await?;

    Ok(())
}