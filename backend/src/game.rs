use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use ts_rs::TS;

#[derive(Serialize, Deserialize, TS, FromRow)]
#[ts(export)]
pub struct Game {
    #[ts(type = "number")]
    pub id: i64,
    pub title: String,
    pub genre: String,
    pub platforms: String,
    #[ts(type = "number | null")]
    pub year: Option<i64>,
}

#[derive(Serialize, Deserialize)]
pub struct NewGame {
    pub title: String,
    pub genre: String,
    pub platforms: String,
    pub year: Option<i64>,
}