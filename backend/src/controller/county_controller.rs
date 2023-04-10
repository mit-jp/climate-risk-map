use std::collections::HashMap;

use crate::model::County;

use super::AppState;
use actix_web::{get, web, HttpResponse, Responder};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(get_all);
}

fn fips_code(county: &County) -> i32 {
    county.state as i32 * 1000 + county.id as i32
}

fn counties_to_map(counties: Vec<County>) -> HashMap<i32, County> {
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
                    2001,
                    County {
                        name: "test1".to_string(),
                        id: 1,
                        state: 2,
                    }
                ),
                (
                    44033,
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
