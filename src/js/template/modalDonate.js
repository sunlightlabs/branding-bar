'use strict';

// Donation modal template
var template = '' +
'<div class="bb-overlay"></div>' +
'' +
'<div class="bb-modal_initial-prompt">' +
'    <div class="bb-modal--header">' +
'        <div class="bb-modal--action js-modal-close">' +
'            <span class="bb-modal--action-icon">&times;</span>' +
'        </div>' +
'        <span class="bb-modal--title">Have you found Influence Explorer useful?</span>' +
'        <p>If so, please consider making a small donation! Donations from users like you help Sunlight Foundation continue to maintain and improve this site!</p>' +
'        <button class="bb-button_cta--large js-modal-open">Donate &raquo;</button>' +
'        <br>' +
'        <a class="bb-modal--link js-modal-close" href="#">Not right now</a>' +
'    </div>' +
'</div>' +
'' +
'<div class="bb-modal_donation">' +
'    <div class="bb-modal_donation--header">' +
'        <div class="bb-modal-form-step-1">' +
'            <div class="bb-modal--action js-modal-close">' +
'                <span class="bb-modal--action-icon">&times;</span>' +
'            </div>' +
'            <span class="bb-modal--title">Have you found Influence Explorer useful?</span>' +
'            <p>A small donation from users like you will help Sunlight Foundation <br> continue to maintain and update this site!</p>' +
'        </div>' +
'' +
'        <div class="bb-modal-form-step-2">' +
'            <div class="bb-modal--action js-prev-frame">' +
'                <span class="bb-modal--action-icon"><</span>' +
'            </div>' +
'            <span class="bb-modal--title">You\'re donating $25 to Sunlight Foundation</span>' +
'        </div>' +
'' +
'        <div class="bb-modal-form-step-3">' +
'            <div class="bb-modal--action js-modal-close">' +
'                <span class="bb-modal--action-icon">&times;</span>' +
'            </div>' +
'            <span class="bb-modal--title">Thank you for your $25 donation!</span>' +
'        </div>' +
'' +
'    </div>' +
'    ' +
'    <div class="bb-modal--content">' +
'' +
'        <div class="bb-modal-form-step-1">' +
'' +
'            <div class="bb-form-fieldset_donation">' +
'                <label class="bb-label_radio"><input class="bb-input" type="radio" name="bb-donation-amount">$10</input></label>' +
'                <label class="bb-label_radio"><input class="bb-input" type="radio" name="bb-donation-amount">$25</input></label>' +
'                <label class="bb-label_radio"><input class="bb-input" type="radio" name="bb-donation-amount">$50</input></label>' +
'                <label class="bb-label_radio"><input class="bb-input" type="radio" name="bb-donation-amount">$100</input></label>' +
'                <label class="bb-label_radio">' +
'                    <input class="bb-input" type="radio" name="bb-donation-amount">' +
'                    <span class="bb-other-amount-prefix">$</span>' +
'                    <input class="bb-input_other-amount" type="text" placeholder="Other Amount"></input>' +
'                </label>' +
'            </div>' +
'            <hr class="bb-divider">' +
'            <div class="bb-form-fieldset">' +
'                <div class="bb-form-group fg-5">' +
'                    <label class="bb-label">' +
'                        <span>First Name</span>' +
'                        <input class="bb-input"></input>' +
'                    </label>' +
'                </div>' +
'' +
'                <div class="bb-form-group fg-5">            ' +
'                    <label class="bb-label">' +
'                        <span>Last Name</span>' +
'                        <input class="bb-input_no-border-left"></input>' +
'                    </label>' +
'                </div>' +
'            </div>' +
'' +
'            <div class="bb-form-fieldset">' +
'                <div class="bb-form-group fg-8">' +
'' +
'                    <label class="bb-label">' +
'                        <span>Street Address</span>' +
'                        <input class="bb-input"></input>' +
'                    </label>' +
'                </div>' +
'' +
'                <div class="bb-form-group fg-2">' +
'                    <label class="bb-label">' +
'                        <span>Apt/Suite</span>' +
'                        <input class="bb-input_no-border-left"></input>' +
'                    </label>' +
'                </div>' +
'            </div>' +
'            ' +
'            <div class="bb-form-fieldset">' +
'                <div class="bb-form-group fg-4">' +
'                    <label class="bb-label">' +
'                        <span>City</span>' +
'                        <input class="bb-input"></input>' +
'                    </label>' +
'                </div>' +
'' +
'                <div class="bb-form-group fg-4">' +
'                    <label class="bb-label">' +
'                        <span>State</span>' +
'                        <input class="bb-input_no-border-left"></input>' +
'                    </label>' +
'                </div>' +
'' +
'                <div class="bb-form-group fg-2">' +
'                    <label class="bb-label">' +
'                        <span>Zip</span>' +
'                        <input class="bb-input_no-border-left"></input>' +
'                    </label>' +
'                </div>' +
'            </div>' +
'' +
'            <div class="bb-form-fieldset_btns js-next-frame">' +
'                <a class="bb-modal--link-alt js-modal-close" href="">Cancel</a>' +
'                <button class="bb-button_cta--next">Next: Payment Info &raquo;</button>' +
'            </div>' +
'' +
'        </div> <!-- step1 -->' +
'' +
'        <div class="bb-modal-form-step-2">' +
'' +
'            <div class="bb-form-fieldset">' +
'                <div class="bb-form-group fg-10">' +
'                    <label class="bb-label">' +
'                        <span>Email Address</span>' +
'                        <input class="bb-input"></input>' +
'                    </label>' +
'                </div>' +
'            </div>' +
'' +
'            <div class="bb-form-fieldset">' +
'                <div class="bb-form-group fg-6">' +
'                    <label class="bb-label">' +
'                        <span>Card Number</span>' +
'                        <input class="bb-input"></input>' +
'                    </label>' +
'                </div>' +
'' +
'                <div class="bb-form-group fg-2">' +
'                    <label class="bb-label">' +
'                        <span>Expires</span>' +
'                        <input class="bb-input_no-border-left" placeholder="MM/YY"></input>' +
'                    </label>' +
'                </div>' +
'' +
'                <div class="bb-form-group fg-2">' +
'                    <label class="bb-label">' +
'                        <span>CVC</span>' +
'                        <input class="bb-input_no-border-left"></input>' +
'                    </label>' +
'                </div>' +
'            </div>' +
'' +
'            <div class="bb-form-fieldset">' +
'                <label class="bb-label">' +
'                    <input class="bb-input js-trigger-note" type="checkbox">Leave a note and other info with my donation</input>' +
'                </label>' +
'            </div>' +
'' +
'            <div class="bb-form-additional-fields">' +
'' +
'                <hr class="bb-divider">' +
'' +
'                <div class="bb-form-fieldset">' +
'                    <div class="bb-form-group fg-10">' +
'                        <label class="bb-label">' +
'                            <span>Note (optional)</span>' +
'                            <textarea class="bb-input_note bb-modal--link" placeholder="Write a note"></textarea>' +
'                        </label>' +
'                    </div>' +
'                </div>' +
'' +
'                <div class="bb-form-fieldset">' +
'                    <div class="bb-form-group fg-5">' +
'                        <label class="bb-label">' +
'                            <span>Phone Number (optional)</span>' +
'                            <input class="bb-input"></input>' +
'                        </label>' +
'                    </div>' +
'                    <div class="bb-form-group fg-5">' +
'                        <label class="bb-label">' +
'                            <span>Occupation (optional)</span>' +
'                            <input class="bb-input_no-border-left"></input>' +
'                        </label>' +
'                    </div>' +
'                </div>' +
'            </div>' +
'' +
'            <div class="bb-form-fieldset_btns">' +
'                <a class="bb-modal--link-alt js-prev-frame" href="#">Go Back</a>' +
'                <button class="bb-button_cta--next js-next-frame">Complete Donation &raquo;</button>' +
'            </div>' +
'            ' +
'        </div> <!-- end step 2 -->' +
'' +
'        <div class="bb-modal-form-step-3">' +
'            <p>We\'ve sent an email confirmation and reciept to <strong class="bb-strong">name@example.com</strong> that you can keep for your records. </p>' +
'            <hr class="bb-divider">' +
'            <p>If you have any questions about your donation, feel free give us a call at <br>(202)742-1520, or email us at <a href="mailto:donors@sunlightfoundation.com" class="bb-modal--link">donors@sunlightfoundation.com</a></p>' +
'        </div>' +
'' +
'    </div>' +
'' +
'' +
'    <div class="bb-modal--footer">' +
'        <p>The Sunlight Foundation is a 501(c)(3) nonprofit, transpartisan organization. All contributions are tax deductible. Please review our <a href="http://sunlightfoundation.com/legal/gifts/" target="_blank" class="bb-modal--link">gift acceptance policy</a> for contributions over $250.</p>' +
'    </div>' +
'' +
'</div>' +
'';

module.exports = template;
