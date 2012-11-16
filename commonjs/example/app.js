var NAVIBRIDGE = require('ti.navibridge');

// ApplicationId must be set before adding POIs NaviBridge
// See the documentation for how to get an AppicationId
// NAVIBRIDGE.setApplicationId('<< YOUR APPLICATION ID HERE >>');

var win = Ti.UI.createWindow({ title:"navibridge" });

var openButton = Ti.UI.createButton({ top:5, title:'Open NaviBridge', height:40, width:200 });
var installButton = Ti.UI.createButton({ top:50, title:'Install NaviBridge', height:40, width:200 });
var insertPOIButton = Ti.UI.createButton({ top:95, title:'Insert POI', height:40, width:200 });

openButton.addEventListener('click', function(){ 
	NAVIBRIDGE.openNavi(); 
});
installButton.addEventListener('click', function(){ 
	NAVIBRIDGE.installNavi();  
});
insertPOIButton.addEventListener('click', function(){ 
	NAVIBRIDGE.addPOI({
		title:'My POI',
		lat:37.38922, 
		lon:-122.048496
	});  
});

win.add( openButton );
win.add( installButton );
win.add( insertPOIButton );

win.open();