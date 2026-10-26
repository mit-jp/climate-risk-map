# Socio-Environmental Systems Risk Triage

[![Build And Test](https://github.com/cypressf/climate-risk-map/actions/workflows/build-release.yml/badge.svg)](https://github.com/cypressf/climate-risk-map/actions/workflows/build-release.yml)

This is an interactive map for the MIT Center for Sustainability Science and Strategy (CS3). You can use it to combine, overlay, and diagnose landscapes of socio-economic, health, and environmental risk and injustice.

## Running the code

[Frontend](frontend)

[Backend](backend)

## Dev guide: Adding a new map type

This codebase was originally designed to show maps only for counties of the USA, and thus adding maps of different regions wasn't a design intent. This resulted in it being difficult to add maps of different regions. If you're interested in adding a map of a new region with different geographic ids than the existing ones, for instance census tracts, then read on.

### Database

In order to uniquely identify any region in the database, we use a compound id: `geography_type`, `id`. `geography_type` can be one of `usa-state`, `usa-county`, `usa-city`, or `country`. Each region needs a geography type in order to be uniquely identified to avoid collisions between ids for different geography types. For instance, it's possible that an id for a country could be identical to an id for a county in the USA. To add a new map type, you first need to add a new `geography_type` and then add all the relevant `geo_id`s for that geography type.

### Backend

There should be no backend changes required besides the database update.

### The map geometry: topojson file (`world.json`, `usa.json`, etc)

In order to show the map on the frontend, you need to create a topojson file for it. Keep three things in mind when creating this file:

1. It must be small in order to load efficiently and quickly.
2. It must be projected and sized appropriately for the svg viewing area 1175x610.
3. If it's intended to be overlaid on top of an existing topojson file, you must use the same projection as the existing topojson file to get them to line up.

You will probably have access to a shape file, and need to convert it to topojson. Look at the [`map-data-cleaning`](https://github.com/mit-jp/map-data-cleaning) repo for examples of converting shape files to topojson, projecting them, and sizing them appropriately. It's full of example scripts. They all use the d3 command line tools that you can install with npm. Read more about how to use them in this trio of blog posts [Command Line Cartography](https://medium.com/@mbostock/command-line-cartography-part-1-897aa8f8ca2c#.8jny46gjo), then read the scripts to understand them.

Here's an example

```fish
#!/usr/bin/env fish

shp2json "shape files/CRITHAB_LINE.shp" | # convert a shape file into geojson
    geoproject -n 'd3.geoAlbersUsa().scale(1300).translate([487.5, 305])' | # project the shape file to the US albers projection we use
    ndjson-split 'd.features' | # split the geojson file into lines, where each line is its own geographic area
    ndjson-map 'delete d.properties.singlmulti, # delete all the properties in the shape file except for the geoids. You don't need them and they take up sapce
delete d.properties.comname,
delete d.properties.sciname,
delete d.properties.spcode,
d' >temp-map.ndjson # save the file to a temporary file because you cannot pipe into geo2topo
geo2topo -n overlay=temp-map.ndjson | # convert the geojson file to a topojson file (more space efficient)
    toposimplify -p 1 -f | # simplify the topojson file so that any lines that would render smaller than 1 pixel are simplified (more space efficient)
    topoquantize 1e5 >critical-habitats-topo.json # truncate all the sig figs past 5. e.g. 1.00000000000000000001 becomes 1.00000 (more space efficient)
```

You should play around with `toposimplify` and `topoquantize` in order to find a good balance of space efficiency and resolution. Once you have the topojson file exported, you can copy it to [`frontend/public/`](frontend/public/) and load it up in the frontend code.

### Frontend

This is the most complex part. The best way to go about adding a completely new region to the frontend is to search the repo for references to other topojson files, then add references to your new topojson file in those places, then update everywhere where there are typescript errors after that.

For instance, search the entire repo for `usa.json`. Currently it's referenced in `Home.tsx` and `Editor.tsx`. Modify those files a reference to your new file, then run `yarn tsc --noEmit` to see all the typescript errors and update the code to fix them. If the types work out properly, they should guide you to update the code everywhere you need to.
