var DracoolaArt;
(function (DracoolaArt) {
    var KartwarsBot;
    (function (KartwarsBot) {
        var Utils;
        (function (Utils) {
            /**
             * Math utils.
             */
            var MathUtils = (function () {
                function MathUtils() {
                }
                /**
                 * Get the smallest angle between two angles (0-pi)
                 * @param a1
                 * @param a2
                 */
                MathUtils.angleBetween = function (a1, a2) {
                    var r1 = 0.0;
                    var r2 = 0.0;
                    r1 = (a1 - a2) % Math.PI;
                    r2 = (a2 - a1) % Math.PI;
                    return r1 < r2 ? -r1 : r2;
                };
                /**
                 * Get clusters based on the given resources.
                 * @param elements
                 * @param sectorSize
                 * @param minimumElementsPerCluster
                 */
                // READ : http://stackoverflow.com/questions/356035/algorithm-for-detecting-clusters-of-dots
                MathUtils.get2DElementsDensity = function (elements, sectorSize, minimumElementsPerCluster) {
                    var dataset = elements.map(function (el) {
                        return [el.x, el.y];
                    });
                    var mapScanner = new DBSCAN();
                    var clusters = mapScanner.run(dataset, sectorSize, minimumElementsPerCluster);
                    return clusters;
                };
                MathUtils.arcPoint = function (x, y, radius, angle) {
                    return new KartwarsBot.Structures.Point2D(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
                };
                /**
                 * Fast atan2
                 * @param y
                 * @param x
                 */
                MathUtils.fastAtan2 = function (y, x) {
                    var QPI = Math.PI / 4;
                    var TQPI = 3 * Math.PI / 4;
                    var r = 0.0;
                    var angle = 0.0;
                    var abs_y = Math.abs(y) + 1e-10;
                    if (x < 0) {
                        r = (x + abs_y) / (abs_y - x);
                        angle = TQPI;
                    }
                    else {
                        r = (x - abs_y) / (x + abs_y);
                        angle = QPI;
                    }
                    angle += (0.1963 * r * r - 0.9817) * r;
                    if (y < 0) {
                        return -angle;
                    }
                    return angle;
                };
                /**
                 * Given the start and end of a line, is point left.
                 * @param start
                 * @param end
                 * @param point
                 */
                MathUtils.isLeft = function (start, end, point) {
                    return ((end.x - start.x) * (point.y - start.y) -
                        (end.y - start.y) * (point.x - start.x)) > 0;
                };
                /**
                 * Given the start and end of a line, is point right.
                 * @param start
                 * @param end
                 * @param point
                 */
                MathUtils.isRight = function (start, end, point) {
                    return !MathUtils.isLeft(start, end, point);
                };
                /**
                 * Get distance
                 * @param point1
                 * @param point2
                 */
                MathUtils.getDistance = function (point1, point2) {
                    var x1 = point1.x, y1 = point1.y, x2 = point2.x, y2 = point2.y;
                    var distance2 = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
                    return distance2;
                };
                /**
                * Get distance squared
                * @param point1
                * @param point2
                */
                MathUtils.getDistance2 = function (point1, point2) {
                    var x1 = point1.x, y1 = point1.y, x2 = point2.x, y2 = point2.y;
                    var distance2 = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
                    return distance2;
                };
                /**
                 * Return unit vector in the direction of the argument
                 * @param v
                 */
                /*
                public static unitVector(v) {
                    let l = Math.sqrt(v.x * v.x + v.y * v.y);
                    if (l > 0) {
                        return {
                            x: v.x / l,
                            y: v.y / l
                        };
                    } else {
                        return {
                            x: 0,
                            y: 0
                        };
                    }
                }
                */
                /*
                public static cross(o, a, b) {
                    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
                }
            
                public static convexHullSort(a, b) {
                    return a.x == b.x ? a.y - b.y : a.x - b.x;
                }
                */
                /*
                public static convexHull(points) {
                    points.sort(MathUtils.convexHullSort);
            
                    let lower = [];
                    for (let i = 0, l = points.length; i < l; i++) {
                        while (lower.length >= 2 && MathUtils.cross(
                            lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
                            lower.pop();
                        }
                        lower.push(points[i]);
                    }
            
                    let upper = [];
                    for (let i = points.length - 1; i >= 0; i--) {
                        while (upper.length >= 2 && MathUtils.cross(
                            upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
                            upper.pop();
                        }
                        upper.push(points[i]);
                    }
            
                    upper.pop();
                    lower.pop();
                    return lower.concat(upper);
                }
                */
                MathUtils.fromRadiansToDegrees = function (radians) {
                    //convert from radians to degrees
                    //let degrees = radians * (180 / Math.PI);
                    var degrees = (360 + (radians * (180 / Math.PI))) % 360;
                    return degrees;
                };
                MathUtils.fromDegreesToRadians = function (degrees) {
                    var radians = degrees * (Math.PI / 180);
                    if (radians > Math.PI) {
                        radians = Math.PI - radians;
                    }
                    return radians;
                };
                MathUtils.medianAngle = function (a, b) {
                    a = a % 360;
                    b = b % 360;
                    var sum = a + b;
                    if (sum > 360 && sum < 540) {
                        sum = sum % 180;
                    }
                    return sum / 2;
                };
                /**
                 * Predicts the Goal Coordinates for a given enemy/sprite at which it might intersect with the player.
                 * @param source
                 * @param target
                 */
                MathUtils.predictIntersection = function (source, target) {
                    var sourceVector = new Victor(source.x, source.y), targetVector = new Victor(target.x, target.y), targetSpeed = target.magnitude;
                    var targetVelocity = new Victor(target.velocity.x, target.velocity.y);
                    var offset = targetVector.clone().subtract(sourceVector);
                    var distanceDelta = offset.magnitude() / targetSpeed;
                    var targetAverageVelocity = targetVelocity.clone().multiplyScalar(distanceDelta);
                    var futureAt = targetVelocity.clone().add(targetAverageVelocity);
                    var result = targetVector.add(futureAt);
                    return new KartwarsBot.Structures.Point2D(result.x, result.y);
                };
                // README : http://stackoverflow.com/questions/2248876/2d-game-fire-at-a-moving-target-by-predicting-intersection-of-projectile-and-u
                /**
                 * Return the firing solution for a projectile starting at 'sourcePoint' with
                 * velocity 'v', to hit a target, 'dst'.
                 *
                 * @param Object source position of shooter
                 * @param Object target position & velocity of target
                 * @param Number projectileVelocity speed of projectile
                 * @return Object Coordinate at which to fire (and where intercept occurs)
                 *
                 * E.g.
                 * >>> intercept({x:2, y:4}, {x:5, y:7, vx: 2, vy:1}, 5)
                 * = {x: 8, y: 8.5}
                 */
                MathUtils.predictIntersectionEx = function (source, target, projectileVelocity) {
                    var tx = target.x - source.x, ty = target.y - source.y, tvx = target.velocity.x, tvy = target.velocity.y;
                    // Get quadratic equation components
                    var a = tvx * tvx + tvy * tvy - projectileVelocity * projectileVelocity;
                    var b = 2 * (tvx * tx + tvy * ty);
                    var c = tx * tx + ty * ty;
                    // Solve quadratic
                    var ts = MathUtils.quad(a, b, c);
                    // Find smallest positive solution
                    var sol = null;
                    if (ts) {
                        var t0 = ts[0], t1 = ts[1];
                        var t = Math.min(t0, t1);
                        if (t < 0)
                            t = Math.max(t0, t1);
                        if (t > 0) {
                            sol = new KartwarsBot.Structures.Point2D(target.x + target.velocity.x * t, target.y + target.velocity.y * t);
                        }
                    }
                    return sol;
                };
                /**
                 * Return solutions for quadratic
                 */
                MathUtils.quad = function (a, b, c) {
                    var sol = null;
                    if (Math.abs(a) < 1e-6) {
                        if (Math.abs(b) < 1e-6) {
                            sol = Math.abs(c) < 1e-6 ? [0, 0] : null;
                        }
                        else {
                            sol = [-c / b, -c / b];
                        }
                    }
                    else {
                        var disc = b * b - 4 * a * c;
                        if (disc >= 0) {
                            disc = Math.sqrt(disc);
                            a = 2 * a;
                            sol = [(-b - disc) / a, (-b + disc) / a];
                        }
                    }
                    return sol;
                };
                return MathUtils;
            }());
            Utils.MathUtils = MathUtils;
        })(Utils = KartwarsBot.Utils || (KartwarsBot.Utils = {}));
    })(KartwarsBot = DracoolaArt.KartwarsBot || (DracoolaArt.KartwarsBot = {}));
})(DracoolaArt || (DracoolaArt = {}));
