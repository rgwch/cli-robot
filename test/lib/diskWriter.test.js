"use strict";

var rewire = require("rewire");
var chai = require("chai");
var expect = chai.expect;

describe("diskWriter", function () {
  var diskWriter, mkdirpMock, mkdirpMockCB, fsMock, writeFileCB, data;

  before(function () {
    mkdirpMock = function (dir, callback) {
      mkdirpMockCB = callback;
    };
    fsMock = {
      writeFile: function (filename, data, callback) {
        writeFileCB = callback;
      }
    };

    diskWriter = rewire("../../lib/diskWriter");
    diskWriter.__set__({"fs": fsMock, "mkdirp": mkdirpMock});

    data = [{"a": "A"}, {"b": "B"}, {"c": "C"}, {"d": "D"}];
  });

  describe(".ensureDir()", function () {
    it("should return a Promise", function () {
      expect(diskWriter.ensureDir("tmp")).to.be.an.instanceof(Promise);
    });

    describe(".resolve()", function () {
      it("should resolve if given dir is ensured", function (done) {
        diskWriter.ensureDir("tmp").then(function () {
          done();
        });
        mkdirpMockCB();
      });
    });

    describe(".reject()", function () {
      it("should reject if an error has occurred", function (done) {
        var ensureDirErr = new Error("Could not ensure dir");

        diskWriter.ensureDir("tmp").catch(function (err) {
          expect(ensureDirErr).to.equal(err);
          done();
        });
        mkdirpMockCB(ensureDirErr);
      })
    });
  });

  describe(".json()", function () {
    it("should return a Promise", function () {
      expect(diskWriter.json("file.json", data)).to.be.an.instanceof(Promise);
    });

    describe(".resolve()", function () {
      it("should resolve if json-file is written", function (done) {
        diskWriter.json("file.json", data).then(function () {
          done();
        });
        writeFileCB();
      });
    });

    describe(".reject()", function () {
      it("should reject if an error has occurred while file writing", function (done) {
        var jsonFileErr = new Error("Could not write json");

        diskWriter.json("file.json", data).catch(function (err) {
          expect(jsonFileErr).to.equal(err);
          done();
        });

        writeFileCB(jsonFileErr);
      })
    });
  });

  describe(".jsonMin()", function () {
    it("should return a Promise", function () {
      expect(diskWriter.jsonMin("file.json", data)).to.be.an.instanceof(Promise);
    });

    describe(".resolve()", function () {
      it("should resolve if json-file is written", function (done) {
        diskWriter.jsonMin("file.json", data).then(function () {
          done();
        });
        writeFileCB();
      });
    });

    describe(".reject()", function () {
      it("should reject if an error has occurred while file writing", function (done) {
        var jsonMinFileErr = new Error("Could not write min-json");

        diskWriter.jsonMin("file.json", data).catch(function (err) {
          expect(jsonMinFileErr).to.equal(err);
          done();
        });

        writeFileCB(jsonMinFileErr);
      })
    });
  });
});