//---------------------------------------------
//Code included in template, some original code
//---------------------------------------------
function PayGapByJob2017() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Pay gap by job: 2017";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "pay-gap-by-job-2017";

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Graph properties.
  this.pad = 20;
  this.dotSizeMin = 15;
  this.dotSizeMax = 40;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    var self = this;
    this.data = loadTable(
      "./data/pay-gap/occupation-hourly-pay-by-gender-2017.csv",
      "csv",
      "header",
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      }
    );
  };

  this.setup = function () {};

  this.destroy = function () {};

  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Draw the axes.
    this.addAxes();

    // Get data from the table object.
    var jobs = this.data.getColumn("job_subtype");
    var propFemale = this.data.getColumn("proportion_female");
    var payGap = this.data.getColumn("pay_gap");
    var numJobs = this.data.getColumn("num_jobs");

    // Convert numerical data from strings to numbers.
    propFemale = stringsToNumbers(propFemale);
    payGap = stringsToNumbers(payGap);
    numJobs = stringsToNumbers(numJobs);

    // Set ranges for axes.
    //
    // Use full 100% for x-axis (proportion of women in roles).
    var propFemaleMin = 0;
    var propFemaleMax = 100;

    // For y-axis (pay gap) use a symmetrical axis equal to the
    // largest gap direction so that equal pay (0% pay gap) is in the
    // centre of the canvas. Above the line means men are paid
    // more. Below the line means women are paid more.
    var payGapMin = -20;
    var payGapMax = 20;

    // Find smallest and largest numbers of people across all
    // categories to scale the size of the dots.
    var numJobsMin = min(numJobs);
    var numJobsMax = max(numJobs);

    fill(255);
    stroke(0);
    strokeWeight(1);

    for (i = 0; i < this.data.getRowCount(); i++) {
      // Draw an ellipse for each point.
      var x = map(
        propFemale[i],
        propFemaleMin,
        propFemaleMax,
        this.pad,
        width - this.pad
      );
      var y = map(payGap[i], payGapMin, payGapMax, height - this.pad, this.pad);

      /*ORIGINAL CODE: 
      Colour the bubbles based on paygap and proportion*/

      var pg_c = map(payGap[i], payGapMin, payGapMax, 80, 255);
      var propF_c = map(propFemale[i], propFemaleMin, propFemaleMax, 80, 255);

      stroke(0);
      fill(pg_c, propF_c, 100);

      /*END of Original Code */

      ellipse(
        x,
        y,
        map(
          numJobs[i],
          numJobsMin,
          numJobsMax,
          this.dotSizeMin,
          this.dotSizeMax
        )
      );

      if (dist(mouseX, mouseY, x, y) < 10) {
        textSize(20);
        noStroke();
        fill(0);
        text("Job Sector: " + jobs[i], 500, height - 100);
        console.log(textWidth(jobs[i]) / 2);
      }

      this.addLabels();
      noFill();
    }
  };

  this.addAxes = function () {
    stroke(200);
    // Add vertical line.
    line(width / 2, 0 + this.pad, width / 2, height - this.pad);

    // Add horizontal line.
    line(0 + this.pad, height / 2, width - this.pad, height / 2);
  };

  this.addLabels = function () {
    textSize(14);
    noStroke();
    fill(0);
    text(
      "Proportion of female employees",
      (width * 8) / 10,
      height / 2 + this.pad
    );
    text("Pay Gap", width / 2 + 10, 0 + this.pad);
  };
}
