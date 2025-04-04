//--------------------------------------------------
// Launch constructor for the
// COST OF SPACE LAUNCHES EXTENSION (ORIGINAL)
//--------------------------------------------------

function Launch(expected_x, start_y, expected_y, size, cost, year, entity) {
  // draws the particular rocket launch

  this.draw = function (t) {
    //calculates the distance needed for the space launch to travel
    let distance = abs(expected_y - start_y);

    // speed = distance/ time formula. animates within 65 frames (time)
    let speed = distance / 65;

    noStroke();

    // based on size of launch, the colour and size of the 'rocket' displayed changes.
    if (size == "Heavy") {
      fill(242, 122, 125);
      s = 10;
    } else if (size == "Medium") {
      fill(247, 212, 134);
      s = 7;
    } else {
      fill(197, 249, 215);
      s = 5;
    }

    // if the visualisation is still being animated, there is fire at the bottom
    if (t < 65) {
      ellipse(expected_x, start_y - speed * t, s, s + 3);
      //ellipses below simulates fire
      fill(185, 0, 0);
      ellipse(expected_x, start_y - speed * t + 8, 5, 7);
      ellipse(expected_x, start_y - speed * t + 12, 3, 5);
    }

    // if the visualisation finished animating, the 'rocket' will be at its rightful place
    // constantly checks if the user has the mouse hovering over the 'rocket'
    else {
      ellipse(expected_x, expected_y, s);
      checkMouse(); // calls local checkMouse function
    }

    // Function checks if the mouse is near the 'rocket'.
    // If it is, displays the name of the 'rocket', the year it is launched and the cost per kg
    function checkMouse() {
      var d = dist(mouseX, mouseY, expected_x, expected_y);
      if (d < 3) {
        push();
        textSize(20);
        text(
          entity + ", launched in " + year + ", costs $" + cost + "/kg",
          width / 1.5,
          height / 5
        );
        pop();
      }
    }
  };
}
