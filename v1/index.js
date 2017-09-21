window.onload = function(){
	var source = $("#handlebars").html();
	var template = Handlebars.compile(source);
	var data = {first : "Anuja", last : "Manoharan", dob : {date : 29, month : 10, year : 1992}};
	$("#main").html(template(data));
}