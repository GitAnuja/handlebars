var Handlebars = {
	compile : function(source){
		return (function(data){
			var ret = "";
			var index = source.indexOf("{{"), close = -2, p =2;
			while(index > -1){
				ret += source.substring(close+p, index);
				close = source.indexOf("}}", index)
				p = 2;
				if(source[index+2] == "{" || source[index+2] == "#"){
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
					if(p == 3){
						var closeH = source.indexOf("{{/"+helper+"}}", close);
						var opt = source.substring(close+2, closeH);
						opt = opt.split("{{else");
						args.push({fn : function(data){
							return Handlebars.compile(opt[0])(data);
						}, inverse : function(data){
							if(opt[1]){	
								if(opt[1].indexOf("if") == 1){
									args[0] = data[opt[1].substring(opt[1].indexOf(" if ")+4, opt[1].indexOf("}}"))];
									opt[0] = opt[1].split("}}")[1];
									opt.splice(1, 1);
									ret+=Handlebars.helpers[helper].apply(null, args);
								}
								else{
									return Handlebars.compile(opt[1])(data);									
								}
							}
							else{
								return "";
							}
						}});
						close = closeH+("{{/"+helper).length;
						p--;	
					}
					var ret1 = Handlebars.helpers[helper].apply(null, args);
					ret+=(ret1?ret1:"");
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
	helpers : {
		with : function(data, opt){
			return opt.fn(data);
		},
		each : function(data, opt){
			var ret = "";
			for(var i=0; i<data.length; i++){
				ret+=opt.fn(data[i]);
			}
			return ret;
		},
		if : function(data, opt){
			if(data){
				return opt.fn(this);
			}
			return opt.inverse(this);
		}
	}
}