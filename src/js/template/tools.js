'use strict';

// Template for an individual "Related Tool"

var template = '' +
'  <li>' +
'    <a class="{{ namespace }}_tools_logo" href="{{ href }}">' +
'      <img src="{{ img }}" alt="{{ name }}"/>' +
'    </a>' +
'    <p class="{{ namespace }}_description">' +
'      {{ description }}' +
'    </p>' +
'  </li>' +
'';

module.exports = template;