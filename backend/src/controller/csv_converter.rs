use serde::Serialize;
use std::error::Error;

pub fn convert<S: Serialize>(data: Vec<S>) -> Result<String, Box<dyn Error>> {
    let mut writer = csv::Writer::from_writer(vec![]);
    for d in data {
        writer.serialize(d)?;
    }
    let serialized_data = writer.into_inner()?;
    Ok(String::from_utf8(serialized_data)?)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::model::data::Simple;

    #[test]
    fn it_converts_data_to_csv() {
        let data = vec![
            Simple {
                id: 123,
                value: 3.0,
            },
            Simple {
                id: 456,
                value: 6.0,
            },
        ];
        let csv = convert(data).unwrap();
        assert_eq!(csv, "id,value\n123,3.0\n456,6.0\n");
    }
}
