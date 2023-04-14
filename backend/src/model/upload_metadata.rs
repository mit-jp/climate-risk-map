use super::NewDataSource;
use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Deserialize, Serialize, Debug, PartialEq)]
pub enum Source {
    ExistingId(i32),
    New(NewDataSource),
}

#[derive(Deserialize, Serialize, Debug, PartialEq)]
pub struct Column {
    pub name: String,
    pub start_date: NaiveDate,
    pub end_date: NaiveDate,
}

#[derive(Deserialize, Serialize, Debug, PartialEq)]
pub struct NewDataset {
    pub columns: Vec<Column>,
    pub name: String,
    pub short_name: String,
    pub units: String,
    pub geography_type: i32,
    pub description: String,
}

#[derive(Deserialize, Serialize, Debug, PartialEq)]
pub struct UploadMetadata {
    pub id_column: String,
    pub source: Source,
    pub datasets: Vec<NewDataset>,
}

impl fmt::Display for UploadMetadata {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", serde_json::to_string_pretty(self).unwrap())
    }
}

#[test]
fn test_parse_metadata() {
    let metadata_string = r#"{
        "id_column": "id",
        "source": {
            "New": {
                "name": "US Census Bureau",
                "description": "Population estimates by the US Census Bureau",
                "link": "https://www.census.gov"
            }
        },
        "datasets": [
            {
                "name": "Population",
                "short_name": "population",
                "units": "people",
                "geography_type": 1,
                "description": "this is the description",
                "columns": [
                    {
                        "name": "POPESTIMATE2010",
                        "start_date": "2010-01-01",
                        "end_date": "2010-12-31"
                    },
                    {
                        "name": "POPESTIMATE2011",
                        "start_date": "2011-01-01",
                        "end_date": "2011-12-31"
                    }
                ]
            }
        ]
    }"#;
    let metadata: UploadMetadata = match serde_json::from_str(metadata_string) {
        Ok(m) => m,
        Err(e) => panic!("{}", e),
    };
    assert_eq!(
        metadata,
        UploadMetadata {
            id_column: "id".to_string(),
            source: Source::New(NewDataSource {
                name: "US Census Bureau".to_string(),
                description: "Population estimates by the US Census Bureau".to_string(),
                link: "https://www.census.gov".to_string(),
            }),
            datasets: vec![NewDataset {
                name: "Population".to_string(),
                short_name: "population".to_string(),
                units: "people".to_string(),
                geography_type: 1,
                description: "this is the description".to_string(),
                columns: vec![
                    Column {
                        name: "POPESTIMATE2010".to_string(),
                        start_date: NaiveDate::from_ymd_opt(2010, 1, 1).unwrap(),
                        end_date: NaiveDate::from_ymd_opt(2010, 12, 31).unwrap(),
                    },
                    Column {
                        name: "POPESTIMATE2011".to_string(),
                        start_date: NaiveDate::from_ymd_opt(2011, 1, 1).unwrap(),
                        end_date: NaiveDate::from_ymd_opt(2011, 12, 31).unwrap(),
                    },
                ],
            }],
        }
    )
}
