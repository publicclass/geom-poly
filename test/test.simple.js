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

    it('should properly compute the center of a hexagon',function(){
      var p = poly.make()
      var a = 2 * Math.PI / 6
        , w = 12;
      for(var i=5; i >= 0; i--){
        poly.add(p, w * Math.cos(i * a), w * Math.sin(i * a) );
      }
      poly.close(p)
      var c = poly.centroid(p);
      // round to 15 digits to ignore floating errors
      expect(Math.round(c[0]*1e15)).to.eql(0)
      expect(Math.round(c[1]*1e15)).to.eql(0)
      poly.free(p)
      vec.free(c)
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
      expect(poly.centroid(p)).to.eql([9.8,8.5]) // according to wolfram alpha
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
      expect(poly.centroid(p)).to.eql([500,457]) // according to wolfram alpha
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

  // http://wolfr.am/16HAB0r
  describe('a generated hexagon with 12px edge length',function(){
    var p = poly.make()
    var a = 2 * Math.PI / 6
      , w = 12;
    for(var i=5; i >= 0; i--){
      poly.add(p, w * Math.cos(i * a), w * Math.sin(i * a) );
    }
    poly.close(p)

    it('should give the right perimeter',function(){
      expect(poly.perimeter(p)).to.equal(72)
    })

    it('should give the right radius',function(){
      // round to 12 digits to ignore floating errors
      var r = poly.radius(p);
      expect(round(r,1e12)).to.equal(12)
    })

    it('should give the right area',function(){
      expect(poly.area(p)).to.equal(374.1229744348775)
    })

    it('should give the right centroid',function(){
      // round to 15 digits to ignore floating errors
      var c = poly.centroid(p);
      expect(round(c[0],1e15)).to.eql(0)
      expect(round(c[1],1e15)).to.eql(0)
    })
  })
})

function round(i,n){
  return Math.round(i*n)/n;
}