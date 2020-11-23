function myDisplayer(some) {
    console.log(some);
  }
  
  let myPromise = new Promise(function(myResolve, myReject) {
    
    function compute(){ 
        let x = 1+a;
        if (x == 3) {
            myResolve("OK");
          } else {
            myReject("Error");
          };
    };
    let a=2;
    setTimeout(compute,5000);
  // The producing code (this may take some time)
});
  
  myPromise.then(
    function(value) {myDisplayer(value);},
    function(error) {myDisplayer(error);}
  );