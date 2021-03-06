var isNode = typeof __dirname != 'undefined';

var poly = require(isNode ? '../' : 'geom-poly')
  , vec = require(isNode ? 'geom-vec' : 'publicclass-geom-vec')
  , expect = expect || require('expect.js')
  , Draw = Draw || require('./support/draw');

vec.verbose = poly.verbose = false;

describe('geom-poly',function(){

  describe('collides()',function(){
    var draw;
    beforeEach(function(){
      draw = createDraw()
      draw.fill('black')
    })
    afterEach(function(){
      appendTest(draw.cnv)
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
      draw.edge(a,1).stroke('gold')

      var v = vec.make()
      var c = poly.collides(a,b,v)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(true)

      expect(c).to.have.property('minTranslationVector').eql([0,-10])
      expect(c).to.have.property('nearestEdge').eql(a.edges[1])

      // move A out of the way
      var t = c.minTranslationVector
      poly.translate(a,t[0],t[1])
      draw.poly(a).stroke('lightblue')

      // and try again
      var c = poly.collides(a,b,v)
      // console.log(c)
      expect(c.willIntersect).to.equal(false)
      expect(c.intersect).to.equal(false)
      expect(c).to.have.property('minTranslationVector').eql(null)
      expect(c).to.have.property('nearestEdge').eql(null)

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

      draw.poly(a).stroke('blue').vel(a,av).stroke('blue')
      draw.poly(b).stroke('red').vel(b,bv).stroke('red')
      draw.edge(a,1).stroke('gold')

      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)

      expect(c).to.have.property('minTranslationVector').eql([0,-1])
      expect(c).to.have.property('nearestEdge').eql(a.edges[1])

      var t = c.minTranslationVector
      poly.translate(a,av[0],av[1])
      poly.translate(a,t[0],t[1])
      draw.poly(a).stroke('lightblue')
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

      draw.poly(a).stroke('blue').vel(a,av).stroke('blue')
      draw.poly(b).stroke('red').vel(b,bv).stroke('red')

      // console.log(c)
      expect(c.willIntersect).to.equal(false)
      expect(c.intersect).to.equal(false)

      expect(c).to.have.property('minTranslationVector',null)
      expect(c).to.have.property('nearestEdge',null)

      poly.translate(a,av[0],av[1])
      draw.poly(a).stroke('lightblue')
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

      draw.poly(a).stroke('blue').vel(a,av).stroke('blue')
      draw.poly(b).stroke('red').vel(b,bv).stroke('red')
      draw.edge(a,0).stroke('gold')

      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)

      expect(c).to.have.property('minTranslationVector').eql([-20,0])
      expect(c).to.have.property('nearestEdge').eql(a.edges[0])

      // TODO the minTranslationVector is now [-20,0] which will push B next
      //      to A while it still "flies through". I'd like to be able to know
      //      "when" it would intersect so I can avoid it.

      var t = c.minTranslationVector
      poly.translate(a,av[0],av[1])
      poly.translate(a,t[0],t[1])
      draw.poly(a).stroke('lightblue')
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
      var av = vec.make(100,0)
      var bv = vec.make(0,0)
      var v = vec.sub(av,bv)
      var c = poly.collides(a,b,v)

      draw.poly(a).stroke('blue').vel(a,av).stroke('blue')
      draw.poly(b).stroke('red').vel(b,bv).stroke('red')
      draw.edge(a,1).stroke('gold')

      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)

      expect(c).to.have.property('minTranslationVector').eql([0,-10])
      expect(c).to.have.property('nearestEdge').eql(a.edges[1])

      // make a copy of a to test the bisection with below
      // (since we're moving a around)
      var d = poly.copy(a)

      var t = c.minTranslationVector
      poly.translate(a,av[0],av[1])
      poly.translate(a,t[0],t[1])
      draw.poly(a).stroke('lightblue')

      // TODO the minTranslationVector is now [0,-10] which will push B next
      //      to A while it still "flies through". I'd like to be able to know
      //      "when" it would intersect so I can avoid it.


      // testing to 'multisample' by stepping 1/10 of the velocity at a time
      // var steps = 100;
      // for(var i=0; i<steps; i++){
      //   poly.translate(d,av[0]/steps*i,av[1]/steps*1)
      //   c = poly.collides(d,b,v)
      //   if( c.intersect )
      //     break;
      // }
      // var t = c.minTranslationVector;
      // poly.translate(d,t[0],t[1])
      // console.log(d)
      // draw.poly(d).stroke('orange')


      // TODO also test a 'bisect multisample' where it steps v*0.5 and if it doesn't
      //      hit it tries v*0.75 or if it hits it tries v*0.25 etc. and have
      //      a sample rate which is the maximum steps taken.
      // var attempts = 10;
      // var z = vec.make() // zero velocity
      // var n = vec.lerp(z,v,0.5); // start in the middle
      // while(--attempts > 0){
      //   poly.collides(d,b,n,c)
      //   if( c.intersect ){
      //     console.log('intersects',n)
      //     // try a bit closer to d
      //     vec.lerp(n,z,0.5,n)
      //   } else if( c.willIntersect ){
      //     console.log('will intersect',n)
      //     // try a bit closer to b
      //     vec.lerp(v,n,0.5,n)
      //   } else {
      //     console.log('no intersection',n)
      //   }
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
      expect(c).to.have.property('minTranslationVector',null)
      expect(c).to.have.property('nearestEdge',null)

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

      draw.poly(b).stroke('red').vel(b,bv).stroke('red')
      draw.poly(a).stroke('blue').vel(a,av).stroke('blue')

      // console.log(c)
      expect(c.willIntersect).to.equal(false)
      expect(c.intersect).to.equal(false)
      expect(c).to.have.property('minTranslationVector',null)
      expect(c).to.have.property('nearestEdge',null)

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

      draw.poly(a).stroke('blue').vel(a,av).stroke('blue')
      draw.poly(b).stroke('red').vel(b,bv).stroke('red')
      draw.edge(a,0).stroke('gold')

      poly.translate(b,bv[0],bv[1])
      draw.poly(b).stroke('pink')

      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)

      expect(c).to.have.property('minTranslationVector').eql([-5,-5])
      expect(c).to.have.property('nearestEdge').eql(a.edges[0])
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

      draw.poly(a).stroke('blue').vel(a,av).stroke('blue')
      draw.poly(b).stroke('red').vel(b,bv).stroke('red')
      draw.edge(b,0).stroke('gold')

      var t = c.minTranslationVector
      poly.translate(a,t[0],t[1])
      poly.translate(a,av[0],av[1])
      draw.poly(a).stroke('lightblue')

      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)
      expect(c).to.have.property('minTranslationVector').eql([2.5,2.5])
      expect(c).to.have.property('nearestEdge').eql(b.edges[0])

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
      draw.edge(a,1).stroke('gold')

      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(true)
      expect(c).to.have.property('minTranslationVector').eql([-5,5])
      expect(c).to.have.property('nearestEdge').eql(a.edges[1])

      var t = c.minTranslationVector
      poly.translate(a,t[0],t[1])
      draw.poly(a).stroke('lightblue')
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
      draw.edge(a,0).stroke('gold')

      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(true)
      expect(c).to.have.property('minTranslationVector').eql([-5,-5])
      expect(c).to.have.property('nearestEdge').eql(a.edges[0])

      var t = c.minTranslationVector
      poly.translate(a,t[0],t[1])
      draw.poly(a).stroke('lightblue')
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

      draw.poly(a).stroke('blue').vel(a,av).stroke('blue')
      draw.poly(b).stroke('red').vel(b,bv).stroke('red')
      draw.edge(b,1).stroke('gold')

      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)

      expect(c).to.have.property('minTranslationVector').eql([-2.499999999999999,2.499999999999999])
      expect(c).to.have.property('nearestEdge').eql(b.edges[1])

      var t = c.minTranslationVector
      poly.translate(a,t[0],t[1])
      poly.translate(a,av[0],av[1])
      draw.poly(a).stroke('lightblue')
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

      draw.poly(a).stroke('blue').vel(a,av).stroke('blue')
      draw.poly(b).stroke('red').vel(b,bv).stroke('red')
      draw.edge(a,1).stroke('gold')

      expect(c).to.have.property('minTranslationVector').eql([0,10])
      expect(c).to.have.property('nearestEdge').eql(a.edges[1])

      var t = c.minTranslationVector
      poly.translate(a,t[0],t[1])
      draw.poly(a).stroke('lightblue')
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

      var av = vec.make(-20,-5)
      var bv = vec.make(0,0)
      var v = vec.sub(av,bv)
      var c = poly.collides(a,b,v)

      draw.poly(a).stroke('blue').vel(a,av).stroke('blue')
      draw.poly(b).stroke('red').vel(b,bv).stroke('red')
      draw.edge(a,0).stroke('gold')

      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)

      expect(c).to.have.property('minTranslationVector').eql([10,0])
      expect(c).to.have.property('nearestEdge').eql(a.edges[0])

      var t = c.minTranslationVector
      poly.translate(a,t[0],t[1])
      poly.translate(a,av[0],av[1])
      draw.poly(a).stroke('lightblue')

      var v = vec.sub(bv,av)
      var c = poly.collides(b,a,v)

      // goes both ways
      // (as long as relative velocity is calculated right)
      // console.log(c)
      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)

    })

    /**
     *
     *   +---B---+ v = 0,0
     *   |       |
     *   | +-A-+ | v = 0,0
     *   | |   | |
     *   | |   | |
     *   | +---+ |
     *   +-------+
     */

    it('should intersect when contained',function(){
      var b = poly.make(
        10,10,
        10,60,
        60,60,
        60,10
      )

      var a = poly.make(
        30,30,
        30,50,
        50,50,
        50,30
      )

      var c = poly.collides(a,b)

      // console.log(c)
      draw.poly(b).stroke('red')
      draw.poly(a).stroke('blue')
      draw.edge(a,1).stroke('gold')

      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(true)

      expect(c).to.have.property('minTranslationVector').eql([0,30])
      expect(c).to.have.property('nearestEdge').eql(a.edges[1])

      var t = c.minTranslationVector
      poly.translate(a,t[0],t[1])
      draw.poly(a).stroke('lightblue')
    })


    /**
     *  +-A-+ v = 0,0
     *  |   |
     *  |   |
     *  +---+
     *
     *  +-B-+ v = 0,-20
     *  |   |
     *  |   |
     *  +---+
     */
    it('will intersect with equal width rects',function(){
      var a = poly.make(
        10,00,
        10,60,
        60,60,
        60,00
      )

      var b = poly.make(
        10,70,
        10,120,
        60,120,
        60,70
      )

      var av = vec.make(0,0)
      var bv = vec.make(0,-55)
      var v = vec.sub(bv,av)
      var c = poly.collides(b,a,v)

      draw.poly(a).stroke('blue').vel(a,av).stroke('blue')
      draw.poly(b).stroke('red').vel(b,bv).stroke('red')
      draw.edge(b,1).stroke('gold')

      expect(c.willIntersect).to.equal(true)
      expect(c.intersect).to.equal(false)

      expect(c).to.have.property('minTranslationVector').eql([0,45])
      expect(c).to.have.property('nearestEdge').eql(b.edges[1])

      var t = c.minTranslationVector
      poly.translate(b,t[0],t[1])
      poly.translate(b,bv[0],bv[1])
      draw.poly(b).stroke('pink')

      // NOTE: if bv[1] is >=60 the nearestEdge changes to
      // 0 (left side) instead.
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