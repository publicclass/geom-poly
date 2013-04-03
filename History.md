
0.3.0 / 2013-04-03
==================

  * Moved break until after minIntervalDistance has been calculated.
  * Fixed project() it didn't set the correct max.
  * Added test for contained polygons.
  * Added some sweet in-browser tests with drawn polygons. Very useful.
  * Added tests for inverted polygons and static intersecting 'diamonds'.
  * Got the tests to pass in both browser, testling and node.

0.2.0 / 2013-04-02
==================

  * Changed so a distance of 0 does not mean intersect.
  * Minor optimization of project() where it doesn't test the first vertex twice.
  * Throws exception on non-implemented features.
  * Added some basic collision tests.
  * poly.collides() now optionally accepts an object to re-use for results.
  * Allow for poly.aabb() to update previous aabb arrays
