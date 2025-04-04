//---------------------------------------------
// 3D DATA VISUALISATION EXTENSION (ORIGINAL)
//---------------------------------------------

/* 
    Data sourced from: https://data.worldbank.org/indicator/EN.ATM.CO2E.PC
    Inspired by: https://www.youtube.com/watch?v=ZeVbsZQiHdU&ab_channel=weidi 
    This links to a tutorial by Weidi Zhang on how to use WEBGL and easycam.js to visualise data in a 3D space.
    Original tutorial used sea levels on a simple sketch. I am using it to show carbon emissions from multiple countries.
    
    I used name-spacing in this visualisation so that WEBGL can be used without affecting the other visualisations.
    With name-spacing, I created a new P5 object to support a different canvas.

    Reference for name-spacing:
    https://stackoverflow.com/questions/73399699/switching-between-p2d-and-webgl
    https://www.youtube.com/watch?v=Su792jEauZg&t=1s&ab_channel=TheCodingTrain

    DESCRIPTION
    The data shows rising carbon emissions from 4 countries - United States, Canada, Japan and China. Each country has a different colour.
    The x-axis is the years and the y-axis is carbon emissions.
    Zoom in to get the exact figure.

    HOW TO INTERACT
    Use left click and drag to rotate around axis, right click and drag to zoom and double click to return to original position! 
*/

