var ConfigurableSwatchesList = {
    swatchesByProduct: {},

    init: function()
    {
        var that = this;
        jQuery('.configurable-swatch-list li').each(function() {
            that.initSwatch(this);
            var $swatch = jQuery(this);
            if ($swatch.hasClass('filter-match')) {
                that.handleSwatchSelect($swatch);
            }
        });
    },

    initSwatch: function(swatch)
    {
        var that = this;
        var $swatch = jQuery(swatch);
        var productId;
        jQuery($swatch).hover(function() {
            /**
             *
             * - Preview the stock status
             **/
            var swatchUl = $swatch.parent();
            swatchUl.find('.x').each(function(){
                jQuery(this).show();
                jQuery(this).closest('li').addClass('not-available');
            });
        });
        if (productId = $swatch.data('product-id')) {
            if (typeof(this.swatchesByProduct[productId]) == 'undefined') {
                this.swatchesByProduct[productId] = [];
            }
            this.swatchesByProduct[productId].push($swatch);

            $swatch.find('a').on('click', function(e) {
                e.preventDefault();
                that.handleSwatchSelect($swatch);
            });
        }
    },

    handleSwatchSelect: function($swatch)
    {
        var productId = $swatch.data('product-id');
        var label;
        if (label = $swatch.data('option-label')) {
            ConfigurableMediaImages.swapListImageByOption(productId, label);
        }

        jQuery.each(this.swatchesByProduct[productId], function(key, $productSwatch) {
            $productSwatch.removeClass('selected');
        });

        $swatch.addClass('selected');
    }
};

jQuery(document).on('configurable-media-images-init', function(){
    ConfigurableSwatchesList.init();
});
