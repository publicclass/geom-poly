
# geom-poly

[![Build Status](https://travis-ci.org/publicclass/geom-poly.png)](https://travis-ci.org/publicclass/geom-poly)

A collection of terse polygon utilities. A part of [geom](https://github.com/publicclass/geom).


## Features

  * __Memory managed__ each utility has a pool of instances accessable using `_X_.make()` and `_X_.free()`. If you don't need pooled instances, simply pass in your own object instead.

  * __State less__ no state is kept within the utilities, it's up to you.


## Example

    var poly = require('geom-poly');
    var rect = poly.make()
    poly.add(rect,10,10)
    poly.add(rect,20,10)
    poly.add(rect,20,20)
    poly.add(rect,10,20)
    poly.close(rect)


## API

### poly.make([x1,y1,x2,y2...])
### poly.add(a,x,y[,c])
### poly.close(a)
### poly.area(a)
### poly.centroid(a)
### poly.translate(a,x,y[,c])
### poly.transform(a,mat[,c])
### poly.aabb(a[,c])
### poly.collides(a,b,v)

## License

  MIT