use crate::model::geo_id::{self, GeoId};

use super::Table;
use std::collections::HashSet;

impl<'c> Table<'c, GeoId> {
    pub async fn all(&self) -> Result<Vec<geo_id::Named>, sqlx::Error> {
        sqlx::query_as!(
            geo_id::Named,
            "
            SELECT
                geo_id.name,
                geo_id.id,
                geography_type.name as geography_type
            FROM geo_id, geography_type
            WHERE geo_id.geography_type = geography_type.id
            ORDER BY geography_type, geo_id.name
            "
        )
        .fetch_all(&*self.pool)
        .await
    }

    pub async fn get_invalid_ids(
        &self,
        geo_ids: &HashSet<GeoId>,
    ) -> Result<Vec<GeoId>, sqlx::Error> {
        let mut ids: Vec<i32> = Vec::new();
        let mut geography_types: Vec<i32> = Vec::new();

        for geo_id in geo_ids {
            ids.push(geo_id.id);
            geography_types.push(geo_id.geography_type);
        }

        sqlx::query_as(
            "
            SELECT missing.id, missing.geography_type
            FROM UNNEST($1, $2) AS missing(id, geography_type)
            LEFT JOIN geo_id
                ON geo_id.geography_type = missing.geography_type
                AND geo_id.id = missing.id
            WHERE geo_id.geography_type IS NULL
            ",
        )
        .bind(ids)
        .bind(geography_types)
        .fetch_all(&*self.pool)
        .await
    }
}
