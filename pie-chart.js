/* 
Coursera-provided template for the skeleton
Original: Pie-chart turned into a donut chart
*/

function PieChart(x, y, diameter) {
  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.innerDiameter = diameter * 0.6;
  this.labelSpace = 30;

  /* Original local variables that is altered by mouseOverItem when mouseOverPie returns true */
  var item = "";
  var item_percent = "";

  this.get_radians = function (data) {
    var total = sum(data);
    this.radians = [];
    for (let i = 0; i < data.length; i++) {
      //Calculates the radian that represents the data
      this.radians.push((data[i] / total) * TWO_PI);
    }
    return this.radians;
  };

  this.draw = function (data, labels, colours, title) {
    // Test that data is not empty and that each input array is the
    // same length.
    if (data.length == 0) {
      alert("Data has length zero!");
    } else if (
      ![labels, colours].every((array) => {
        return array.length == data.length;
      })
    ) {
      alert(`Data (length: ${data.length})
      Labels (length: ${labels.length})
      Colours (length: ${colours.length})
      Arrays must be the same length!`);
    }

    // https://p5js.org/examples/form-pie-chart.html

    var angles = this.get_radians(data);
    var lastAngle = 0;
    var colour;

    for (var i = 0; i < data.length; i++) {
      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, data.length, 0, 255);
      }

      fill(colour);
      stroke(0);
      strokeWeight(1);

      arc(
        this.x,
        this.y,
        this.diameter,
        this.diameter,
        lastAngle,
        lastAngle + angles[i] + 0.001
      ); // Hack for 0!

      if (labels) {
        this.makeLegendItem(labels[i], i, colour);
      }

      /*ORIGINAL CODE: 
    Call mouseOverItem for each piece of data drawn, 
    parsing through the label, the last angle and angles into the arguments 
    If true, returns 'item' and 'label' */

      this.mouseOverItem(labels[i], lastAngle, angles[i]);

      lastAngle += angles[i];
    }

    fill(255);
    ellipse(this.x, this.y, this.innerDiameter);

    if (title) {
      noStroke();
      fill(0);
      textAlign("center", "center");
      textSize(24);
      text(title, this.x, this.y - this.diameter * 0.6);
    }

    textSize(12);
    if (this.mouseOverPie()) {
      fill(0);
      text(item + ": " + item_percent + "%", this.x, this.y);
    } else {
      text("Please hover over chart", this.x, this.y);
    }
  };

  this.makeLegendItem = function (label, i, colour) {
    var x = this.x + 50 + this.diameter / 2;
    var y = this.y + this.labelSpace * i - this.diameter / 3;
    var boxWidth = this.labelSpace / 2;
    var boxHeight = this.labelSpace / 2;

    fill(colour);
    rect(x, y, boxWidth, boxHeight);

    fill("black");
    noStroke();
    textAlign("left", "center");
    textSize(12);
    text(label, x + boxWidth + 10, y + boxWidth / 2);
  };

  //Extension made: mouseOverItem function judges where the mouse is in the pie
  //and returns the label and percentage

  this.mouseOverItem = function (label, lastAngle, currentAngle) {
    //reference: https://stackoverflow.com/questions/68660637/how-to-identify-the-cursor-within-an-arc-in-p5-js
    //atan2 function identifies the angle of the mouse in a range of -PI to PI
    let mouse_angle = atan2(mouseY - height / 2, mouseX - width / 2);

    this.label = label; //takes in the parsed in label

    if (mouse_angle < 0) {
      mouse_angle = mouse_angle + TWO_PI;
    } //since atan2 maps from -PI to PI, adjust to give positive values

    //var mouseDist calculates distance between mouse and center of pie
    var mouseDist = dist(this.x, this.y, mouseX, mouseY);

    //conditions to check whether the mouse is in that segment of the pie
    var hover =
      mouseDist < this.diameter / 2 &&
      mouse_angle >= lastAngle &&
      mouse_angle < lastAngle + currentAngle;

    //if the mouse is indeed in that segment of the pie
    if (hover) {
      //parse to the global variable within this constructor
      item = label;
      item_percent = nf((currentAngle / TWO_PI) * 100, 2, 2); //nf fprmats numbers into strings
    }
  };

  //mouseOverPie checks if the mouse is on the pie, returns a boolean
  this.mouseOverPie = function () {
    var mouseDist = dist(this.x, this.y, mouseX, mouseY);
    var hover =
      mouseDist < this.diameter / 2 && mouseDist > this.diameter * 0.3;

    if (hover) {
      return true;
    }
  };
}
