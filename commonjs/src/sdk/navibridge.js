/**
 * The NaviBridge module allows developers to send POI (point of interest) locations to the NaviBridge application, which can then send
 * the location to a Denso in-dash display unit.
 *
 * Developers must register for a key ("Application ID") to authenticate calls to the NaviBridge system:
 *			Register/Docs: https://navicon.denso.co.jp/navicon_download/
 *			User Manual: http://www.globaldenso.com/en/products/aftermarket/navibridge/index.html
 *			Japan iOS Application: http://itunes.apple.com/jp/app/navicon-kanabi-lian-xie/id368186022?mt=8
 *			UA iOS Application: http://itunes.apple.com/us/app/navibridge/id498898448?mt=8
 *			Test Application Id: ICiAV4Ay
 *
 * All coordinates must be passed to NaviBridge as a decimal. NaviBridge uses the WGS84 datum with the following range limitations:
 *		-90.0 < lat < 90.0
 *		-180.0 <= lng <= 180.0
 */

var NAVIBRIDGE = (function() {
	var LCAT = "NavibridgeModule"
	Ti.API.trace(LCAT + " NAVIBRIDGE module initiated");

	/** Do not modify these values */
	var API = {
		Version: "1.4",
		Enabled: true,
		URLBase: "navicon://",
		Install: {
			iOS: "http://itunes.apple.com/us/app/navibridge/id498898448?mt=8",
			Android: "http://appcappstore.s3.amazonaws.com/navibridge/NaviBridge_Appcelerator_test_v3.3f.apk"
		},
		ApplicationId: null,
		Platform: Ti.Platform.osname === "iphone" || Ti.Platform.osname ==="ipad" ? "ios" : Ti.Platform.osname == "android" ? "android" : "mobileweb"
	};

	/**
	 * Sets the Denso-approved Application ID to authenticate NaviBridge calls
	 * @param {String} _id The Application ID provided by Denso
	 */
	API.setApplicationId = function(_id) {
		Ti.API.trace(LCAT + " NAVIBRIDGE.setApplicationId()");

		if(isDefined(_id)) {
			API.ApplicationId = _id;
		} else {
			Ti.API.error(LCAT + " You must pass a valid ID to setApplicationId()");
		}
	};

	/**
	 * Legacy support
	 * @deprecated
	 */
	API.SetApplicationID = function(_id) {
		Ti.API.info(LCAT + " NAVIBRIDGE.SetApplicationID() is deprecated; use NAVIBRIDGE.setApplicationId()");

		API.setApplicationId(_id);
	};
	
	/**
	 * Sets the iTunes/APK URL to the NaviBridge app
	 * @param {String} _url The iTunes/APK URL to the NaviBridge app
	 */
	API.setNaviBridgeInstallAppURL = function(_url) {
		Ti.API.trace(LCAT + " NAVIBRIDGE.setNaviBridgeInstallAppURL()");

		if(isDefined(_url)) {
			switch(API.Platform) {
				case "ios":
					API.Install.iOS = _url;
					break;
				case "android":
					API.Install.Android = _url;
					break;
				case "mobileweb":
					Ti.API.error(LCAT + " NaviBridge not available for mobile web");
					break;
				default:
					Ti.API.error(LCAT + " NaviBridge is not supported on this platform " + API.Platform);
					break;
			}
		} else {
			Ti.API.error(LCAT + " You must pass a valid URL to setNaviBridgeIOSURL()");
		}
	};

	/**
	 * Opens the NaviBridge application on the user device, or installs NaviBridge if necessary
	 */
	API.openNavi = function() {
		Ti.API.trace(LCAT + " NAVIBRIDGE.openNavi()");

		if(API.checkInstall()) {
			Ti.Platform.openURL(API.URLBase);
		} else {
			Ti.API.error(LCAT + " NaviBridge is not installed");

			API.installNavi();
		}
	};

	/**
	 * Determines if the NaviBridge application is installed on the user device
	 */
	API.checkInstall = function() {
		Ti.API.trace(LCAT + " NAVIBRIDGE.checkInstall()");

		if(Ti.Platform.canOpenURL(API.URLBase)) {
			return true;
		} else {
			return false;
		}
	};

	/**
	 * Promps the user to install the NaviBridge application on their device
	 */
	API.installNavi = function() {
		Ti.API.trace(LCAT + " NAVIBRIDGE.installNavi()");
		
		if(API.Enabled) {
			if(!API.checkInstall()) {
				var alertDialog = Ti.UI.createAlertDialog({
					title: "NaviBridge Not Installed",
					message: "This action requires you install the NaviBridge application",
					buttonNames: [ "OK", "Cancel" ],
					cancel: 1
				});
	
				alertDialog.addEventListener("click", function(_event) {
					if(_event.index === 0) {
						var installURL;
	
						switch(API.Platform) {
							case "ios":
								installURL = API.Install.iOS;
								break;
							case "android":
								installURL = API.Install.Android;
								break;
							case "mobileweb":
								Ti.API.error(LCAT + " NaviBridge not available for mobile web");
								return;
								break;
							default:
								Ti.API.error(LCAT + " NaviBridge is not supported on this platform " + API.Platform);
								break;
						}
	
						Ti.API.info(LCAT + " Installing NaviBridge application");
	
						Ti.Platform.openURL(installURL);
					} else {
						Ti.API.info(LCAT + " User aborted NaviBridge installation");
						
						API.Enabled = false;
					}
				});
	
				alertDialog.show();
			} else {
				Ti.API.info(LCAT + " NaviBridge is already installed");
			}
		} else {
			Ti.API.info(LCAT + " User already declined NaviBridge install");
		}
	};

	/**
	 * Adds a POI (point of interest) waypoint to the NaviBridge application
	 * @param {Object} _poi The POI object (see dictionary definition below)
	 * @param {String|Number} _poi.lat The latitude for the POI (must exist if no 'address')
	 * @param {String|Number} _poi.lon The longitude for the POI (must exist if no 'address')
	 * @param {String} _poi.address The address for the POI (must exist if no 'lat'/'lon')
	 * @param {String|Number} _poi.radiusKM The map zoom radius in KM (has priority over radiusMI) (optional)
	 * @param {String|Number} _poi.radiusMI The map zoom radius in MI (optional)
	 * @param {String} _poi.title The title text for the POI pin within NaviBridge (optional)
	 * @param {String|Number} _poi.tel The telephone number for the POI [0-9+*#](optional)
	 * @param {String} _poi.text A message to display on the in-dash screen after sending data to NaviBridge (optional)
	 * @param {Function} _poi.callbackURL The URL to invoke your applicatio to invoke your application/web site from NaviBridge (optional)
	 * @return {Bool} Returns false on error
	 */
	API.addPOI = function(_poi) {
		Ti.API.trace(LCAT + " NAVIBRIDGE.addPOI()");

		if(!API.ApplicationId)  {
			Ti.API.error(LCAT + " ApplicationId must be set before adding POIs NaviBridge");
			
			return false;
		}

		if(API.checkInstall()) {
			if(typeof _poi === "object" && _poi !== null) {
				if((!isDefined(_poi.lat) || !isDefined(_poi.lon)) && !isDefined(_poi.addr)) {
					Ti.API.error(LCAT + " POI object must have 'lat' and 'lon' properties, or 'addr' property");

					return false;
				} else {
					var appURL = API.URLBase + "setPOI?ver=" + API.Version;

					if(isDefined(_poi.lat) && isDefined(_poi.lon)) {
						appURL += appendURL("ll", _poi.lat + "," + _poi.lon);
					}

					appURL += appendURL("addr", _poi.address);
					appURL += appendURL("appName", API.ApplicationId);
					appURL += appendURL("title", _poi.title);
					appURL += appendURL("radKM", _poi.radiusKM);
					appURL += appendURL("radML", _poi.radiusMI);
					appURL += appendURL("tel", _poi.tel);
					appURL += appendURL("text", _poi.text);
					appURL += appendURL("callURL", _poi.callbackURL);

					Ti.API.info(LCAT + " " + appURL);

					Ti.Platform.openURL(appURL);
				}
			} else {
				Ti.API.error(LCAT + " Incorrect POI data type given (or null)");

				return false;
			}
		} else {
			Ti.API.error(LCAT + " NaviBridge is not installed");

			API.installNavi();

			return false;
		}
	};

	/**
	 * Adds multiple POI (point of interest) waypoints to the NaviBridge application
	 * @param {Object} _object An object of POIs and meta-data
	 * @param {Array} _object.poi An array of POIs [max. 5] including lat, lon, address, title, & tel (see "addPOI()" method documentation for definitions)
	 * @param {String} _object.text A message to display on the in-dash screen after sending data to NaviBridge (optional)
	 * @param {Function} _poi.callbackURL The URL to invoke your applicatio to invoke your application/web site from NaviBridge (optional)
	 * @return {Bool} Returns false on error
	 * @example
	 * 	{
	 * 		poi: [
	 * 			{
	 * 				lat: x, lon: x, address: x, title: x, tel: x
	 * 			},
	 * 			{
	 * 				lat: x, lon: x, address: x, title: x, tel: x
	 * 			},
	 * 		],
	 * 		text: "POI added successfully",
	 * 		callbackURL: "schema://"
	 * 	}
	 */
	API.addMultiPOI = function(_object) {
		Ti.API.trace(LCAT + " NAVIBRIDGE.addMultiPOI()");

		if(!API.ApplicationId)  {
			Ti.API.error(LCAT + " ApplicationId must be set before adding POIs NaviBridge");
			
			return false;
		}

		if(API.checkInstall()) {
			if(typeof _object === "object" && _object !== null) {
				if(isDefined(_object.poi)) {
					if(_object.poi.length > 5) {
						Ti.API.info(LCAT + " Too many POI items provided; limiting to 5");
					}

					var length = _object.poi.length > 5 ? 5 : _object.poi.length;

					var appURL = API.URLBase + "setMultiPOI?ver=" + API.Version;

					appURL += appendURL("appName", API.ApplicationId);

					var poi;
					for(var i = 0; i < length; i++) {
						poi = _object.poi[i];

						if(isDefined(poi.lat) && isDefined(poi.lon)) {
							appURL += appendURL("ll" + (i + 1), poi.lat + "," + poi.lon);
						}

						appURL += appendURL("addr" + (i + 1), poi.address);
						appURL += appendURL("title" + (i + 1), poi.title);
						appURL += appendURL("tel" + (i + 1), poi.tel);
					}


					appURL += appendURL("text", _object.text);
					appURL += appendURL("callURL", _object.callbackURL);

					Ti.API.info(LCAT + " " + appURL);

					Ti.Platform.openURL(appURL);
				} else {
					Ti.API.error(LCAT + " No POIs found");

					return false;
				}
			} else {
				Ti.API.error(LCAT + " Incorrect POI data type given (or null)");

				return false;
			}
		} else {
			Ti.API.error(LCAT + " NaviBridge is not installed");

			API.installNavi();

			return false;
		}
	};

	/**
	 * Appends a value to a URL string
	 * @param {String} _key The key for the item
	 * @param {String} _value The value for the item
	 */
	var appendURL = function(_key, _value) {
		if(isDefined(_value)) {
			return "&" + _key + "=" + _value;
		} else {
			return "";
		}
	};

	/**
	 * Verifies a value is defined and is not null
	 * @param _value The value to check
	 */
	var isDefined = function(_value) {
		if(typeof _value !== "undefined" && _value !== null) {
			return true;
		} else {
			return false;
		}
	};

	return API;
})();

module.exports = NAVIBRIDGE;