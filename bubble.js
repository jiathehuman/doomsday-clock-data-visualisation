//---------------------------------------------
//Code included in template, no original code
//---------------------------------------------
function Bubble(numJobs, propFemale, payGap) {
  this.draw = function () {
    minFemale = min(propFemale);
    maxFemale = max(propFemale);
    min_payGap = min(payGap);
    max_payGap = max(payGap);

    fill(0);
    ellipse(0, 0, 100, 100);
  };
}
