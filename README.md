
# geom-poly

## API

    poly.make([x1,y1,x2,y2...])
    poly.convexHull(a[,c])
    poly.add(a,x,y[,c])
    poly.close(a)
    poly.inside(a,x,y) > Boolean
    poly.area(a) > Number
    poly.centroid(a) > vec
    poly.translate(a,x,y[,c]) // or just transform?
    poly.rotate(a,x,y[,c])    // or just transform?
    poly.scale(a,x,y[,c])     // or just transform?
    poly.transform(a,mat[,c])
    poly.aabb(a[,c]) > rect // or a poly-array?

    // a->b goes through an edge of p? if so set the intersection
    // at i and the normal of the edge at n
    poly.intersects(p,a,b,i,n)

    poly.collides(a,b,v) > {}

    var rect = poly.make()
    poly.add(rect,10,10)
    poly.add(rect,20,10)
    poly.add(rect,20,20)
    poly.add(rect,10,20)
    poly.close(rect)

    var rayOrigin = vec.make(5,5)
      , ray = vec.make()
    poly.project(p,rayOrigin,ray)
