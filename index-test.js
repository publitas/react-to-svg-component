var toReact = require('../');
var test = require('tap').test;
var React = require('react');

test('setting colors', function(t) {
  t.plan(1);
  var icon = toReact.convert('<svg><circle stroke="blue" fill="red"></circle></svg>');
  var res = renderToString(icon, { color: 'green' });

  t.equal(res, '<svg><circle stroke="green" fill="green"></circle></svg>');
});

test('setting colors when they are "none"', function(t) {
  t.plan(1);
  var icon = toReact.convert('<svg><circle stroke="none" fill="red"></circle></svg>');
  var res = renderToString(icon, { color: 'green' });

  t.equal(res, '<svg><circle stroke="none" fill="green"></circle></svg>');
});

test('setting colors with a function', function(t) {
  t.plan(1);
  var icon = toReact.convert('<svg><circle stroke="blue" fill="red"></circle></svg>');
  var res = renderToString(icon, { color: function(type, _) {
    return (type === 'fill')
      ? 'yellow'
      : 'green';
  }});

  t.equal(res, '<svg><circle stroke="green" fill="yellow"></circle></svg>');
});

function renderToString(icon, params) {
  this.React = React; // TODO: why does this need to be global

  return stripReactNoise(
    this.React.renderToString(icon(params))
  );
}

function stripReactNoise(str) {
  return str
    .replace(/ data-reactid="[^"]+"/g, '')
    .replace(/ data-react-checksum="[^"]+"/g, '');
}
