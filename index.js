var Handlebars = {
  compile : function(source){
    return (function(data){
      var index = source.indexOf("{{");
      var ret = "";
	  var close;
      while(index > -1){
		  ret+=source.substr(0, index-1);
		  close = source.indexOf("}}");
		  var property = source.substring(index+2, close);
		  ret+=data[property];
		  index = source.substr("{{", index);
      }
	  ret+=source.substr(close+2);
      return ret;
    });
  }
}
