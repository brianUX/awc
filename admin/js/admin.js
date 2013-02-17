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

		//app view
		AppView = Parse.View.extend({
			initialize: function() {
				_.bindAll(this, "loggedIn", "notLoggedIn");
				var currentUser = Parse.User.current();
				if (currentUser) {
				    this.loggedIn();
				} else {
				    this.notLoggedIn();
				}
		    },
			loggedIn: function() {
				new DashboardView();
			},
			notLoggedIn: function() {
				new LoginView();
			}
		});	
		
		//login view
		LoginView = Parse.View.extend({
			el: $('#login'),
			template: _.template($('#login-template').html()),
			events: {
				"submit form": "logIn"
			},
			initialize: function() {
				_.bindAll(this, "logIn");
				this.render();
			},
			render: function() {
				$(this.el).html(this.template());
				$('#login').show();
			},
			logIn: function() {
				var self = this;
				var username = $('input.username').val();
				var password = $('input.password').val();
				Parse.User.logIn(username, password, {
				  success: function(user) {
					// app.navigate("/settings", {trigger: false});
					new DashboardView();
					new SettingsView();
					$('#login').hide();
				  },
				  error: function(user, error) {
				    alert('Login failed. Try again.')
				  }
				});
				return false;
			}
		});
		
		//dashboard view
		DashboardView = Parse.View.extend({
			el: $('.user'),
			template: _.template($('#user-template').html()),
			events: {
				"click .logout": "logout"
			},
			initialize: function() {
				_.bindAll(this, "logout");
				var currentUser = Parse.User.current();
				this.username = currentUser.attributes.username;
				this.render();
			},
			render: function() {
				var data = {
					username: this.username
				};
				$(this.el).html(this.template(data));
				$("#dashboard").show();
			},
			logout: function() {
				$("#dashboard").hide();
				Parse.User.logOut();
				new LoginView();
				return false;
			}
		});
		
		//settings view
		SettingsView = Parse.View.extend({
			el: $('.sub-content'),
			template: _.template($('#settings-template').html()),
			events: {
				"submit form.settings": "update"
			},
			initialize: function() {
				_.bindAll(this, "update");
				console.log('new settings view');
				$(".main-nav li.active").removeClass('active');
				$(".main-nav li.settings").addClass("active");
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
				var data = {
					title: settings.title,
					tagline: settings.tagline,
					facebook: settings.facebook,
					twitter: settings.twitter,
					pinterest: settings.pinterest,
					tumblr: settings.tumblr,
					address: settings.address,
					email: settings.email,
					phone: settings.phone
				};
				$(this.el).html(this.template(data));
			},
			update: function() {
				$('button.submit').addClass('disabled');
				$(".alert").hide();
				//new values
				var title = $('input#title').val();
				var tagline = $('input#tagline').val();
				var facebook = $('input#facebook').val();
				var twitter = $('input#twitter').val();
				var pinterest = $('input#pinterest').val();
				var tumblr = $('input#tumblr').val();
				var address = $('input#address').val();
				var email = $('input#email').val();
				var phone = $('input#phone').val();
				//save new values
				var settings = new Parse.Query(Settings);
				settings.get("lfjE3nUk04", {
				    success: function(settings) {
						settings.set("title", title);
						settings.set("tagline", tagline);
						settings.set("facebook", facebook);
						settings.set("twitter", twitter);
						settings.set("pinterest", pinterest);
						settings.set("tumblr", tumblr);
						settings.set("address", address);
						settings.set("email", email);
						settings.set("phone", phone);
						settings.save(null, {
							success: function() {
		 						$(".alert-success").show();
								$('button.submit').removeClass('disabled');
							},
							error: function() {
								$(".alert-error").show();
								$('button.submit').removeClass('disabled');
							}
						});
				    },
				    error: function(collection, error) {
				  		new ErrorView({
							title: "Error",
							message: "Please Try Again"
						});
					}
				});
				return false;
			}
		});
		
		//pages view
		PagesView = Parse.View.extend({
			el: $('.sub-content'),
			template: _.template($('#pages-template').html()),
			events: {
				"click button.submit" : "changeOrder"
			},
			initialize: function() {
			    _.bindAll(this, "changeOrder");
				var self = this;
				$(".main-nav li.active").removeClass('active');
				$(".main-nav li.pages").addClass("active");
			    //fetch pages
				var pages = new Pages();
				pages.comparator = function(object) {
				  return object.get("order");
				};
				pages.fetch({
					success: function(pages) {
						self.pages = pages;
						self.render(pages.models);
					},
					error: function(collection, error) {
					    new ErrorView({
							title: "Error",
							message: "Please Try Again"
						});
					}
				});
			},
			render: function(pages) {
				var data = {
					pages: pages
				};
			  	$(this.el).html(this.template(data));
			},
			changeOrder: function() {
				$('button.submit').addClass('disabled');
				$(".alert").hide();
				$("input.order").each(function(){
					var id = $(this).attr('id');
					var order = parseFloat($(this).val());
					var page = new Parse.Query(Page);
					page.get(id, {
						success: function(object) {
							console.log(object)
							console.log(order)
							object.set("order", order);
							object.save();
						},
						error: function(object,error) {
							$(".alert-error").show();
							$('button.submit').removeClass('disabled');
							return false;
						}
					});
				});
				$(".alert-success").show();
				$('button.submit').removeClass('disabled');
			}
		});
		
		//page view
		PageView = Parse.View.extend({
			el: $('.sub-content'),
			template: _.template($('#page-template').html()),
			events: {
				"submit form.page" : "update"
		    },
			initialize: function() {
			    _.bindAll(this, "update");
				var self = this;
				$(".main-nav li.active").removeClass('active');
			    //fetch page
				self.id = this.options.id;
				var query = new Parse.Query(Page);
				query.get(self.id, {
				    success: function(page) {
						self.render(page);
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
				console.log(page.attributes.body)
			  	var data = {
					title: page.attributes.title,
					body: page.attributes.body,
					url: page.attributes.url,
					id: page.id
				};
			  	$(this.el).html(this.template(data));
				$('textarea:visible').wysihtml5({
					"html": true, //Button which allows you to edit the generated HTML. Default false
					"image": false, //Button to insert an image. Default true,
					"stylesheets": ["css/typo.css"]
				});
				$("input#url").keydown(function (e) {
				     if (e.keyCode == 32) { 
				       $(this).val($(this).val() + "-"); // append '-' to input
				       return false; // return false to prevent space from being added
				     }
				});
			},
			update: function() {
				console.log(this.id);
				var self = this;
				$('button.submit').addClass('disabled');
				$(".alert").hide();
				//new values
				var title = $('input#title').val();
				var url = $('input#url').val();
				var body = $('textarea#body').val();
				//save new values
				var page = new Parse.Query(Page);
				page.get(self.id, {
				    success: function(page) {
						page.set("title", title);
						page.set("url", url);
						page.set("body", body);
						page.save(null, {
							success: function() {
		 						$(".alert-success").show();
								$('button.submit').removeClass('disabled');
							},
							error: function() {
								$(".alert-error").show();
								$('button.submit').removeClass('disabled');
							}
						});
				    },
				    error: function(collection, error) {
				  		new ErrorView({
							title: "Error",
							message: "Please Try Again"
						});
					}
				});			
				return false;
			}
		});
		
		//products view
		ProductsView = Parse.View.extend({
			el: $('.sub-content'),
			template: _.template($('#products-template').html()),
			events: {
				"click button.submit" : "changeOrder"
			},
			initialize: function() {
			    _.bindAll(this, "changeOrder");
				var self = this;
				$(".main-nav li.active").removeClass('active');
				$(".main-nav li.products").addClass("active");
			    //fetch products
				var products = new Products();
				products.comparator = function(object) {
				  return object.get("order");
				};
				products.fetch({
					success: function(products) {
						self.render(products.models);
					},
					error: function(collection, error) {
					    new ErrorView({
							title: "Error",
							message: "Please Try Again"
						});
					}
				});
			},
			render: function(products) {
				var data = {
					products: products
				};
			  	$(this.el).html(this.template(data));
			},
			changeOrder: function() {
				$('button.submit').addClass('disabled');
				$(".alert").hide();
				$("input.order").each(function(){
					var id = $(this).attr('id');
					var order = parseFloat($(this).val());
					var product = new Parse.Query(Product);
					product.get(id, {
						success: function(object) {
							object.set("order", order);
							object.save();
						},
						error: function(object,error) {
							$(".alert-error").show();
							$('button.submit').removeClass('disabled');
							return false;
						}
					});
				});
				$(".alert-success").show();
				$('button.submit').removeClass('disabled');
			}
		});
		
		//product view
		ProductView = Parse.View.extend({
			el: $('.sub-content'),
			template: _.template($('#product-template').html()),
			events: {
				"submit form.product" : "update",
				"change input#fileselect" : "grabFile"
		    },
			initialize: function() {
			    _.bindAll(this, "update", "grabFile", "uploadImage");
				var self = this;
				$(".main-nav li.active").removeClass('active');
			    //fetch product
				self.id = this.options.id;
				var query = new Parse.Query(Product);
				query.get(self.id, {
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
					body: product.body,
					url: product.url,
					src: product.photo,
					id: product.id
				};
			  	$(this.el).html(this.template(data));
				$('textarea:visible').wysihtml5({
					"html": true, //Button which allows you to edit the generated HTML. Default false
					"image": false, //Button to insert an image. Default true,
					"stylesheets": ["css/typo.css"]
				});
				$("input#url").keydown(function (e) {
				     if (e.keyCode == 32) { 
				       $(this).val($(this).val() + "-"); // append '-' to input
				       return false; // return false to prevent space from being added
				     }
				});
			},
			update: function() {
				console.log(this.id);
				var self = this;
				$('button.submit').addClass('disabled');
				$(".alert").hide();
				//new values
				var title = $('input#title').val();
				var url = $('input#url').val();
				var body = $('textarea#body').val();
				var photo = $("img.product:visible").attr('src');
				//save new values
				var product = new Parse.Query(Product);
				product.get(self.id, {
				    success: function(product) {
						product.set("title", title);
						product.set("url", url);
						product.set("body", body);
						product.set("photo", photo);
						product.save(null, {
							success: function() {
		 						$(".alert-success").show();
								$('button.submit').removeClass('disabled');
							},
							error: function() {
								$(".alert-error").show();
								$('button.submit').removeClass('disabled');
							}
						});
				    },
				    error: function(collection, error) {
				  		new ErrorView({
							title: "Error",
							message: "Please Try Again"
						});
					}
				});			
				return false;
			},
			grabFile: function(e) {
				var files = e.target.files || e.dataTransfer.files;
		        this.file = files[0];
				this.filetype = this.file.type;
				console.log(this.file)
				this.uploadImage();
			},
			uploadImage: function() {
				var self = this;
				var serverUrl = 'https://api.parse.com/1/files/' + this.file.name;
				//send file
				$.ajax({
					type: "POST",
					beforeSend: function(request) {
						request.setRequestHeader("X-Parse-Application-Id", "VHLTs3Df0CDlYqsdMjAGtMPFONSDiqGlixqizO5I");
						request.setRequestHeader("X-Parse-REST-API-Key", "nag9lASDJkgHUTsp55h8HvKlYdy23VNe0YVzp40O");
						request.setRequestHeader("Content-Type", self.file.type);
					},
					url: serverUrl,
					data: self.file,
					processData: false,
					contentType: false,
					success: function(image) {
						console.log(image)
						$("img.product:visible").attr('src', image.url)
					},
					error: function(image) {
					  	new ErrorView({
							title: "Awww, Bro",
							message: "We encountered an error. Try again."
						});
					}
				});
				return false;
			}
		});
		
		//slideshow view
		SlideshowView = Parse.View.extend({
			el: $('.sub-content'),
			template: _.template($('#slideshow-template').html()),
			initialize: function() {
			    _.bindAll(this);
				var self = this;
				$(".main-nav li.active").removeClass('active');
				$(".main-nav li.slideshow").addClass('active');
			    //fetch slides
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
			  	var data = {
					slides: slides
				};
			  	$(this.el).html(this.template(data));
			}
		});
		
		//slide view
		SlideView = Parse.View.extend({
			el: $('.sub-content'),
			template: _.template($('#slide-template').html()),
			events: {
				"change input#fileselect" : "grabFile",
				"submit form.slide" : "update"
			},
			initialize: function() {
			    _.bindAll(this, "grabFile", "uploadImage", "update");
				var self = this;
				$(".main-nav li.active").removeClass('active');
			    //fetch slide
				self.id = this.options.id;
				var query = new Parse.Query(Slide);
				query.get(self.id, {
				    success: function(slide) {
						self.render(slide.attributes);
				    },
				    error: function(collection, error) {
				  		new ErrorView({
							title: "Error",
							message: "Please Try Again"
						});
					}
				});
			},
			render: function(slide) {
				var self = this;
			  	var data = {
					photo: slide.photo
				};
			  	$(this.el).html(this.template(data));
			},
			grabFile: function(e) {
				var files = e.target.files || e.dataTransfer.files;
		        this.file = files[0];
				this.filetype = this.file.type;
				this.uploadImage();
				$(this).css('background', "red");
				$('button.submit').addClass('disabled');
			},
			uploadImage: function(x) {
				var self = this;
				var serverUrl = 'https://api.parse.com/1/files/' + this.file.name;
				//send file
				$.ajax({
					type: "POST",
					beforeSend: function(request) {
						request.setRequestHeader("X-Parse-Application-Id", "VHLTs3Df0CDlYqsdMjAGtMPFONSDiqGlixqizO5I");
						request.setRequestHeader("X-Parse-REST-API-Key", "nag9lASDJkgHUTsp55h8HvKlYdy23VNe0YVzp40O");
						request.setRequestHeader("Content-Type", self.file.type);
					},
					url: serverUrl,
					data: self.file,
					processData: false,
					contentType: false,
					success: function(image) {
						console.log(image);
						$("img.slide:visible").attr('src', image.url);
						$('button.submit').removeClass('disabled');
					},
					error: function(image) {
						$('button.submit').removeClass('disabled');
					  	new ErrorView({
							title: "Awww, Bro",
							message: "We encountered an error. Try again."
						});
					}
				});
				return false;
			},
			update: function() {
				console.log(this.id);
				var self = this;
				$('button.submit').addClass('disabled');
				$(".alert").hide();
				//new values
				var photo = $("img.slide:visible").attr('src');
				//save new values
				var slide = new Parse.Query(Slide);
				slide.get(self.id, {
				    success: function(slide) {
						slide.set("photo", photo);
						slide.save(null, {
							success: function() {
		 						$(".alert-success").show();
								$('button.submit').removeClass('disabled');
							},
							error: function() {
								$(".alert-error").show();
								$('button.submit').removeClass('disabled');
							}
						});
				    },
				    error: function(collection, error) {
				  		new ErrorView({
							title: "Error",
							message: "Please Try Again"
						});
					}
				});			
				return false;
			}
		});
		
		//error view
		ErrorView = Parse.View.extend({
			el: $('.content'),
			template: _.template($('#error-template').html()),
			initialize: function() {
			  _.bindAll(this);
			  this.render();
			},
			render: function() {
				var data = {
					title: this.options.title,
					message: this.options.message
				};
			  	$(this.el).html(this.template(data));
				$('.error').show();
			}
		});
		
	
	//router
		var AppRouter = Parse.Router.extend({
			routes: {
				"" : "settings",
				"settings" : "settings",
				"pages" : "pages",
				"products" : "products",
				"page/:id" : "page",
				"product/:id" : "product",
				"slideshow" : "slideshow",
				"slide/:id" : "slide"
			},
			initialize: function() {
				new AppView();
			},
			settings: function() {
				if (this.currentSettingsView) {
					this.currentPagesView.undelegateEvents();
				}
				var view = new SettingsView();
				this.currentSettingsView = view;
			},
			pages: function() {
				if (this.currentPagesView) {
					this.currentPagesView.undelegateEvents();
				}
				var view = new PagesView();
				this.currentPagesView = view;
			},
			products: function() {
				if (this.currentProductsView) {
					this.currentProductsView.undelegateEvents();
				}
				var view = new ProductsView();
				this.currentProductsView = view;
			},
			page: function(id) {
				if (this.currentPageView) {
					this.currentPageView.undelegateEvents();
				}
				var view = new PageView({
					id: id
				});
				this.currentPageView = view;
			},
			product: function(id) {
				if (this.currentProductView) {
					this.currentProductView.undelegateEvents();
				}
				var view = new ProductView({
					id: id
				});
				this.currentProductView = view;
			},
			slideshow: function() {
				if (this.currentSlideshowView) {
					this.currentSlideshowView.undelegateEvents();
				}
				var view = new SlideshowView();
				this.currentSlideshowView = view;
			},
			slide: function(id) {
				if (this.currentSlideView) {
					this.currentSlideView.undelegateEvents();
				}
				var view = new SlideView({
					id: id
				});
				this.currentSlideView = view;
			}
		});
	
		var app = new AppRouter();
		Parse.history.start();
		
});


