//--------------------------------------------------
// Sea Levels constructor for the
// DOOMSDAY CLOCK VISUALISATION EXTENSION (ORIGINAL)
//--------------------------------------------------

function SeaLevel(
  currentRow,
  data,
  innerR,
  outerR,
  animateFinished,
  sliderValue
) {
  this.draw = function () {
  //employing a switch operator to evaluate whether the animation has finished and consequently, what to display
  switch(true){
    // if the animation has not finished, use the currentRow in the parameter to decide how many rows to draw
    case !animateFinished: 
      depict_visualisation(currentRow, data, innerR);
      break;
    // if the animation has finished, use the sliderValue in the parameter to decide how many rows to draw
    case animateFinished: 
      depict_visualisation(sliderValue, data, innerR);
      break;
  }

    // draws the label to the side
    noStroke();
    textSize(15);
    text("Sea Levels", 280, 90);

    strokeWeight(1);
    stroke(255);
    line(outerR - 50, 20, 235, 80);
  };

  /*
  This function draws the circular depiction of the data.
  There is a for-loop that iterates through each row of the data.
  */

  function depict_visualisation(currentRow, data, innerR) {
    for (var i = 0; i < currentRow; i++) {
      // calculates the values used later, 'let' used as it is only applicable in this block
      let angle = map(i, 0, data.length, 0, TWO_PI) - PI / 3;
      let last_angle = angle - TWO_PI / data.length;
      let meanLevel = mean(data);
      let minLevel = min(data);
      let maxLevel = max(data);

      let previousLevel = 0;

      let currentLevel = data[i];
      // maps the sea level to a radius length that is between the innerR and outerR
      s = map(currentLevel, minLevel, maxLevel, innerR + 20, outerR);
      p_s = map(previousLevel, minLevel, maxLevel, innerR + 20, outerR);

      // calculates the x and y position of the current data point and the previous data point
      let x1 = s * cos(angle);
      let y1 = s * sin(angle);

      let x2 = p_s * cos(last_angle);
      let y2 = p_s * sin(last_angle);

      /*
        Defines the colours of the lines - Colour palette from coolers
        Uses a comparison with the mean and a lerpColor function to determine colour
      */

      let mid = color(155, 177, 255);
      let low = color(120, 139, 255);
      let high = color(191, 215, 255);
      let colour = 0;

      let difference = abs(meanLevel - currentLevel) / currentLevel;

      if (currentLevel < meanLevel) {
        colour = lerpColor(mid, high, difference);
      } else if (currentLevel > meanLevel) {
        colour = lerpColor(mid, low, difference);
      }

      // draws out the visualisation
      stroke(colour);
      strokeWeight(2);
      beginShape();
      vertex(x1, y1);
      vertex(x2, y2);
      endShape();

      fill(colour);
      ellipse(x1, y1, 2, 2);

      previousLevel = currentLevel;
    }
  }
}
