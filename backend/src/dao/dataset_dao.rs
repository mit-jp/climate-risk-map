use super::Table;
use crate::model::dataset::{self, Dataset, New};
use sqlx::postgres::PgQueryResult;

impl<'c> Table<'c, dataset::Dataset> {
    pub async fn find_duplicates(
        &self,
        datasets: &[dataset::New],
    ) -> Result<Vec<Dataset>, sqlx::Error> {
        sqlx::query_as!(
            Dataset,
            "
            SELECT *
            FROM dataset
            WHERE short_name = ANY($1)
            OR name = ANY($2)
            ",
            &datasets
                .iter()
                .map(|dataset| dataset.short_name.clone())
                .collect::<Vec<_>>(),
            &datasets
                .iter()
                .map(|dataset| dataset.name.clone())
                .collect::<Vec<_>>(),
        )
        .fetch_all(&*self.pool)
        .await
    }

    pub async fn update(&self, dataset: &dataset::Diff) -> Result<PgQueryResult, sqlx::Error> {
        // COALESCE values to update only if they are not None
        sqlx::query!(
            "
            UPDATE dataset
            SET short_name = COALESCE($1, short_name),
                name = COALESCE($2, name),
                description = COALESCE($3, description),
                units = COALESCE($4, units),
                geography_type = COALESCE($5, geography_type)
            WHERE id = $6
            ",
            dataset.short_name,
            dataset.name,
            dataset.description,
            dataset.units,
            dataset.geography_type,
            dataset.id,
        )
        .execute(&*self.pool)
        .await
    }

    pub async fn by_id(&self, id: i32) -> Result<dataset::Dataset, sqlx::Error> {
        sqlx::query_as!(
            dataset::Dataset,
            "
            SELECT id, short_name, name, description, units, geography_type
            FROM dataset
            WHERE id = $1
            ",
            id
        )
        .fetch_one(&*self.pool)
        .await
    }

    pub async fn all(&self) -> Result<Vec<dataset::Dataset>, sqlx::Error> {
        sqlx::query_as!(
            dataset::Dataset,
            "
            SELECT id, short_name, name, description, units, geography_type
            FROM dataset
            ORDER BY id
            "
        )
        .fetch_all(&*self.pool)
        .await
    }

    pub async fn create(&self, dataset: &New) -> Result<dataset::Dataset, sqlx::Error> {
        sqlx::query_as!(
            dataset::Dataset,
            "
            INSERT INTO dataset (short_name, name, description, units, geography_type)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            ",
            dataset.short_name,
            dataset.name,
            dataset.description,
            dataset.units,
            dataset.geography_type,
        )
        .fetch_one(&*self.pool)
        .await
    }

    pub async fn delete(&self, id: i32) -> Result<PgQueryResult, sqlx::Error> {
        sqlx::query!("DELETE FROM dataset WHERE id = $1", id)
            .execute(&*self.pool)
            .await
    }
}
