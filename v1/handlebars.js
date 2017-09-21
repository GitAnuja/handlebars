var Handlebars = {
	compile : function(source){
		return (function(data){
			var ret = "";
			var index = source.indexOf("{{"), close = -2;
			while(index > -1){
				ret += source.substring(close+2, index);
				close = source.indexOf("}}", index)
				var property = source.substring(index+2, close);
				property = property.split("/").join(".");
				property = property.split(".");
				var val = data;
				for(var i=0; i<property.length; i++){
					val = val[property[i]];
				}
				ret+=val;
				index = source.indexOf("{{", close);
			}
			ret+=source.substring(close+2);
			return ret;
		})
	}
}