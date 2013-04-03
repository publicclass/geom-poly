var mat = require('./index');

describe('geom',function(){

  describe('mat',function(){

    describe('make',function(){
      it('make()',function(){
        mat.make().should.eql([1,0,0,0,1,0,0,0,1])
        mat.make().should.be.length(9)
      })
      it('make(1)',function(){
        mat.make(1).should.eql([1,0,0,0,1,0,0,0,1])
      })
      it('make(1,2)',function(){
        mat.make(1,2).should.eql([1,2,0,0,1,0,0,0,1])
      })
      it('make(1,2,3)',function(){
        mat.make(1,2,3).should.eql([1,2,0,3,1,0,0,0,1])
      })
      it('make(1,2,3,4)',function(){
        mat.make(1,2,3,4).should.eql([1,2,0,3,4,0,0,0,1])
      })
      it('make(1,2,3,4,5)',function(){
        mat.make(1,2,3,4,5).should.eql([1,2,5,3,4,0,0,0,1])
      })
      it('make(1,2,3,4,5,6)',function(){
        mat.make(1,2,3,4,5,6).should.eql([1,2,5,3,4,6,0,0,1])
      })
      it('make(0,0,0,0,0,0)',function(){
        mat.make(0,0,0,0,0,0).should.eql([0,0,0,0,0,0,0,0,1])
      })
    })

    var allocated = []
    describe('alloc',function(){
      // TODO test to make sure that this alloc()
      //      is really not GC-friendly.
      it('alloc()',function(){
        var m = mat.alloc()
        m.should.eql([1,0,0,0,1,0,0,0,1])
      })
      it('alloc() * 10000',function(){
        var a = mat._allocated.length - mat._unallocated.length;
        for(var i=0; i<10000; i++){
          var m = mat.alloc()
          m.should.eql([1,0,0,0,1,0,0,0,1])
          allocated.push(m);
        }
        var b = mat._allocated.length - mat._unallocated.length;
        (b-a).should.equal(allocated.length)
      })
    })
    describe('free',function(){
      it('free(allocated)',function(){
        var a = mat._allocated.length - mat._unallocated.length;
        var l = allocated.length;
        while(allocated.length)
          mat.free(allocated.pop())
        var b = mat._allocated.length - mat._unallocated.length;
        (b-a).should.equal(-l)
      })
      it('free(m)',function(){
        var m = mat.alloc();
        m.should.eql([1,0,0,0,1,0,0,0,1])
        mat.free(m);
      })
    })

    describe('ident',function(){
      var a = mat.make()

      it('ident()',function(){
        mat.ident().should.not.equal(a)
        mat.ident().should.eql([1,0,0,0,1,0,0,0,1])
        mat.ident().should.eql(mat.make())
      })
      it('ident(a)',function(){
        mat.ident(a).should.equal(a)
        mat.ident(a).should.eql([1,0,0,0,1,0,0,0,1])
      })
      after(function(){
        mat.free(a)
      })
    })

    describe('mul',function(){
      var a = mat.make(1,2)
        , b = mat.make(1,0,3,4)
        , m = mat.make(1,0,0,0,5,6)

      it('mul(a,b)',function(){
        mat.mul(a,b).should.not.equal(a)
        mat.mul(a,b).should.not.equal(b)
        mat.mul(a,b).should.not.equal(m)
        mat.mul(a,b).should.eql(a)
      })
      it('mul(a,b,m)')
      it('mul(a,a,m)')
      it('mul(a,a)')
      it('mul(a,b,a)')

      after(function(){
        mat.free(a)
        mat.free(b)
        mat.free(m)
      })
    })
    describe('rotate',function(){
      it('rotate(theta)')
      it('rotate(theta,m)')
    })
    describe('translate',function(){
      it('translate(x,y)')
      it('translate(x,y,m)')
    })
    describe('scale',function(){
      it('scale(x,y)')
      it('scale(x,y,m)')
    })
    describe('inv',function(){
      it('inv()')
      it('inv(m)')
      it('inv(inv(m))')
    })
  })

})