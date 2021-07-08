use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(FromRow, Deserialize, Serialize)]
pub struct MapVisualization {
    pub id: i32,
    pub dataset: i32,
    pub map_type: i16,
    pub legend_ticks: Option<i16>,
    pub should_normalize: bool,
    pub color_palette: i16,
    pub reverse_scale: bool,
    pub invert_normalized: bool,
    pub scale_type: i16,
    pub formatter_type: i16,
    pub decimals: i16,
    pub legend_formatter_type: Option<i16>,
    pub legend_decimals: Option<i16>,
}
