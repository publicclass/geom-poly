var isNode = typeof __dirname != 'undefined';

var poly = require(isNode ? '../' : 'geom-poly')
  , vec = require(isNode ? 'geom-vec' : 'publicclass-geom-vec')
  , expect = expect || require('expect.js');

poly.verbose = vec.verbose = false;

describe('geom-poly',function(){

  describe('area()',function(){
    it('should properly compute the area of a triangle', function(){
      var p = poly.make(
        100,100,
        100,0,
        0,0
      )
      expect(poly.area(p)).to.equal(100*100/2)
      poly.free(p)
    })

    it('should properly compute the area of a square', function(){
      var p = poly.make(
        0,100,
        100,100,
        100,0,
        0,0
      )
      expect(poly.area(p)).to.equal(100*100)
      poly.free(p)
    })

    it('should properly compute the area of a polygon with 5 vertices',function(){
      var p = poly.make(
        5,5,
        12,5,
        15,8.5,
        12,12,
        5,12
      )
      expect(poly.area(p)).to.eql(59.5)
      poly.free(p)
    })

    it('should properly compute the area of another polygon with 5 vertices',function(){
      var p = poly.make(
        770,400,
        529,643,
        320,494,
        424,381,
        459,369
      )
      expect(poly.area(p)).to.eql(66293.5)
      poly.free(p)
    })
  })

  describe('centroid()',function(){
    it('should properly compute the center of a square',function(){
      var p = poly.make(
        0,100,
        100,100,
        100,0,
        0,0
      )
      expect(poly.centroid(p)).to.eql([50,50])
      poly.free(p)
    })

    it('should properly compute the center of a rectangle',function(){
      var p = poly.make(
        0,100,
        200,100,
        200,0,
        0,0
      )
      expect(poly.centroid(p)).to.eql([100,50])
      poly.free(p)
    })

    it('should properly compute the center of a irregular polygon',function(){
      var p = poly.make(
        5,5,
        12,5,
        15,8.5,
        12,12,
        5,12
      )
      p = poly.reverse(p)
      expect(poly.centroid(p)).to.eql([9.8,8.5])
      poly.free(p)
    })


    it('should properly compute the center of a irregular polygon',function(){
      var p = poly.make(
        770,400,
        529,643,
        320,494,
        424,381,
        459,369
      )
      p = poly.reverse(p)
      expect(poly.centroid(p)).to.eql([500,457])
      poly.free(p)
    })
  })

  // http://wolfr.am/Y5PFUm
  describe('a polygon from wolfram alpha',function(){
    var p = poly.make(
      770,400,
      529,643,
      320,494,
      424,381,
      459,369
    )

    it('should give the right perimeter',function(){
      expect(poly.perimeter(p)).to.equal(1102.0327792939624)
    })

    it('should give the right area',function(){
      expect(poly.area(p)).to.equal(66293.5)
    })

    it('should give the right centroid',function(){
      expect(poly.centroid(p)).to.eql([500,457])
    })
  })
})