var ConfigurableMediaImages = {
    imageType: null,
    productImages: {},
    imageObjects: {},

    arrayIntersect: function(a, b) {
        var ai=0, bi=0;
        var result = new Array();

        while( ai < a.length && bi < b.length )
        {
            if      (a[ai] < b[bi] ){ ai++; }
            else if (a[ai] > b[bi] ){ bi++; }
            else /* they're equal */
            {
                result.push(a[ai]);
                ai++;
                bi++;
            }
        }

        return result;
    },

    getCompatibleProductImages: function(productFallback, selectedLabels) {
        //find compatible products
        var compatibleProducts = [];
        var compatibleProductSets = [];
        selectedLabels.each(function(selectedLabel) {
            if(typeof(productFallback['option_labels']) != 'undefined') {
                if (!productFallback['option_labels'][selectedLabel]) {
                    return;
                }

                var optionProducts = productFallback['option_labels'][selectedLabel]['products'];
                compatibleProductSets.push(optionProducts);

                //optimistically push all products
                optionProducts.each(function (productId) {
                    compatibleProducts.push(productId);
                });
            }
        });

        //intersect compatible products
        compatibleProductSets.each(function(productSet) {
            compatibleProducts = ConfigurableMediaImages.arrayIntersect(compatibleProducts, productSet);
        });

        return compatibleProducts;
    },

    isValidImage: function(fallbackImageUrl) {
        if(!fallbackImageUrl) {
            return false;
        }

        return true;
    },

    getSwatchImage: function(productId, optionLabel, selectedLabels) {
        var fallback = ConfigurableMediaImages.productImages[productId];
        if(!fallback) {
            return null;
        }

        //first, try to get label-matching image on config product for this option's label
        if(typeof(fallback['option_labels']) != 'undefined') {
            var currentLabelImage = fallback['option_labels'][optionLabel];
            if (currentLabelImage && fallback['option_labels'][optionLabel]['configurable_product'][ConfigurableMediaImages.imageType]) {
                //found label image on configurable product
                return fallback['option_labels'][optionLabel]['configurable_product'][ConfigurableMediaImages.imageType];
            }
        }

        var compatibleProducts = ConfigurableMediaImages.getCompatibleProductImages(fallback, selectedLabels);

        if(compatibleProducts.length == 0) { //no compatible products
            return null; //bail
        }

        //second, get any product which is compatible with currently selected option(s)
        jQuery.each(fallback['option_labels'], function(key, value) {
            var image = value['configurable_product'][ConfigurableMediaImages.imageType];
            var products = value['products'];

            if(image) { //configurable product has image in the first place
                //if intersection between compatible products and this label's products, we found a match
                var isCompatibleProduct = ConfigurableMediaImages.arrayIntersect(products, compatibleProducts).length > 0;
                if(isCompatibleProduct) {
                    return image;
                }
            }
        });

        //third, get image off of child product which is compatible
        var childSwatchImage = null;
        var childProductImages = fallback[ConfigurableMediaImages.imageType];
        compatibleProducts.each(function(productId) {
            if(childProductImages[productId] && ConfigurableMediaImages.isValidImage(childProductImages[productId])) {
                childSwatchImage = childProductImages[productId];
                return false; //break "loop"
            }
        });
        if (childSwatchImage) {
            return childSwatchImage;
        }

        //fourth, get base image off parent product
        if (childProductImages[productId] && ConfigurableMediaImages.isValidImage(childProductImages[productId])) {
            return childProductImages[productId];
        }

        //no fallback image found
        return null;
    },

    getImageObject: function(productId, imageUrl) {
        var key = productId+'-'+imageUrl;
        if(!ConfigurableMediaImages.imageObjects[key]) {
            var image = jQuery('<img />');
            image.attr('src', imageUrl);
            ConfigurableMediaImages.imageObjects[key] = image;
        }
        return ConfigurableMediaImages.imageObjects[key];
    },

    updateImage: function(el) {
        var select = jQuery(el);
        var label = select.find('option:selected').attr('data-label');
        var productId = optionsPrice.productId; //get product ID from options price object

        //find all selected labels
        var selectedLabels = new Array();

        jQuery('.product-options .super-attribute-select').each(function() {
            var $option = jQuery(this);
            if($option.val() != '') {
                selectedLabels.push($option.find('option:selected').attr('data-label'));
            }
        });

        var swatchImageUrl = ConfigurableMediaImages.getSwatchImage(productId, label, selectedLabels);
        if(!ConfigurableMediaImages.isValidImage(swatchImageUrl)) {
            return;
        }

        var swatchImage = ConfigurableMediaImages.getImageObject(productId, swatchImageUrl);

        ProductMediaManager.swapImage(swatchImage);
    },

    wireOptions: function() {
        jQuery('.product-options .super-attribute-select').change(function(e) {
            ConfigurableMediaImages.updateImage(this);
        });
    },

    swapListImage: function(productId, imageObject) {

        var originalImage = jQuery('#product-collection-image-' + productId);

        if(imageObject[0].complete) { //swap image immediately

            //remove old image
            originalImage.addClass('hidden');
            jQuery('.product-collection-image-' + productId).remove();

            //add new image
            imageObject.insertAfter(originalImage);

        } else { //need to load image

            var wrapper = originalImage.parent();

            //add spinner
            wrapper.addClass('loading');

            //wait until image is loaded
            imagesLoaded(imageObject, function() {
                //remove spinner
                wrapper.removeClass('loading');

                //remove old image
                originalImage.addClass('hidden');
                jQuery('.product-collection-image-' + productId).remove();

                //add new image
                imageObject.insertAfter(originalImage);
            });

        }
    },

    swapListImageByOption: function(productId, optionLabel) {
        var swatchImageUrl = ConfigurableMediaImages.getSwatchImage(productId, optionLabel, [optionLabel]);
        if(!swatchImageUrl) {
            return;
        }

        var newImage = ConfigurableMediaImages.getImageObject(productId, swatchImageUrl);
        newImage.addClass('product-collection-image-' + productId);

        ConfigurableMediaImages.swapListImage(productId, newImage);
    },

    setImageFallback: function(productId, imageFallback) {
        ConfigurableMediaImages.productImages[productId] = imageFallback;
    },

    init: function(imageType) {
        ConfigurableMediaImages.imageType = imageType;
        ConfigurableMediaImages.wireOptions();
    }
};