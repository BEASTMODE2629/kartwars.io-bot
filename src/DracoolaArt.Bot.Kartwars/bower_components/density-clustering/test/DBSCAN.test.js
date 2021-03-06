require('should');
var DBSCAN = require('../lib/index.js').DBSCAN;
describe('DBSCAN', function () {
    describe('run', function () {
        it('should return correct clusters for regular density set', function () {
            var dbscan = new DBSCAN();
            var dataset = [
                [1, 1], [0, 1], [1, 0],
                [10, 10], [10, 13], [13, 13],
                [30, 30], [30, 33], [49, 49], [33, 33], [36, 36]
            ];
            // small radius
            dbscan.run(dataset, 5, 2)
                .should.be.eql([
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 9, 10]
            ]);
            dbscan.noise.should.eql([8]);
            // big radius
            dbscan.run(dataset, 50, 2).should.be.eql([
                [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 8]
            ]);
            dbscan.noise.should.eql([]);
        });
    });
    describe('regionQuery', function () {
        it('should return nearest neighborhood of a point', function () {
            var dataset = [
                [1, 1], [2, 2], [3, 3],
                [50, 50], [51, 51]
            ];
            var dbscan = new DBSCAN(dataset);
            dbscan.epsilon = 1;
            dbscan._regionQuery(1).should.eql([1]);
            dbscan.epsilon = 2;
            dbscan._regionQuery(1).should.eql([0, 1, 2]);
            dbscan._regionQuery(4).should.eql([3, 4]);
            dbscan.epsilon = 100;
            dbscan._regionQuery(1).should.eql([0, 1, 2, 3, 4]);
        });
    });
    describe('mergeArrays', function () {
        it('should merge two arrays', function () {
            var dbscan = new DBSCAN();
            dbscan._mergeArrays([1, 2, 3], [2, 3, 4, 5])
                .should.eql([1, 2, 3, 4, 5]);
            dbscan._mergeArrays([2, 3, 4, 5], [1, 2, 3])
                .should.eql([2, 3, 4, 5, 1]);
        });
    });
    describe('euclideanDistance', function () {
        it('should return distance between two points', function () {
            var dbscan = new DBSCAN();
            dbscan._euclideanDistance([1, 1], [3, 1]).should.eql(2);
            dbscan._euclideanDistance([1, 1], [1, 3]).should.eql(2);
        });
    });
});
