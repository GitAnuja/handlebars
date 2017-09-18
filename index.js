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
				  var str1 = Handlebars.replaceString(str, v, data);
				  return str1;
			  }});
			  source = source.replace(source.substring(index, close1+end.length), temp);
			  index = source.indexOf("{{");
			  continue;
		  }
		  else if(source.substring(index+2, index+5) == "!--"){
			  source = source.replace(source.substring(index, close+2), "");
			  index = source.indexOf("{{");
			  continue;
		  }
		  else if(source[index+2] == ">"){
			  var partial = source.substring(index, close).split(" ")[1];
			  source = source.replace(source.substring(index, close+2), Handlebars.$.partial[partial]);
			  index = source.indexOf("{{");
			  continue;
		  }
		  var property = source.substring(index+2, close), prop = property.split(" "), val;
		  if(Handlebars.$.helper[prop[0]]){
			  val = Handlebars.$.helper[prop[0]](data[prop[1]]);
		  }
		  else{
			  property = property.split(".");
			  val = data[property[0]];
			  for(var i=1; i<property.length; i++){
				  val = val[property[1]];
			  }
			  if(triple){
				  index--;
				  close++;
				  val = Handlebars.escapeVal(val).toString();
			  }
		  }
		  source = source.replace(source.substring(index, close+2), val);
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
	  helper : {},
	  partial : {}
  },
  replaceString : function(str, val, data){
	  var index = str.indexOf("{{");
	  while(index > -1){
		  var close = str.indexOf("}}");
		  var property = str.substring(index+2, close), val1 = val;
		  if(property.indexOf("..") > -1){
			  property = property.split("../")[1];
			  val1 = data;
		  }
		  str = str.replace(new RegExp(str.substring(index, close+2), 'g'), val1[property]);	  	
		  index = str.indexOf("{{");
	  }
	  return str;
  },
  registerPartial : function(name, partial){
	  this.$.partial[name] = partial;
  }
}
