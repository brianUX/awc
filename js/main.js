$(document).ready(function(){
	
	$('.loading').hide();
	$('.app').fadeIn(150);
	
	$("a[rel=tooltip]").tooltip();
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
	
});



