var vec = require('./index')

var maxDiff = 1e5;

function benchAlloc(done){
  vec.alloc();
  var mem = process.memoryUsage()
    , ticks = 0;
  process.nextTick(function checkMem(){
    ticks++
    for( var i=0; i < 100; i++ ){
      var v = vec.alloc()
      vec.free(v);
    }

    var mem2 = process.memoryUsage()
      , diff = Math.abs(mem2.heapUsed - mem.heapUsed);

    // gc happened!
    if( diff > maxDiff ){
      setTimeout(function(){
        // cool down (allow for gc)
        done(ticks)
      },1000)
    } else {
      mem = mem2
      process.nextTick(checkMem)
    }
  })
}

function benchArray(done){
  var mem = process.memoryUsage()
    , ticks = 0;
  process.nextTick(function checkMem(){
    ticks++
    for( var i=0; i < 100; i++ ){
      var v = new Array(2)
      v[0] = 0
      v[1] = 0
      // let it get caught by the GC
    }

    var mem2 = process.memoryUsage()
      , diff = Math.abs(mem2.heapUsed - mem.heapUsed);

    // gc happened!
    if( diff > maxDiff ){
      setTimeout(function(){
        // cool down (allow for gc)
        done(ticks)
      },1000)
    } else {
      mem = mem2
      process.nextTick(checkMem)
    }
  })
}


benchArray(function(ticks){
  console.log('[]:',ticks)

  benchAlloc(function(ticks){console.log('v():',ticks)})
})
