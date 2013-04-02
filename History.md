
0.2.0 / 2013-04-02
==================

  * Changed so a distance of 0 does not mean intersect.
  * Minor optimization of project() where it doesn't test the first vertex twice.
  * Throws exception on non-implemented features.
  * Added some basic collision tests.
  * poly.collides() now optionally accepts an object to re-use for results.
  * Allow for poly.aabb() to update previous aabb arrays
