//---------------------------------------------
// NUTRIENTS (SOME ORIGINAL)
//---------------------------------------------

/* 
    Data sourced from: Coursera

    DESCRIPTION
    Shows nutrients intake from 1974 to 2016

    HOW TO INTERACT
    Click on the dropdown menu to select the nutrient you want to display
    Hover over the line graph to interact and see the specific nutrient intake that year
*/

function NutrientsSeries() {
  this.name = "Nutrients:1974 - 2016";
  this.id = "nutrients-series";
  this.title = "Nutrients:1974 - 2016";

  this.xAxisLabel = "year";
  this.yAxisLabel = "%";

  this.colors = [];

  var marginSize = 35;

  this.loaded = false;

  this.preload = function () {
    var self = this;
    this.data = loadTable(
      "./data/food/nutrients74-16.csv",
      "csv",
      "header",
      function (table) {
        self.loaded = true;
      }
    );
  };

  this.setup = function () {
    textSize(16);
    // Finds the start and end year
    this.startYear = Number(this.data.columns[1]);
    this.endYear = Number(this.data.columns[this.data.columns.length - 1]);

    this.minPercentage = 80;
    this.maxPercentage = 400;

    // creates a dropdown selection
    this.select = createSelect();
    this.select.position(
      this.layout.leftMargin + 230,
      this.layout.bottomMargin + 75
    );

    this.nutrients_name = []; // empty array for the nutrients, populated later
    this.numYears = this.endYear - this.startYear;

    // populate the array 'nutrients_name' with all the nutrients
    for (var i = 0; i < this.data.getRowCount(); i++) {
      // push the nutrient into the array
      d = this.data.getString(i, 0);
      this.nutrients_name.push(d);
      this.select.option(this.nutrients_name[i]); // populate the options for the drop-box

      //https://p5js.org/reference/#/p5/color - creates a color object
      randomColor = color(random(0, 255), random(0, 255), random(0, 255));

      this.colors.push(randomColor); // pushes the random colour into the array
    }
  };

  // layout for the visualisation
  this.layout = {
    marginSize: marginSize,

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

    grid: true, //Boolean for background grid

    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  this.destroy = function () {
    this.select.remove();
  };

  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    //draw title
    this.drawTitle();

    //draw labels on y axis
    drawYAxisTickLabels(
      this.minPercentage,
      this.maxPercentage,
      this.layout,
      this.mapNutrientsToHeight.bind(this),
      0
    );

    //draw x and y
    drawAxis(this.layout);
    //draw x and y axis
    drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);

    this.makeLegendItem();

    fill(0);
    text(
      "Select nutrient to see:",
      this.layout.leftMargin + 50,
      this.layout.bottomMargin + 50
    );

    // the value selected by the user will be the nutrient drawn
    var nutrient_selected = this.select.value();
    var all_nutrients = this.data.getColumn(0); // gets the nutrients' names

    //https://p5js.org/reference/#/p5.Table/matchRow to find the particular row
    var col = this.data.matchRow(nutrient_selected, 0);
    //https://www.w3schools.com/jsref/jsref_indexof_array.asp to find the row index of the nutrient selected
    var colour_index = all_nutrients.indexOf(nutrient_selected);
    var colour = this.colors[colour_index]; // the colour will be at the same index
    this.drawGraph(col, colour, nutrient_selected);
  };

  this.drawGraph = function (col, colour, label) {
    let numYears = this.endYear - this.startYear;

    if (col == null) {
      column = this.data.getRow(8);
    } //catches last row because matchRow does not
    else {
      column = col;
    }

    var previous = null;

    push();
    //this.numYears + 2 because we took 1974 - 2016 which is 42, but did not account for 1974 and 2016 itself
    for (var i = 1; i < this.numYears + 2; i++) {
      var current = {
        year: this.startYear + i,
        percentage: column.getNum(i),
      };

      stroke(colour);
      strokeWeight(2.5);

      // if it is the first value
      if (previous == null) {
        var x2 = this.mapYearToWidth(current.year);
        var secondValue = column.getNum(i + 1);
        var y2 = this.mapNutrientsToHeight(current.percentage);

        var x1 = this.layout.leftMargin;
        var y1 = this.mapNutrientsToHeight(secondValue);

        // draws the graph
        line(x1, y1, x2, y2);
      }

      // if it is all the values afterwards
      else if (previous != null) {
        var x1 = this.mapYearToWidth(previous.year);
        var y1 = this.mapNutrientsToHeight(previous.percentage);
        var x2 = this.mapYearToWidth(current.year);
        var y2 = this.mapNutrientsToHeight(current.percentage);

        line(x1, y1, x2, y2);

        // calculates number of ticks
        var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

        if (i % xLabelSkip == 0) {
          push();
          strokeWeight(1);
          var currentTextSize = textSize();
          textSize(9);
          drawXAxisTickLabel(
            previous.year,
            this.layout,
            this.mapYearToWidth.bind(this)
          );
          textSize(currentTextSize);
          pop();
        }
      } else {
        noStroke();
      }

      //local checkMouse function
      this.checkMouse(
        x1,
        y1,
        label,
        current.year - 1,
        current.percentage,
        colour
      );
      previous = current;
    }

    pop();
  };

  // draws the title on the top of the visualisation
  this.drawTitle = function () {
    fill(0);
    noStroke();
    textAlign("center", "center");

    text(
      this.title,
      this.layout.plotWidth() / 2 + this.layout.leftMargin,
      this.layout.topMargin - this.layout.marginSize / 2
    );

    // lets users know that they can hover over the line chart to see more details
    text("Please hover over the line chart", this.layout.plotWidth() / 2 + this.layout.leftMargin,
    this.layout.topMargin - this.layout.marginSize / 2 + 30 )
  };

  // maps the year to the width
  this.mapYearToWidth = function (value) {
    return map(
      value,
      this.startYear,
      this.endYear + 1,
      this.layout.leftMargin,
      this.layout.rightMargin
    );
  };

  // maps the percentage to the height
  this.mapNutrientsToHeight = function (value) {
    return map(
      value,
      this.minPercentage,
      this.maxPercentage,
      this.layout.bottomMargin,
      this.layout.topMargin
    );
  };

  // creates the legend item
  this.makeLegendItem = function () {
    for (var i = 0; i < this.data.getRowCount(); i++) {
      //size of the box
      var boxWidth = 10;
      var boxHeight = 10;

      // x and y co-ordinates of the box
      var x = this.layout.rightMargin - 150;
      var y = 50 + (boxHeight + 10) * i; // y coordinate increases with each increment
      var label = this.data.get(i, 0); // the label for the box

      noStroke();
      fill(this.colors[i]); // same color as the line graph
      rect(x, y, boxWidth, boxHeight); // draws the box

      //https://p5js.org/reference/#/p5/push
      //push and pop such that the text settings is contained within this function
      push();
      fill("black");
      noStroke();
      textAlign("left", "center");
      textSize(12);
      text(label, x + boxWidth + 10, y + boxWidth / 2); // draws the label
      pop();
    }
  };

  // Local function to check if the mouse is near the data point
  this.checkMouse = function (x, y, label, year, nutrients, colour) {
    d = dist(mouseX, mouseY, x, y);
    // coverts the year and nutrients into strings
    y_w = str(year);
    n_w = str(nutrients);

    // if the user is near, the text appears
    if (d < 10) {
      noStroke();
      fill(colour);
      strokeWeight(0.75);
      textSize(20);
      text(
        label + " intake in Year " + y_w + " : " + "\n" + n_w + "%",
        width / 2,
        height / 2
      );
    }
  };
}
