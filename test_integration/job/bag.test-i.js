"use strict";

var path = require("path");
var fs = require("fs");

var rewire = require("rewire");
var shasum = require("shasum");
var merge = require("merge");
var expect = require("chai").expect;

var server = require("../../fixtures/server");

describe.only("job: BAG", function () {
  var job, test;

  before(function () {
    test = {
      cfg: {
        "download": {
          "dir": path.resolve(__dirname, "../tmp/data/auto"),
          "zip": path.resolve(__dirname, "../tmp/data/auto/bag.zip"),
          "zipFiles": [{
            name: /Preparations.xml/, dest: path.resolve(__dirname, "../tmp/data/auto/bag.xml")
          }, {
            name: /Publications.xls/, dest: path.resolve(__dirname, "../tmp/data/auto/bag.xls")
          }, {
            name: /ItCodes.xml/, dest: path.resolve(__dirname, "../tmp/data/auto/it.xml")
          }]
        },
        "process": {
          "dir": path.resolve(__dirname, "../tmp/data/release/bag"),
          "bag": path.resolve(__dirname, "../tmp/data/release/bag/bag.json"),
          "bagMin": path.resolve(__dirname, "../tmp/data/release/bag/bag.min.json"),
          "it": path.resolve(__dirname, "../tmp/data/release/bag/it.json"),
          "itMin": path.resolve(__dirname, "../tmp/data/release/bag/it.min.json")
        }
      }
    };
  });

  before(function (done) {
    this.timeout(60000);

    job = rewire("../../jobs/bag");
    job.__set__("cfg", merge.recursive(job.cfg, test.cfg));
    job(done);
  });

  describe("download and unzip", function () {

    it("should have unzipped bag.xls", function () {
      var fixture = shasum(fs.readFileSync(path.resolve(__dirname, "../../fixtures/bag/bag.xls"), {encoding: "utf8"}));
      var download = shasum(fs.readFileSync(test.cfg.download.zipFiles[0].dest, {encoding: "utf8"}));

      expect(fixture).to.equal(download);
    });

    it("should have unzipped bag.xml", function () {
      var fixture = shasum(fs.readFileSync(path.resolve(__dirname, "../../fixtures/bag/bag.xml"), {encoding: "utf8"}));
      var download = shasum(fs.readFileSync(test.cfg.download.zipFiles[1].dest, {encoding: "utf8"}));

      expect(fixture).to.equal(download);
    });

    it("should have unzipped it.xml", function () {
      var fixture = shasum(fs.readFileSync(path.resolve(__dirname, "../../fixtures/bag/it.xml"), {encoding: "utf8"}));
      var download = shasum(fs.readFileSync(test.cfg.download.zipFiles[2].dest, {encoding: "utf8"}));

      expect(fixture).to.equal(download);
    });
  });
});