//--------------------------------------------------
// Clock Hand constructor for the
// DOOMSDAY CLOCK VISUALISATION EXTENSION (ORIGINAL)
//--------------------------------------------------

function ClockHand(currentRow, data, animateFinished, sliderValue) {
  this.draw = function () {
    var minutes = [9, 10, 11, 12]; //the other digits are not neccessary for our data

    /* DRAWS THE NUMBERS OF THE CLOCK from 9 to 12 since it is the only range useful
      Figuring out polar coordinates: https://en.wikipedia.org/wiki/Polar_coordinate_system#
    */

    for (var i = 0; i < minutes.length; i++) {
      // map angle to 12 gaps in a clock
      let angle = map(i, 0, 12, 0, TWO_PI) + PI; // off-set by 180° since 0 starts at 3 o'clock
      let clockRadius = 225;
      let x = clockRadius * cos(angle);
      let y = clockRadius * sin(angle);
      fill(255);
      strokeWeight(0.7);
      text(minutes[i], x, y); // writes out the minutes at the exact x and y co-ordinates
    }

    //employing a switch operator to evaluate whether the animation has finished and consequently, what to display
    switch (true) {
      // if the animation has not finished, use the currentRow in the parameter to decide how many rows to draw
      case !animateFinished:
        depict_visualisation(currentRow, data);
        break;
      // if the animation has finished, use the sliderValue in the parameter to decide how many rows to draw
      case animateFinished:
        depict_visualisation(sliderValue, data);
        break;
    }
  };

  /*
  This function draws the clock-hand, which points to a different position each year.
  There is a for-loop that iterates through each row of the data.
  */

  function depict_visualisation(currentRow, data) {
    for (var i = 0; i < currentRow; i++) {
      let seventeen_min = PI - TWO_PI / 60; // there is a data point that is 17 minutes
      let midnight = PI + HALF_PI; // midnight is zero minutes
      let currentHand = data[currentRow];

      // maps the current time (0 - 17) to the correct positions
      let angle = map(currentHand, 17, 0, seventeen_min, midnight);

      // radius
      let r1 = 150;
      let r2 = 220;

      // calculates the angle
      let x1 = r1 * cos(angle);
      let y1 = r1 * sin(angle);
      let x2 = r2 * cos(angle);
      let y2 = r2 * sin(angle);

      /*
        Defines the colours of the lines
        Uses a comparison with the mean and a lerpColor function to determine colour
      */
      let mid = color(255, 225, 168);
      let low = color(201, 203, 163);
      let high = color(226, 109, 92);
      let colour = 0;
      let meanMinute = mean(data);

      // calculates how far from the mean level this particular data is
      let difference = abs(meanMinute - currentHand) / currentHand;

      // if the current value is lower than mean, use a cooler colour,
      // else if current value is higher than mean, use a warmer colour
      if (currentHand < meanMinute) {
        colour = lerpColor(mid, high, difference);
      } else if (currentHand > meanMinute) {
        colour = lerpColor(mid, low, difference);
      }

      // draws the hand
      strokeWeight(2);
      stroke(colour);
      line(x1, y1, x2, y2);
      fill(colour);
      ellipse(x2, y2, 5, 5);
    }
  }
  noStroke(); // clears the stroke
}
