'use strict';

// Donation bar template
var template = '' +
'<div class="bb-donation-bar_container">' +
'   <div class="bb-donation-message">' +
'        <span class="bb-donation-message_text">' +
'            <strong class="bb-strong">It\'s #GivingTuesday!</strong>' +
'            This year, give a little sunlight.' +
'        </span>' +
'        <button class="bb-button_cta--donate js-modal-open">' +
'           Donate Today' +
'           <svg class="bb-chevron_pulse" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z" transform="translate(1)" /></svg>' +
'        </button>' +
'        <img class="bb-sunlight-rings" src="https://sunlight-cdn.s3.amazonaws.com/brandingbar/0.4/img/sunlight-rings.svg">' +
'    </div>' +
'   <div class="bb-donation-bar_logo">' +
'       <a class="bb-donation-bar_sunlight-logo" href="https://www.sunlightfoundation.com">Sunlight Foundation</a>' +
'   </div>' +
'</div>' +
'';

module.exports = template;
