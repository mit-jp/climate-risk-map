use std::collections::HashMap;

use crate::model::County;

use super::AppState;
use actix_web::{get, web, HttpResponse, Responder};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
    cfg.service(get);
}

#[get("/county/{id}")]
async fn get(id: web::Path<i16>, app_state: web::Data<AppState<'_>>) -> impl Responder {
    let counties = app_state.database.county.by_id(id.into_inner()).await;

    match counties {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(counties) => HttpResponse::Ok().json(counties),
    }
}

fn fips_code(county: &County) -> String {
    format!("{:02}{:03}", county.state, county.id)
}

fn counties_to_map(counties: Vec<County>) -> HashMap<String, County> {
    counties
        .into_iter()
        .map(|county| (fips_code(&county), county))
        .collect()
}

#[get("/county")]
async fn get_all(app_state: web::Data<AppState<'_>>) -> impl Responder {
    let counties = app_state.database.county.all().await;

    match counties {
        Err(_) => HttpResponse::NotFound().finish(),
        Ok(counties) => HttpResponse::Ok().json(counties_to_map(counties)),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_converts_vec_to_map_by_fips_code() {
        assert_eq!(
            counties_to_map(vec![
                County {
                    name: "test1".to_string(),
                    id: 1,
                    state: 2,
                },
                County {
                    name: "test2".to_string(),
                    id: 33,
                    state: 44,
                },
            ]),
            HashMap::from([
                (
                    "02001".to_string(),
                    County {
                        name: "test1".to_string(),
                        id: 1,
                        state: 2,
                    }
                ),
                (
                    "44033".to_string(),
                    County {
                        name: "test2".to_string(),
                        id: 33,
                        state: 44,
                    },
                )
            ])
        )
    }
}
