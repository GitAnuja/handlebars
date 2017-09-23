var Handlebars = {
	compile : function(source){
		return (function(data){
			var ret = "";
			var index = source.indexOf("{{"), close = -2, p =2;
			while(index > -1){
				ret += source.substring(close+p, index);
				close = source.indexOf("}}", index)
				p = 2;
				if(source[index+2] == "{"){
					p++;
				}
				var property = source.substring(index+p, close);
				if(Handlebars.helpers[property.split(" ")[0]]){
					property = property.split(" ");
					var helper = property[0];
					var args = [];
					for(var i=1; i<property.length; i++){
						args[i-1] = data[property[i]];
					}
					ret+=Handlebars.helpers[helper].apply(null, args);
				}
				else{
					property = property.split("/").join(".");
					property = property.split(".");
					var val = data;
					for(var i=0; i<property.length; i++){
						val = val[property[i]];
					}
					if(p == 3){
						ret+=Handlebars.escape(val);
					}
					else{
						ret+=val;					
					}
				}
				index = source.indexOf("{{", close);
			}
			ret+=source.substring(close+2);
			return ret;
		});
	},
	escape : function(val){
		val = val.replace(/&/g, '&amp;');
		val = val.replace(/</g, '&lt;');
		val = val.replace(/>/g, '&gt;');
		val = val.replace(/"/g, '&quot;');
		val = val.replace(/'/g, '&#x27;');
		val = val.replace(/`/g, '&#x60;');
		val = val.replace(/=/g, '&#x3D;');
		return val;
	},
	registerHelper : function(name, f){
		Handlebars.helpers[name] = f;
	},
	helpers : {}
}