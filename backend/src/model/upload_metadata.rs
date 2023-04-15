use super::NewDataSource;
use serde::{Deserialize, Serialize};
use std::fmt;
use str_slug::slug;

#[derive(Deserialize, Serialize, Debug, PartialEq)]
pub enum Source {
    ExistingId(i32),
    New(NewDataSource),
}

#[derive(Deserialize, Serialize, Debug, PartialEq, Clone)]
pub struct Column {
    pub name: String,
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

impl NewDataset {
    pub fn from(dataset: JsonDataset, geography_type: i32) -> Self {
        NewDataset {
            columns: dataset.columns,
            short_name: slug(&dataset.name),
            name: dataset.name,
            units: dataset.units,
            description: dataset.description,
            geography_type,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
pub struct JsonDataset {
    pub columns: Vec<Column>,
    pub name: String,
    pub units: String,
    pub description: String,
}

#[derive(Deserialize, Serialize, Debug, PartialEq)]
pub struct UploadMetadata {
    pub id_column: String,
    pub date_column: String,
    pub geography_type: i32,
    pub source: Source,
    pub datasets: Vec<JsonDataset>,
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
        "date_column": "date",
        "geography_type": 1,
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
                "units": "people",
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
            date_column: "date".to_string(),
            geography_type: 1,
            source: Source::New(NewDataSource {
                name: "US Census Bureau".to_string(),
                description: "Population estimates by the US Census Bureau".to_string(),
                link: "https://www.census.gov".to_string(),
            }),
            datasets: vec![JsonDataset {
                name: "Population".to_string(),
                units: "people".to_string(),
                description: "this is the description".to_string(),
                columns: vec![
                    Column {
                        name: "POPESTIMATE2010".to_string(),
                    },
                    Column {
                        name: "POPESTIMATE2011".to_string(),
                    },
                ],
            }],
        }
    )
}
