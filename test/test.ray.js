var isNode = typeof __dirname != 'undefined';

var poly = require(isNode ? '../' : 'geom-poly')
  , vec = require(isNode ? 'geom-vec' : 'publicclass-geom-vec')
  , expect = expect || require('expect.js')
  , Draw = Draw || require('./support/draw');

vec.verbose = poly.verbose = false;


describe('geom-poly',function(){

  describe('ray',function(){

    var draw;
    beforeEach(function(){
      draw = createDraw()
      draw.fill('black')
    })
    afterEach(function(){
      appendTest(draw.cnv)
    })


    it('should intersect with rect',function(){

      var rect = makeRect(50,50,10,10)
      var origin = vec.make(30,0)
      var ray = vec.make(0,20)
      var normal = vec.make()

      draw.poly(rect).stroke('blue')
      draw.line([
        origin,
        vec.add(origin,ray)
      ]).stroke('red')

      var found = findEdgeNormal(rect,origin,ray,normal)

      expect(found).to.be.true
      expect(normal).to.eql([0,-1])
    })


    it('should intersect with rect',function(){

      var rect = makeRect(50,50,10,10)
      var origin = vec.make(30,0)
      var ray = vec.make(10,20)
      var normal = vec.make()

      draw.poly(rect).stroke('blue')
      draw.line([
        origin,
        vec.add(origin,ray)
      ]).stroke('red')

      var found = findEdgeNormal(rect,origin,ray,normal)

      expect(found).to.be.true
      expect(normal).to.eql([0,-1])
    })

    it('should intersect with rect',function(){

      var rect = makeRect(50,50,10,10)
      var origin = vec.make(0,30)
      var ray = vec.make(20,20)
      var normal = vec.make()

      draw.poly(rect).stroke('blue')
      draw.line([
        origin,
        vec.add(origin,ray)
      ]).stroke('red')

      var found = findEdgeNormal(rect,origin,ray,normal)

      expect(found).to.be.true
      expect(normal).to.eql([-1,0])
    })

    it('should intersect with rect corner',function(){

      var rect = makeRect(50,50,10,10)
      var origin = vec.make(0,0)
      var ray = vec.make(20,20)
      var normal = vec.make()

      draw.poly(rect).stroke('blue')
      draw.line([
        origin,
        vec.add(origin,ray)
      ]).stroke('red')

      var found = findEdgeNormal(rect,origin,ray,normal)

      expect(found).to.be.true
      expect(normal).to.eql([0,-1])
    })


    it('should intersect using the centroids of two rects',function(){
      var a = makeRect(50,50,10,10)
      var b = makeRect(50,50,30,40)
      var origin = poly.centroid(a)
      var target = poly.centroid(b)
      var ray = vec.sub(target,origin)

      draw.poly(a).stroke('blue')
      draw.poly(b).stroke('red')
      draw.line([origin,target]).stroke('pink')

      var normal = vec.make()
      var intersection = vec.make()
      var found = findEdgeNormal(b,origin,ray,normal,intersection)

      expect(found).to.be.true
      expect(normal).to.eql([0,-1])

      draw.point(intersection).fill('green')
    })


    it('should intersect using the centroids of two closer rects',function(){
      var a = makeRect(50,50,10,10)
      var b = makeRect(50,50,30,20)
      var origin = poly.centroid(a)
      var target = poly.centroid(b)
      var ray = vec.sub(target,origin)

      // extend the ray backwards by the radius of
      // the polygon to make sure we get an intersection
      var radius = poly.radius(a)
      var extension = vec.norm(ray)
      vec.smul(extension,radius,extension)
      vec.sub(origin,extension,origin)

      // and then update the ray
      vec.sub(target,origin,ray)

      draw.poly(a).stroke('blue')
      draw.poly(b).stroke('red')
      draw.line([origin,target]).stroke('pink')

      var normal = vec.make()
      var intersection = vec.make()
      var found = findEdgeNormal(b,origin,ray,normal,intersection)

      expect(found).to.be.true
      expect(normal).to.eql([-1,0])

      draw.point(intersection).fill('green')
    })


  })

})

/**
 * Sends a ray (the vector) into the Polygon
 * to see which edge segment it intersects.
 *
 * Based on: http://afloatingpoint.blogspot.se/2011/04/2d-polygon-raycasting.html
 *
 * @param  {Polygon} p The polygon
 * @param  {Vector} o The ray origin
 * @param  {Vector} v The ray direction
 * @param  {Vector} n The edge normal (if found)
 * @return {Boolean} true if normal was found
 */
function findEdgeNormal(p,o,v,n,x){
  var e = vec.add(o,v)
  var f = vec.make()
  // for( var i=0,j=p.vertices.length-1; i < p.vertices.length; i++ ){
  for(var i=0; i<p.length; i++){
    var a = p.vertices[i];
    var b = vec.add(a,p.edges[i],f)
    if( intersectsLineLine(o,e,a,b,x) ){
      vec.perp(p.edges[i],n)
      vec.norm(n,n);
      return true;
    }
  }
  return false;
}

function intersectsLineLine(a1,a2,b1,b2,i){
  var uaT = (b2[0] - b1[0]) * (a1[1]-b1[1]) - (b2[1]-b1[1]) * (a1[0]-b1[0]);
  var ubT = (a2[0] - a1[0]) * (a1[1]-b1[1]) - (a2[1]-a1[1]) * (a1[0]-b1[0]);
  var u   = (b2[1] - b1[1]) * (a2[0]-a1[0]) - (b2[0]-b1[0]) * (a2[1]-a1[1]);
  if( u !== 0 ){
    var ua = uaT / u;
    var ub = ubT / u;

    if( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ){
      // intersection point:
      if( i ){
        i[0] = a1[0]+ua*(a2[0]-a1[0])
        i[1] = a1[1]+ua*(a2[1]-a1[1])
      }
      return true;
    } else {
      // no intersection
      return false;
    }

  } else if( uaT === 0 || ubT === 0 ){
    // coincident
    return false;
  } else {
    // parallel
    return false;
  }
}

/**
 * Used by findEdgeNormal to check if a ray
 * intersects with a single segment.
 *
 * @param  {Vector} o The ray origin
 * @param  {Vector} r The ray direction
 * @param  {Vector} v The edge origin
 * @param  {Vector} e The edge direction
 * @return {Boolean}
 */
function intersectsSegment(o,r,v,e){
  var x = vec.dot(r,e);

  if( x === 0 ){
    return false;
  }
  var p = vec.perp(r);
  vec.neg(p,p) // left perp
  var d = vec.sub(v,o);
  var t = vec.dot(e,d) / x;
  var s = vec.dot(r,d) / x;
  vec.free(p)
  vec.free(d)
  return t >= 0 && t <= Number.MAX_VALUE
      && s >= 0 && s <= 1;
}


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