globalURL = "http://imlo.insof.uz/";

(function() {
    tinymce.PluginManager.add( 'imlo_class', function( editor, url ) {
        // Add Button to Visual Editor Toolbar
        editor.addButton('imlo_class', {
            title: 'Imloni tekshirish',
            cmd: 'imlo_class',
            image: url + '/icon.png',
        });

        // Add Command when Button Clicked
        editor.addCommand('imlo_class', function() {
			var html = editor.getContent({'format': 'html'});
			var html = html.replace(/<span style="color: #ff0000;">([^<]+)<\/span>/g, "$1");
			editor.setContent(html);
			
            var text = editor.getContent({'format': 'text'});
			
			var text = remModifiers(text);
			var text = autoCorrect(text);
			
			var correctWords = [];
			
			if ( localStorage["myDict"] ) {
				var myDict = JSON.parse( localStorage["myDict"] );
			} else {
				var myDict = [];
			}
			
			var wArray2 = [];
			var wArray = text.split(/[^a-zA-Z\’\‘\'\-]+/g);
			var wArray = wArray.filter(function(x) {
				return x !== undefined && x != null && x != '';
			});
			wArray.forEach(function(el){
				if (wArray2.indexOf(el) == -1 && myDict.indexOf(el) == -1){
					if (el != el.toUpperCase() && el.length < 50) {
						wArray2.push(el);
					}
				}
			});
			
			if(text.length > 0) {
				if(wArray2.length > 0) {
					var text = JSON.stringify(wArray2);
					var apiKey = getApiKey();
					var data = "apikey=" + apiKey + "&text="+text;
					if(apiKey != false){
						//console.log(text);
						jQuery.ajax({
							type: "POST",
							url: globalURL+"api/check",
							data: data,
							cache: false,
							success: function(response){
								//console.log(response);					
								if (response.success) {
									if (response.errors) {
										words = response.words;
										var incorectWords = response.words;
										wArray2.forEach(function(el){
											if (incorectWords.indexOf(el) == -1){
												correctWords.push(el);
											}
										});
										correctWords.forEach(function(el){
											if (myDict.indexOf(el) == -1){
												myDict.push(el);
											}
										});
										localStorage["myDict"] = JSON.
										
										stringify(myDict);
										
										var html = editor.getContent({'format': 'html'});

										words.forEach(function(word){
											var regx = /^(ku|yu|da|ya|chi)$/;
											if (!regx.test(word)) {
												var wrapped = "\(^\|[^a-zA-Z\’\‘\']\)\("+word+"\)\([^a-zA-Z\’\‘\']\|$\)";
												var pat = new RegExp(wrapped, "g");
												html = html.replace(pat, "$1<span style=\"color: #ff0000;\">$2</span>$3");
											}
										});
										
										editor.setContent(html);
									} else {
										wArray2.forEach(function(el){
											if (myDict.indexOf(el) == -1){
												myDict.push(el);
											}
										});
										localStorage["myDict"] = JSON.stringify(myDict);
									}
								}
							},
							error: function(response){
								console.log(response);
							}
						});
					} else {
						console.log('API kalitni topib bo‘lmadi');
					}
				} else {
					console.log('Kiritilgan matnda xatolar topilmadi');
				}
			} else {
				console.log('Iltimos, tekshirish uchun kamida bitta so‘z kiriting');
			}
        });
    });
})();

autoCorrect = function(text){
	var text = text.trim();
	var text = text.replace(/G’|G'|G`/g,"G‘"); 
	var text = text.replace(/g’|g'|g`/g,"g‘");
	var text = text.replace(/O’|O'|O`/g,"O‘"); 
	var text = text.replace(/o’|o'|o`/g,"o‘");
	var text = text.replace(/'|`/g,"’");
	var text = text.replace(/«|"([a-z])/g, '“$1');
	var text = text.replace(/([a-z])"|»/g, '$1”');
	return text;
};

remModifiers = function(text){
	var text = text.replace(/\b[A-Z]+[a-z]+[A-Z]+[a-z]{0,}\b|\b[A-Z]{2,}[a-z]{0,}\b/g,"");
	var text = text.replace(/([aouei]g|[aouei]g‘)\-(a|u)\b/g,"$1г$2");
	var text = text.replace(/\-(a|ku|yu|u|da|ya|chi)\b/g,"");
	var text = text.replace(/\-/g," ");
	var text = text.replace(/г/g,"-");
	var text = text.replace(/([^a-zA-Z\-‘’])u\b/g,"$1");
	var text = text.replace(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/ig, "");
	var text = text.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/ig, "");
	return text;
};

getApiKey = function(){
	if ( localStorage["apiKey"] ) {
		var apiKey = JSON.parse( localStorage["apiKey"] );
	} else {
		jQuery.ajax({
			type: "POST",
			url: globalURL+"api/getapi",
			cache: false,
			assync: false,
			success: function(response){
				//console.log(response);					
				if (response.success) {
					var apiKey = response.apiKey;
					//console.log(apiKey);
					localStorage["apiKey"] = JSON.stringify(apiKey);
				} else {
					var apiKey = false;
				}
			},
			error: function(response){
				var apiKey = false;
			}
		});
	}
	return apiKey;
};
