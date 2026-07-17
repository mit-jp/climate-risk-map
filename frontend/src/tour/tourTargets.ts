/**
 * Element ids the tour points at. Components set `id={TOUR_TARGET.x}` and
 * TourPlanner selects `#${TOUR_TARGET.x}`, so the coupling is explicit.
 */
const TOUR_TARGET = {
    map: 'map-svg',
    dataSelector: 'data-selector',
    reportCard: 'report-card-div',
    overlays: 'map-overlays',
    downloads: 'download-buttons',
    dataDescription: 'data-desc',
    navigation: 'navigation',
    regionSelector: 'region-selector',
    viewTourButton: 'view-tour-button-id',
} as const

export default TOUR_TARGET