function CarbonEmissions() {
  this.name = "Carbon Emissions: 1990 to 2020";
  this.id = "carbon-emissions";
  this.title = "Carbon Emissions: 1990 to 2020 (metric tons per capita)";

  this.loaded = false; //boolean variable set to true in preload

  this.preload = function () {
    var self = this;
    this.data = loadTable(
      "./data/climate-change/carbon-emissions.csv",
      "csv",
      "header",
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      }
    ); //this must be fulfilled to display visual
  };

  this.setup = function () {
    if (!this.loaded) {
      console.log("Mental Health data not yet loaded");
      return;
    }

    /*
    P5.js did not allow me to have 2D and 3D primitives/ operations at the same time. 
    To work around this, I employed name-spacing - coding a new p5 object that is created and destroyed
    everytime I click on the visualisation. 

    threedim_sketch is a function that comprises of everything loaded and drawn in this visualisation.
    This function is parsed as a variable in the new p5 object.
    */

    var threedim_sketch = function (w) {
      w.preload = function () {
        var self = this;
        w.data = loadTable(
          "./data/climate-change/carbon-emissions.csv",
          "csv",
          "header",
          // Callback function to set the value
          // this.loaded to true.
          function (table) {
            self.loaded = true;
          }
        );
        // additional font imported from Google fonts, saved as a local copy.
        w.myFont = loadFont("./lib/roboto-light.ttf");
      };

      w.setup = function () {
        // global variables used in the canvas declared with 'w.' prefix 

        // positions the new canvas within the existing canvas
        w.canvas = w.createCanvas(width, height, WEBGL);
        w.canvas.position(width * 0.3, 20);
        w.data = this.data;
        w.boxwidth = 300;

        // slider selection for 30 years, starts at 2020 with all 30 years displayed
        w.years_selection = w.createSlider(1990, 2020, 2020, 1);
        w.years_selection.position(width / 3, 150);

        /*
        Checkbox options for each country. 
        When checked, the country will be shown. Else, country will not be shown.
        https://p5js.org/reference/#/p5/createCheckbox for reference on how to use checkboxes
        */
        w.usa_selected = w.createCheckbox("United States", true);
        w.canada_selected = w.createCheckbox("Canada", true);
        w.japan_selected = w.createCheckbox("Japan", true);
        w.china_selected = w.createCheckbox("China", true);

        // position of eachh checkbox
        w.usa_selected.position(width / 3, 40);
        w.canada_selected.position(width / 3, 60);
        w.japan_selected.position(width / 3, 80);
        w.china_selected.position(width / 3, 100);

        /*I have included an EasyCam library to allow the user to move around the 3D space with ease.
        https://github.com/diwi/p5.EasyCam/issues/5
        fix for EasyCam to work with p5 v0.7.2
        */
        Dw.EasyCam.prototype.apply = function (n) {
          var o = this.cam;
          (n = n || o.renderer),
            n &&
              ((this.camEYE = this.getPosition(this.camEYE)),
              (this.camLAT = this.getCenter(this.camLAT)),
              (this.camRUP = this.getUpVector(this.camRUP)),
              n._curCamera.camera(
                this.camEYE[0],
                this.camEYE[1],
                this.camEYE[2],
                this.camLAT[0],
                this.camLAT[1],
                this.camLAT[2],
                this.camRUP[0],
                this.camRUP[1],
                this.camRUP[2]
              ));
        };

        /*I downloaded the Easycam.js library to support easy user interaction with the 3D model.
        EasyCam creates an instance to support this function.*/
        w.easycam = w.createEasyCam();

        // suppress right-click context menu such that it can be used by Easycam to support moving around 3D canvas
        document.oncontextmenu = function () {
          return false;
        };

        // changes the cursor to a hand to indicate that the model can be moved
        w.cursor(HAND);

        // imports a textfont to use with easycam
        w.textFont(w.myFont);
      };

      w.draw = function () {
        w.background(245);
        w.noFill(); // ensures that the box is empty and the graph can be seen within
        w.strokeWeight(0); // the stroke of the box is 0
        w.stroke("black"); // the color of the box
        w.box(w.boxwidth); // w.boxwidth is declased at w.setup

        w.push();
        w.translate(-width / 2, -height / 2, -w.boxwidth / 2); // 3D visualisations starts at a different axis
        w.year_selected = w.years_selection.value();
        w.carbonGraph(w.year_selected); // calls the w.carbonGraph function, which is the function that draws the line graphs.
        w.carbonAxis(); // calls the carbonAxis function, which draws the axes of the graphs.

        w.textSize(20); // text above the slider that controls the years
        w.text("Progression over the years", 10, 80);

        // text at the bottom containing instructions for the user
        w.text(
          "Use left click and drag to rotate around axis, right click and drag to zoom and double click to restart! Use arrow buttons to pan around.",
          width / 2,
          height + 10
        );

        w.pop();

        // use easycam to set the maximum zoom; such that user doesnt zoom too far out
        w.easycam.setDistanceMax(800);

        w.strokeWeight(10);
      };

      /*
      This is the main method that draws the graph.
      */
      w.carbonGraph = function (y) {
        // declared with 'let' as they are only useful inside this block where they are defined
        let numRows = w.data.getRowCount();
        let numCols = w.data.getColumnCount();

        // const are used here as they do not need to be changed
        const firsty = w.height / 2 + w.boxwidth / 2; // bottom of the box
        const maxy = w.height / 2 - w.boxwidth / 2; // top of the box
        const gapX = w.boxwidth / 30; // Since data has 30 years, we divide it by 30
        let z = 0;
        let year_selected = y;

        // array of colours - first element is empty as it is accessed by increment j in for loop and j starts at 1
        const colours = ["", "teal", "green", "brown", "brown"];
        let countries = w.data.columns;

        // booleans of whether the countries should be changed
        let usa = w.usa_selected.checked();
        let canada = w.canada_selected.checked();
        let japan = w.japan_selected.checked();
        let china = w.china_selected.checked();

        /* initialise a Boolean array in Java
        https://www.baeldung.com/java-initializing-boolean-array
        */
        let boolean_array = ["", usa, canada, japan, china];

        // the number of rows drawn, used in the inner for-loop later
        let drawnRows = numRows - (2020 - year_selected);

        /* Main draw loops
          j loops over the number of countries and checks against the boolean array
          if boolean is true, the inner for-loop is called
          inner for-loop iterates through the data over the years, decided by the slider value
        */
        w.strokeWeight(3);
        for (let j = 1; j < numCols; j++) {
          if (boolean_array[j] == true) {
            for (let i = 0; i < drawnRows; i++) {
              w.stroke(colours[j]);
              let firstx = w.width / 2 - w.boxwidth / 2; // row number/12 multiply by gap

              let x = firstx + gapX * i; // the x-coordinate is the sum of the first x and the number of gaps (years) it is from the first x

              let min_data = min(w.data.getColumn(j));
              let max_data = max(w.data.getColumn(j));
              let y = w.map(
                w.data.getNum(i, j),
                min_data,
                max_data,
                firsty,
                maxy
              ); // y is mapped from the (min and max data point) to (bottom and top of the box)

              // the bigger the carbon emissions that year, the bigger the size of the point
              let size = w.map(w.data.getNum(i, j), min_data, max_data, 3, 6);

              // styling for the graph
              w.strokeWeight(size);
              w.point(firstx + gapX * i, y, z);
              w.push();
              w.translate(0, 0, z);
              w.textSize(3);
              w.fill("black");
              w.textAlign(CENTER);

              // formating the numbers into strings: https://p5js.org/reference/#/p5/nf
              w.text(nf(w.data.getNum(i, j), 2, 2), x - 2, y + 2);
              w.pop();

              // connecting the points; avoid the points outside the range, reference: Weidi's tutorial
              if (i < numRows - 1) {
                w.nextX =
                  w.width / 2 - w.boxwidth / 2 + (w.boxwidth / 30) * (i + 1);
                w.nextY = w.map(
                  w.data.getNum(i + 1, j),
                  min_data,
                  max_data,
                  firsty,
                  maxy
                );
              }

              w.strokeWeight(0.5);

              // draws the graph
              w.beginShape();
              w.vertex(x, y, z);
              w.vertex(w.nextX, w.nextY, z);
              w.endShape();
            }
          }

          // each country is drawn on a different z axis.
          z = z + w.boxwidth / 4;
        }

        /*
        Labels for the graph
        */

        w.textSize(20);
        w.fill("black");
        w.textAlign(CENTER);
        w.text("Carbon Emissions: 1990 to 2020 (metric tons per capita)", w.width / 2, 20); //title

        // draws the text for the country
        for (var i = 0; i < countries.length; i++) {
          w.push();
          w.translate(0, (i * w.boxwidth) / 4, ((i - 1) * w.boxwidth) / 4);
          w.textSize(12);
          w.fill(colours[i]);
          // only draws the country label if the country is checked in the checkbox
          if (boolean_array[i] == true) {
            w.text(countries[i], w.width / 2 - w.boxwidth / 2 - 50, maxy - 20);
          }
          w.pop();
        }
      };

      /* Draws the Axes for the graph
      Uses Vertex to draw the shape, with the box-width as a reference point
      */
      w.carbonAxis = function () {
        w.stroke(0);
        w.strokeWeight(3);
        //axis to be slightly bigger than graph
        let y_origin = w.height / 2 + w.boxwidth / 2 + 10;
        let top_y = w.height / 2 - w.boxwidth / 2 - 10;
        let x_origin = w.width / 2 - w.boxwidth / 2 - 20;
        let last_x = w.width / 2 + w.boxwidth / 2 + 20;

        let gap_x = (last_x - x_origin) / 30;

        // draw horizontal and vertical axis
        w.beginShape();
        w.vertex(x_origin, y_origin, 0);
        w.vertex(last_x, y_origin, 0);
        w.endShape();

        w.beginShape();
        w.vertex(x_origin, y_origin, 0);
        w.vertex(x_origin, top_y, 0);
        w.endShape();

        w.stroke(255, 0, 0);
        // draws the year labels at the bottom
        for (var i = 0; i < w.data.getRowCount(); i++) {
          let tick_x = x_origin + i * gap_x;
          w.point(tick_x, y_origin, 0);
          let years = w.data.getColumn("Year");
          w.textSize(2);
          w.text(years[i], tick_x, y_origin + 10);
        }

        // draws the labels for the x and y axes
        w.textSize(16);
        w.text("Year", last_x + 30, y_origin, 0);
        w.text("Carbon Emissions", x_origin - 50, top_y, 0);
      };

      // https://github.com/freshfork/p5.EasyCam documentation on how to use pan
      w.keyPressed = function () {
        if (w.keyCode == LEFT_ARROW) {
          w.easycam.panX(-10);
        }

        if (w.keyCode == RIGHT_ARROW) {
          w.easycam.panX(+10);
        }

        if (w.keyCode == UP_ARROW) {
          w.easycam.panY(-10);
        }
        if (w.keyCode == DOWN_ARROW) {
          w.easycam.panY(+10);
        }
      };
    };

    // the new p5 object
    this.carbon_sketch = new p5(threedim_sketch);
  };

  /* DESTROY function
     this.destroy is especially important in this visualisation as we have to remove the WEBGL canvas,
     and remove the sliders and checkboxes, such that they won't appear in other visualisations.
  */
  this.destroy = function () {
    this.carbon_sketch.canvas.hide();
    this.carbon_sketch.years_selection.remove();
    this.carbon_sketch.usa_selected.remove();
    this.carbon_sketch.canada_selected.remove();
    this.carbon_sketch.japan_selected.remove();
    this.carbon_sketch.china_selected.remove();
  };

  this.draw = function () {
    this.carbon_sketch.canvas.show(); // shows the new canvas created when the visualisation is called from menu
    fill(0);
  };
}
