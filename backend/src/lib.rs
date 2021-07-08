use crate::dao::Database;
use std::sync::{Arc, Mutex};

pub mod config;
pub mod controller;
pub mod dao;
pub mod model;

pub struct AppState<'a> {
    pub connections: Mutex<u32>,
    pub database: Arc<Database<'a>>,
}
