SrkaReviewStars = Class.create();
SrkaReviewStars.prototype = {
    initialize: function(reviewTableId) {
        var _this = this;
        _this.ratingTable = $(reviewTableId);
        _this.ratings = {};
        _this.html = '';

        if (!_this.ratingTable) {
            return;
        }

        this.ratingTable.hide();

        this.ratingTable.select('tbody > tr').each(function(row, row_count) {
            var ratingCode = row.select('.radio')[0].readAttribute('name');
            var ratingLabel = row.select('th')[0].innerHTML;
            var ratingOptions = [];
            row.select('.radio').each(function(radio) {
                ratingOptions.push(radio.value);
            });

            _this.ratings[ratingCode] = {
                code: ratingCode,
                label: ratingLabel,
                options: ratingOptions
            };
        });

        _this.html += '<div id="srka-product-review-list" class="input-box">';
        for (var i in _this.ratings) {
            var code_id = _this.ratings[i]['code'].replace(/[\[]/g, '_').replace(/[\]]/g, '');
            _this.html += '<div id="code-' + code_id + '" class="srka-rating-code">\n';
            _this.html += '  <div class="label">' + _this.ratings[i]['label'] + '</div>\n';
            _this.html += '  <ul class="options">\n';

            for (var j = 0; j < _this.ratings[i]['options'].length; j++) {
                var option_id = 'srka-' + _this.ratings[i]['label'] + '_' + _this.ratings[i]['options'][j];
                _this.html += '     <li><a href="#" id="' + option_id + '" class="option" onclick="_this.select(\'' + _this.ratings[i]['code'] + '\', ' + _this.ratings[i]['options'][j] + '); return false;"></a></li>\n';
            }

            _this.html += '  </ul>\n';
            _this.html += '  <div style="clear: both;"></div>\n';
            _this.html += '</div>\n';
        }
        _this.html += '</div>';

        this.ratingTable.insert({
            after: _this.html
        });
    },

    select: function(ratingCode, ratingOption) {
        var options = this.ratings[ratingCode]['options'];

        this.ratingTable.select('.radio[value="' + ratingOption + '"]')[0].checked = true;

        for (var i = 0; i < options.length; i++) {
            var srka_option_id = 'srka-' + this.ratings[ratingCode]['label'] + '_' + this.ratings[ratingCode]['options'][i];
            var option_id = srka_option_id.replace('srka-', '');
            if (options[i] <= ratingOption) {
                $(srka_option_id).addClassName('selected');
            } else {
                $(srka_option_id).removeClassName('selected');
            }
        }
    }
};
