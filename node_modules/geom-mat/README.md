
# geom-mat

[![Build Status](https://travis-ci.org/publicclass/geom-mat.png)](https://travis-ci.org/publicclass/geom-mat)

A collection of terse matrix utilities. A part of [geom](https://github.com/publicclass/geom).


## Features

  * __Memory managed__ each utility has a pool of instances accessable using `_X_.make()` and `_X_.free()`. If you don't need pooled instances, simply pass in your own object instead.

  * __State less__ no state is kept within the utilities, it's up to you.


## Example

## API

### mat.make([a,b,c,d,x,y])
### mat.free(m)
### mat.copy(a[,m])
### mat.ident([m])
### mat.mul(a,b[,m])
### mat.inv(a[,m])
### mat.translate(x,y[,m])
### mat.scale(x,y[,m])
### mat.rotate(theta[,m])

## License

  MIT