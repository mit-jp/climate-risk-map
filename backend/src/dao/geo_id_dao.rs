use crate::model::geo_id::GeoId;

use super::Table;
use std::collections::HashSet;

impl<'c> Table<'c, GeoId> {
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
