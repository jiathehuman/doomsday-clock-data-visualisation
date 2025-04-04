//--------------------------------------------------
// Nuclear arms constructor for the
// DOOMSDAY CLOCK VISUALISATION EXTENSION (ORIGINAL)
// Figuring out polar coordinates: https://en.wikipedia.org/wiki/Polar_coordinate_system#
//--------------------------------------------------

function Nuclear_arms(currentRow, data, innerR, animateFinished, sliderValue) {
  let minStock = min(data);
  let maxStock = max(data);
  let meanStock = mean(data);
  let r = innerR;

  this.draw = function () {
    //employing a switch operator to evaluate whether the animation has finished and consequently, what to display
    switch (true) {
      // if the animation has not finished, use the currentRow in the parameter to decide how many rows to draw
      case !animateFinished:
        depict_visualisation(currentRow, data, r);
        break;
      // if the animation has finished, use the sliderValue in the parameter to decide how many rows to draw
      case animateFinished:
        depict_visualisation(sliderValue, data, r);
        break;
    }
    // draws the label to the side
    textSize(15);

    text("Nuclear stock", 315, 165);

    // draws the line to the label
    stroke(255);
    strokeWeight(1);
    line(innerR, 35, 255, 150);
  };

  /*
  This function draws the circular depiction of the data.
  There is a for-loop that iterates through each row of the data.
  */
  function depict_visualisation(currentRow, data, r) {
    for (var i = 0; i < currentRow; i++) {
      var base = 0;
      var angle = map(i, 0, data.length, 0, TWO_PI) - PI / 3;
      var stock = data[i];

      // maps the temperature anomaly to a radius length that is between the radius and the center
      let n = map(stock, minStock, maxStock, r, r - 50);
      let b = map(base, minStock, maxStock, r, r - 50);

      // calculates the x and y position of the current data point and the previous data point
      let x1 = n * cos(angle);
      let y1 = n * sin(angle);
      let x2 = b * cos(angle - PI / 6);
      let y2 = b * sin(angle - PI / 6);

      /*
       Defines the colours of the lines -  Colour palette from coolers
       Uses a comparison with the mean and a lerpColor function to determine colour
    */ let mid = color(244, 241, 187);
      let low = color(155, 193, 188);
      let high = color(237, 106, 90);
      let colour = 0;
      // calculates how far from the mean level this particular data is
      let difference = abs(meanStock - stock) / stock;

      // https://p5js.org/reference/#/p5/lerpColor
      // if the current value is lower than mean, use a cooler colour,
      // else if current value is higher than mean, use a warmer colour
      if (stock < meanStock) {
        colour = lerpColor(mid, low, difference);
      } else if (stock > meanStock) {
        colour = lerpColor(mid, high, difference);
      }

      // draws the visualisation
      stroke(colour);
      strokeWeight(3);
      line(x1, y1, x2, y2);

      strokeWeight(1); //resets strokeWeight

      noStroke();
    }
  }
}
