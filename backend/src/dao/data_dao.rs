use super::Table;
use crate::controller::data_controller::PercentileInfo;
use crate::model::data::{self, Creator, Data, Simple, SourceAndDate};
use chrono::NaiveDate;
use sqlx::postgres::PgQueryResult;
use std::collections::HashSet;

impl<'c> Table<'c, Data> {
    pub async fn by_dataset(
        &self,
        dataset: i32,
        source_and_date: &data::SourceAndDate,
    ) -> Result<Vec<Simple>, sqlx::Error> {
        sqlx::query_as!(
            Simple,
            "
            SELECT id, value
            FROM data
            WHERE dataset = $1
            AND source = $2
            AND start_date = $3
            AND end_date = $4
            ",
            dataset,
            source_and_date.source,
            source_and_date.start_date,
            source_and_date.end_date,
        )
        .fetch_all(&*self.pool)
        .await
    }

    pub async fn by_map_visualization(
        &self,
        map_visualization: i32,
        source_and_date: &SourceAndDate,
    ) -> Result<Vec<Simple>, sqlx::Error> {
        sqlx::query_as!(
            Simple,
            "
            SELECT data.id, data.value
            FROM data, map_visualization
            WHERE data.dataset = map_visualization.dataset
            AND map_visualization.id = $1
            AND data.source = $2
            AND data.start_date = $3
            AND data.end_date = $4
            ",
            map_visualization,
            source_and_date.source,
            source_and_date.start_date,
            source_and_date.end_date
        )
        .fetch_all(&*self.pool)
        .await
    }

    /**
     * The percentile for a given geo-id for all datasets in a category
     */
    pub async fn percentile(
        &self,
        info: PercentileInfo,
    ) -> Result<Vec<data::Percentile>, sqlx::Error> {
        sqlx::query_as!(
            data::Percentile,
            r#"
        SELECT
            entry.dataset,
            entry.dataset_name,
            entry.source as "source!",
            entry.start_date as "start_date!",
            entry.end_date as "end_date!",
            entry.units,
            entry.formatter_type,
            entry.decimals,
            (
                SELECT
                    value
                FROM
                    data
                WHERE
                    id = $1
                    AND dataset = entry.dataset
                    AND source = entry.source
                    AND start_date = entry.start_date
                    AND end_date = entry.end_date
            ),
            CASE WHEN (
                SELECT
                    value
                FROM
                    data
                WHERE
                    id = $1
                    AND dataset = entry.dataset
                    AND source = entry.source
                    AND start_date = entry.start_date
                    AND end_date = entry.end_date
            ) IS NULL THEN NULL ELSE
            percent_rank(
                (
                    SELECT
                        CASE WHEN entry.invert_normalized THEN -value ELSE value END as value
                    FROM
                        data
                    WHERE
                        id = $1
                        AND dataset = entry.dataset
                        AND source = entry.source
                        AND start_date = entry.start_date
                        AND end_date = entry.end_date
                )
            ) within GROUP (
                ORDER BY CASE WHEN entry.invert_normalized THEN -value ELSE value END
            )
        END
        FROM
            data,
            (
                SELECT
                    map_visualization.dataset,
                    dataset.name as dataset_name,
                    COALESCE(default_source, source) AS source,
                    COALESCE(default_start_date, start_date) AS start_date,
                    COALESCE(default_end_date, end_date) AS end_date,
                    invert_normalized,
                    units,
                    formatter_type,
                    decimals
                FROM
                    map_visualization,
                    map_visualization_collection,
                    dataset,
                    (
                        SELECT
                            dataset,
                            MAX(end_date) AS end_date,
                            MAX(start_date) AS start_date,
                            MAX("source") AS source
                        FROM
                            data
                        GROUP BY
                            dataset
                    ) AS cd
                WHERE
                    map_visualization_collection.category = $2
                    AND map_visualization.dataset = dataset.id
                    AND cd.dataset = map_visualization.dataset
                    AND map_visualization_collection.map_visualization = map_visualization.id
                    AND dataset.geography_type = $3
            ) AS entry
        WHERE
            data.dataset = entry.dataset
            AND data.source = entry.source
            AND data.start_date = entry.start_date
            AND data.end_date = entry.end_date
        GROUP BY
            entry.dataset,
            entry.dataset_name,
            entry.source,
            entry.start_date,
            entry.end_date,
            entry.units,
            entry.formatter_type,
            entry.decimals,
            entry.invert_normalized;
        "#,
            info.geo_id,
            info.category,
            info.geography_type
        )
        .fetch_all(&*self.pool)
        .await
    }

