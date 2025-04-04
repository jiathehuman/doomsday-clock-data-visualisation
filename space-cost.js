//--------------------------------------------------
// COST OF SPACE LAUNCHES EXTENSION (ORIGINAL)
//--------------------------------------------------

/*
    Data sourced from: 
    https://ourworldindata.org/grapher/cost-space-launches-low-earth-orbit

    HOW TO INTERACT
    Use the slider to control the year!  
 */

function SpaceCost() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Cost of Space Launches";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "cost-of-space-launches";

  // Title to display above the plot.
  this.title = "Cost of Space Launches to low Earth Orbit: 1961 - 2019";

  // Axis lables
  this.xAxisLabel = "Year";
  this.yAxisLabel = "Cost";

  var marginSize = 35; // Margin Size

  this.preload = function () {
    var self = this;
    this.data = loadTable(
      "./data/space/space-launches.csv",
      "csv",
      "header",
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      }
    );
  };

  // Determines layout of the visualisation
  this.layout = {
    marginSize: marginSize,

    // Locations of margin positions. Left and bottom have double margin
    // size due to axis and tick labels.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5,

    plotWidth: function () {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function () {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean to enable/disable background grid.
    grid: false,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  this.setup = function () {

    // draws out the values from the columns for manipulaion later
    this.cost = this.data.getColumn("cost_per_kg");
    this.year = this.data.getColumn("year");
    this.launch_class = this.data.getColumn("launch_class");
    this.entity = this.data.getColumn("entity");

    // array that will contain each individual launch 
    this.launches = [];
    this.frameRate = 0;

    // user selects the end year with the slider
    endY_select = createSlider(1961, 2019, 2019, 1);
    endY_select.position(width / 4 + 120, height - 30);

    // calculates the minimum and maximum cost to calculate y-axis
    minCost = min(this.cost);
    maxCost = max(this.cost);

    //hard codes the year
    startYear = 1961;
    endYear = 2019;

    numRows = this.data.getRowCount();

    for (var i = 0; i < numRows; i++) {

      // calculates expected x and y for the particular individual launch
      expected_y = map(
        this.cost[i],
        minCost,
        maxCost,
        this.layout.bottomMargin - 50,
        this.layout.topMargin
      );
      expected_x = map(
        this.year[i],
        startYear,
        endYear,
        this.layout.leftMargin + 10,
        this.layout.rightMargin - 10
      );

      // gets the data for the particular individual launch
      size = this.launch_class[i];
      cost = this.cost[i];
      year = this.year[i];
      entity = this.entity[i];

      // pushes this particular launch into the array
      this.launches.push(
        new Launch(
          expected_x,
          this.layout.bottomMargin,
          expected_y,
          size,
          cost,
          year,
          entity
        )
      );

      // at the end of this loop, the array will contain all the launches
    }
  };

  this.destroy = function(){
    endY_select.remove()
  };

  this.draw = function () {
    background(40);

    drawAxis(this.layout, 255); // draws axis

    drawYAxisTickLabels(
      minCost,
      maxCost,
      this.layout,
      this.mapCostToHeight.bind(this),
      0,
      255
    ); // draws the labels on the y-axis

    // draws the x and y axes labels
    text("Cost of launch", this.layout.leftMargin + 20, this.layout.topMargin - 15)
    text("Years", this.layout.rightMargin,this.layout.bottomMargin + 15)

    // draws the title of the visualisation
    push();
    textSize(20);
    text(this.title, width - 40, this.layout.topMargin);
    textSize(15)
    text("Hover over the 'rockets' to see exact details !!!", width - 40, this.layout.topMargin + 25)

    pop();

    // gets the number of rows to be drawn (year determined by user)
    endYear = endY_select.value() - 1961;

    text("Year", width / 10, height - 30);

      // draws the launch
    for (var i = 0; i < endYear; i++) {
      this.launches[i].draw(this.frameRate);
    }

    this.frameRate += 1; // controls the speed of the launch

    this.legend();
  };

  // maps the cost to the y-axis, with the highest cost at the top and lowest at the bottom
  this.mapCostToHeight = function (value) {
    return map(
      value,
      minCost,
      maxCost,
      this.layout.bottomMargin, // Draw left-to-right from margin.
      this.layout.topMargin
    );
  };

  // maps the year to the width
  this.mapYearToWidth = function (value) {
    return map(
      value,
      1961,
      2019,
      this.layout.leftMargin + 10,
      this.layout.rightMargin - 10
    );
  };

  this.legend = function () {
    var x = this.rightMargin;
    var y = this.topMargin;

    push()
    fill(255)
    textSize(15)
    text("Payload size", width - 120, this.layout.topMargin + 80)
    pop()

    for (var i = 0; i < 3; i++) {
      var x = width - 200;
      var y = this.layout.topMargin + 100 + i * 30;
      var s = 15;

      if (i == 0) {
        //Heavy
        fill(242, 122, 125);
        text("Heavy", x + 70, y + 7)
      }
      if (i == 1) {
        //Medium
        fill(247, 212, 134);
        text("Medium", x + 70, y + 7)

      } else if (i == 2) {
        //Small
        fill(197, 249, 215);
        text("Small", x + 70, y + 7)

      }

      rect(x, y, s, s);
    }
  };
}
