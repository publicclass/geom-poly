var isNode = typeof __dirname != 'undefined';

var poly = require(isNode ? '../' : 'geom-poly')
  , vec = require(isNode ? 'geom-vec' : 'publicclass-geom-vec')
  , mat = require(isNode ? 'geom-mat' : 'publicclass-geom-mat')
  , expect = expect || require('expect.js');

poly.verbose = vec.verbose = false;

describe('geom-poly',function(){

  describe('translate()',function(){
    var square;
    before(function(){
      square = poly.make(
        0,100,
        100,100,
        100,0,
        0,0
      )
    })

    after(function(){
      poly.free(square)
    })

    it('should start at 0,0',function(){
      expect(poly.aabb(square)).to.eql([0,100,100,0])
    })

    it('should translate by 10,0',function(){
      poly.translate(square,10,0)
      expect(poly.aabb(square)).to.eql([0,110,100,10])
    })

    it('should translate by another 10,0',function(){
      poly.translate(square,10,0)
      expect(poly.aabb(square)).to.eql([0,120,100,20])
    })

    it('should translate by -10,0',function(){
      poly.translate(square,-10,0)
      expect(poly.aabb(square)).to.eql([0,110,100,10])
    })

    it('should translate into a copy of square',function(){
      var copy = poly.copy(square)
      poly.translate(square,-10,0,copy)
      expect(poly.aabb(square)).to.eql([0,110,100,10])
      expect(poly.aabb(copy)).to.eql([0,100,100,0])
    })

    it('should translate by -10,100',function(){
      poly.translate(square,-10,100)
      expect(poly.aabb(square)).to.eql([100,100,200,0])
    })


    it('should fail when translating into an empty poly',function(){
      // until we implement it...
      var empty = poly.make()
      expect(function(){
        poly.translate(square,-10,0,empty)
      }).to.throwException(/not supported/)
    })

  })

  describe('transform()',function(){

    it('should scale a rect x2',function(){
      var rect = poly.make(0,1,1,1,1,0,0,0)

      expect(poly.aabb(rect)).to.eql([0,1,1,0])

      var m = mat.scale(2,2);
      poly.transform(rect,m)

      expect(poly.aabb(rect)).to.eql([0,2,2,0])
    })

    it('should scale a rect x.5',function(){
      var rect = poly.make(0,2,2,2,2,0,0,0)

      expect(poly.aabb(rect)).to.eql([0,2,2,0])

      var m = mat.scale(.5,.5);
      poly.transform(rect,m)

      expect(poly.aabb(rect)).to.eql([0,1,1,0])
    })

    it('should scale a rect twice',function(){
      var rect = poly.make(0,1,1,1,1,0,0,0)

      expect(poly.aabb(rect)).to.eql([0,1,1,0])

      var m = mat.scale(2,2)
      poly.transform(rect,m)
      poly.transform(rect,m)

      expect(poly.aabb(rect)).to.eql([0,4,4,0])
    })

    it('should scale a rect twice on x',function(){
      var rect = poly.make(0,1,1,1,1,0,0,0)

      expect(poly.aabb(rect)).to.eql([0,1,1,0])

      var m = mat.scale(2,1)
      poly.transform(rect,m)
      poly.transform(rect,m)

      expect(poly.aabb(rect)).to.eql([0,4,1,0])
    })

    it('should scale a rect twice on y',function(){
      var rect = poly.make(0,1,1,1,1,0,0,0)

      expect(poly.aabb(rect)).to.eql([0,1,1,0])

      var m = mat.scale(1,2)
      poly.transform(rect,m)
      poly.transform(rect,m)

      expect(poly.aabb(rect)).to.eql([0,1,4,0])
    })

    it('should scale a rect from center',function(){
      var rect = poly.make(0,1,1,1,1,0,0,0)

      expect(poly.aabb(rect)).to.eql([0,1,1,0])

      var m = mat.translate(-0.5,-0.5)
      mat.scale(2,2,m)
      mat.translate(0.5,0.5,m)

      poly.transform(rect,m)

      expect(poly.aabb(rect)).to.eql([-0.5,1.5,1.5,-0.5])
    })

    it('should scale a rect from right',function(){
      var rect = poly.make(0,1,1,1,1,0,0,0)

      expect(poly.aabb(rect)).to.eql([0,1,1,0])

      var m = mat.translate(-1,-1)
      mat.scale(2,2,m)
      mat.translate(1,1,m)

      poly.transform(rect,m)

      expect(poly.aabb(rect)).to.eql([-1,1,1,-1])
    })

    it('should scale a rect from center on x',function(){
      var rect = poly.make(0,1,1,1,1,0,0,0)

      expect(poly.aabb(rect)).to.eql([0,1,1,0])

      var m = mat.translate(-0.5,0)
      mat.scale(2,1,m)
      mat.translate(0.5,0,m)

      poly.transform(rect,m)

      expect(poly.aabb(rect)).to.eql([0,1.5,1,-0.5])
    })
  })

})