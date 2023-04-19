use super::{data_source, dataset::PartialCreator};
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, fmt};

#[derive(Deserialize, Serialize, Debug, PartialEq)]
pub enum Source {
    ExistingId(i32),
    New(data_source::Creator),
}

#[derive(Deserialize, Serialize, Debug, PartialEq)]
pub struct UploadMetadata {
    pub id_column: String,
    pub date_column: String,
    pub geography_type: i32,
    pub source: Source,
    pub existing_datasets: HashMap<String, i32>,
    pub new_datasets: HashMap<String, PartialCreator>,
}

impl fmt::Display for UploadMetadata {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", serde_json::to_string_pretty(self).unwrap())
    }
}

#[cfg(test)]
mod test {
    use crate::model::{
        data_source, dataset,
        upload_metadata::{Source, UploadMetadata},
    };
    use std::collections::HashMap;

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
            "existing_datasets": {
                "ExistingDataset": 1
            },
            "new_datasets": {
                "NewDataset": {
                    "name": "New dataset",
                    "units": "this is the units",
                    "description": "this is the description"
                }
            }
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
                source: Source::New(data_source::Creator {
                    name: "US Census Bureau".to_string(),
                    description: "Population estimates by the US Census Bureau".to_string(),
                    link: "https://www.census.gov".to_string(),
                }),
                existing_datasets: HashMap::from([("ExistingDataset".to_string(), 1),]),
                new_datasets: HashMap::from([(
                    "NewDataset".to_string(),
                    dataset::PartialCreator {
                        name: "New dataset".to_string(),
                        units: "this is the units".to_string(),
                        description: "this is the description".to_string(),
                    }
                )])
            }
        )
    }
}