    /**
     * The state-level percentile for a given geo-id for all datasets in a category
     */
    pub async fn state_percentile(
        &self,
        info: PercentileInfo,
    ) -> Result<Vec<data::Percentile>, sqlx::Error> {
        sqlx::query_as!(
            data::Percentile,
            r#"
        SELECT
            entry.dataset,
            entry.dataset_name,
            entry.source as "source!",
            entry.start_date as "start_date!",
            entry.end_date as "end_date!",
            entry.units,
            entry.formatter_type,
            entry.decimals,
            (
                SELECT
                    value
                FROM
                    (SELECT * FROM data
                    WHERE FLOOR(id / 1000) = FLOOR($1 / 1000)) AS state_data
                WHERE
                    id =($1)
                    AND dataset = entry.dataset
                    AND source = entry.source
                    AND start_date = entry.start_date
                    AND end_date = entry.end_date
            ),
            CASE WHEN (
                SELECT
                    value
                FROM
                    (SELECT * FROM data
                    WHERE FLOOR(id / 1000) = FLOOR($1 / 1000)) AS state_data
                WHERE
                    id =($1)
                    AND dataset = entry.dataset
                    AND source = entry.source
                    AND start_date = entry.start_date
                    AND end_date = entry.end_date
            ) IS NULL THEN NULL ELSE
            percent_rank(
                (
                    SELECT
                        CASE WHEN entry.invert_normalized THEN -value ELSE value END as value
                    FROM
                        (SELECT * FROM data
                        WHERE FLOOR(id / 1000) = FLOOR($1 / 1000)) AS state_data
                    WHERE
                        id =($1)
                        AND dataset = entry.dataset
                        AND source = entry.source
                        AND start_date = entry.start_date
                        AND end_date = entry.end_date
                )
            ) within GROUP (
                ORDER BY CASE WHEN entry.invert_normalized THEN -value ELSE value END
            )
        END
        FROM
            (SELECT * FROM data
            WHERE FLOOR(id / 1000) = FLOOR($1 / 1000)) AS state_data,
            (
                SELECT
                    map_visualization.dataset,
                    dataset.name as dataset_name,
                    COALESCE(default_source, source) AS source,
                    COALESCE(default_start_date, start_date) AS start_date,
                    COALESCE(default_end_date, end_date) AS end_date,
                    invert_normalized,
                    units,
                    formatter_type,
                    decimals
                FROM
                    map_visualization,
                    map_visualization_collection,
                    dataset,
                    (
                        SELECT
                            dataset,
                            MAX(end_date) AS end_date,
                            MAX(start_date) AS start_date,
                            MAX("source") AS source
                        FROM
                            data
                        GROUP BY
                            dataset
                    ) AS cd
                WHERE
                    map_visualization_collection.category = $2
                    AND map_visualization.dataset = dataset.id
                    AND cd.dataset = map_visualization.dataset
                    AND map_visualization_collection.map_visualization = map_visualization.id
                    AND dataset.geography_type = $3
            ) AS entry
        WHERE
            state_data.dataset = entry.dataset
            AND state_data.source = entry.source
            AND state_data.start_date = entry.start_date
            AND state_data.end_date = entry.end_date
        GROUP BY
            entry.dataset,
            entry.dataset_name,
            entry.source,
            entry.start_date,
            entry.end_date,
            entry.units,
            entry.formatter_type,
            entry.decimals,
            entry.invert_normalized;
        "#,
            info.geo_id,
            info.category,
            info.geography_type
        )
        .fetch_all(&*self.pool)
        .await
    }

    pub async fn insert(&self, data: &HashSet<Creator>) -> Result<PgQueryResult, sqlx::Error> {
        let mut ids: Vec<i32> = Vec::with_capacity(data.len());
        let mut sources: Vec<i32> = Vec::with_capacity(data.len());
        let mut datasets: Vec<i32> = Vec::with_capacity(data.len());
        let mut start_dates: Vec<NaiveDate> = Vec::with_capacity(data.len());
        let mut end_dates: Vec<NaiveDate> = Vec::with_capacity(data.len());
        let mut values: Vec<f64> = Vec::with_capacity(data.len());
        let mut geography_types: Vec<i32> = Vec::with_capacity(data.len());

        data.iter().for_each(|row| {
            ids.push(row.id);
            sources.push(row.source);
            datasets.push(row.dataset);
            start_dates.push(row.start_date);
            end_dates.push(row.end_date);
            values.push(row.value);
            geography_types.push(row.geography_type);
        });

        // https://github.com/launchbadge/sqlx/issues/294#issuecomment-886080306
        sqlx::query!(
            "
            INSERT INTO
            data (
                id,
                source,
                dataset,
                start_date,
                end_date,
                value,
                geography_type
            )
            SELECT *
            FROM
            UNNEST ($1::int[], $2::int[], $3::int[], $4::date[], $5::date[], $6::float[], $7::int[])
            ",
            &ids,
            &sources,
            &datasets,
            &start_dates,
            &end_dates,
            &values,
            &geography_types
        )
        .execute(&*self.pool)
        .await
    }

    pub async fn delete_by_dataset(&self, dataset: i32) -> Result<PgQueryResult, sqlx::Error> {
        sqlx::query!("DELETE FROM data WHERE dataset = $1", dataset)
            .execute(&*self.pool)
            .await
    }

    pub async fn delete_by_source(&self, source: i32) -> Result<PgQueryResult, sqlx::Error> {
        sqlx::query!("DELETE FROM data WHERE source = $1", source)
            .execute(&*self.pool)
            .await
    }
}
