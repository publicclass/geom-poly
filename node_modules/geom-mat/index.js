var unallocated = []
  , allocated = []
  , totalAllocated = 0;

// Used by sin/cos to fix floating point precision errors
// slower, but testable
var EPS = 1e-12;
function eps(x){ return Math.round(x/EPS) * EPS }

// 2d affine transformation matrix
var mat = module.exports = {

  verbose: true,

  _unallocated: unallocated,
  _allocated: allocated,

  make: function(a,b,c,d,x,y){
    var m = mat.ident()
      , u = undefined;
    if( a !== u ) m[0] = a;
    if( b !== u ) m[1] = b;
    if( c !== u ) m[3] = c;
    if( d !== u ) m[4] = d;
    if( x !== u ) m[2] = x;
    if( y !== u ) m[5] = y;
    return m;
  },

  alloc: function(){
    if( !unallocated.length ){
      var i = totalAllocated
        , u = unallocated.length - i;
      totalAllocated = (totalAllocated || 64) * 2; // double the size (128>256>512 etc)
      allocated.length = totalAllocated;
      mat.verbose && console.warn('mat alloc',totalAllocated)
      while(i < totalAllocated){
        var v = [1,0,0,0,1,0,0,0,1]; //new Array(9)
        unallocated[u+i] = v;
        allocated[i] = v;
        i++;
      }
    }
    return unallocated.pop();
  },

  free: function(v){
    v && unallocated.push(v);
    return mat;
  },

  copy: function(a,m){
    m = m || mat.make()
    m[0] = a[0];
    m[1] = a[1];
    m[2] = a[2];
    m[3] = a[3];
    m[4] = a[4];
    m[5] = a[5];
    m[6] = a[6];
    m[7] = a[7];
    m[8] = a[8];
    return m;
  },

  ident: function(m){
    m = m || mat.alloc()
    m[0] = 1; // 0 0 / a
    m[1] = 0; // 0 1 / b
    m[2] = 0; // 0 2 / tx
    m[3] = 0; // 1 0 / c
    m[4] = 1; // 1 1 / d
    m[5] = 0; // 1 2 / ty
    m[6] = 0; // 2 0 / ?
    m[7] = 0; // 2 1 / ?
    m[8] = 1; // 2 2 / ?
    return m;
  },

  mul: function(a,b,m){
    var c = mat.make()
    c[0] = a[0]*b[0] + a[3]*b[1] // a*a + c*b
    c[1] = a[1]*b[0] + a[4]*b[1] // b*a + d*b
    c[3] = a[0]*b[3] + a[3]*b[4] // a*c + c*d
    c[4] = a[1]*b[3] + a[4]*b[4] // b*c + d*d
    c[2] = a[0]*b[2] + a[3]*b[5] + a[2] // a*tx + c*ty + tx
    c[5] = a[1]*b[2] + a[4]*b[5] + a[5] // b*tx + d*ty + ty
    if( m ){
      mat.copy(c,m)
      mat.free(c)
      return m;
    }
    return c;
  },

  //https://github.com/STRd6/matrix.js/blob/master/matrix.js
  translate: function(x,y,m){
    var a = mat.make(1,0,0,1,x,y)
    if( m ){
      mat.mul(a,m,m)
      mat.free(a)
      return m;
    }
    return a;
  },

  rotate: function(theta,m){
    var c = eps(Math.cos(theta))
      , s = eps(Math.sin(theta))
      , a = mat.make(c,s,-s,c);
    if( m ){
      mat.mul(a,m,m)
      mat.free(a)
      return m;
    }
    return a;
  },

  scale: function(x,y,m){
    var a = mat.make(x,0,0,y)
    if( m ){
      mat.mul(a,m,m)
      mat.free(a)
      return m;
    }
    return a;
  },

  // TODO transpose
  // TODO shear

  inv: function(a,m){
    var id = 1 / (a[0]*a[4] - a[1]*a[3]);
    a = mat.make(
       a[4]*id,
      -a[1]*id,
      -a[3]*id,
       a[0]*id,
      (a[3]*a[5] - a[4]*a[2])*id,
      (a[1]*a[2] - a[0]*a[5])*id
    )
    if( m ){
      mat.mul(a,m,m)
      mat.free(a)
      return m;
    }
    return a;
  }
}