$(document).ready(function(){
	
	$('.loading p').fadeIn(1200);
	
	setTimeout(start,1600);
	
	$("a[rel=tooltip]").tooltip();
	$(".carousel").carousel();
	$('body').on('slid', function() {
		var current = $('.circles span.active');
		var slide = $(".carousel .item.active").index();
		var next = $('.circles span').eq(slide);
		current.removeClass('active');
		next.addClass('active');
	});
	
	$('.circles span').click(function() {
		var x = $(this).index();
		$(".carousel").carousel(x);
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

var start = function() {
	$(".loading").fadeOut(450, function(){
		$('.app').fadeIn(450)
	})
}

