var Handlebars = {
    escapeVal : function(val){
		var ret = "";
  	  for(var i=0; i<val.length; i++){
  		  if(this.escape[val[i]]){
  			  ret += this.escape[val[i]];
  		  }
		  else{
			  ret +=val[i];
		  }
  	  }
	  return ret;
    },
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
			  val = Handlebars.escapeVal(val);
		  }
		  source = source.replace(new RegExp(source.substring(index, close+2), 'g'), val);
		  index = source.indexOf("{{");
      }
	  return source;
    });
  },
  escape : {
	  "&" : '&amp;',
	  "<" : '&lt;',
	  '>' : '&gt;',
	  '"' : '&quot;',
	  "'" : '&#x27;',
	  '`' : '&#x60;',
	  '=': '&#x3D;'
  }
}
