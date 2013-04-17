var isNode = typeof __dirname != 'undefined';

var poly = require(isNode ? '../' : 'geom-poly')
  , vec = require(isNode ? 'geom-vec' : 'publicclass-geom-vec')
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

})