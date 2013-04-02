var poly = require('./')
  , vec = require('geom-vec');

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

var v = vec.make()
var c = poly.collides(a,b,v)
// console.log(c)
console.assert(c.willIntersect === true)
console.assert(c.intersect === true)

// move A out of the way
var t = c.minTranslationVector
poly.translate(a,t[0],t[1])
// console.log(a)

var c = poly.collides(a,b,v)
// console.log(c)
console.assert(c.willIntersect === false)
console.assert(c.intersect === false)


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
console.assert(c.willIntersect === true)
console.assert(c.intersect === false)


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
console.assert(c.willIntersect === false)
console.assert(c.intersect === false)


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
var av = vec.make(0,100)
var bv = vec.make(0,0)
var v = vec.sub(av,bv)
var c = poly.collides(a,b,v)

// console.log(c)
console.assert(c.willIntersect === true)
console.assert(c.intersect === false)



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
console.assert(c.willIntersect === false)
console.assert(c.intersect === false)



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
console.assert(c.willIntersect === false)
console.assert(c.intersect === false)

