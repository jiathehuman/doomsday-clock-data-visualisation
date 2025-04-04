// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;

function setup() {
  // Create a canvas to fill the content div from index.html.
  canvasContainer = select("#app");
  var c = createCanvas(1024, 576);

  c.parent("app");

  // Create a new gallery object.
  gallery = new Gallery();

  // Original visualisations
  gallery.addVisual(new CarbonEmissions());
  gallery.addVisual(new Doomsday());
  gallery.addVisual(new SpaceCost());

  // Turning pie chart to donut chart
  gallery.addVisual(new TechDiversityRace());
  gallery.addVisual(new UKFoodAttitudes());

  //Enhancing existing code on template
  gallery.addVisual(new NutrientsSeries());
  gallery.addVisual(new PayGapByJob2017());

  //little to no changes
  gallery.addVisual(new TechDiversityGender());
  gallery.addVisual(new PayGapTimeSeries());
  gallery.addVisual(new ClimateChange());
}

function draw() {
  background(255);

  if (gallery.selectedVisual != null) {
    gallery.selectedVisual.draw();
  }
}
