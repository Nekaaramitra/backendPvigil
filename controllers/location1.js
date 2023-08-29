const fs = require("fs");
const path = require("path");
const inside = require("point-in-polygon");
const toGeoJSON = require("togeojson");
const { DOMParser } = require("xmldom");

const kmlFilePath = path.join(__dirname, "../kml-files/KML_Ballari_City1.kml");
// console.log("KML File Path:", kmlFilePath);

// Read the KML file
const kml = fs.readFileSync(kmlFilePath, "utf8");

// Convert KML to GeoJSON
const kmlParser = new DOMParser();
const kmlDocument = kmlParser.parseFromString(kml);
const geoJSON = toGeoJSON.kml(kmlDocument);

// Extract the boundary coordinates of each polygon (ward) and store them in an array
const polygons = geoJSON.features.map((feature) => ({
  coordinates: feature.geometry.coordinates[0],
  wardName: feature.properties.name,
}));

// Location validation function
const validateLocation = (latitude, longitude) => {
  // Check if the given location is within any of the polygons (wards)
  for (let i = 0; i < polygons.length; i++) {
    const { coordinates, wardName } = polygons[i];
    if (inside([longitude, latitude], coordinates)) {
      console.log("Inside ward:", wardName);
      return { isInsideCityLimits: true, wardName };
    }
  }

  console.log("Not inside any ward.");
  return { isInsideCityLimits: false, wardName: null };
};

module.exports = { validateLocation };
