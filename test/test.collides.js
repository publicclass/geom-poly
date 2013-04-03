try {
// component
var poly = require('geom-poly')
  , vec = require('publicclass-geom-vec')
  , expect = expect || require('expect.js');
} catch(e){
// node/browserify
var poly = require('../')
  , vec = require('geom-vec')
  , expect = expect || require('expect.js');
}

describe('geom-poly',function(){

  describe('collides()',function(){
    var draw;
    beforeEach(function(){
      draw = createDraw()
    })
    afterEach(function(){
      if( typeof window != 'undefined' ){
        // append the canvas after the results
        var suite = document.querySelector('#mocha .suite .test:last-child');
        suite.appendChild(draw.cnv)
      }
    })

    /**
     * Intersection on two axis' with no
     * velocity.
     *
     *    +-A-+ v = 0,0
     *    |   |
     *    | +---B---+ v = 0,0
     *    +-|-+     |
     *      +-------+
     *
     */
    it('should intersect on 2 axis with no velocity',function(){

      var a = poly.make(
        10,10,
        10,40,
        40,40,
        40,10
      )

      var b = poly.make(
        20,30,
        20,50,
        90,50,
        90,30
      )
      // console.log(a)

      draw.poly(b).stroke('red')
      draw.poly(a).stroke('blue')

      var v = vec.make()
      var c = poly.collides(a,b,v)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(true)

      // move A out of the way
      var t = c.minTranslationVector
      poly.translate(a,t[0],t[1])
      draw.poly(a).stroke('lightblue')

      // and try again
      var c = poly.collides(a,b,v)
      // console.log(c)
      expect(c.willIntersect).to.equal(false)
      expect(c.intersect).to.equal(false)

    })

    /**
     * Will collide on two axis' with vertical
     * velocity.
     *
     *    +-A-+ v = 0,11
     *    |   |
     *    |   |
     *    +---+
     *
     *      +---B---+ v = 0,0
     *      |       |
     *      +-------+
     *
     */

    it('will collide on 2 axis with vertical velocity',function(){

      var a = poly.make(
        10,10,
        10,40,
        40,40,
        40,10
      )

      var b = poly.make(
        20,50,
        20,70,
        90,70,
        90,50
      )
      var av = vec.make(0,11)
      var bv = vec.make(0,0)
      var v = vec.sub(av,bv)
      var c = poly.collides(a,b,v)

      draw.poly(b).stroke('red')
      draw.poly(a).stroke('blue')

      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)

    })

    /**
     * Will only touch on two axis' with vertical
     * velocity.
     *
     *    +-A-+ v = 0,10
     *    |   |
     *    |   |
     *    +---+
     *
     *      +---B---+ v = 0,0
     *      |       |
     *      +-------+
     *
     */

    it('will only touch (not intersect) with vertical velocity',function(){
      var a = poly.make(
        10,10,
        10,40,
        40,40,
        40,10
      )

      var b = poly.make(
        20,50,
        20,70,
        90,70,
        90,50
      )
      var av = vec.make(0,10)
      var bv = vec.make(0,0)
      var v = vec.sub(av,bv)
      var c = poly.collides(a,b,v)

      draw.poly(b).stroke('red')
      draw.poly(a).stroke('blue')

      // console.log(c)
      expect(c.willIntersect).to.equal(false)
      expect(c.intersect).to.equal(false)

    })


    /**
     * Will collide on two axis' with very high
     * vertical velocity which would cause it to
     * pass through
     *
     *    +-A-+ v = 0,100
     *    |   |
     *    |   |
     *    +---+
     *
     *      +---B---+ v = 0,0
     *      |       |
     *      +-------+
     *
     */
    it('will collide when pass through because of high vertical velocity',function(){

      var a = poly.make(
        10,10,
        10,40,
        40,40,
        40,10
      )

      var b = poly.make(
        20,50,
        20,70,
        90,70,
        90,50
      )
      var av = vec.make(0,100)
      var bv = vec.make(0,0)
      var v = vec.sub(av,bv)
      var c = poly.collides(a,b,v)

      draw.poly(b).stroke('red')
      draw.poly(a).stroke('blue')

      poly.translate(a,av[0],av[1])
      draw.poly(a).stroke('lightblue')

      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)

      // TODO the minTranslationVector is now [-20,0] which will push B next
      //      to A while it still "flies through". I'd like to be able to know
      //      "when" it would intersect so I can avoid it.

    })


    /**
     * Will collide on two axis' with very high
     * horizontal velocity which would cause it to
     * pass through
     *
     *    +-A-+ v = 0,0
     *    |   |   +---B---+ v = -100,0
     *    |   |   |       |
     *    +---+   +-------+
     *
     */
    it('will collide when pass through because of high horizontal velocity',function(){

      var a = poly.make(
        10,10,
        10,40,
        40,40,
        40,10
      )

      var b = poly.make(
        50,30,
        50,40,
        90,40,
        90,30
      )
      var av = vec.make(0,0)
      var bv = vec.make(-100,0)
      var v = vec.sub(av,bv)
      var c = poly.collides(a,b,v)

      draw.poly(b).stroke('red')
      draw.poly(a).stroke('blue')

      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)

      poly.translate(a,v[0],v[1])
      draw.poly(a).stroke('lightblue')

      // TODO the minTranslationVector is now [0,-10] which will push B next
      //      to A while it still "flies through". I'd like to be able to know
      //      "when" it would intersect so I can avoid it.

      // testing to 'multisample' by stepping 1/10 of the velocity at a time
      // var steps = 10;
      // for(var i=0; i<steps; i++){
      //   poly.translate(b,bv[0]/steps,0)
      //   var c = poly.collides(a,b,v)
      //   console.log(c)
      //   if( c.intersect )
      //     break;
      // }
    })


    /**
     * Precise intersection on one axis with no
     * velocity.
     *
     *    +-A-+ v = 0,0
     *    |   |
     *    |   |
     *    +-+-+-B---+ v = 0,0
     *      |       |
     *      +-------+
     *
     */
    it('will not intersect when distance is 0 with no velocity',function(){

      var a = poly.make(
        10,10,
        10,40,
        40,40,
        40,10
      )

      var b = poly.make(
        20,40,
        20,60,
        90,60,
        90,40
      )

      var c = poly.collides(a,b)

      // console.log(c)
      expect(c.willIntersect).to.equal(false)
      expect(c.intersect).to.equal(false)

      draw.poly(b).stroke('red')
      draw.poly(a).stroke('blue')
    })



    /**
     * Will not collide on two axis' with very high
     * vertical velocity in the wrong direction.
     *
     *    +-A-+ v = 0,-100
     *    |   |
     *    |   |
     *    +---+
     *
     *      +---B---+ v = 0,0
     *      |       |
     *      +-------+
     *
     */

    it('will not collide with high velocity in opposite direction',function(){

      var a = poly.make(
        10,10,
        10,40,
        40,40,
        40,10
      )

      var b = poly.make(
        20,50,
        20,70,
        90,70,
        90,50
      )
      var av = vec.make(0,-100)
      var bv = vec.make(0,0)
      var v = vec.sub(av,bv)
      var c = poly.collides(a,b,v)

      draw.poly(b).stroke('red')
      draw.poly(a).stroke('blue')

      // console.log(c)
      expect(c.willIntersect).to.equal(false)
      expect(c.intersect).to.equal(false)

      poly.translate(a,av[0],av[1])
      draw.poly(a).stroke('lightblue')
    })



    /**
     *
     *    A v = 0,0
     *   / \
     *  /   \
     * +     +
     *  \   /
     *   \ /
     *    +
     *
     *    +-B-+ v = 0,-10
     *    |   |
     *    |   |
     *    +---+
     *
     */

    it('will collide with non-axis-aligned polygons',function(){

      var a = poly.make(
        50,30,
        30,50,
        50,70,
        70,50
      )

      var b = poly.make(
        50,70,
        50,90,
        70,90,
        70,70
      )
      var av = vec.make(0,0)
      var bv = vec.make(0,-10)
      var v = vec.sub(av,bv)
      var c = poly.collides(a,b,v)

      draw.poly(a).stroke('blue')
      draw.poly(b).stroke('red')

      poly.translate(b,bv[0],bv[1])
      draw.poly(b).stroke('pink')

      console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)
    })

    /**
     *
     *    B v = 0,0
     *   / \
     *  /   \
     * +     +
     *  \   /
     *   \ /
     *    +
     *
     *    +-A-+ v = 0,-10
     *    |   |
     *    |   |
     *    +---+
     *
     */

    it('will collide with non-axis-aligned polygons (reversed)',function(){

      var b = poly.make(
        50,30,
        30,50,
        50,70,
        70,50
      )

      var a = poly.make(
        55,70,
        55,90,
        75,90,
        75,70
      )
      var av = vec.make(0,-10)
      var bv = vec.make(0,0)
      var v = vec.sub(av,bv)
      var c = poly.collides(a,b,v)

      draw.poly(b).stroke('red')
      draw.poly(a).stroke('blue')

      poly.translate(a,av[0],av[1])
      draw.poly(a).stroke('lightblue')

      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)

    })

    /**
     *
     *    A v = 0,0
     *   / \
     *  /   \
     * +  +-B++ v = 0,0
     *  \ |   |
     *   \|   |
     *    +---+
     *
     */

    it('intersecting non-axis-aligned polygons',function(){

      var a = poly.make(
        50,60,
        30,80,
        50,100,
        70,80
      )

      var b = poly.make(
        55,55,
        55,75,
        75,75,
        75,55
      )
      var c = poly.collides(a,b)

      draw.poly(a).stroke('blue')
      draw.poly(b).stroke('red')

      console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(true)
    })


    /**
     *
     *    A v = 0,0
     *   / \
     *  /   \
     * +  +-B++ v = 0,0
     *  \ |   |
     *   \|   |
     *    +---+
     *
     */

    it('intersecting non-axis-aligned polygons (inverted)',function(){

      var a = invert(poly.make(
        50,30,
        30,50,
        50,70,
        70,50
      ))

      var b = invert(poly.make(
        55,55,
        55,75,
        75,75,
        75,55
      ))
      var c = poly.collides(a,b)

      draw.poly(a).stroke('blue')
      draw.poly(b).stroke('red')

      console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(true)
    })


    /**
     *
     *          B v = 0,0
     *         / \
     *        /   \
     *       +     +
     *        \   /
     *         \ /
     *          +
     *
     *    +-A-+ v = 0,-10
     *    |   |
     *    |   |
     *    +---+
     *
     */

    it('will collide with non-axis-aligned polygons too on the left side',function(){

      var b = poly.make(
        75,30,
        55,50,
        75,70,
        95,50
      )

      var a = poly.make(
        50,70,
        50,90,
        70,90,
        70,70
      )
      var av = vec.make(0,-10)
      var bv = vec.make(0,0)
      var v = vec.sub(av,bv)
      var c = poly.collides(a,b,v)

      draw.poly(b).stroke('red')
      draw.poly(a).stroke('blue')

      poly.translate(a,av[0],av[1])
      draw.poly(a).stroke('lightblue')

      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)

    })

    /**
     *
     *    B v = 0,0
     *   / \
     *  / +-A-+ v = 0,0
     * +--|   |
     *    |   |
     *    +---+
     *
     */

    it('will collide with static triangle vs rectangle',function(){

      var b = poly.make(
        50,30,
        35,50,
        65,50
      )

      var a = poly.make(
        50,40,
        50,60,
        70,60,
        70,40
      )
      var av = vec.make(0,0)
      var bv = vec.make(0,0)
      var v = vec.sub(av,bv)
      var c = poly.collides(a,b,v)

      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(true)

      draw.poly(b).stroke('red')
      draw.poly(a).stroke('blue')
    })

    /**
     *
     * +
     * |\ v=0,0
     * | \
     * B  +  +-A-+ v=-20,-5
     * | /   |   |
     * |/    |   |
     * +     +---+
     *
     */

    it('will collide with rotated static triangle vs moving rectangle',function(){
      var b = poly.make(
        10,10,
        10,50,
        30,30
      )

      var a = poly.make(
        40,30,
        40,50,
        60,50,
        60,30
      )

      draw.poly(b).stroke('red')
      draw.poly(a).stroke('blue')

      var av = vec.make(-20,-5)
      var bv = vec.make(0,0)
      var v = vec.sub(av,bv)
      var c = poly.collides(a,b,v)

      console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)

      var v = vec.sub(bv,av)
      var c = poly.collides(b,a,v)
      console.log(c)

      // goes both ways
      // (as long as relative velocity is calculated right)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)

      poly.translate(a,av[0],av[1])
      draw.poly(a).stroke('lightblue')
    })
  })
})

function createDraw(){
  if( typeof window != 'undefined' ){
    return new Draw(document.createElement('canvas'))
  } else {
    var draw = {
      poly: function(){return draw},
      fill: function(){return draw},
      stroke: function(){return draw}
    };
    return draw;
  }
}

function invert(p){
  var q = poly.make();
  for(var i=p.length-1; i>=0; i--){
    var v = p.vertices[i];
    poly.add(q,v[0],v[1]);
  }
  poly.close(q)
  return q;
}