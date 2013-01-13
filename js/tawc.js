$(function(){
	
	Parse.initialize("VHLTs3Df0CDlYqsdMjAGtMPFONSDiqGlixqizO5I", "UMbIj6CgBQHpDBs2VvQiik4Au17F6TNGPN2attrF");
	
	//models
		var Settings = Parse.Object.extend("settings");
		var Slides = Parse.Object.extend("slides");
		
		var Slides = Parse.Collection.extend({
		  model: Slides
		});
			
	//views	

		//app view
		AppView = Parse.View.extend({
			initialize: function() {
				_.bindAll(this);
				var self = this;
				var query = new Parse.Query(Settings);
				query.get("lfjE3nUk04", {
				    success: function(settings) {
						self.render(settings.attributes);
				    },
				    error: function(collection, error) {
				  		new ErrorView({
							title: "Error",
							message: "Please Try Again"
						});
					}
				});
		    },
		    render: function(settings) {
				new LoadingView({
					title: settings.title,
					tagline: settings.tagline,
					facebook: settings.facebook,
					twitter: settings.twitter,
					tumblr: settings.tumblr,
					pinterest: settings.pinterest
				});
		    }
		});	
		
		//header view
		HeaderView = Parse.View.extend({
			el: $('.header-dad'),
			template: _.template($('#header-template').html()),
			initialize: function() {
			    _.bindAll(this);
				this.render();
			},
			render: function() {
				var data = {
					template: this.options.template,
					title: this.options.title,
					tagline: this.options.tagline,
					facebook: this.options.facebook,
					twitter: this.options.twitter,
					pinterest: this.options.pinterest,
					tumblr: this.options.tumblr
				};
			  	$(this.el).html(this.template(data));
				$("a[rel=tooltip]").tooltip();
			}
		});
		
		//footer view
		FooterView = Parse.View.extend({
			el: $('.footer-dad'),
			template: _.template($('#footer-template').html()),
			initialize: function() {
			    _.bindAll(this);
				this.render();
			},
			render: function() {
				var data = {
					facebook: this.options.facebook,
					twitter: this.options.twitter,
					pinterest: this.options.pinterest,
					tumblr: this.options.tumblr
				};
			  	$(this.el).html(this.template(data));
				$("a[rel=tooltip]").tooltip();
			}
		});
		
		//loading view
		LoadingView = Parse.View.extend({
			el: $('.loading-dad'),
			template: _.template($('#loading-template').html()),
			initialize: function() {
			  _.bindAll(this, "close", "comeIn", "comeOut");
			  this.render();
			},
			render: function() {
			  	$(this.el).html(this.template());
				$('.loading').fadeIn(600);
				setTimeout(this.comeOut,800);
				this.comeIn();
			},
			comeIn: function() {

			},
			comeOut: function() {
				var self = this;
				$(".loading").fadeOut(300, function(){
					self.close();
				});
			},
			close: function() {
				new HeaderView({
					title: this.options.title,
					tagline: this.options.tagline,
					facebook: this.options.facebook,
					twitter: this.options.twitter,
					pinterest: this.options.pinterest,
					tumblr: this.options.tumblr
				});
				new FooterView({
					facebook: this.options.facebook,
					twitter: this.options.twitter,
					pinterest: this.options.pinterest,
					tumblr: this.options.tumblr
				});
				$('.app').fadeIn(400)
				this.remove();
			}
		});	
		
		//home view
		HomeView = Parse.View.extend({
			el: $('.content'),
			template: _.template($('#home-template').html()),
			initialize: function() {
			    _.bindAll(this, "listeners");
				var self = this;
				var slides = new Slides();
				slides.fetch({
					success: function(slides) {
						self.render(slides.models);
					},
					error: function(collection, error) {
					    new ErrorView({
							title: "Error",
							message: "Please Try Again"
						});
					}
				});
			},
			render: function(slides) {
			  	var data = {
					slides: slides
				};
				$(this.el).html(this.template(data));
				$('.carousel-inner .item:first-child').addClass('active');
				$('.circles span:first-child').addClass('active');
				this.listeners();
			},
			listeners: function() {
				$(".carousel").carousel();
				$('body').on('slide', function() {
					var current = $('.circles span.active');
					current.removeClass('active');
				});
				$('body').on('slid', function() {
					var current = $('.circles span.active');
					var slide = $(".carousel .item.active").index();
					var next = $('.circles span').eq(slide);
					next.addClass('active');
				});
				$('.circles span').click(function() {
					var x = $(this).index();
					$(".carousel").carousel(x);
					$(this).addClass('active');
				});	
				$(".product img").hover(
					function() {
						var x = $(this).parents('.product').find('h4');
						x.toggleClass('under');
					}, 
					function() {
						var x = $(this).parents('.product').find('h4');
						x.toggleClass('under');
					}
				);
			}
		});
		
		//page view
		PageView = Parse.View.extend({
			el: $('.content'),
			template: _.template($('#page-template').html()),
			initialize: function() {
			    _.bindAll(this);
			    this.render();
			},
			render: function() {
				var body = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, augue iaculis fermentum dignissim, dolor nibh rutrum erat, in gravida nibh nisl vel tortor. Curabitur dictum dui non justo lacinia malesuada. Mauris et diam lectus, rutrum aliquam justo. Proin sollicitudin, turpis at commodo pellentesque, est nulla congue eros, eget malesuada elit nibh in magna. Proin vel diam in risus pharetra vehicula. Ut eget fringilla odio.</p>\
				<p>Phasellus ligula diam, aliquet et cursus ac, pretium nec ante. Sed quis imperdiet turpis. Vivamus euismod nulla semper elit congue ac tempus mauris mollis. Pellentesque dignissim consectetur nibh a tincidunt. Mauris augue nisl, imperdiet non suscipit nec, pellentesque sed leo. Suspendisse id massa purus. Ut consequat, neque sed condimentum scelerisque, ipsum lorem fermentum leo, a consectetur eros eros et augue. Donec dapibus placerat turpis sed malesuada.</p>';
			  	var data = {
					title: this.options.title,
					body: body
				};
			  	$(this.el).html(this.template(data));
			}
		});
		
		//product view
		ProductView = Parse.View.extend({
			el: $('.content'),
			template: _.template($('#product-template').html()),
			initialize: function() {
			    _.bindAll(this);
			    this.render();
			},
			render: function() {
				var body = "<p><img src='img/item-"+this.options.number+".png' alt=''>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, augue iaculis fermentum dignissim, dolor nibh rutrum erat, in gravida nibh nisl vel tortor. Curabitur dictum dui non justo lacinia malesuada. Mauris et diam lectus, rutrum aliquam justo. Proin sollicitudin, turpis at commodo pellentesque, est nulla congue eros, eget malesuada elit nibh in magna. Proin vel diam in risus pharetra vehicula. Ut eget fringilla odio.</p>\
				<p>Phasellus ligula diam, aliquet et cursus ac, pretium nec ante. Sed quis imperdiet turpis. Vivamus euismod nulla semper elit congue ac tempus mauris mollis. Pellentesque dignissim consectetur nibh a tincidunt. Mauris augue nisl, imperdiet non suscipit nec, pellentesque sed leo. Suspendisse id massa purus. Ut consequat, neque sed condimentum scelerisque, ipsum lorem fermentum leo, a consectetur eros eros et augue. Donec dapibus placerat turpis sed malesuada.</p><h4><a href='#'>Suspendisse id massa</a></h4>";
			  	var data = {
					title: this.options.title,
					body: body
				};
			  	$(this.el).html(this.template(data));
			}
		});
		
		//slider view
		SliderView = Parse.View.extend({
			el: $('.carousel-inner'),
			template: _.template($('#slide-template').html()),
			initialize: function() {
			    _.bindAll(this);
				var self = this;
			    var slides = new Slides();
				slides.fetch({
					success: function(slides) {
						self.render(slides.models);
					},
					error: function(collection, error) {
					    new ErrorView({
							title: "Error",
							message: "Please Try Again"
						});
					}
				});
			},
			render: function(slides) {
				var self = this;
				slides.forEach(function(slide) {
					console.log(slide.attributes.image.url);
					var data = {
						src: slide.attributes.image.url
					};
					$(self.el).prepend(self.template(data));
				});
			}
		});
		
		//error view
		ErrorView = Parse.View.extend({
			el: $('.error'),
			template: _.template($('#error-template').html()),
			initialize: function() {
			  _.bindAll(this);
			  this.render();
			  $('.loading').hide();
			  $('.content').empty();
			},
			render: function() {
				var data = {
					title: this.options.title,
					message: this.options.message
				};
			  	$(this.el).html(this.template(data));
				$('.error').show();
				_gaq.push(['_trackPageview', 'error']);
				_gaq.push(['_trackEvent', 'Error', 'error', '']);
			}
		});
		
	
	//router
		var AppRouter = Parse.Router.extend({
			routes: {
				"" : "home",
				"about" : "about",
				"the-wood" : "theWood",
				"contact" : "contact",
				"red-oak" : "redOak",
				"almond" : "almond",
				"olive" : "olive"
			},
			initialize: function() {
		        new AppView();
		    },
			home: function() {
				new HomeView();
			},
			about: function() {
				new PageView({
					title: "About"
				});
			},
			theWood: function() {
				new PageView({
					title: "The Wood"
				});
			},
			contact: function() {
				new PageView({
					title: "Contact"
				});
			},
			redOak: function() {
				new ProductView({
					title: "Red Oak",
					number : "1"
				});
			},
			olive: function() {
				new ProductView({
					title: "Olive",
					number : "2"
				});
			},
			almond: function() {
				new ProductView({
					title: "Almond",
					number : "3"
				});
			}
		});
	
		var app = new AppRouter();
		Parse.history.start();
		
});


