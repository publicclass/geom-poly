

/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("publicclass-geom-vec/index.js", function(exports, require, module){

var unallocated = []
  , allocated = []
  , totalAllocated = 0;

// TODO see if `new Vec()` is better than `[]` or `new Array(2)`
// in both memory and speed
function Vec(x,y){this[0] = x; this[1] = y};


// Used by sin/cos to fix floating point precision errors
// slower, but testable
var EPS = 1e-12;
function eps(x){ return Math.round(x/EPS) * EPS }

var vec = module.exports = {

  verbose: true,

  _unallocated: unallocated,
  _allocated: allocated,

  make: function(x,y){
    var c = vec.alloc();
    if( typeof x == 'object' ){
      c[0] = x[0] || x.x || x.u || 0;
      c[1] = x[1] || x.y || x.v || 0;
    } else {
      c[0] = x || 0;
      c[1] = y || 0;
    }
    return c;
  },

  alloc: function(){
    if( !unallocated.length ){
      var i = totalAllocated
        , u = unallocated.length - i;
      totalAllocated = (totalAllocated || 64) * 2; // double the size (128>256>512 etc)
      allocated.length = totalAllocated;
      vec.verbose && console.warn('vec alloc',totalAllocated)
      while(i < totalAllocated){
        var v = [0,0]; //new Array(2); //new Vec(0.0,0.0);
        unallocated[u+i] = v;
        allocated[i] = v;
        i++;
      }
    }
    return unallocated.pop();
  },

  free: function(v){
    v && unallocated.push(v);
    return vec;
  },

  copy: function(a,b){
    b = b || vec.make()
    b[0] = a[0]
    b[1] = a[1]
    return b;
  },

  add: function(a,b,c){
    c = c || vec.make()
    c[0] = a[0] + b[0];
    c[1] = a[1] + b[1];
    return c;
  },

  sadd: function(a,s,c){
    c = c || vec.make()
    c[0] = a[0] + s;
    c[1] = a[1] + s;
    return c;
  },

  sub: function(a,b,c){
    c = c || vec.make()
    c[0] = a[0] - b[0];
    c[1] = a[1] - b[1];
    return c;
  },

  ssub: function(a,s,c){
    c = c || vec.make()
    c[0] = a[0] - s;
    c[1] = a[1] - s;
    return c;
  },

  mul: function(a,b,c){
    c = c || vec.make()
    c[0] = a[0] * b[0];
    c[1] = a[1] * b[1];
    return c;
  },

  smul: function(a,s,c){
    c = c || vec.make()
    c[0] = a[0] * s;
    c[1] = a[1] * s;
    return c;
  },

  div: function(a,b,c){
    c = c || vec.make()
    c[0] = a[0] / b[0];
    c[1] = a[1] / b[1];
    return c;
  },

  sdiv: function(a,s,c){
    c = c || vec.make()
    c[0] = a[0] / s;
    c[1] = a[1] / s;
    return c;
  },

  min: function(a,b,c){
    c = c || vec.make()
    c[0] = Math.min(a[0],b[0])
    c[1] = Math.min(a[1],b[1])
    return c;
  },

  smin: function(a,s,c){
    c = c || vec.make()
    c[0] = Math.min(a[0],s)
    c[1] = Math.min(a[1],s)
    return c;
  },

  max: function(a,b,c){
    c = c || vec.make()
    c[0] = Math.max(a[0],b[0])
    c[1] = Math.max(a[1],b[1])
    return c;
  },

  smax: function(a,s,c){
    c = c || vec.make()
    c[0] = Math.max(a[0],s)
    c[1] = Math.max(a[1],s)
    return c;
  },

  clamp: function(lo,v,hi,c){
    c = c || vec.make()
    vec.min(hi,v,c)
    vec.max(lo,c,c)
    return c;
  },

  sclamp: function(lo,a,hi,c){
    c = c || vec.make()
    vec.min(v,hi,c)
    vec.max(c,lo,c)
    return c;
  },

  abs: function(a,c){
    c = c || vec.make()
    c[0] = Math.abs(a[0])
    c[1] = Math.abs(a[1])
    return c;
  },

  neg: function(a,c){
    c = c || vec.make()
    c[0] = -a[0]
    c[1] = -a[1]
    return c;
  },

  // note: dot(perp(a), b) == cross(a, b)
  perp: function(a,c){
    c = c || vec.make()
    var x=a[0], y=a[1];
    c[0] = -y
    c[1] = +x
    return c;
  },

  // cross product of two vectors
  cross: function(a,b){
    return a[0]*b[1] - a[1]*b[0];
  },

  // dot product of two vectors
  dot: function(a,b){
    return a[0]*b[0] + a[1]*b[1];
  },

  len: function(a){
    return Math.sqrt(vec.lenSq(a));
  },

  lenSq: function(a){
    return vec.dot(a,a);
  },

  dist: function(a,b){
    var d = vec.sub(a,b)
    var l = vec.len(d)
    vec.free(d)
    return l;
  },

  distSq: function(a,b){
    var d = vec.sub(a,b)
    var l = vec.lenSq(d)
    vec.free(d)
    return l;
  },

  norm: function(a,c){
    c = c || vec.make()
    var l = vec.len(a);
    c[0] = !l ? 0 : a[0] / l;
    c[1] = !l ? 0 : a[1] / l;
    return c;
  },

  // to move `a` around `origin`:
  //  var b = vec.sub(a,origin)
  //  b = vec.rot(b,theta)
  //  vec.add(b,origin,a)
  rot: function(a,theta,c){
    c = c || vec.make()
    var cos = Math.cos(theta)
      , sin = Math.sin(theta);
    c[0] = eps(cos * a[0] - sin * a[1]);
    c[1] = eps(sin * a[0] + cos * a[1]);
    return c;
  },

  eq: function(a,b){
    return a[0]===b[0] && a[1]===b[1];
  },

  lerp: function(a,b,t,c){
    c = c || vec.make()
    c[0] = a[0] + (b[0] - a[0]) * t;
    c[1] = a[1] + (b[1] - a[1]) * t;
    return c;
  },

  // m = mat
  transform: function(a,m,c){
    c = c || vec.make()
    var x=a[0], y=a[1];
    c[0] = m[0]*x + m[3]*y + m[2]
    c[1] = m[1]*x + m[4]*y + m[5]
    return c;
  },

  reflect: function(v,n,c){
    c = c || vec.make()
    var t = vec.dot(v,n);
    c[0] = v[0] - (2 * t) * n[0];
    c[1] = v[1] - (2 * t) * n[1];
    return c;
  }
}

});
require.register("geom-poly/index.js", function(exports, require, module){
var vec = require('geom-vec');


var unallocated = []
  , allocated = []
  , totalAllocated = 0;

function Poly(){
  this.length = 0;
  this.vertices = []
  this.edges = []
}

var poly = module.exports = {

  verbose: true,

  make: function(){
    var p = poly.alloc();
    if( arguments.length ){
      for( var i=0; i < arguments.length; i+=2 )
        poly.add(p,arguments[i],arguments[i+1]);
      poly.close(p);
    }
    return p;
  },

  alloc: function(){
    if( !unallocated.length ){
      var i = totalAllocated
        , u = unallocated.length - i;
      totalAllocated = (totalAllocated || 64) * 2; // double the size (128>256>512 etc)
      allocated.length = totalAllocated;
      poly.verbose && console.warn('poly alloc',totalAllocated)
      while(i < totalAllocated){
        var p = new Poly();
        unallocated[u+i] = p;
        allocated[i] = p;
        i++;
      }
    }
    return unallocated.pop();
  },

  free: function(p){
    if( p ){
      while(p.vertices.length)
        vec.free(p.vertices.pop());
      while(p.edges.length)
        vec.free(p.edges.pop());
      p.length = 0;
      unallocated.push(p);
    }
    return p;
  },

  copy: function(p,c){
    c = poly.free(c) || poly.make()
    for (var i = 0; i < p.vertices.length; i++) {
      poly.add(c,p.vertices[i][0],p.vertices[i][1])
    }
    poly.close(c);
    return c;
  },

  add: function(p,x,y){
    var v = vec.make(x,y)
    if( p.length ){
      // an edge is a vector between the last and
      // the current vertex
      var l = p.vertices[p.length-1];
      p.edges.push(vec.sub(v,l));
    }
    p.vertices.push(v);
    p.length++;
    return poly;
  },

  close: function(p){
    if( p.length ){
      // an edge is a vector between the last and
      // the current vertex
      var l = p.vertices[p.length-1]
      var v = p.vertices[0];
      p.edges.push(vec.sub(v,l));
    }
    return poly;
  },

  // source: http://alienryderflex.com/polygon/
  inside: function(p,x,y){
    var oddNodes = false;
    for( var i=0,j=p.vertices.length-1; i < p.vertices.length; i++ ){
      var vI = p.vertices[i]
        , vJ = p.vertices[j];
      if( (vI.y< y && vJ.y>=y
       ||  vJ.y< y && vI.y>=y)
       && (vI.x<=x || vJ.x<=x))
        oddNodes ^= (vI.x+(y-vI.y)/(vJ.y-vI.y)*(vJ.x-vI.x)<x);
      j = i;
    }
    return oddNodes;
  },

  area: function(p){
    var n = p.vertices.length
      , sum = 0;
    for(var i=0; i < n; i++){
      var v = p.vertices[i]
      var q = p.vertices[(i+1)%n]; // TODO optimize away modulo plz
      sum += v[0] * q[1] - q[0] * v[1];
    }
    return .5 * sum;
  },

  centroid: function(p){
    var a = poly.area(p) // TODO maybe accept area as an argument (in case it's cached?)
      , n = p.length
      , P = p.vertices
      , c = vec.make();
    for(var i=0; i < n; i++){
      var v = P[i]
        , q = P[(i+1)%n]
        , ai = vec.cross(v,q);
      c[0] += (v[0] + q[0]) * ai
      c[1] += (v[1] + q[1]) * ai
    }
    var b = 1 / (6 * a);
    return vec.mul(c,[b,b],c);
  },

  translate: function(p,x,y,o){
    var t = vec.make(x,y)
    o = o || p;
    for(var j=0; j < p.length; j++)
      vec.add(p.vertices[j],t,o.vertices[j]);
    // TODO this will not make a functional `o` (should use poly.add()/poly.close())
    vec.free(t)
    return o;
  },

  rotate: function(p,theta,o){
    // TODO
    throw new Error('rotate not implemented')
  },

  scale: function(p,theta,o){
    // TODO
    throw new Error('scale not implemented')
  },

  transform: function(p,mat,o){
    o = o || p
    for(var j=0; j < p.length; j++){
      vec.transform(p.vertices[j],mat,o.vertices[j]);
      vec.transform(p.edges[j],mat,o.edges[j]);
    }
    // TODO this will not make a functional `o` (should use poly.add()/poly.close())
    return o;
  },

  convexHull: function(p,o){
    // TODO
    throw new Error('convexHull not implemented')
  },

  aabb: function(p,o){
    // [t,r,b,l]
    var aabb = o || [0,0,0,0]
    aabb[0] =  Infinity;
    aabb[1] = -Infinity;
    aabb[2] = -Infinity;
    aabb[3] =  Infinity;
    for(var j=0; j < p.length; j++){
      var v = p.vertices[j];
      if( v[1] < aabb[0] ) aabb[0] = v[1] // t
      if( v[0] > aabb[1] ) aabb[1] = v[0] // r
      if( v[1] > aabb[2] ) aabb[2] = v[1] // b
      if( v[0] < aabb[3] ) aabb[3] = v[0] // l
    }
    return aabb;
      // or [x,y,w,h]?
      // or Poly(x1,y1,x2,y2,x3,y3,x4,y4)?
  },

  // a->b goes through an edge of p? if so set the intersection
  // at i and the normal of the edge at n
  intersects: function(p,a,b,i,n){
    // TODO
    throw new Error('intersects not implemented')
  },

  // http://www.codeproject.com/Articles/15573/2D-Polygon-Collision-Detection
  // is polygon `a` going to collide with polygon `b`?
  // `v` is the relative velocity of the polygons (ie. velA - velB)
  // returns a collision info object:
  //    { intersect: Bool, willIntersect: Bool, nearestEdge: vec, minTranslationVector: vec}
  collides: function(a,b,v,o){
    var res = o || {};
    res.intersect = true;
    res.willIntersect = true;
    res.minTranslationVector = null;
    res.nearestEdge = null;

    v = v || vec.make()
    var minIntervalDistance = Infinity;
    var translationAxis = vec.make();
    var nearestEdge = vec.make();
    var axis = vec.make()
    var iA = vec.make();
    var iB = vec.make();
    var cA, cB, cD;

    // loop through all edges of both polygons
    for(var i=0; i < (a.length+b.length); i++){
      var e = i < a.length ? i : i-a.length
      var edge = i < a.length ? a.edges[e] : b.edges[e]

      vec.perp(edge,axis)
      vec.norm(axis,axis)

      project(a,axis,iA)
      project(b,axis,iB)

      // are they currently intersecting?
      var iD = intervalDistance(iA,iB);
      if( iD >= 0 ){
        res.intersect = false;
      }

      // will they intersect?
      var vProj = vec.dot(axis,v);
      if( vProj < 0 ){
        iA[0] += vProj;
      } else {
        iA[1] += vProj;
      }

      iD = intervalDistance(iA,iB);
      if( iD >= 0 ){
        res.willIntersect = false;
      }

      // no intersection is and won't happen
      if( !res.intersect && !res.willIntersect ){
        break;
      }

      // find out if it's the closest one
      iD = Math.abs(iD);
      if( iD < minIntervalDistance ){
        minIntervalDistance = iD;
        vec.copy(edge, nearestEdge);
        vec.copy(axis, translationAxis);

        cA = cA || poly.centroid(a)
        cB = cB || poly.centroid(b)
        cD = vec.sub(cA, cB, cD);
        if( vec.dot(cD, translationAxis) < 0 ){
          vec.neg(translationAxis,translationAxis)
        }
      }
    }

    // the minimum translation vector can
    // be used to push the polygons apart
    if( res.willIntersect ){
      translationAxis[0] *= minIntervalDistance;
      translationAxis[1] *= minIntervalDistance;
      res.minTranslationVector = translationAxis;
      res.nearestEdge = nearestEdge;
    } else {
      vec.free(translationAxis)
      vec.free(nearestEdge)
    }

    vec.free(iA)
    vec.free(iB)
    vec.free(cA)
    vec.free(cB)
    vec.free(cD)
    vec.free(axis)

    // free `v` if it wasn't passed in as
    // an argument
    if( !arguments[2] ){
      vec.free(v);
    }

    return res;
  }

}


// `i` (interval) will be [min,max]
// TODO should this be exposed as poly.project()?
function project(p,axis,i){
  i = i || vec.make();
  i[0] =  Infinity;
  i[1] = -Infinity;
  for(var j=0; j < p.length; j++){
    var dot = vec.dot(axis,p.vertices[j])
    if( dot < i[0] ){
      i[0] = dot;
    }
    if( dot > i[1] ){
      i[1] = dot;
    }
  }
  return i
}


function intervalDistance(a,b){
  return a[0] < b[0] ? b[0] - a[1] : a[0] - b[1];
}
});
require.alias("publicclass-geom-vec/index.js", "geom-poly/deps/geom-vec/index.js");

