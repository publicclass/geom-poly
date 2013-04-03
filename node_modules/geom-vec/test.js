var vec = require('./index')
  , mat = require('geom-mat')
  , v = vec.make;

describe('geom',function(){

  describe('vec',function(){

    describe('make',function(){
      it('make()',function(){
        vec.make().should.eql([0,0])
        vec.make().should.be.length(2)
      })
      it('make({x:5,y:5})',function(){
        vec.make({x:5,y:5}).should.eql([5,5])
      })
      it('make([5,5])',function(){
        vec.make([5,5]).should.eql([5,5])
      })
      it('make(5,5)',function(){
        vec.make(5,5).should.eql([5,5])
      })
      it('v(5,5)',function(){
        v(5,5).should.eql([5,5])
      })
    })
    var allocated = []
    describe('alloc',function(){
      // TODO test to make sure that this alloc()
      //      is really not GC-friendly.
      it('alloc()',function(){
        var v = vec.alloc()
        v.should.eql([0,0])
      })
      it('alloc() * 10000',function(){
        var a = vec._allocated.length - vec._unallocated.length;
        for(var i=0; i<10000; i++){
          var v = vec.alloc()
          v.should.eql([0,0])
          allocated.push(v);
        }
        var b = vec._allocated.length - vec._unallocated.length;
        (b-a).should.equal(allocated.length)

        for(var i=0; i < vec._unallocated.length; i++)
          vec._unallocated.should.have.property(i).eql([0,0]);
      })
    })
    describe('free',function(){
      it('free(allocated)',function(){
        var a = vec._allocated.length - vec._unallocated.length;
        var l = allocated.length;
        while(allocated.length)
          vec.free(allocated.pop())
        var b = vec._allocated.length - vec._unallocated.length;
        (b-a).should.equal(-l)

        for(var i=0; i < vec._unallocated.length; i++)
          vec._unallocated.should.have.property(i).eql([0,0]);
      })
      it('free(v)',function(){
        var v = vec.alloc();
        v.should.eql([0,0])
        vec.free(v);
      })
    })
    describe('copy',function(){
      var v = vec.make(1,2)
        , m = vec.make(3,4)

      after(function(){
        vec.free(v)
        vec.free(m)
      })

      it('copy(v)',function(){
        vec.copy(v).should.not.equal(v)
        vec.copy(v).should.eql([1,2])
      })
      it('copy(v,m)',function(){
        vec.copy(v,m).should.not.equal(v)
        vec.copy(v,m).should.equal(m)
        vec.copy(v,m).should.eql([1,2])
      })
      it('copy(v,v)',function(){
        vec.copy(v,v).should.equal(v)
        vec.copy(v,v).should.eql([1,2])
      })
    })
    describe('sub',function(){
      var a = vec.make(1,2)
        , b = vec.make(3,4)
        , m = vec.make(5,6)

      after(function(){
        vec.free(a)
        vec.free(b)
        vec.free(m)
      })

      it('sub(a,b)',function(){
        vec.sub(a,b).should.not.equal(a)
        vec.sub(a,b).should.not.equal(b)
        vec.sub(a,b).should.eql([-2,-2])
      })
      it('sub(a,b,m)',function(){
        vec.sub(a,b,m).should.not.equal(a)
        vec.sub(a,b,m).should.not.equal(b)
        vec.sub(a,b,m).should.equal(m)
        vec.sub(a,b,m).should.eql([-2,-2])
      })
      it('sub(a,a,m)',function(){
        vec.sub(a,a,m).should.equal(m)
        vec.sub(a,a,m).should.not.equal(a)
        vec.sub(a,a,m).should.eql([0,0])
      })
      it('sub(a,a)',function(){
        vec.sub(a,a).should.not.equal(a)
        vec.sub(a,a).should.not.equal(b)
        vec.sub(a,a).should.not.equal(m)
        vec.sub(a,a).should.eql([0,0])
      })
      it('sub(a,b,a)',function(){
        vec.sub(a,b,a).should.equal(a)       // [-2,-2]
        vec.sub(a,b,a).should.not.equal(b)   // [-5,-6]
        vec.sub(a,b,a).should.not.equal(m)   // [-8,-10]
        vec.sub(a,b,a).should.eql([-11,-14])
      })
    })
    describe('add',function(){
      var a = vec.make(1,2)
        , b = vec.make(3,4)
        , m = vec.make(5,6)

      after(function(){
        vec.free(a)
        vec.free(b)
        vec.free(m)
      })

      it('add(a,b)',function(){
        vec.add(a,b).should.not.equal(a)
        vec.add(a,b).should.not.equal(b)
        vec.add(a,b).should.eql([4,6])
      })
      it('add(a,b,m)',function(){
        vec.add(a,b,m).should.not.equal(a)
        vec.add(a,b,m).should.not.equal(b)
        vec.add(a,b,m).should.equal(m)
        vec.add(a,b,m).should.eql([4,6])
      })
      it('add(a,a,m)',function(){
        vec.add(a,a,m).should.equal(m)
        vec.add(a,a,m).should.not.equal(a)
        vec.add(a,a,m).should.eql([2,4])
      })
      it('add(a,a)',function(){
        vec.add(a,a).should.not.equal(a)
        vec.add(a,a).should.not.equal(b)
        vec.add(a,a).should.not.equal(m)
        vec.add(a,a).should.eql([2,4])
      })
      it('add(a,b,a)',function(){
        vec.add(a,b,a).should.equal(a)       // [ 4, 6]
        vec.add(a,b,a).should.not.equal(b)   // [ 7,10]
        vec.add(a,b,a).should.not.equal(m)   // [10,14]
        vec.add(a,b,a).should.eql([13,18])
      })
    })
    describe('mul',function(){
      var a = vec.make(1,2)
        , b = vec.make(3,4)
        , m = vec.make(5,6)

      after(function(){
        vec.free(a)
        vec.free(b)
        vec.free(m)
      })

      it('mul(a,b)',function(){
        vec.mul(a,b).should.not.equal(a)
        vec.mul(a,b).should.not.equal(b)
        vec.mul(a,b).should.eql([3,8])
      })
      it('mul(a,b,m)',function(){
        vec.mul(a,b,m).should.not.equal(a)
        vec.mul(a,b,m).should.not.equal(b)
        vec.mul(a,b,m).should.equal(m)
        vec.mul(a,b,m).should.eql([3,8])
      })
      it('mul(a,a,m)',function(){
        vec.mul(a,a,m).should.equal(m)
        vec.mul(a,a,m).should.not.equal(a)
        vec.mul(a,a,m).should.eql([1,4])
      })
      it('mul(a,a)',function(){
        vec.mul(a,a).should.not.equal(a)
        vec.mul(a,a).should.not.equal(b)
        vec.mul(a,a).should.not.equal(m)
        vec.mul(a,a).should.eql([1,4])
      })
      it('mul(a,b,a)',function(){
        vec.mul(a,b,a).should.equal(a)       // [ 3,  8]
        vec.mul(a,b,a).should.not.equal(b)   // [ 9, 32]
        vec.mul(a,b,a).should.not.equal(m)   // [27,128]
        vec.mul(a,b,a).should.eql([81,512])
      })
    })
    describe('div',function(){
      var a = vec.make(1,2)
        , b = vec.make(3,4)
        , m = vec.make(5,6)

      it('div(a,b)',function(){
        vec.div(a,b).should.not.equal(a)
        vec.div(a,b).should.not.equal(b)
        vec.div(a,b).should.eql([1/3,2/4])
      })
      it('div(a,b,m)',function(){
        vec.div(a,b,m).should.not.equal(a)
        vec.div(a,b,m).should.not.equal(b)
        vec.div(a,b,m).should.equal(m)
        vec.div(a,b,m).should.eql([1/3,2/4])
      })
      it('div(a,a,m)',function(){
        vec.div(a,a,m).should.equal(m)
        vec.div(a,a,m).should.not.equal(a)
        vec.div(a,a,m).should.eql([1,1])
      })
      it('div(a,a)',function(){
        vec.div(a,a).should.not.equal(a)
        vec.div(a,a).should.not.equal(b)
        vec.div(a,a).should.not.equal(m)
        vec.div(a,a).should.eql([1,1])
      })
      it('div(a,b,a)',function(){
        vec.div(a,b,a).should.equal(a)       // [    1/3,     2/4]
        vec.div(a,b,a).should.not.equal(b)   // [  1/3/3,   2/4/4]
        vec.div(a,b,a).should.not.equal(m)   // [1/3/3/3, 2/4/4/4]
        vec.div(a,b,a).should.eql([1/3/3/3/3,2/4/4/4/4])
      })
      after(function(){
        vec.free(a)
        vec.free(b)
        vec.free(m)
      })
    })
    describe('abs',function(){
      var a = vec.make(1,-2)
        , m = vec.make(5,6)
      it('abs(a)',function(){
        vec.abs(a).should.not.equal(a)
        vec.abs(a).should.not.equal(m)
        vec.abs(a).should.eql([1,2])
      })
      it('abs(a,m)',function(){
        vec.abs(a,m).should.not.equal(a)
        vec.abs(a,m).should.equal(m)
        vec.abs(a,m).should.eql([1,2])
      })
      it('abs(a,a)',function(){
        vec.abs(a,a).should.not.equal(m)
        vec.abs(a,a).should.equal(a)
        vec.abs(a,a).should.eql([1,2])
      })
      after(function(){
        vec.free(a)
        vec.free(m)
      })
    })
    describe('min',function(){
      var a = vec.make(1,2)
        , b = vec.make(-3,4)
        , m = vec.make(5,6)

      it('min(a,b)',function(){
        vec.min(a,b).should.not.equal(a)
        vec.min(a,b).should.not.equal(b)
        vec.min(a,b).should.eql([-3,2])
      })
      it('min(a,b,m)',function(){
        vec.min(a,b,m).should.not.equal(a)
        vec.min(a,b,m).should.not.equal(b)
        vec.min(a,b,m).should.equal(m)
        vec.min(a,b,m).should.eql([-3,2])
      })
      it('min(a,a,m)',function(){
        vec.min(a,a,m).should.equal(m)
        vec.min(a,a,m).should.not.equal(a)
        vec.min(a,a,m).should.eql([1,2])
      })
      it('min(a,a)',function(){
        vec.min(a,a).should.not.equal(a)
        vec.min(a,a).should.not.equal(b)
        vec.min(a,a).should.not.equal(m)
        vec.min(a,a).should.eql([1,2])
      })
      it('min(a,b,a)',function(){
        vec.min(a,b,a).should.equal(a)       // [-3,2]
        vec.min(a,b,a).should.not.equal(b)   // [-3,2]
        vec.min(a,b,a).should.not.equal(m)   // [-3,2]
        vec.min(a,b,a).should.eql([-3,2])
      })
      after(function(){
        vec.free(a)
        vec.free(b)
        vec.free(m)
      })
    })
    describe('max',function(){
      var a = vec.make(1,2)
        , b = vec.make(-3,4)
        , m = vec.make(5,6)

      it('max(a,b)',function(){
        vec.max(a,b).should.not.equal(a)
        vec.max(a,b).should.not.equal(b)
        vec.max(a,b).should.eql([1,4])
      })
      it('max(a,b,m)',function(){
        vec.max(a,b,m).should.not.equal(a)
        vec.max(a,b,m).should.not.equal(b)
        vec.max(a,b,m).should.equal(m)
        vec.max(a,b,m).should.eql([1,4])
      })
      it('max(a,a,m)',function(){
        vec.max(a,a,m).should.equal(m)
        vec.max(a,a,m).should.not.equal(a)
        vec.max(a,a,m).should.eql([1,2])
      })
      it('max(a,a)',function(){
        vec.max(a,a).should.not.equal(a)
        vec.max(a,a).should.not.equal(b)
        vec.max(a,a).should.not.equal(m)
        vec.max(a,a).should.eql([1,2])
      })
      it('max(a,b,a)',function(){
        vec.max(a,b,a).should.equal(a)       // [1,4]
        vec.max(a,b,a).should.not.equal(b)   // [1,4]
        vec.max(a,b,a).should.not.equal(m)   // [1,4]
        vec.max(a,b,a).should.eql([1,4])
      })
      after(function(){
        vec.free(a)
        vec.free(b)
        vec.free(m)
      })
    })
    describe('neg',function(){
      var a = vec.make(1,-2)
        , m = vec.make(5,6)
      it('neg(a)',function(){
        vec.neg(a).should.not.equal(a)
        vec.neg(a).should.not.equal(m)
        vec.neg(a).should.eql([-1,2])
      })
      it('neg(a,m)',function(){
        vec.neg(a,m).should.not.equal(a)
        vec.neg(a,m).should.equal(m)
        vec.neg(a,m).should.eql([-1,2])
      })
      it('neg(a,a)',function(){
        vec.neg(a,a).should.not.equal(m) // [-1, 2]
        vec.neg(a,a).should.equal(a)     // [1, -2]
        vec.neg(a,a).should.eql([-1,2])
      })
      after(function(){
        vec.free(a)
        vec.free(m)
      })
    })
    describe('clamp',function(){
      var a = vec.make(10,-20)
        , b = vec.make(1,-2)
        , min = vec.make(-5,-5)
        , max = vec.make(5,5)
        , m = vec.make(5,6)
      it('clamp(min,a,max)',function(){
        vec.clamp(min,a,max).should.not.equal(a)
        vec.clamp(min,a,max).should.not.equal(b)
        vec.clamp(min,a,max).should.not.equal(m)
        vec.clamp(min,a,max).should.not.equal(min)
        vec.clamp(min,a,max).should.not.equal(max)
        vec.clamp(min,a,max).should.eql([5,-5])
      })
      it('clamp(min,b,max)',function(){
        vec.clamp(min,b,max).should.not.equal(a)
        vec.clamp(min,b,max).should.not.equal(b)
        vec.clamp(min,b,max).should.not.equal(m)
        vec.clamp(min,b,max).should.not.equal(min)
        vec.clamp(min,b,max).should.not.equal(max)
        vec.clamp(min,b,max).should.eql([1,-2])
      })
      it('clamp(min,a,max,m)',function(){
        vec.clamp(min,a,max,m).should.not.equal(a)
        vec.clamp(min,a,max,m).should.not.equal(b)
        vec.clamp(min,a,max,m).should.not.equal(min)
        vec.clamp(min,a,max,m).should.not.equal(max)
        vec.clamp(min,a,max,m).should.equal(m)
        vec.clamp(min,a,max,m).should.eql([5,-5])
      })
      it('clamp(min,a,max,a)',function(){
        vec.clamp(min,a,max,a).should.equal(a)
        vec.clamp(min,a,max,a).should.not.equal(b)
        vec.clamp(min,a,max,a).should.not.equal(m)
        vec.clamp(min,a,max,a).should.not.equal(min)
        vec.clamp(min,a,max,a).should.not.equal(max)
        vec.clamp(min,a,max,a).should.eql([5,-5])
      })
      it('clamp(max,a,min)') // LOL WUT?
      after(function(){
        vec.free(a)
        vec.free(b)
        vec.free(m)
      })
    })
    describe('perp',function(){
      var a = vec.make(1,-2)
        , m = vec.make(5,6)
      it('perp(a)',function(){
        vec.perp(a).should.not.equal(a)
        vec.perp(a).should.not.equal(m)
        vec.perp(a).should.eql([2,1])
      })
      it('perp(a,m)',function(){
        vec.perp(a,m).should.not.equal(a)
        vec.perp(a,m).should.equal(m)
        vec.perp(a,m).should.eql([2,1])
      })
      it('perp(a,a)',function(){
        vec.perp(a,a).should.not.equal(m) // [ 2,1]
        vec.perp(a,a).should.equal(a)     // [-1,2]
        vec.perp(a,a).should.eql([-2,-1])
      })
      after(function(){
        vec.free(a)
        vec.free(m)
      })
    })
    describe('cross',function(){
      var a = vec.make(1,0)
        , b = vec.make(3,-5)
      it('cross(a,b)',function(){
        vec.cross(a,b).should.equal(-5)
      })
      it('cross(a,a)',function(){
        vec.cross(a,a).should.equal(0)
      })
      after(function(){
        vec.free(a)
        vec.free(b)
      })
    })
    describe('dot',function(){
      var a = vec.make(1,0)
        , b = vec.make(3,-5)
      it('dot(a,b)',function(){
        vec.dot(a,b).should.equal(3)
      })
      it('dot(a,a)',function(){
        vec.dot(a,a).should.equal(1)
      })
      it('dot(perp(a),b) == cross(a,b)',function(){
        vec.dot(vec.perp(a),b).should.eql(vec.cross(a,b))
      })
      after(function(){
        vec.free(a)
        vec.free(b)
      })
    })
    describe('len',function(){
      var a = vec.make(1,0)
        , b = vec.make(3,-5)
        , c = vec.make(0,0)
      it('len(a)',function(){
        vec.len(a).should.equal(1)
      })
      it('len(b)',function(){
        vec.len(b).should.equal(5.830951894845301)
      })
      it('len(c)',function(){
        vec.len(c).should.equal(0)
      })
      after(function(){
        vec.free(a)
        vec.free(b)
        vec.free(c)
      })
    })
    describe('lenSq',function(){
      var a = vec.make(1,0)
        , b = vec.make(3,-5)
        , c = vec.make(0,0)
      it('lenSq(a)',function(){
        vec.lenSq(a).should.equal(1)
      })
      it('lenSq(b)',function(){
        vec.lenSq(b).should.equal(34)
      })
      it('lenSq(c)',function(){
        vec.lenSq(c).should.equal(0)
      })
      after(function(){
        vec.free(a)
        vec.free(b)
        vec.free(c)
      })
    })
    describe('dist',function(){
      var a = vec.make(1,0)
        , b = vec.make(3,-5)
      it('dist(a,b)',function(){
        vec.dist(a,b).should.equal(5.385164807134504)
      })
      it('dist(b,b)',function(){
        vec.dist(b,b).should.equal(0)
      })
      after(function(){
        vec.free(a)
        vec.free(b)
      })
    })
    describe('distSq',function(){
      var a = vec.make(1,0)
        , b = vec.make(3,-5)
      it('distSq(a,b)',function(){
        vec.distSq(a,b).should.equal(29)
      })
      it('distSq(b,b)',function(){
        vec.distSq(b,b).should.equal(0)
      })
      after(function(){
        vec.free(a)
        vec.free(b)
      })
    })
    describe('norm',function(){
      var a = vec.make(1,0)
        , b = vec.make(3,-5)
        , m = vec.make(5,6)
      it('norm(a)',function(){
        vec.norm(a).should.not.equal(a)
        vec.norm(a).should.not.equal(m)
        vec.norm(a).should.eql([1,0])
      })
      it('norm(b)',function(){
        var l = vec.len(b);
        vec.norm(b).should.not.equal(a)
        vec.norm(b).should.not.equal(b)
        vec.norm(b).should.not.equal(m)
        vec.norm(b).should.eql([3/l,-5/l])
      })
      it('norm(a,m)',function(){
        vec.norm(a,m).should.not.equal(a)
        vec.norm(a,m).should.equal(m)
        vec.norm(a,m).should.eql([1,0])
      })
      it('norm(a,a)',function(){
        vec.norm(a,a).should.not.equal(m) // [1,0]
        vec.norm(a,a).should.equal(a)     // [1,0]
        vec.norm(a,a).should.eql([1,0])
      })
      after(function(){
        vec.free(a)
        vec.free(m)
      })
    })
    describe('lerp',function(){
      var a = vec.make(1,0)
        , b = vec.make(3,-5)
      it('lerp(a,b,0)',function(){
        vec.lerp(a,b,0).should.not.equal(a)
        vec.lerp(a,b,0).should.not.equal(b)
        vec.lerp(a,b,0).should.eql(a)
        vec.lerp(a,b,0).should.not.eql(b)
      })
      it('lerp(a,b,1)',function(){
        vec.lerp(a,b,1).should.eql(b)
        vec.lerp(a,b,1).should.not.eql(a)
      })
      it('lerp(a,b,.5)',function(){
        vec.lerp(a,b,.5).should.not.eql(a)
        vec.lerp(a,b,.5).should.not.eql(b)
        vec.lerp(a,b,.5).should.eql([2,-2.5])
      })
      it('lerp(a,b,-1)',function(){
        vec.lerp(a,b,-1).should.not.eql(a)
        vec.lerp(a,b,-1).should.not.eql(b)
        vec.lerp(a,b,-1).should.eql([-1,5])
      })
      it('lerp(a,b,2)',function(){
        vec.lerp(a,b,2).should.not.eql(a)
        vec.lerp(a,b,2).should.not.eql(b)
        vec.lerp(a,b,2).should.eql([5,-10])
      })
      after(function(){
        vec.free(a)
        vec.free(b)
      })
    })

    describe('rot',function(){
      var a = vec.make(5,5)
        , m = vec.make(10,10);
      it('rot(a,Math.PI*2)',function(){
        vec.rot(a,Math.PI*2).should.not.equal(a)
        vec.rot(a,Math.PI*2).should.eql(a) // 360!
      })
      it('rot(a,Math.PI)',function(){
        vec.rot(a,Math.PI).should.not.equal(a)
        vec.rot(a,Math.PI).should.eql([-5,-5])
      })
      it('rot(a,-Math.PI,m)',function(){
        vec.rot(a,-Math.PI,m).should.not.equal(a)
        vec.rot(a,-Math.PI,m).should.equal(m)
        vec.rot(a,-Math.PI,m).should.eql([-5,-5])
      })
      it('rot(a,Math.PI/2,a)',function(){
        vec.rot(a,Math.PI/2,a).should.equal(a)
        vec.rot(a,Math.PI/2,a).should.not.equal(m)
        vec.rot(a,Math.PI/2,a).should.eql([-5,-5])
      })

      it('rot(a,Math.PI) (around origin)',function(){
        var a = vec.make(5,5)
        var o = vec.make(10,10);
        var t = vec.sub(a,o)
        vec.rot(t,Math.PI,t)
        vec.add(o,t).should.not.equal(a)
        vec.add(o,t).should.not.equal(t)
        vec.add(o,t).should.not.equal(o)
        vec.add(o,t).should.not.eql(o)
        vec.add(o,t).should.not.eql(t)
        vec.add(o,t).should.not.eql(a)
        vec.add(o,t).should.eql([15,15])
      })

      after(function(){
        vec.free(a)
        vec.free(m)
      })
    })

    describe('transform',function(){
      var a = vec.make(15,0)

      it('transform(a,mat.rotate(Math.PI))',function(){
        vec.transform(a,mat.rotate(Math.PI)).should.eql(vec.rot(a,Math.PI))
      })
      it('transform(a,mat.scale(5,0))',function(){
        vec.transform(a,mat.scale(5,0)).should.eql(vec.mul(a,[5,0]))
      })
      it('transform(a,mat.translate(0,5))',function(){
        vec.transform(a,mat.translate(-5,10)).should.eql(vec.add(a,[-5,10]))
      })

      after(function(){
        vec.free(a)
      })
    })

    describe('reflect',function(){
      it('reflect(a,n)')
      it('reflect(a,n,m)')
    })

  })

})