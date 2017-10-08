var Handlebars = {
	compile : function(source){
		return (function(data, i){
			var ret = "";
			var index = source.indexOf("{{"), close = -2, p =2;
			while(index > -1){
				ret += source.substring(close+p, index);
				close = source.indexOf("}}", index)
				p = 2;
				if(source[index+2] == "{" || source[index+2] == "#"){
					p++;
				}
				else if(source.indexOf("!--") == index+2){
					close = source.indexOf("--}}", index)+2;
					index = source.indexOf("{{", close);
					continue;
				}
				var property = source.substring(index+p, close);
				if(property == "@index"){
					ret+=i;
				}
				else if(property.indexOf(">") == 0){
					property = property.split(" ");
					var partial = property[1];
					var html = Handlebars.partials[partial];
					ret+=Handlebars.compile(html)(data);
				}
				else if(Handlebars.helpers[property.split(" ")[0]]){
					property = property.split(" ");
					var helper = property[0];
					var args = [];
					for(var i=1; i<property.length; i++){
						if(property[i].indexOf("(") > -1){
							var subHelper = property[i].split("(")[1];
							var subHelperArg = [];
							for(var j=i+1; j<property.length; j++){
								if(property[j].indexOf(")") > -1){
									subHelperArg.push(data[property[j].split(")")[0]]);
									break;
								}
								else{
									subHelperArg.push(data[property[j]]);
								}
							}
							args[i-1] = Handlebars.helpers[subHelper].apply(null, subHelperArg);
							i = j;
						}
						else if(property[i].indexOf("=") > -1){
							var prop = property[i].split("=");
							var arg = Handlebars.getArgs(Handlebars.helpers[helper]);
							args[arg.indexOf(prop[0])] = data[prop[1]];
						}
						else{
							args[i-1] = data[property[i]];							
						}
					}
					if(p == 3){
						var closeH = source.indexOf("{{/"+helper+"}}", close);
						var opt = source.substring(close+2, closeH);
						opt = opt.split("{{else");
						args.push({fn : function(data, index){
							return Handlebars.compile(opt[0])(data, index);
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
						if(helper == "each" && property[2] == "as"){
							args.splice(1, 3);
							args.push(property[3].split("|")[1]);
							args.push(property[4].split("|")[0])
						}
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
		each : function(data, opt, item, index){
			var ret = "";
			if(Array.isArray(data)){
				for(var i=0; i<data.length; i++){
					if(item){
						var val = data[i];
						data[i] = {};
						data[i][item] = val;
						data[i][index] = i+1;
					}
					ret+=opt.fn(data[i], i+1);
				}				
			}
			else{
				for(var key in data){
					var val  = data[key];
					data[key] = {this : val, "@key" : key};
					ret+=opt.fn(data[key]);
				}
			}
			return ret;
		},
		if : function(data, opt){
			if(data){
				return opt.fn(this);
			}
			return opt.inverse(this);
		}
	},
	getArgs : function(fn){
		var args = fn.toString().match(/function\s.*?\(([^)]*)\)/)[1];
		return args.split(",").map(function(arg){
			return arg.replace(/\/\*.*\*\//, '').trim();
		}).filter(function(arg){
			return arg;
		});
	},
	registerPartial : function(name, html){
		Handlebars.partials[name] = html;
	},
	partials : {}
}