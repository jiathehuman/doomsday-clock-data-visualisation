//--------------------------------------------------
// Global Temperature constructor for the
// DOOMSDAY CLOCK VISUALISATION EXTENSION (ORIGINAL)
//--------------------------------------------------

function Global_temperature(
  currentRow,
  data,
  innerR,
  outerR,
  animateFinished,
  sliderValue
) {
  this.draw = function () {
    // if the animation has not finished, use the currentRow in the parameter to decide how many rows to draw
    if (!animateFinished) {
      depict_visualisation(currentRow, data, innerR, outerR);
    }

    // if the animation has finished, use the sliderValue in the parameter to decide how many rows to draw
    else {
      depict_visualisation(sliderValue, data, innerR, outerR);
    }

    // draws the label to the side
    noStroke();
    fill(255);
    textSize(15);
    text("Global Temperature", outerR + 100, 0);
    textSize(12);
    text("(Hover over to see)", outerR + 100, +15);

    // draws the line to the label
    stroke(255);
    strokeWeight(1);
    line(outerR - 30, 0, outerR + 20, 0);
  };
}

/*
  This function draws the circular depiction of the data.
  There is a for-loop that iterates through each row of the data.
  */
function depict_visualisation(currentRow, data, innerR, outerR) {
  // calculates the values used later
  let firstValue = true;
  let minTemp = min(data);
  let maxTemp = max(data);
  let meanLevel = mean(data);
  let rangeTemp = max(data) - min(data);

  let previousLevel = 0;

  for (var i = 0; i < currentRow; i++) {
    let angle = map(i, 0, data.length, 0, TWO_PI) - PI / 3;
    let previous_angle = angle - TWO_PI / data.length;

    let currentLevel = data[i];

    // maps the temperature anomaly to a radius length that is between the innerR and outerR
    let s = map(currentLevel, minTemp, maxTemp, innerR + 20, outerR - 30);
    let p_s = map(previousLevel, minTemp, maxTemp, innerR + 20, outerR - 30);

    // calculates the x and y position of the current data point and the previous data point
    let x1 = s * cos(angle);
    let y1 = s * sin(angle);

    let x2 = p_s * cos(previous_angle);
    let y2 = p_s * sin(previous_angle);

    /*
        Defines the colours of the lines - Colour palette from coolers
        Uses a comparison with the mean and a lerpColor function to determine colour
      */
    let white = color(251, 209, 162);
    let low = color(125, 207, 182);
    let high = color(255, 80, 86);
    let colour = 0;

    // calculates how far from the mean level this particular data is
    let difference = abs(currentLevel - meanLevel) / currentLevel; //a fractional value

    // if the current value is lower than mean, use a cooler colour,
    // else if current value is higher than mean, use a warmer colour
    if (currentLevel < meanLevel) {
      colour = lerpColor(white, low, difference);
    } else if (currentLevel > meanLevel) {
      colour = lerpColor(white, high, difference);
    }

    //map the difference for size of each arc
    let d = map(difference, 0, rangeTemp, 5, 6);

    //if it is not the first value, draw the shape
    if (!firstValue) {
      stroke(colour);

      beginShape();
      vertex(x1, y1);
      vertex(x2, y2);
      endShape();

      fill(colour);
      if (currentLevel < meanLevel) {
        arc(x1, y1, 10, d, previous_angle - PI, angle - PI, PIE);
      }
      if (currentLevel > meanLevel) {
        arc(x1, y1, 10, d, previous_angle, angle, PIE);
      }
    }
    previousLevel = currentLevel;
    firstValue = false; //runs on the first pass

    // calls the local check hover function
    checkHover(currentLevel, x1, y1);
  }

  /* Check Hover function
    Allows the user to see the exact value next to the point when hovered over
  */

  function checkHover(currentLevel, x, y) {
    // recall that we have called a translation of x and y axis at the start
    mouse_x = mouseX - width / 2;
    mouse_y = mouseY - height / 2;

    // if the mouse is near the data point, show the current data
    if (dist(mouse_x, mouse_y, x, y) < 6) {
      push();
      noStroke();
      textSize(12);
      var level = nf(currentLevel, 1, 4);
      text(level, x - 10, y - 20);
      pop();
    }
  }
}
