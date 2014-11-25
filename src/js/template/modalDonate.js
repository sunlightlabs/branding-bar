'use strict';

// Donation modal template
var template = '' +
'<div class="bb-overlay"></div>' +
'' +
'<div class="bb-modal_donation">' +
'    <div class="bb-modal_donation--header">' +
'        <div class="bb-modal-form-step-1">' +
'            <div class="bb-modal--action js-modal-close">' +
'                <span class="bb-modal--action-icon"><svg class="bb-icon_close" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M1.41 0l-1.41 1.41.72.72 1.78 1.81-1.78 1.78-.72.69 1.41 1.44.72-.72 1.81-1.81 1.78 1.81.69.72 1.44-1.44-.72-.69-1.81-1.78 1.81-1.81.72-.72-1.44-1.41-.69.72-1.78 1.78-1.81-1.78-.72-.72z" /></svg></span>' +
'            </div>' +
'            <span class="bb-modal--title">This year, give a little sunlight.</span>' +
'            <p class="bb-modal--description">For #GivingTuesday, help us put the <em>giving</em> back into the giving season by supporting Sunlight Foundation!</p>' +
'        </div>' +
'' +
'        <div class="bb-modal-form-step-2">' +
'            <div class="bb-modal--action js-prev-frame">' +
'                <span class="bb-modal--action-icon"><svg class="bb-icon_chevron-left" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M4 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z" transform="translate(1)" /></svg></span>' +
'            </div>' +
'            <span class="bb-modal--title">You\'re donating <span class="js-val-donation"></span> to Sunlight Foundation</span>' +
'        </div>' +
'' +
'        <div class="bb-modal-form-step-3">' +
'            <div class="bb-modal--action js-modal-close">' +
'                <span class="bb-modal--action-icon"><svg class="bb-icon_close" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M1.41 0l-1.41 1.41.72.72 1.78 1.81-1.78 1.78-.72.69 1.41 1.44.72-.72 1.81-1.81 1.78 1.81.69.72 1.44-1.44-.72-.69-1.81-1.78 1.81-1.81.72-.72-1.44-1.41-.69.72-1.78 1.78-1.81-1.78-.72-.72z" /></svg></span>' +
'            </div>' +
'            <span class="bb-modal--title">Thank you for your <span class="js-val-donation"></span> donation!</span>' +
'        </div>' +
'' +
'    </div>' +
'    ' +
'    <div class="bb-modal--content">' +
'' +
'        <form action="https://sunlightfoundation.com/engage/brandingbar/remote/" method="post" id="bb-transaction-form">' +
'        <div class="bb-modal-form-step-1">' +
'' +
'            <div class="bb-form-fieldset_donation">' +
'                <label class="bb-label_radio"><input class="bb-input" type="radio" name="amount" value="10.00" required>$10</input></label>' +
'                <label class="bb-label_radio"><input class="bb-input" type="radio" name="amount" value="25.00" required>$25</input></label>' +
'                <label class="bb-label_radio"><input class="bb-input" type="radio" name="amount" value="50.00" required>$50</input></label>' +
'                <label class="bb-label_radio"><input class="bb-input" type="radio" name="amount" value="100.00" required>$100</input></label>' +
'                <label class="bb-label_radio">' +
'                    <input class="bb-input" type="radio" name="amount" required data-radio-custom>' +
'                    <span class="bb-other-amount-prefix">$</span>' +
'                    <input class="bb-input bb-input_other-amount" type="text" name="amount_other" placeholder="Other Amount" onkeypress="return event.charCode >= 48 && event.charCode <= 57"></input>' +
'                </label>' +
'            </div>' +
'            <hr class="bb-divider">' +
'            <div class="bb-form-fieldset">' +
'                <div class="bb-form-group fg-5">' +
'                    <label class="bb-label">' +
'                        <span>First Name</span>' +
'                        <input class="bb-input" name="first_name" required></input>' +
'                    </label>' +
'                </div>' +
'' +
'                <div class="bb-form-group fg-5">            ' +
'                    <label class="bb-label">' +
'                        <span>Last Name</span>' +
'                        <input class="bb-input bb-input_no-border-left" name="last_name" required></input>' +
'                    </label>' +
'                </div>' +
'            </div>' +
'' +
'            <div class="bb-form-fieldset">' +
'                <div class="bb-form-group fg-8">' +
'' +
'                    <label class="bb-label">' +
'                        <span>Street Address</span>' +
'                        <input class="bb-input" name="address" required></input>' +
'                    </label>' +
'                </div>' +
'' +
'                <div class="bb-form-group fg-2">' +
'                    <label class="bb-label">' +
'                        <span>Apt/Suite</span>' +
'                        <input class="bb-input bb-input_no-border-left" name="unit"></input>' +
'                    </label>' +
'                </div>' +
'            </div>' +
'            ' +
'            <div class="bb-form-fieldset">' +
'                <div class="bb-form-group fg-4">' +
'                    <label class="bb-label">' +
'                        <span>City</span>' +
'                        <input class="bb-input" name="city" required></input>' +
'                    </label>' +
'                </div>' +
'' +
'                <div class="bb-form-group fg-4">' +
'                    <label class="bb-label">' +
'                        <span>State</span>' +
'                        <input class="bb-input bb-input_no-border-left" name="state" required></input>' +
'                    </label>' +
'                </div>' +
'' +
'                <div class="bb-form-group fg-2">' +
'                    <label class="bb-label">' +
'                        <span>Zip</span>' +
'                        <input class="bb-input bb-input_no-border-left" name="zipcode" required></input>' +
'                    </label>' +
'                </div>' +
'            </div>' +
'' +
'            <div class="bb-form-fieldset_btns">' +
'                <div class="bb-error-message">Error Message</div>' +
'                <a class="bb-modal--link-alt js-modal-close" href="">Cancel</a>' +
'                <button class="bb-button_cta--next js-next-frame" type="button">' +
'                   Next' +
'                   <svg class="bb-chevron" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z" transform="translate(1)" /></svg>' +
'                </button>' +
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
'                        <input class="bb-input" name="email" type="email" required data-input-email></input>' +
'                    </label>' +
'                </div>' +
'            </div>' +
'' +
'            <div class="bb-form-fieldset">' +
'                <div class="bb-form-group fg-6">' +
'                    <label class="bb-label">' +
'                        <span>Card Number</span>' +
'                        <input class="bb-input" data-stripe="number"></input>' +
'                    </label>' +
'                </div>' +
'' +
'                <div class="bb-form-group fg-1">' +
'                    <label class="bb-label">' +
'                        <span>Expires</span>' +
'                        <input class="bb-input bb-input_no-border-left" placeholder="MM" data-stripe="exp-month"></input>' +
'                    </label>' +
'                </div>' +
'' +
'                <div class="bb-form-group fg-1">' +
'                    <label class="bb-label">' +
'                        <span>&nbsp;</span>' +
'                        <input class="bb-input bb-input_no-border-left" placeholder="YY" data-stripe="exp-year"></input>' +
'                    </label>' +
'                </div>' +
'' +
'                <div class="bb-form-group fg-2">' +
'                    <label class="bb-label">' +
'                        <span>CVC</span>' +
'                        <input class="bb-input bb-input_no-border-left" data-stripe="cvc"></input>' +
'                    </label>' +
'                </div>' +
'            </div>' +
'' +
'            <div class="bb-form-fieldset_checkmark">' +
'                <label class="bb-label">' +
'                    <input class="bb-input" type="checkbox">I would like email updates from the Sunlight Foundation</input>' +
'                </label>' +
'            </div>' +
'' +
'' +
'            <div class="bb-form-fieldset_checkmark">' +
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
'                            <textarea class="bb-input bb-input_note bb-modal--link" placeholder="Write a note" name="note"></textarea>' +
'                        </label>' +
'                    </div>' +
'                </div>' +
'' +
'                <div class="bb-form-fieldset">' +
'                    <div class="bb-form-group fg-5">' +
'                        <label class="bb-label">' +
'                            <span>Phone Number (optional)</span>' +
'                            <input class="bb-input" name="phone"></input>' +
'                        </label>' +
'                    </div>' +
'                    <div class="bb-form-group fg-5">' +
'                        <label class="bb-label">' +
'                            <span>Occupation (optional)</span>' +
'                            <input class="bb-input bb-input_no-border-left" name="occupation"></input>' +
'                        </label>' +
'                    </div>' +
'                </div>' +
'            </div>' +
'' +
'            <div class="bb-form-fieldset_btns">' +
'                <div class="bb-error-message">Error Message</div>' +
'                <a class="bb-modal--link-alt js-prev-frame" href="#">Go Back</a>' +
'                <button class="bb-button_cta--next js-next-frame" type="button">' +
'                    Complete Donation' +
'                    <svg class="bb-chevron" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z" transform="translate(1)" /></svg>' +
'                </button>' +
'            </div>' +
'            ' +
'        </div> <!-- end step 2 -->' +
'' +
'        </form>' +
'        <div class="bb-modal-form-step-3">' +
'           <div class="bb-modal-message-progress">' +
'                <svg class="bb-progress_icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 8 8"><path d="M4 0c-2.2 0-4 1.8-4 4s1.8 4 4 4c1.1 0 2.12-.43 2.84-1.16l-.72-.72c-.54.54-1.29.88-2.13.88-1.66 0-3-1.34-3-3s1.34-3 3-3c.83 0 1.55.36 2.09.91l-1.09 1.09h3v-3l-1.19 1.19c-.72-.72-1.71-1.19-2.81-1.19z"></path></svg>' +
'                <p class="bb-progress_text">Processing your donation…</p>' +
'           </div>' +
'' +
'            <div class="bb-modal-message-thankyou">' +
'                <p class="bb-thankyou-thankyou_text">Thank you for choosing to support the Sunlight Foundation and participating in the #GivingTuesday movement.</p>' +
'                <p>We\'ve sent an email confirmation and receipt to <strong class="bb-strong"><span class="js-val-email">your email address</span></strong> that you can keep for your records. </p>' +
'                <hr class="bb-divider">' +
'                <p>If you have any questions about your donation, feel free give us a call at <br>(202)742-1520, or email us at <a href="mailto:donors@sunlightfoundation.com" class="bb-modal--link">donors@sunlightfoundation.com</a></p>' +
'            </div>' +
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
