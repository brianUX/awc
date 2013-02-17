$(function(){
	
	Parse.initialize("VHLTs3Df0CDlYqsdMjAGtMPFONSDiqGlixqizO5I", "UMbIj6CgBQHpDBs2VvQiik4Au17F6TNGPN2attrF");
	
	//models
		var Settings = Parse.Object.extend("settings");
		
		var Slide = Parse.Object.extend("slides");
		var Slides = Parse.Collection.extend({
		  model: Slide
		});
		
		var Page = Parse.Object.extend("pages");
		var Pages = Parse.Collection.extend({
		  model: Page
		});
		
		var Product = Parse.Object.extend("products");
		var Products = Parse.Collection.extend({
		  model: Product
		});
			
	//views	
	
		//router
		RouterView = Parse.View.extend({
			initialize: function() {
				_.bindAll(this, "fetch", "find");
				this.fetch();
			}, 
			fetch: function() {
				var self = this;
				var pages = new Pages();
				pages.fetch({
					success: function(pages) {
						var pages = pages.models;
						var products = new Products();
						products.fetch({
							success: function(products) {
								var products = products.models;
								self.find(pages,products);
							},
							error: function(pages, error) {}
						});
					},
					error: function(pages, error) {}
				});
			},
			find: function(pages,products) {
				var slug = this.options.slug;
				//check pages
				for (var i = 0; i < pages.length; i++) {
				    if (pages[i].attributes.url === slug) {
						var id = pages[i].id;
						new PageView({id: id});
						return false;
					}
				}
				//check products
				for (var i = 0; i < products.length; i++) {
				    if (products[i].attributes.url === slug) {
						var id = products[i].id;
						new ProductView({id: id});
						return false;
					}
				}
				//error
				new ErrorView({
					title: "404",
					message: "Page Not Found"
				});
			}
		});

		//app view
		AppView = Parse.View.extend({
			initialize: function() {
				_.bindAll(this, "getSettings", "renderSettings", "getPages", "renderPages");
				this.render();
				this.getSettings();
				this.getPages();
		    },
			render: function() {
				new LoadingView();
			},
			getSettings: function() {
				var self = this;
				var query = new Parse.Query(Settings);
				query.get("lfjE3nUk04", {
				    success: function(settings) {
						self.renderSettings(settings.attributes);
				    },
				    error: function(collection, error) {
				  		new ErrorView({
							title: "Error",
							message: "Please Try Again"
						});
					}
				});
			},
		    renderSettings: function(settings) {
				new HeaderView({
					settings: settings
				});
				new FooterView({
					settings: settings
				});
		    },
			getPages: function() {
				var self = this;
				var pages = new Pages();
				pages.comparator = function(object) {
				  return object.get("order");
				};
				pages.fetch({
					success: function(pages) {
						self.renderPages(pages.models);
					},
					error: function(collection, error) {
					    new ErrorView({
							title: "Error",
							message: "Please Try Again"
						});
					}
				});
			},
			renderPages: function(pages) {
				var self = this;
				pages.forEach(function(page) {
					var data = {
						title: page.attributes.title,
						url: page.attributes.url
					};
					$('.main-nav').append(_.template($('#menu-item').html())(data));
					$('.footer-nav').append(_.template($('#menu-item').html())(data));
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
					template: this.options.settings.template,
					title: this.options.settings.title,
					tagline: this.options.settings.tagline,
					facebook: this.options.settings.facebook,
					twitter: this.options.settings.twitter,
					pinterest: this.options.settings.pinterest,
					tumblr: this.options.settings.tumblr
				};
			  	$(this.el).html(this.template(data));
				$("a[rel=tooltip]").tooltip();
			}
		});
		
		//footer view
		FooterView = Parse.View.extend({
			el: $('.footer-info'),
			template: _.template($('#footer-template').html()),
			initialize: function() {
			    _.bindAll(this);
				this.render();
			},
			render: function() {
				var data = {
					address: this.options.settings.address,
					email: this.options.settings.email,
					phone: this.options.settings.phone,
					facebook: this.options.settings.facebook,
					twitter: this.options.settings.twitter,
					pinterest: this.options.settings.pinterest,
					tumblr: this.options.settings.tumblr
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
				$('.loading').fadeIn(300);
				setTimeout(this.comeOut,1000);
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
				$('.app').fadeIn(380)
				this.remove();
			}
		});	
		
		//home view
		HomeView = Parse.View.extend({
			sliderTemplate: _.template($('#home-slider-template').html()),
			productTemplate: _.template($('#home-products-template').html()),
			initialize: function() {
			    _.bindAll(this, "loadSlides", "renderSlides", "loadProducts", "renderProducts", "listeners");
				var self = this;
				$('.content').empty();
				var inner = "<div class='content-top'></div><div class='content-bottom'></div>";
				$('.content').html(inner);
				this.loadSlides();
				this.loadProducts();
			},
			loadSlides: function() {
				var self = this;
				var slides = new Slides();
				slides.fetch({
					success: function(slides) {
						self.renderSlides(slides.models);
					},
					error: function(collection, error) {
					    new ErrorView({
							title: "Error",
							message: "Please Try Again"
						});
					}
				});
			},
			renderSlides: function(slides) {
				var self = this;
			  	var data = {
					slides: slides
				};
				$('.content-top').html(this.sliderTemplate(data));
				$(".carousel").carousel();
				this.listeners();
				$('.carousel-inner .item:first-child').addClass('active');
				$('.circles span:first-child').addClass('active');
			},
			loadProducts: function() {
				var self = this;
				var products = new Products();
				products.comparator = function(object) {
				  return object.get("order");
				};
				products.fetch({
					success: function(products) {
						self.renderProducts(products.models);
					},
					error: function(collection, error) {
					    new ErrorView({
							title: "Error",
							message: "Please Try Again"
						});
					}
				});
			},
			renderProducts: function(products) {
				var self = this;
				var data = {
					products: products
				};
				$('.content-bottom').html(this.productTemplate(data));
			},
			listeners: function() {
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
				var self = this;
				var id = this.options.id;
				var query = new Parse.Query(Page);
				query.get(id, {
				    success: function(page) {
						self.render(page.attributes);
				    },
				    error: function(collection, error) {
				  		new ErrorView({
							title: "Error",
							message: "Please Try Again"
						});
					}
				});
			},
			render: function(page) {
			  	var data = {
					title: page.title,
					body: page.body,
					photo: page.photo
				};
			  	$(this.el).html(this.template(data));
			}
		});
		
		//product view
		ProductView = Parse.View.extend({
			el: $('.content'),
			template: _.template($('#product-template').html()),
			events: {
				"click .thumbs a" : "rotate"
			},
			initialize: function() {
			    _.bindAll(this, "rotate");
				var self = this;
			    var id = this.options.id;
				var query = new Parse.Query(Product);
				query.get(id, {
				    success: function(product) {
						self.render(product.attributes);
				    },
				    error: function(collection, error) {
				  		new ErrorView({
							title: "Error",
							message: "Please Try Again"
						});
					}
				});
			},
			render: function(product) {
			  	var data = {
					title: product.title,
					photo: product.photo,
					photo2: product.photo2,
					photo3: product.photo3,
					body: product.body
				};
			  	$(this.el).html(this.template(data));
			},
			rotate: function(e) {
				var climber = $(e.target);
				var climberSrc = climber.attr('src');
				if (climber.hasClass('active')) {
					console.log('active')
					return false;
				} else {
					console.log('new')
					$('.thumbs a.active').removeClass('active');
					climber.parent('a').addClass('active');
					$('img#main').attr('src', climberSrc);
				}
			}
		});
		
		
		//error view
		ErrorView = Parse.View.extend({
			el: $('.content'),
			template: _.template($('#error-template').html()),
			initialize: function() {
			  _.bindAll(this);
			  $('.loading').hide();
			  $('.content').empty();
			  this.render();
			},
			render: function() {
				var data = {
					title: this.options.title,
					message: this.options.message
				};
			  	$(this.el).html(this.template(data));
			}
		});
		
	
	//router
		var AppRouter = Parse.Router.extend({
			routes: {
				"" : "home",
				":slug" : "router"
			},
			initialize: function() {
		        new AppView();
		    },
			home: function() {
				new HomeView();
			},
			router: function(slug) {
				new RouterView({
					slug: slug
				});
			}
		});
	
		var app = new AppRouter();
		Parse.history.start();
		
});


