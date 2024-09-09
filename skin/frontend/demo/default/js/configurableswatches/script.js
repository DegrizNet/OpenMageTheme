/**
 * Magento
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License (AFL 3.0)
 * that is bundled with this package in the file LICENSE_AFL.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/afl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@magento.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Magento to newer
 * versions in the future. If you wish to customize Magento for your
 * needs please refer to http://www.magento.com for more information.
 *
 * @category    design
 * @package     rwd_default
 * @copyright   Copyright (c) 2006-2014 X.commerce, Inc. (http://www.magento.com)
 * @license     http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
 */
// ==============================================
// PDP - image zoom - needs to be available outside document.ready scope
// ==============================================

// Jquery no conflict
var $j = ja =  $JM = jQuery.noConflict();

var bp = ProductMediaManager = PointerManager = null;
(function($j){

    bp = {
        xsmall: 479,
        small: 599,
        medium: 770,
        large: 979,
        xlarge: 1199
    }

    ProductMediaManager = {
        IMAGE_ZOOM_THRESHOLD: 20,
        imageWrapper: null,

        destroyZoom: function() {
            $j('.zoomContainer').remove();
            $j('.product-image-gallery .gallery-image').removeData('elevateZoom');
        },

        createZoom: function(image) {
            // Destroy since zoom shouldn't be enabled under certain conditions
            ProductMediaManager.destroyZoom();

            if(
            // Don't use zoom on devices where touch has been used
                PointerManager.getPointer() == PointerManager.TOUCH_POINTER_TYPE
                    // Don't use zoom when screen is small, or else zoom window shows outside body
                    || Modernizr.mq("screen and (max-width:" + bp.medium + "px)")
                ) {
                return; // zoom not enabled
            }

            if(image.length <= 0) { //no image found
                return;
            }

            if(image[0].naturalWidth && image[0].naturalHeight) {
                var widthDiff = image[0].naturalWidth - image.width() - ProductMediaManager.IMAGE_ZOOM_THRESHOLD;
                var heightDiff = image[0].naturalHeight - image.height() - ProductMediaManager.IMAGE_ZOOM_THRESHOLD;

                if(widthDiff < 0 && heightDiff < 0) {
                    //image not big enough

                    image.parents('.product-image').removeClass('zoom-available');

                    return;
                } else {
                    image.parents('.product-image').addClass('zoom-available');
                }
            }
			
			if($j().elevateZoom){
				image.elevateZoom();
			}
        },

        swapImage: function(targetImage) {

            var $imageContainer = $j('.product-image-zoom');
            var $targetImage = $j(targetImage);

            //console.log($targetImage.attr("src"));
            //ProductMediaManager.destroyZoom();

            if($targetImage[0].complete) { //image already loaded -- swap immediately

                //console.log($targetImage[0]);

                $targetImage.attr('id', 'image');
                $targetImage.attr('width', $imageContainer.width());

                $imageContainer.html('').fadeOut(100, function(){
                    $imageContainer.html($targetImage);
                    $imageContainer.fadeIn(200);
                });

                //wire zoom on new image
				ProductMediaManager.createZoom($targetImage);

            } else { //need to wait for image to load

                //add spinner
                $imageContainer.addClass('loading');

                //move target image to correct place, in case it's necessary
                $targetImage.attr('id', 'image');
                $targetImage.attr('width', $imageContainer.width());

                $imageContainer.html('').fadeOut(100, function(){
                    $imageContainer.html($targetImage);
                    $imageContainer.fadeIn(200);
                });

                //wait until image is loaded
                imagesLoaded($targetImage, function() {
                    //remove spinner
                    $imageContainer.removeClass('loading');

                    //wire zoom on new image
					ProductMediaManager.createZoom($targetImage);
                });

            }
        },

//    swapImage: function(targetImage) {
//        targetImage = $j(targetImage);
//        targetImage.addClass('gallery-image');
//
//        ProductMediaManager.destroyZoom();
//
//        var imageGallery = $j('.product-image-gallery');
//        if(targetImage[0].complete) { //image already loaded -- swap immediately
//
//            imageGallery.find('.gallery-image').removeClass('visible');
//
//            //move target image to correct place, in case it's necessary
//            imageGallery.append(targetImage);
//
//            //reveal new image
//            targetImage.addClass('visible');
//
//            //wire zoom on new image
//            ProductMediaManager.createZoom(targetImage);
//
//        } else { //need to wait for image to load
//
//            //add spinner
//            imageGallery.addClass('loading');
//
//            //move target image to correct place, in case it's necessary
//            imageGallery.append(targetImage);
//
//            //wait until image is loaded
//            imagesLoaded(targetImage, function() {
//                //remove spinner
//                imageGallery.removeClass('loading');
//
//                //hide old image
//                imageGallery.find('.gallery-image').removeClass('visible');
//
//                //reveal new image
//                targetImage.addClass('visible');
//
//                //wire zoom on new image
//                ProductMediaManager.createZoom(targetImage);
//            });
//
//        }
//    },

        wireThumbnails: function() {
            //trigger image change event on thumbnail click
            $j('.product-image-thumbs .thumb-link').click(function(e) {
                e.preventDefault();
                var jlink = $j(this);
                var target = $j('#image-' + jlink.data('image-index'));

                ProductMediaManager.swapImage(target);
            });
        },

        initZoom: function() {
            ProductMediaManager.createZoom($j(".gallery-image.visible")); //set zoom on first image
        },

        init: function() {
            ProductMediaManager.imageWrapper = $j('.product-img-box');

            // Re-initialize zoom on viewport size change since resizing causes problems with zoom and since smaller
            // viewport sizes shouldn't have zoom
            $j(window).on('delayed-resize', function(e, resizeEvent) {
                ProductMediaManager.initZoom();
            });

            ProductMediaManager.initZoom();

            ProductMediaManager.wireThumbnails();

            $j(document).trigger('product-media-loaded', ProductMediaManager);
        }
    };

    $j(document).ready(function() {
        ProductMediaManager.init();
    });

    PointerManager = {
        MOUSE_POINTER_TYPE: 'mouse',
        TOUCH_POINTER_TYPE: 'touch',
        POINTER_EVENT_TIMEOUT_MS: 500,
        standardTouch: false,
        touchDetectionEvent: null,
        lastTouchType: null,
        pointerTimeout: null,
        pointerEventLock: false,

        getPointerEventsSupported: function() {
            return this.standardTouch;
        },

        getPointerEventsInputTypes: function() {
            if (window.navigator.pointerEnabled) { //IE 11+
                //return string values from http://msdn.microsoft.com/en-us/library/windows/apps/hh466130.aspx
                return {
                    MOUSE: 'mouse',
                    TOUCH: 'touch',
                    PEN: 'pen'
                };
            } else if (window.navigator.msPointerEnabled) { //IE 10
                //return numeric values from http://msdn.microsoft.com/en-us/library/windows/apps/hh466130.aspx
                return {
                    MOUSE:  0x00000004,
                    TOUCH:  0x00000002,
                    PEN:    0x00000003
                };
            } else { //other browsers don't support pointer events
                return {}; //return empty object
            }
        },

        /**
         * If called before init(), get best guess of input pointer type
         * using Modernizr test.
         * If called after init(), get current pointer in use.
         */
        getPointer: function() {
            // On iOS devices, always default to touch, as this.lastTouchType will intermittently return 'mouse' if
            // multiple touches are triggered in rapid succession in Safari on iOS
            if(Modernizr.ios) {
                return this.TOUCH_POINTER_TYPE;
            }

            if(this.lastTouchType) {
                return this.lastTouchType;
            }

            return Modernizr.touch ? this.TOUCH_POINTER_TYPE : this.MOUSE_POINTER_TYPE;
        },

        setPointerEventLock: function() {
            this.pointerEventLock = true;
        },
        clearPointerEventLock: function() {
            this.pointerEventLock = false;
        },
        setPointerEventLockTimeout: function() {
            var that = this;

            if(this.pointerTimeout) {
                clearTimeout(this.pointerTimeout);
            }

            this.setPointerEventLock();
            this.pointerTimeout = setTimeout(function() { that.clearPointerEventLock(); }, this.POINTER_EVENT_TIMEOUT_MS);
        },

        triggerMouseEvent: function(originalEvent) {
            if(this.lastTouchType == this.MOUSE_POINTER_TYPE) {
                return; //prevent duplicate events
            }

            this.lastTouchType = this.MOUSE_POINTER_TYPE;
            $j(window).trigger('mouse-detected', originalEvent);
        },
        triggerTouchEvent: function(originalEvent) {
            if(this.lastTouchType == this.TOUCH_POINTER_TYPE) {
                return; //prevent duplicate events
            }

            this.lastTouchType = this.TOUCH_POINTER_TYPE;
            $j(window).trigger('touch-detected', originalEvent);
        },

        initEnv: function() {
            if (window.navigator.pointerEnabled) {
                this.standardTouch = true;
                this.touchDetectionEvent = 'pointermove';
            } else if (window.navigator.msPointerEnabled) {
                this.standardTouch = true;
                this.touchDetectionEvent = 'MSPointerMove';
            } else {
                this.touchDetectionEvent = 'touchstart';
            }
        },

        wirePointerDetection: function() {
            var that = this;

            if(this.standardTouch) { //standard-based touch events. Wire only one event.
                //detect pointer event
                $j(window).on(this.touchDetectionEvent, function(e) {
                    switch(e.originalEvent.pointerType) {
                        case that.getPointerEventsInputTypes().MOUSE:
                            that.triggerMouseEvent(e);
                            break;
                        case that.getPointerEventsInputTypes().TOUCH:
                        case that.getPointerEventsInputTypes().PEN:
                            // intentionally group pen and touch together
                            that.triggerTouchEvent(e);
                            break;
                    }
                });
            } else { //non-standard touch events. Wire touch and mouse competing events.
                //detect first touch
                $j(window).on(this.touchDetectionEvent, function(e) {
                    if(that.pointerEventLock) {
                        return;
                    }

                    that.setPointerEventLockTimeout();
                    that.triggerTouchEvent(e);
                });

                //detect mouse usage
                $j(document).on('mouseover', function(e) {
                    if(that.pointerEventLock) {
                        return;
                    }

                    that.setPointerEventLockTimeout();
                    that.triggerMouseEvent(e);
                });
            }
        },

        init: function() {
            this.initEnv();
            this.wirePointerDetection();
        }
    };

})(jQuery);
