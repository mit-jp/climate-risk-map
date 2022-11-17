use crate::controller::data_controller::DataQuery;
use crate::model::CountyPercentileData;

use super::Data;
use super::SimpleData;
use super::SourceAndDate;
use super::Table;

impl<'c> Table<'c, Data> {
    pub async fn by_id(&self, id: i32) -> Result<Vec<Data>, sqlx::Error> {
        sqlx::query_as("SELECT state_id, county_id, source, start_date, end_date, value FROM county_data WHERE dataset = $1")
            .bind(id)
            .fetch_all(&*self.pool)
            .await
    }
    pub async fn by_category_state_county(
        &self,
        info: DataQuery,
    ) -> Result<Vec<CountyPercentileData>, sqlx::Error> {
        sqlx::query_as!(
            CountyPercentileData,
            r#"
        SELECT
            entry.dataset as "dataset!",
            entry.dataset_name as "dataset_name!",
            entry.source as "source!",
            entry.start_date as "start_date!",
            entry.end_date as "end_date!",
            (
                SELECT
                    value
                FROM
                    county_data
                WHERE
                    state_id = $1
                    AND county_id = $2
                    AND dataset = entry.dataset
                    AND source = entry.source
                    AND start_date = entry.start_date
                    AND end_date = entry.end_date
            ),
            percent_rank(
                (
                    SELECT
                        CASE WHEN entry.invert_normalized THEN -value ELSE value END as value
                    FROM
                        county_data
                    WHERE
                        state_id = $1
                        AND county_id = $2
                        AND dataset = entry.dataset
                        AND source = entry.source
                        AND start_date = entry.start_date
                        AND end_date = entry.end_date
                )
            ) within GROUP (
                ORDER BY CASE WHEN entry.invert_normalized THEN -value ELSE value END
            )
        FROM
            county_data,
            (
                SELECT
                    map_visualization.dataset,
                    dataset.name as dataset_name,
                    COALESCE(default_source, source) AS source,
                    COALESCE(default_start_date, start_date) AS start_date,
                    COALESCE(default_end_date, end_date) AS end_date,
                    invert_normalized
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
                            county_data
                        GROUP BY
                            dataset
                    ) AS cd
                WHERE
                    map_visualization_collection.category = $3
                    AND map_visualization.dataset = dataset.id
                    AND cd.dataset = map_visualization.dataset
                    AND map_visualization_collection.map_visualization = map_visualization.id
            ) AS entry
        WHERE
            county_data.dataset = entry.dataset
            AND county_data.source = entry.source
            AND county_data.start_date = entry.start_date
            AND county_data.end_date = entry.end_date
        GROUP BY
            entry.dataset,
            entry.dataset_name,
            entry.source,
            entry.start_date,
            entry.end_date,
            entry.invert_normalized;
        "#,
            info.state_id,
            info.county_id,
            info.category
        )
        .fetch_all(&*self.pool)
        .await
    }
    pub async fn by_id_source_date(
        &self,
        id: i32,
        source_and_date: SourceAndDate,
    ) -> Result<Vec<SimpleData>, sqlx::Error> {
        sqlx::query_as(
            "
            SELECT
                state_id, county_id, value
            FROM county_data
            WHERE dataset = $1
            AND source = $2
            AND start_date = $3
            AND end_date = $4
            ",
        )
        .bind(id)
        .bind(source_and_date.source)
        .bind(source_and_date.start_date)
        .bind(source_and_date.end_date)
        .fetch_all(&*self.pool)
        .await
    }
}
