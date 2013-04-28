var isNode = typeof __dirname != 'undefined';

var poly = require(isNode ? '../' : 'geom-poly')
  , vec = require(isNode ? 'geom-vec' : 'publicclass-geom-vec')
  , mat = require(isNode ? 'geom-mat' : 'publicclass-geom-mat')
  , expect = expect || require('expect.js')
  , Draw = Draw || require('./support/draw');

mat.verbose = poly.verbose = vec.verbose = false;

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

    var draw;
    beforeEach(function(){
      draw = createDraw()
      draw.fill('black')
    })
    afterEach(function(){
      appendTest(draw.cnv)
    })

    it('should scale a rect x2',function(){
      var w = 20, h = 20;
      var rect = makeRect(w,h)
      expect(poly.aabb(rect)).to.eql([0,w,h,0])
      draw.poly(rect).stroke('blue')

      var m = mat.scale(2,2);
      poly.transform(rect,m)

      expect(poly.aabb(rect)).to.eql([0,w*2,h*2,0])
      draw.poly(rect).stroke('red')
    })

    it('should scale a rect x.5',function(){
      var w = 20, h = 20;
      var rect = makeRect(w,h)
      expect(poly.aabb(rect)).to.eql([0,w,h,0])
      draw.poly(rect).stroke('blue')

      var m = mat.scale(.5,.5)
      poly.transform(rect,m)

      expect(poly.aabb(rect)).to.eql([0,w/2,h/2,0])
      draw.poly(rect).stroke('red')
    })

    it('should scale a rect twice',function(){
      var w = 20, h = 20;
      var rect = makeRect(w,h)
      expect(poly.aabb(rect)).to.eql([0,w,h,0])
      draw.poly(rect).stroke('blue')

      var m = mat.scale(2,2)
      poly.transform(rect,m)
      poly.transform(rect,m)

      expect(poly.aabb(rect)).to.eql([0,w*4,h*4,0])
      draw.poly(rect).stroke('red')
    })

    it('should scale a rect twice on x',function(){
      var w = 20, h = 20;
      var rect = makeRect(w,h)
      expect(poly.aabb(rect)).to.eql([0,w,h,0])
      draw.poly(rect).stroke('blue')

      var m = mat.scale(2,1)
      poly.transform(rect,m)
      poly.transform(rect,m)

      expect(poly.aabb(rect)).to.eql([0,w*4,h,0])
      draw.poly(rect).stroke('red')
    })

    it('should scale a rect twice on y',function(){
      var w = 20, h = 20;
      var rect = makeRect(w,h)
      expect(poly.aabb(rect)).to.eql([0,w,h,0])
      draw.poly(rect).stroke('blue')

      var m = mat.scale(1,2)
      poly.transform(rect,m)
      poly.transform(rect,m)

      expect(poly.aabb(rect)).to.eql([0,w,h*4,0])
      draw.poly(rect).stroke('red')
    })

    it('should scale a rect from center',function(){
      var w = 20, h = 20;
      var rect = makeRect(w,h)
      expect(poly.aabb(rect)).to.eql([0,w,h,0])
      draw.poly(rect).stroke('blue')

      var m = mat.translate(-w/2,-w/2)
      mat.scale(2,2,m)
      mat.translate(w/2,w/2,m)

      poly.transform(rect,m)

      expect(poly.aabb(rect)).to.eql([-h/2,w+w/2,h+h/2,-w/2])
      draw.poly(rect).stroke('red')
    })

    it('should scale a rect from right',function(){
      var w = 20, h = 20;
      var rect = makeRect(w,h)
      expect(poly.aabb(rect)).to.eql([0,w,h,0])
      draw.poly(rect).stroke('blue')

      var m = mat.translate(-w,-h)
      mat.scale(2,2,m)
      mat.translate(w,h,m)

      poly.transform(rect,m)

      expect(poly.aabb(rect)).to.eql([-h,w,h,-w])
      draw.poly(rect).stroke('red')
    })

    it('should scale a rect from center on x',function(){
      var w = 20, h = 20;
      var rect = makeRect(w,h)
      expect(poly.aabb(rect)).to.eql([0,w,h,0])
      draw.poly(rect).stroke('blue')

      var m = mat.translate(-w/2,0)
      mat.scale(2,1,m)
      mat.translate(w/2,0,m)

      poly.transform(rect,m)

      expect(poly.aabb(rect)).to.eql([0,w+w/2,h,-w/2])
      draw.poly(rect).stroke('red')
    })

    it('should scale an offset rect from center on x',function(){
      var w = 20, h = 20, x = 10, y = 10;
      var rect = makeRect(w,h,x,y)
      expect(poly.aabb(rect)).to.eql([y,x+w,y+h,x])
      draw.poly(rect).stroke('blue')

      var m = mat.translate(-(x+w/2),0)
      mat.scale(2,1,m)
      mat.translate((x+w/2),0,m)

      poly.transform(rect,m)

      draw.poly(rect).stroke('red')
      expect(poly.aabb(rect)).to.eql([y,x+w+w/2,y+h,x-w/2])
    })
  })

})


function createDraw(){
  if( typeof window != 'undefined' ){
    return new Draw(document.createElement('canvas'));
  } else {
    return new Draw();
  }
}

function appendTest(el){
  if( typeof window != 'undefined' ){
    // append the canvas after the results
    var suite = document.querySelector('#mocha-report > .suite:last-child')
      , test;

    // find the last test
    while( suite ){
      test = suite.querySelector('.test:last-child')
      suite = suite.querySelector('.suite:last-child')
    }

    test.appendChild(el)
  }
}

function invert(p){
  var q = poly.reverse(p);
  poly.free(p)
  return q;
}

function makeRect(w,h,x,y){
  x = x || 0
  y = y || 0
  return poly.make(
    x,y+h,
    x+w,y+h,
    x+w,y,
    x,y
  )
}