import $  from 'jquery';
import Prism from './vendor/prism';
import './vendor/prism-azkfile';

// Prism Regex
var PrismlangRegEX = /\blang(?:uage)?-(?!\*)(\w+)\b/i;

var CodeHighlighter = module.exports = function (element) {
  element = $(element);
  var isCode = (element.tagName === 'CODE' && PrismlangRegEX.test(element.attr('class')));
  var codeSelector = 'code';
  // assign it into the current DOM
  // element.html(value);
  var elms = (isCode) ? element : element.find(codeSelector);
  elms.each(function(ix, elm) {
    // if elm.textContent is Azkfile.js
    // replace language to 'azkfile'
    // https://regex101.com/r/iO8qI8/1
    if (/Azkfile(\.js)?|^systems\(/gmi.test(elm.textContent)) {
      if (/(language-|lang-).*/gm.test(elm.className)) {
        elm.className = elm.className.replace(/(language-|lang-).*/gm, "$1azkfile");
      } else {
        elm.className = 'language-azkfile';
      }
    }
    Prism.highlightElement(elm);
  });
}
