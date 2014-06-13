#!/usr/bin/env node

var fs = require('fs');
var cheerio = require('cheerio');
var path = require('path');

var cheerioOptions = {xmlMode: true};
var files = process.argv.slice(2);

function read(file, name) {
  var content = fs.readFileSync(file, 'utf8');
  // replace SVGIDs with icon name
  content = content.replace(/SVGID/g, name);
  return cheerio.load(content, cheerioOptions);
}

function transmogrify($, name) {
  var node = $('svg');
  var innerHTML = $.xml(node.find('*'));
  // remove extraneous whitespace
  innerHTML = innerHTML.replace(/\t|\r|\n/g, ''); 
  var output = '<g id="' + name + '">' + innerHTML + '</g>';
  // print icon svg
  console.log(output);
}

function path2IconName(file) {
  parts = path.basename(file).split('-');
  parts.pop();
  return parts.join('-');
}
[
  '<link rel="import" href="../components/core-iconset-svg/core-iconset-svg.html">',
  '<core-iconset-svg id="topeka-icons" iconSize="256">',
  '<svg><defs>'
].forEach(function(l) {
  console.log(l);
});
files.forEach(function(file) {
  var name = path2IconName(file);
  var $ = read(file, name);
  transmogrify($, name);
});
console.log('</defs></svg></core-iconset-svg>');
