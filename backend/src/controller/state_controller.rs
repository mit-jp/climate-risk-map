use crate::model::geo_id::State;

use super::AppState;
use actix_web::{get, web, HttpResponse, Responder};
use std::collections::HashMap;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
    cfg.service(get);
}

#[get("/state/{id}")]
async fn get(id: web::Path<i32>, app_state: web::Data<AppState<'_>>) -> impl Responder {
    let state = app_state.database.state.by_id(id.into_inner()).await;

    match state {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(state) => HttpResponse::Ok().json(state),
    }
}

fn states_to_map(states: Vec<State>) -> HashMap<i32, State> {
    states.into_iter().map(|state| (state.id, state)).collect()
}

#[get("/state")]
async fn get_all(app_state: web::Data<AppState<'_>>) -> impl Responder {
    let states = app_state.database.state.all().await;

    match states {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(states) => HttpResponse::Ok().json(states_to_map(states)),
    }
}
