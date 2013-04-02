var poly = require(typeof window != 'undefined' ? 'geom-poly' : '../')
  , vec = require(typeof window != 'undefined' ? 'publicclass-geom-vec' : 'geom-vec')
  , expect = expect || require('expect.js');

describe('geom-poly',function(){

  describe('collides()',function(){
    var draw;
    beforeEach(function(){
      draw = createDraw()
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
        40,10,
        40,40,
        10,40
      )

      var b = poly.make(
        20,30,
        90,30,
        90,50,
        20,50
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
      // console.log(a)

      // and try again
      var c = poly.collides(a,b,v)
      // console.log(c)
      expect(c.willIntersect).to.equal(false)
      expect(c.intersect).to.equal(false)

      draw.poly(a).stroke('pink')
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
        40,10,
        40,40,
        10,40
      )

      var b = poly.make(
        20,50,
        90,50,
        90,70,
        20,70
      )
      var av = vec.make(0,11)
      var bv = vec.make(0,0)
      var v = vec.sub(av,bv)
      var c = poly.collides(a,b,v)

      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)

      draw.poly(b).stroke('red')
      draw.poly(a).stroke('blue')
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
        40,10,
        40,40,
        10,40
      )

      var b = poly.make(
        20,50,
        90,50,
        90,70,
        20,70
      )
      var av = vec.make(0,10)
      var bv = vec.make(0,0)
      var v = vec.sub(av,bv)
      var c = poly.collides(a,b,v)

      // console.log(c)
      expect(c.willIntersect).to.equal(false)
      expect(c.intersect).to.equal(false)

      draw.poly(b).stroke('red')
      draw.poly(a).stroke('blue')
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

      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)

      // TODO the minTranslationVector is now [-20,0] which will push B next
      //      to A while it still "flies through". I'd like to be able to know
      //      "when" it would intersect so I can avoid it.

      draw.poly(b).stroke('red')
      draw.poly(a).stroke('blue')
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

      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)

      draw.poly(b).stroke('red')
      draw.poly(a).stroke('blue')

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
        40,10,
        40,40,
        10,40
      )

      var b = poly.make(
        20,40,
        90,40,
        90,60,
        20,60
      )

      var v = vec.make()
      var c = poly.collides(a,b,v)
      // console.log(a)
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
        40,10,
        40,40,
        10,40
      )

      var b = poly.make(
        20,50,
        90,50,
        90,70,
        20,70
      )
      var av = vec.make(0,-100)
      var bv = vec.make(0,0)
      var v = vec.sub(av,bv)
      var c = poly.collides(a,b,v)

      // console.log(c)
      expect(c.willIntersect).to.equal(false)
      expect(c.intersect).to.equal(false)

      draw.poly(b).stroke('red')
      draw.poly(a).stroke('blue')
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

    it('will collide with non-axis-aligned polygons too',function(){

      var a = poly.make(
        50,30,
        70,50,
        50,30,
        70,10
      )

      var b = poly.make(
        20,50,
        90,50,
        90,70,
        20,70
      )
      var av = vec.make(0,0)
      var bv = vec.make(0,-10)
      var v = vec.sub(av,bv)
      var c = poly.collides(a,b,v)

      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)

      draw.poly(b).stroke('red')
      draw.poly(a).stroke('blue')
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

    it('will collide with non-axis-aligned polygons too (reversed)',function(){

      var b = poly.make(
        50,30,
        70,50,
        50,30,
        70,10
      )

      var a = poly.make(
        20,50,
        90,50,
        90,70,
        20,70
      )
      var av = vec.make(0,-10)
      var bv = vec.make(0,0)
      var v = vec.sub(av,bv)
      var c = poly.collides(a,b,v)

      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)

      draw.poly(b).stroke('red')
      draw.poly(a).stroke('blue')
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
        65,50,
        35,50
      )

      var a = poly.make(
        50,40,
        70,40,
        70,60,
        50,60
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
      draw.poly(a).stroke('pink')
    })
  })
})

function createDraw(){
  if( typeof window != 'undefined' ){
    var cnv = document.createElement('canvas');
    var ctx = cnv.getContext('2d');
    var suite = document.querySelector('#mocha .suite .suite ul');
    suite.appendChild(cnv)
    return new Draw(ctx)
  } else {
    var draw = {
      poly: function(){return draw},
      fill: function(){return draw},
      stroke: function(){return draw}
    };
    return draw;
  }
}