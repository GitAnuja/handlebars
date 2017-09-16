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
		  var triple = false, helper, close = source.indexOf("}}");
		  if(source[index+2] == "{"){
			  triple = true;
			  index++;
		  }
		  else if(source[index+2] == "#"){
			  var arg = source.substring(index+3, close).split(" ");
			  helper = arg[0];
			  arg = data[arg[1]];
			  var end = "{{/"+helper+"}}";
			  var close1 = source.indexOf(end, close+2);
			  var temp = Handlebars.$.helper[helper](arg, {fn : function(v){
				  var str = source.substring(close+2, close1);
				  var str1 = Handlebars.replaceString(str, v);
				  return str1;
			  }});
			  source = source.replace(source.substring(index, close1+end.length), temp);
			  index = source.indexOf("{{");
			  continue;
		  }
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
  },
  registerHelper : function(name, func){
	  this.$.helper[name] = func;
  },
  $ : {
	  helper : {}
  },
  replaceString : function(str, val){
	  var index = str.indexOf("{{");
	  while(index > -1){
		  var close = str.indexOf("}}");
		  var property = str.substring(index+2, close);
		  str = str.replace(new RegExp(str.substring(index, close+2), 'g'), val[property]);	  	
		  index = str.indexOf("{{");
	  }
	  return str;
  }
}
