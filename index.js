var Handlebars = {
  compile : function(source){
    return (function(data){
      var index = source.indexOf("{{");
      while(index > -1){
		  var triple = false;
		  if(source[index+2] == "{"){
			  triple = true;
			  index++;
		  }
		  var close = source.indexOf("}}");
		  var property = source.substring(index+2, close);
		  var val = data[property];
		  if(triple){
			  index--;
			  close++;
			  val = "unescape("+val+")"
		  }
		  source = source.replace(new RegExp(source.substring(index, close+2), 'g'), val);
		  index = source.indexOf("{{");
      }
	  return source;
    });
  }
}
