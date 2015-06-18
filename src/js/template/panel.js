'use strict';

// Default panel template
var template = '' +
'  <button id="{{ namespace }}_close-panel" type="button" data-{{ namespace }}-toggle=".{{ namespace }}_wrapper">&times;</button>' +
'  <div class="{{ namespace }}_panel-container">' +
'    <div class="{{ namespace }}_about">' +
'      <span class="{{ namespace }}_heading">About Sunlight Foundation</span>' +
'      <p class="{{ namespace }}_description">The <a class="{{ namespace }}_link" href="https://sunlightfoundation.com">Sunlight Foundation</a> is a nonpartisan nonprofit that advocates for open government globally and uses technology to make government more accountable to all.</p>' +
'' +
'      <div class="{{ namespace }}_email">' +
'        <span class="{{ namespace }}_heading">Stay informed about our work</span>' +
'        <form class="{{ namespace }}_email-form" action="https://sunlightfoundation.com/join/" method="post">' +
'          <input class="{{ namespace }}_input" type="email" placeholder="email address" name="email">' +
'          <input class="{{ namespace }}_input {{ namespace }}_input-zip" type="text" placeholder="zip code" name="zipcode">' +
'          <button class="{{ namespace }}_submit" type="submit">Submit</button>' +
'          <span class="{{ namespace }}_email-form-fail">Oops, there was an error :(</span>' +
'        </form>' +
'        <div class="bb_email-form-success"> Thanks for subscribing to our updates! <a class="bb_link bb_email-sucess-url" href="">Tell us more about you &raquo;</a></div>' +
'      </div>' +
'    </div>' +
'' +
'    <div class="{{ namespace }}_tools">' +
'      <span class="{{ namespace }}_heading">' +
'        <span class="{{ namespace }}_tools-heading" id="{{ namespace }}_featured-tools-heading" data-{{ namespace }}-toggle="#{{ namespace }}_featured-tools">Related Tools</span>' +
'        <span class="{{ namespace }}_tools-heading is-inactive" id="{{ namespace }}_more-tools-heading" data-{{ namespace }}-toggle="#{{ namespace }}_more-tools">All Tools</span>' +
'      </span>' +
'' +
'      <div id="{{ namespace }}_featured-tools" class="{{ namespace }}_tools-details">' +
'        <ul class="{{ namespace }}_tools-featured">' +
'          <li>' +
'            <a class="{{ namespace }}_tools-logo" href="https://www.opencongress.org">' +
'            <img src="https://sunlight-cdn.s3.amazonaws.com/brandingbar/{{ s3Version }}/img/logo_opencongress.png" alt="Open Congress"/>' +
'            </a>' +
'            <p class="{{ namespace }}_description">' +
'              <a class="{{ namespace }}_link" href="https://www.opencongress.org">OpenCongress</a> allows anyone to follow legislation in Congress, from bill introduction to floor votes. Learn more about the issues you care about.' +
'            </p>' +
'          </li>' +
'          <li>' +
'            <a class="{{ namespace }}_tools-logo" href="https://scout.sunlightfoundation.com">' +
'              <img src="https://sunlight-cdn.s3.amazonaws.com/brandingbar/{{ s3Version }}/img/logo_scout.png" alt="Scout"/>' +
'            </a>' +
'            <p class="{{ namespace }}_description">' +
'              <a class="{{ namespace }}_link" href="https://scout.sunlightfoundation.com">Scout</a> is a rapid notification service that allows anyone to create customized email or text alerts on actions Congress takes on an issue or a specific bill.' +
'            </p>' +
'          </li>' +
'        </ul>' +
'      </div>' +
'      <div id="{{ namespace }}_more-tools" class="{{ namespace }}_tools-details is-hidden">' +
'        <ul class="{{ namespace }}_tools-list">' +
'          <li><a class="{{ namespace }}_link" href="https://www.opencongress.org">OpenCongress</a></li>' +
'          <li><a class="{{ namespace }}_link" href="http://influenceexplorer.com">Influence Explorer</a></li>' +
'          <li><a class="{{ namespace }}_link" href="http://openstates.org">Open States</a></li>' +
'          <li><a class="{{ namespace }}_link" href="https://scout.sunlightfoundation.com">Scout</a></li>' +
'        </ul>' +
'' +
'        <ul class="{{ namespace }}_tools-list">' +
'          <li><a class="{{ namespace }}_link" href="http://churnalism.sunlightfoundation.com">Churnalism</a></li>' +
'          <li><a class="{{ namespace }}_link" href="http://capitolwords.org">Capitol Words</a></li>' +
'          <li><a class="{{ namespace }}_link" href="http://politwoops.sunlightfoundation.com">Politwoops</a></li>' +
'          <li><a class="{{ namespace }}_link" href="http://adhawk.sunlightfoundation.com">Ad Hawk</a></li>' +
'        </ul>' +
'' +
'        <ul class="{{ namespace }}_tools-list">' +
'          <li><a class="{{ namespace }}_link" href="http://politicalpartytime.org">Party Time</a></li>' +
'          <li><a class="{{ namespace }}_link" href="https://scout.sunlightfoundation.com">Scout</a></li>' +
'          <li><a class="{{ namespace }}_link" href="http://docketwrench.sunlightfoundation.com">Docket Wrench</a></li>' +
'          <li><a class="{{ namespace }}_link" href="http://politicaladsleuth.com">Political Ad Sleuth</a></li>' +
'        </ul>' +
'      </div>' +
'    </div>' +
'  </div>' +
'';

module.exports = template;
