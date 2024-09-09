jQuery.noConflict();
jQuery(document).ready(function() {
	// lazy load
	jQuery('.lazy').Lazy();


	/* quantity plus minus */
	jQuery('<div class="quantity-nav"><div class="quantity-button quantity-up">+</div><div class="quantity-button quantity-down">-</div></div>').insertAfter('.quantity input');
    jQuery('.quantity').each(function() {
      var spinner = jQuery(this),
        input = spinner.find('input[type="number"]'),
        btnUp = spinner.find('.quantity-up'),
        btnDown = spinner.find('.quantity-down'),
        min = input.attr('min');
        max = input.attr('max');

      btnUp.click(function() {
        var oldValue = parseFloat(input.val());
        if (oldValue >= max) {
          var newVal = oldValue;
        } else {
          var newVal = oldValue + 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");
      });

      btnDown.click(function() {

        var oldValue = parseFloat(input.val());

        if (oldValue  <= 1) { //>
          var newVal = oldValue;
        } else {
          var newVal = oldValue - 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");
      });

    });


	// Function to equalize heights
	function equalizeHeights() {

	var elements = jQuery('.catalog-category-view .products-grid .content');
	if (elements.length === 0) {
		return;
	}

	elements.height('auto');

	var heights = elements.map(function () {
		return jQuery(this).height();
	}).get();

	var maxHeight = Math.max.apply(null, heights);

	elements.height(maxHeight);
	}

	equalizeHeights();

	jQuery(window).resize(function () {
	equalizeHeights();
	});

	// header language
	var languageContainer = jQuery('.select-language');

	languageContainer.on('click', '.selection', function() {
	  var options = jQuery(this).siblings('.options');
	  options.show();
	});

	jQuery(document).on('click', function(event) {
	  if (!jQuery(event.target).closest('.select-language').length) {
		jQuery('.select-language .options').hide();
	  }
	});

	// search
	jQuery('#search_mini_form .icon').click(function(e) {
		jQuery(this).parent().toggleClass('show');
	});

	// accordion
	jQuery('.accordion .toggle').click(function(e) {
		let $this = jQuery(this);
		if ($this.next().hasClass('show')) {
			$this.removeClass('show');
			$this.next().removeClass('show');
			$this.next().slideUp(350);
		} else {
			$this.parent().parent().find('li .toggle').removeClass('show');
			$this.parent().parent().find('li .inner').removeClass('show');
			$this.parent().parent().find('li .inner').slideUp(350);
			$this.next().toggleClass('show');
			$this.toggleClass('show');
			$this.next().slideToggle(350);
		}
		setTimeout(function() {
			var position = jQuery($this).position();
			scroll(0,position.top);
		}, 200);
	});

	/* show filters */
	jQuery('.block-layered-nav .block-title').click(function(){
		jQuery('.block-layered-nav #narrow-by-list').toggle();
		jQuery(this).toggleClass("minus");
	});

	// footer mobile
	jQuery('.noga .wrap .povezave .blok h2.title').click(function(){
		jQuery(this).parent().find('.content').toggleClass('open');
		jQuery(this).toggleClass('open');
	});
	

	// MENI
	var header = jQuery('.header');
	jQuery(window).scroll(function () {
		var visinaokna = jQuery(window).height();
		var visina = 140;
		if (visinaokna > 700) {
			  if (jQuery(this).scrollTop() > visina) {
				header.addClass("fixed");
			  } else {
				header.removeClass("fixed");
			  }
		} else {
			  if (jQuery(this).scrollTop() > visina) {
				  header.addClass("fixed-top");
			  } else {
				  header.removeClass("fixed-top");
			  }
		}
	});

	jQuery('.nav-container .maton').click(function(){
		jQuery('.nav-container .mobile ul#nav').toggle();
		jQuery('.nav-container .mobile .maton').toggleClass('open');
		jQuery('.menu_overlay').toggle();
	});
	
	jQuery('.menu_overlay').click(function(){
		jQuery(this).hide();
	});

	var width = jQuery(window).width();
	if (width <= 1180) { //>
		jQuery('.mobile #nav li.parent a.level-top').click(function( event ) {
		   var state = jQuery(this).data('clicked') || 0;
		   if(state === 0){
			  event.preventDefault();
			  state++;
			  jQuery(this).data('clicked', state);
		   }
		});
	}

	jQuery('#nav li.parent').click(function(){  
        var aktiven = jQuery(this).find('ul.level0').is(':visible');
	    jQuery('ul.level0').hide();
		jQuery('#nav li').removeClass("minus");       
        if(aktiven)
            jQuery(this).find('ul.level0').show();
		jQuery(this).find('ul.level0').toggle();
 
		jQuery(this).toggleClass("minus");
	});

	jQuery('#nav li.level0.parent').hover(
		function () {
		  jQuery('.overshade').addClass('show');
		},
		function () {
		  jQuery('.overshade').removeClass('show');
		}
	  );

	// close top
	var setCookie = function(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	  }
  
	  var getCookie = function(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
		  var c = ca[i];
		  while (c.charAt(0) == ' ') c = c.substring(1);
		  if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
		}
		return "";
	  }
  
	  if (getCookie("closed") == "closed") {
		  jQuery(".top-container").hide();
	  }
  
	  jQuery(".top-container .close").click(function() {
		  jQuery(".top-container").remove();
		  setCookie("closed", "closed", 5)
	  });

	// home slider


	jQuery('.banner .owl-carousel').owlCarousel({
		lazyLoad:true,
		loop:true,
		dots: true,
		autoplay: true,
		autoplayTimeout: 8000,
		nav: false,
		margin: 0,
		items:1,
	});

	// banner instagram
	jQuery('.binstagram .owl-carousel').owlCarousel({
		autoplay: true,
		autoplayTimeout:3000,
		autoplayHoverPause:true,
		loop: true,
		margin: 0,
		nav: true,
		dots: false,
		lazyLoad: true,
		stagePadding: 100,
		center:true,
		responsive:{
			0:{
				items:1,
			},
			460:{
				items:2,
			},
			760:{
				items:3,
			},
			960:{
				items:4,
			},
			1200:{
				items:5,
			},
			1480:{
				items:6,
			}
		}
	});

	// home reference
	jQuery('.reference .owl-carousel').owlCarousel({
		autoplay: true,
		autoplayTimeout:3000,
		autoplayHoverPause:true,
		loop: true,
		margin: 20,
		nav: false,
		dots: false,
		lazyLoad: true,
		responsive:{
			0:{
				items:2,
			},
			460:{
				items:3,
			},
			760:{
				items:4,
			},
			1200:{
				items:5,
			}
		}
	});
	// product view media
	var owl = jQuery('.more-views .owl-carousel'),
	owlOptions = {
		loop: false,
		margin: 20,
		nav:true,
		dots: false,
		responsive:{
			0:{
				items:2,
			},
			420:{
				items:3,
			},
			620:{
				items:4,
			},
			900:{
				items:5,
			}
		}
	};

	if ( jQuery(window).width() < 900 ) {
		var owlActive = owl.owlCarousel(owlOptions);
	} else {
		owl.addClass('off');
	}

	jQuery(window).resize(function() {
		if ( jQuery(window).width() < 900 ) {
			if ( jQuery('.owl-carousel').hasClass('off') ) {
				var owlActive = owl.owlCarousel(owlOptions);
				owl.removeClass('off');
			}
		} else {
			if ( !jQuery('.owl-carousel').hasClass('off') ) {
				owl.addClass('off').trigger('destroy.owl.carousel');
				owl.find('.owl-stage-outer').children(':eq(0)').unwrap();
			}
		}
	});


	// home products
	jQuery('.section .owl-carousel').owlCarousel({
		autoplay: true,
		autoplayTimeout:3000,
		autoplayHoverPause:true,
		loop: false,
		margin: 20,
		nav:true,
		dots: false,
		lazyLoad: true,
		items:10,
		responsive:{
			0:{
				items:2,
			},
			640:{
				items:3,
			},
			1200:{
				items:4,
			}
		}
	});

	jQuery('.section0 .owl-carousel').owlCarousel({
		autoplay: true,
		autoplayTimeout:3000,
		autoplayHoverPause:true,
		loop: false,
		margin: 20,
		nav:true,
		dots: false,
		lazyLoad: true,
		items:10,
		responsive:{
			0:{
				items:2,
			},
			640:{
				items:3,
			},
			1200:{
				items:4,
			}
		}
	});

	// cat desc show


	jQuery('.category-description .readmore').click(function(){  
	    jQuery(this).hide();
		jQuery('.long-description').show();
	});
	jQuery('.long-description .readless').click(function(){  
	    jQuery('.category-description .readmore').show();
		jQuery('.long-description').hide();
	});

	// upsell
	jQuery('.ups.owl-carousel').owlCarousel({
		loop:false,
		margin: 20,
		nav:true,
		dots: false,
		lazyLoad: true,
		items:10,
		responsive:{
			0:{
				items:1,
			},
			600:{
				items:2,
			},
			800:{
				items:3,
			},
			1000:{
				items:4,
			}
		}
	});
	// related
	jQuery('.related .owl-carousel').owlCarousel({
		loop:false,
		margin: 20,
		nav:true,
		dots: false,
		lazyLoad: true,
		items:10,
		responsive:{
			0:{
				items:1,
			},
			600:{
				items:2,
			},
			800:{
				items:3,
			},
			1000:{
				items:4,
			}
		}
	});
	// related
	jQuery('.crosssell .owl-carousel').owlCarousel({
		loop:false,
		margin: 20,
		nav:true,
		dots: false,
		lazyLoad: true,
		items:1,
	});

	// related
	jQuery('.wrelated .owl-carousel').owlCarousel({
		loop:false,
		margin: 20,
		nav:true,
		dots: false,
		lazyLoad: true,
		items:4,
		responsive:{
			0:{
				items:2,
			},
			600:{
				items:3,
			},
			1000:{
				items:4,
			}
		}
	});
	// blog images
	jQuery('.post-entry a img').each(function( index ) { 
		jQuery(this).parent().attr('data-lightbox', 'lightbox');
	});
    lightbox.option({
      'resizeDuration': 200,
      'showImageNumberLabel': false,
      'alwaysShowNavOnTouchDevices': true
    })
	// relatedblog
	jQuery('.relatedblog .owl-carousel').owlCarousel({
		loop:false,
		nav:true,
		dots: false,
		lazyLoad: true,
		items:10,
		responsive:{
			0:{
				items:1,
			},
			600:{
				items:2,
			},
			1000:{
				items:3,
			},
			1900:{
				items:4,
			},
			2100:{
				items:5,
			}
		}
	});

	// hover grid image
	jQuery('.products-grid li.item').hover(function(){
		jQuery(this).find('.imghover').attr("src", jQuery(this).find('.imghover').data('src'));
	});
	//layered navigation
	jQuery('.block-layered-nav dt').click(function(){
		jQuery(this).toggleClass('open');
		jQuery(this).next('dd').toggle();
	});

	// review form toggle >
	jQuery('.reviw .addreviw ').on('click',function(){
		jQuery('.reviw .add-review').toggle('slow');
	});


    // Load the first 3 list items from review list
    jQuery('#product-customer-reviews li:lt(2)').show();
    jQuery('#showLess').hide();
    var items =  125;
    var shown =  2;
    jQuery('#loadMore').click(function () {
        jQuery('#showLess').show();
        shown = jQuery('#product-customer-reviews li:visible').size()+5;
        if(shown < items) { jQuery('#product-customer-reviews li:lt('+shown+')').show();}
        else {jQuery('#product-customer-reviews li:lt('+items+')').show();
             jQuery('#loadMore').hide();
             }
    });
    jQuery('#showLess').click(function () {
        jQuery('#product-customer-reviews li').not(':lt(2)').hide();
	    jQuery('#showLess').hide();
    });
	
	// owl carousel aria fix for dots
	jQuery('.owl-carousel .owl-dots').each(function() {
		jQuery(this).find('.owl-dot').each(function(index) {
			jQuery(this).attr('aria-label', index + 1);
		});
	});
});