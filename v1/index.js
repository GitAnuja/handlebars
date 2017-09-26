window.onload = function(){
	var source = $("#handlebars").html();
	var template = Handlebars.compile(source);
	var data = {first : "Anuja", last : "Manoharan", dob : {date : 29, month : 10, year : 1992}, items : ["One", "Two"],
	escape : "<b>BODY</b>", people: [{firstName: "Yehuda", lastName: "Katz"}, {firstName: "Carl", lastName: "Lerche"},
	{firstName: "Alan", lastName: "Johnson"}], item : {intro : "intro12", break : "break34"},
	bool : false};
	Handlebars.registerHelper("concat", function(first, last){
		return first+"+++"+last;
	});
	Handlebars.registerHelper("list", function(items, opt){
		var ret = "";
		for(var i=0; i<items.length; i++){
			ret+="<li>"+opt.fn(items[i])+"</li>";
		}
		return ret;
	});
	$("#main").html(template(data));
}