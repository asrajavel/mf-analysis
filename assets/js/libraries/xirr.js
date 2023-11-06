function XIRR(values, dates, guess) {
  // Credits: algorithm inspired by Apache OpenOffice
  
  // Calculates the resulting amount
  
//  Sample usage:
//  Logger.log(XIRR([-100, -100, 210], [new Date("2019-12-31"), new Date("2020-05-05"), new Date("2020-12-31")]))
  
  var irrResult = function(values, dates, rate) {
    var r = rate + 1;
    var result = values[0];
    for (var i = 1; i < values.length; i++) {
      result += values[i] / Math.pow(r, moment(dates[i]).diff(moment(dates[0]), 'days') / 365);
    }
    return result;
  }

  // Calculates the first derivation
  var irrResultDeriv = function(values, dates, rate) {
    var r = rate + 1;
    var result = 0;
    for (var i = 1; i < values.length; i++) {
      var frac = moment(dates[i]).diff(moment(dates[0]), 'days') / 365;
      result -= frac * values[i] / Math.pow(r, frac + 1);
    }
    return result;
  }

  // Check that values contains at least one positive value and one negative value
  var positive = false;
  var negative = false;
  for (var i = 0; i < values.length; i++) {
    if (values[i] > 0) positive = true;
    if (values[i] < 0) negative = true;
  }
  
  // Return error if values does not contain at least one positive value and one negative value
  if (!positive || !negative) return '#NUM!';

  // Initialize guess and resultRate
  var guess = (typeof guess === 'undefined') ? 0.1 : guess;
  var resultRate = guess;
  
  // Set maximum epsilon for end of iteration
  var epsMax = 1e-5;
  
  // Set maximum number of iterations
  var iterMax = 50;

  // Implement Newton's method
  var newRate, epsRate, resultValue;
  var iteration = 0;
  var contLoop = true;
  do {
    resultValue = irrResult(values, dates, resultRate);
    newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
    epsRate = Math.abs(newRate - resultRate);
    resultRate = newRate;
    contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
    // console.log("iteration: " + iteration + " rate: " + resultRate + " value: " + resultValue + " eps: " + epsRate, " guess: " + guess);
    // when the actual xirr is too low, we decrease the guess, when it goes below .9 we decrease by .01
    // when the actual xirr is too low the calculation goes to infinity or NaN (covered in the next if)
    if(resultRate > 1000000 && guess >= -0.79) return XIRR(values, dates, guess-0.1);
    else if (resultRate > 1000000) return XIRR(values, dates, guess-0.01);
  } while(contLoop && (++iteration < iterMax));

  if(contLoop) return '#NUM!';

  if(isNaN(resultValue)) {
    if(guess >= -0.79) return XIRR(values, dates, guess-0.1);
    else return XIRR(values, dates, guess-0.01);
  }

  // Return internal rate of return
  return resultRate;
}