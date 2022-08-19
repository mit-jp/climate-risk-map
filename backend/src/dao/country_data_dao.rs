use crate::model::CountryData;

use super::CountrySimpleData;
use super::SourceAndDate;
use super::Table;

impl<'c> Table<'c, CountryData> {
    pub async fn by_id_source_date(
        &self,
        id: i32,
        source_and_date: SourceAndDate,
    ) -> Result<Vec<CountrySimpleData>, sqlx::Error> {
        sqlx::query_as!(
            CountrySimpleData,
            "
            SELECT country_id, value
            FROM country_data
            WHERE dataset = $1
            AND source = $2
            AND start_date = $3
            AND end_date = $4
            ",
            id,
            source_and_date.source,
            source_and_date.start_date,
            source_and_date.end_date
        )
        .fetch_all(&*self.pool)
        .await
    }
}
