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
    return p;
  },

  close: function(p){
    if( p.length ){
      // an edge is a vector between the last and
      // the current vertex
      var l = p.vertices[p.length-1]
      var v = p.vertices[0];
      p.edges.push(vec.sub(v,l));
    }
    return p;
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
      , area = 0;
    for(var i=0, j=n-1; i < n; j=i, i++){
      var v = p.vertices[i];
      var q = p.vertices[j];
      area += v[0] * q[1];
      area -= v[1] * q[0];
    }
    return Math.abs(area / 2);
  },

  perimeter: function(p){
    var sum = 0;
    for(var i=0; i < p.edges.length; i++){
      var e = p.edges[i];
      sum += vec.len(e); // TODO optimize away sqrt?
    }
    return sum;
  },

  radiusSq: function(p,c){
    var r = 0;
    c = c || poly.centroid(p);
    for(var i=0; i < p.length; i++){
      var v = p.vertices[i];
      var d = vec.distSq(v,c);
      if( d > r ) r = d;
    }
    return r;
  },

  radius: function(p,c){
    return Math.sqrt(poly.radiusSq(p,c));
  },

  centroid: function(p){
    var a = poly.area(p) // TODO maybe accept area as an argument (in case it's cached?)
      , n = p.length
      , P = p.vertices
      , c = vec.make();
    for(var i=0, j=n-1; i < n; j=i, i++){
      var v = P[i]
        , q = P[j]
        , x = vec.cross(v,q);
      c[0] += (v[0] + q[0]) * x
      c[1] += (v[1] + q[1]) * x
    }
    var b = 1 / (6 * a);
    vec.smul(c,b,c)
    if( c[0] < 0 ){
      vec.neg(c,c)
    }
    return c;
  },

  translate: function(p,x,y,o){
    if( o && (o.length !== p.length) ){
      // TODO this will not make a functional `o` (should use poly.add()/poly.close())
      throw new Error('translate to unequal polys are not supported')
      return;
    }
    var t = vec.make(x,y)
    o = o || p;
    for(var j=0; j < p.length; j++){
      vec.add(p.vertices[j],t,o.vertices[j]);
    }
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
    if( o && (o.length !== p.length) ){
      // TODO this will not make a functional `o` (should use poly.add()/poly.close())
      throw new Error('transform to unequal polys are not supported')
      return;
    }
    o = o || p
    var n = p.length;
    for(var i=0, j=n-1; i < n; j=i, i++){
      vec.transform(p.vertices[i],mat,o.vertices[i]);
      vec.sub(p.vertices[i],p.vertices[j],o.edges[j])
    }
    vec.sub(p.vertices[0],p.vertices[n-1],o.edges[n-1])
    return o;
  },

  convexHull: function(p,o){
    // TODO
    throw new Error('convexHull not implemented')
  },

  reverse: function(p){
    var o = poly.make();
    for(var i=p.length-1; i>=0; i--){
      var v = p.vertices[i];
      poly.add(o,v[0],v[1]);
    }
    return poly.close(o);
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

      poly.project(a,axis,iA)
      poly.project(b,axis,iB)

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

      // no intersection is and won't happen
      if( !res.intersect && !res.willIntersect ){
        break;
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
  },


  // `i` (interval) will be [min,max]
  // `axis` (vec) will be [x,y]
  project: function(p,axis,i){
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
    return i;
  }

}



function intervalDistance(a,b){
  return a[0] < b[0] ? b[0] - a[1] : a[0] - b[1];
}