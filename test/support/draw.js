var isNode = typeof __dirname != 'undefined';

var poly = require(isNode ? '../../' : 'geom-poly')
  , vec = require(isNode ? 'geom-vec' : 'publicclass-geom-vec');

if( isNode ){
  module.exports = Draw;
}

function Draw(cnv){
  if( cnv ){
    this.cnv = cnv;
    this.ctx = cnv.getContext('2d');
    this.ctx.translate(50,50)
  }
}

Draw.prototype = {
  clear: function(){
    if( !this.ctx ) return this;
    this.ctx.clearRect(0,0,canvas.width,canvas.height)
  },
  poly: function(p,d){
    if( !this.ctx ) return this;
    this.ctx.beginPath();
    var v = p.vertices[0]
      , x = v[0]
      , y = v[1];

    for(var i=0; i < p.edges.length; i++){
      var e = p.edges[i];
      this.ctx.moveTo(x,y)
      this.ctx.lineTo(x+e[0],y+e[1]);

      // draw normal
      var n = vec.perp(e)
      vec.norm(n,n)
      var m = vec.lerp([x,y],[x+e[0],y+e[1]],0.5)
      this.ctx.moveTo(m[0],m[1])
      this.ctx.lineTo(m[0]+n[0]*5,m[1]+n[1]*5)

      // draw index
      this.ctx.font = '10px courier'
      var t = this.ctx.measureText(i).width;
      this.ctx.fillText(i,(m[0]+n[0]*10)-t/2,(m[1]+n[1]*10)+3)

      // free the vectors
      vec.free(n)
      vec.free(m)

      x += e[0]
      y += e[1];
    }
    this.ctx.closePath();

    // draw centroid
    var c = poly.centroid(p)
    this.ctx.fillRect(c[0]-1,c[1]-1,2,2)
    vec.free(c)

    return this;
  },
  edge: function(a,i){
    if( !this.ctx ) return this;
    var v = a.vertices[i]
    var e = a.edges[i]
    var S = [
      v,
      vec.add(v,e)
    ]
    this.line(S)
    return this;
  },
  vel: function(p,v){
    if( !this.ctx ) return this;
    // draw centroid
    var c = poly.centroid(p)
    var S = [
      c,
      vec.add(c,v)
    ]
    vec.free(c)
    return this.line(S);
  },
  line: function(S){
    if( !this.ctx ) return this;
    var a = S[0], b = S[1];
    this.ctx.beginPath();
    this.ctx.moveTo(a[0],a[1])
    this.ctx.lineTo(b[0],b[1])
    this.ctx.closePath();
    return this;
  },
  rect: function(r){ // [t,r,b,l]
    if( !this.ctx ) return this;
    this.ctx.beginPath();
    this.ctx.rect(r[0],r[3],r[1]-r[3],r[2]-r[0]);
    this.ctx.closePath();
    return this;
  },
  point: function(a,r){
    if( !this.ctx ) return this;
    r = r || 1
    this.ctx.beginPath();
    this.ctx.rect(a[0]-r,a[1]-r,r+r,r+r);
    this.ctx.closePath();
    return this;
  },
  stroke: function(strokeStyle,lineWidth){
    if( !this.ctx ) return this;
    if( lineWidth )
      this.ctx.lineWidth = lineWidth;
    if( strokeStyle )
      this.ctx.strokeStyle = strokeStyle;
    this.ctx.stroke()
    return this;
  },
  fill: function(fillStyle){
    if( !this.ctx ) return this;
    if( fillStyle )
      this.ctx.fillStyle = fillStyle;
    this.ctx.fill()
    return this;
  }
}