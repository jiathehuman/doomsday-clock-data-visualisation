//-----------------------------------------------------
// DOOMSDAY CLOCK VISUALISATION EXTENSION (ORIGINAL)
//-----------------------------------------------------

/* 
    Data sourced from: 
    sea-level: https://research.csiro.au/slrwavescoast/sea-level/, https://hpc.csiro.au/users/326141/Sea_Level_data/gmsl_files/
    nuclear-stockpile: https://ourworldindata.org/nuclear-weapons
    temperature anomaly: https://ourworldindata.org/grapher/temperature-anomaly
    minutes to midnight: https://thebulletin.org/doomsday-clock/timeline/ 

    DESCRIPTION
    A circular 'clock design' showing the countdown to midnight, 
    where midnight significies global catastrophe.

    HOW TO INTERACT
    Clock animates from 1947 to 2022 at first.
    After animation, use slider to control animation over the years and 
    checkboxes to choose what factor you would like to see.
*/

function Doomsday() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Doomsday Clock: 1947-2022";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "doomsday";

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Graph properties.

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    var self = this;
    this.data = loadTable(
      "./data/climate-change/doomsday_clock.csv",
      "csv",
      "header",
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      }
    );
  };

  this.setup = function () {
    this.nuclearRadius = 75;
    this.seaRadius = 150;
    this.tempRadius = 225;

    // creates global variables for each piece of data
    this.nuclearStock = this.data.getColumn("nuclear_stock");
    this.seaLevel = this.data.getColumn("sea_level");
    this.tempLevel = this.data.getColumn("temp_anomaly");
    this.year = this.data.getColumn("year");

    this.handPosition = this.data.getColumn("mins_to_midnight");

    // create the checkboxes to show/hide each factor
    temperature_select = createCheckbox("Global Temperature", true);
    nuclear_select = createCheckbox("Nuclear Arms", true);
    sea_select = createCheckbox("Sea Levels", true);
    clockHand = createCheckbox("Clock Hand", true);

    // to position the checkboxes
    temperature_select.position(width / 4 + 30, height / 3);
    nuclear_select.position(width / 4 + 30, height / 3 + 20);
    sea_select.position(width / 4 + 30, height / 3 + 40);
    clockHand.position(width / 4 + 30, height / 3 + 60);

    // slider for the user to choose the year
    year_select = createSlider(1947, 2022, 2022, 1);
    year_select.position(width / 4 + 15, height / 5 + 35);

    this.currentRow = 0;

    this.animateFinished = false;

    text(255);
    textSize(16);
    textAlign(CENTER);
  };

  this.destroy = function () {
    // destroys the checkboxes and slider when clicking away from this visualisation
    temperature_select.remove();
    nuclear_select.remove();
    sea_select.remove();
    clockHand.remove();
    year_select.remove();
  };

  this.draw = function () {
    background(40);
    translate(width / 2, height / 2);
    noFill();
    stroke(255);

    noStroke();
    fill(255);
    textSize(20);
    text(this.name, -width / 2 + 150, -height / 2 + 50);

    // Boolean array to contain each constructor - global-temp, nuclear arms, sea-level and clock-hand
    let doomsday_vis = [];
    let year_selected = 75 - (2022 - year_select.value()); // the year selected determines the number of points drawn

    /*
    Each constructor is drawn in a different js file.
    Since this.currentRow is refreshed every draw, we cannot declare this in setup 
    */

    doomsday_vis.push(
      new Global_temperature(
        this.currentRow,
        this.tempLevel,
        this.seaRadius,
        this.tempRadius,
        this.animateFinished,
        year_selected
      )
    );
    doomsday_vis.push(
      new Nuclear_arms(
        this.currentRow,
        this.nuclearStock,
        this.nuclearRadius,
        this.animateFinished,
        year_selected
      )
    );
    doomsday_vis.push(
      new SeaLevel(
        this.currentRow,
        this.seaLevel,
        this.nuclearRadius,
        this.seaRadius,
        this.animateFinished,
        year_selected
      )
    );
    doomsday_vis.push(
      new ClockHand(
        this.currentRow,
        this.handPosition,
        this.animateFinished,
        year_selected
      )
    );

    // Booleans for the checkboxes, dictates whether the particular factor is drawn.
    var checkBoxes = [];
    checkBoxes.push(temperature_select.checked());
    checkBoxes.push(nuclear_select.checked());
    checkBoxes.push(sea_select.checked());
    checkBoxes.push(clockHand.checked());

    // For each factor, check if the checkbox corresponding to it has been checked.
    // If yes, draw the visualisation.
    for (var i = 0; i < doomsday_vis.length; i++) {
      if (checkBoxes[i]) {
        doomsday_vis[i].draw();
      }
    }

    /* DRAWS THE NUMBERS OF THE CLOCK 
        Figuring out polar coordinates: https://en.wikipedia.org/wiki/Polar_coordinate_system#
    */

    // draws years at the center
    noStroke();
    textSize(20);
    fill(255);
    text(this.year[this.currentRow], 0, 0);

    // once the number of frames reaches the number of pieces of data in total, the animateFinished boolean checks true
    if (this.currentRow == this.year.length) {
      this.animateFinished = true;
    }

    // once the visualisation finishes animating, the text in the middle changes based on the slider
    if (this.animateFinished) {
      noStroke();
      textSize(20);
      fill(255);
      text(this.year[year_selected], 0, 0);
    }

    // increments the rows drawn to simulate the animation
    this.currentRow += 1;

    // calls the makeLegend function which populates the text at the top right corner
    this.makeLegend(this.currentRow, year_selected);
  };

  // Populates the legend on the right and creates a background for the checkboxes at the left
  this.makeLegend = function (year, year_selected) {
    fill(255);

    // provide a background for the checkboxes
    fill(135);
    rect(-width / 2 + 10, -height / 5, 200, 110);

    // label the slider
    fill(255);
    text("Years:", -width / 2 + 40, -height / 3 + 40);

    // small text at the bottom right
    let text_x = width / 2 - 130;
    let text_y = -height / 2 + 100;
    noStroke();
    textSize(10);
    text(
      "*Global land-sea anomaly relative to 1961 - 1990 average",
      width / 2 - 150,
      height / 2 - 20
    );
    textSize(13);

    // If the animation is still loading (at the start), the text changes along with the animation.
    if (!this.animateFinished) {
      text(
        "Nuclear Stock: " + this.nuclearStock[year] + " estimated warheads",
        text_x,
        text_y
      );
      text(
        "Sea Level: " + this.seaLevel[year] + "GSML (mm)",
        text_x,
        text_y + 20
      );
      text(
        "Temperature level: " + this.tempLevel[year] + " celcius*",
        text_x,
        text_y + 40
      );
      text(
        "Minutes to midnight: " + this.handPosition[year] + " mins to midnight",
        text_x,
        text_y + 60
      );
    }

    //takes care of the second scenerio - the instance the animation finishes and the user has not interacted with the slider
    else if (this.animateFinished && year_selected == this.year.length) {
      //https://flexiple.com/javascript/get-last-array-element-javascript/

      text(
        "Nuclear Stock: " + this.nuclearStock.slice(-1) + " estimated warheads",
        text_x,
        text_y
      );
      text(
        "Sea Level: " + this.seaLevel.slice(-1) + "GSML (mm)",
        text_x,
        text_y + 20
      );
      text(
        "Temperature level: " + this.tempLevel.slice(-1) + " celcius*",
        text_x,
        text_y + 40
      );
      text(
        "Minutes to midnight: " +
          this.handPosition.slice(-1) +
          " mins to midnight",
        text_x,
        text_y + 60
      );
    }

    //in the third scenerio where the user slides to previous years
    else {
      text(
        "Nuclear Stock: " +
          this.nuclearStock[year_selected] +
          " estimated warheads",
        text_x,
        text_y
      );
      text(
        "Sea Level: " + this.seaLevel[year_selected] + "GSML (mm)",
        text_x,
        text_y + 20
      );
      text(
        "Temperature level: " + this.tempLevel[year_selected] + " celcius*",
        text_x,
        text_y + 40
      );
      text(
        "Minutes to midnight: " +
          this.handPosition[year_selected] +
          " mins to midnight",
        text_x,
        text_y + 60
      );
    }
  };
}
