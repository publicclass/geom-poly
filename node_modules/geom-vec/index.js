
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
      console.warn('vec alloc',totalAllocated)
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
