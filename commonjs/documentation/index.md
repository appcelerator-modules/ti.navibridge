# ti.navibridge Module

## Description

The NaviBridge module allows developers to send POI (point of interest) locations to the [NaviBridge application](http://www.globaldenso.com/en/products/aftermarket/navibridge/index.html), which can then send the location to a Denso in-dash display unit.

## Getting Started

View the [Using Titanium Modules](http://docs.appcelerator.com/titanium/latest/#!/guide/Using_Titanium_Modules) document for instructions on getting
started with using this module in your application.

## Accessing the Module

Use `require` to access this module from JavaScript:

	var NAVIBRIDGE = require('ti.navibridge');

The NAVIBRIDGE variable is a reference to the Module object.

## Methods

### void setApplicationId(applicationId)

__Note:__ ApplicationId must be set before calling other methods

* applicationId [String]: The Application ID provided by Denso

Developers must [register](https://navicon.denso.co.jp/navicon_download/) for a key ("AppicationId") to authenticate calls to the NaviBridge system.

#### Example

	NAVIBRIDGE.setApplicationId('<< YOUR APPLICATION ID HERE >>');
	
### void setNaviBridgeInstallAppURL(url)

* url [string]: The iTunes/APK URL to the NaviBridge app. 

The user will be taken to this URL if the NaviBridge app is not installed. By default this URL points to the US App Store (iOS) and an APK (android). There is no need to call this function unless you wish point to a different App Store or APK. Simply pass in the url for the  current platform. 

* iOS
	* US (default): [http://itunes.apple.com/us/app/navibridge/id498898448?mt=8](http://itunes.apple.com/us/app/navibridge/id498898448?mt=8)
	* Japan: [http://itunes.apple.com/jp/app/navicon-kanabi-lian-xie/id368186022?mt=8](http://itunes.apple.com/jp/app/navicon-kanabi-lian-xie/id368186022?mt=8) 
	
### void openNavi()

Opens the NaviBridge application on the user device, or installs NaviBridge if necessary.

#### Example

	NAVIBRIDGE.openNavi();
	
### boolean checkInstall()

__Note:__ iOS only

Determines if the NaviBridge application is installed on the user device. It is not necessary to call this method before adding a poi. This method will prompt the user to install NaviBridge if it is not installed.

* returns [boolean]: Returns true if installed and false if not.

#### Example

	NAVIBRIDGE.checkInstall();

### void installNavi()

Prompts the user to install the NaviBridge application on their device. Will prompt the user to install the app even if it is already installed. It is not necessary to call this method before adding a poi. This method will prompt the user to install NaviBridge if it is not installed.

#### Example

	NAVIBRIDGE.installNavi();

### boolean addPOI(poi)

Adds a POI (point of interest) waypoint to the NaviBridge application

* __poi__ [Object]: The POI object (see dictionary definition below)
	* poi.__lat__ [String|Number]: The latitude for the POI (must exist if no 'address')
	* poi.__lon__ [String|Number]: The longitude for the POI (must exist if no 'address')
	* poi.__address__ [String]: The address for the POI (must exist if no 'lat'/'lon')
	* poi.__radiusKM__ [String|Number]: The map zoom radius in KM (has priority over radiusMI) (optional)
	* poi.__radiusMI__ [String|Number]: The map zoom radius in MI (optional)
	* poi.__title__ [String]: The title text for the POI pin within NaviBridge (optional)
	* poi.__tel__ [String|Number]: The telephone number for the POI [0-9+*#] (optional)
	* poi.__text__ [String]: A message to display on the in-dash screen after sending data to NaviBridge (optional)
	* poi.__callbackURL__ [String]: URL to invoke your application to invoke your application/web site from NaviBridge (optional)
 
* returns [boolean]: Returns false on error

 __NOTE:__ All coordinates must be passed to NaviBridge as a decimal. NaviBridge uses the WGS84 datum with the following range limitations:

	-90.0 < lat < 90.0
	-180.0 <= lng <= 180.0

#### Example

	NAVIBRIDGE.addPOI({
		title: 'My POI',
		lat:37.38922, 
		lon:-122.048496,
		text: "POI added successfully",
		callbackURL: "schema://"
	});
	
### boolean addMultiPOI(object)

Adds multiple POI (point of interest) waypoints to the NaviBridge application

 * __object__ [Object]: An object of POIs and meta-data
	* object.__poi__ [Array]: An array of POIs [max. 5] including lat, lon, address, title, & tel (see "addPOI()" method documentation for definitions)
	* object.__text__ [String]: A message to display on the in-dash screen after sending data to NaviBridge (optional)
	* object.__callbackURL__ [String]: URL to invoke your application to invoke your application/web site from NaviBridge (optional)
 
 * returns [boolean]: Returns false on error

#### Example

	NAVIBRIDGE.addPOI({
		poi: [
			{
				lat: x, lon: x, address: x, title: x, tel: x
			},
			{
				lat: x, lon: x, address: x, title: x, tel: x
			},
		],
		text: "POI added successfully",
		callbackURL: "schema://"
	});

## Properties
### NAVIBRIDGE.Enabled [boolean] (read/write)
True by default. Set to false when the user cancels the alert dialog to install NaviBridge. When false, the install NaviBridge dialog will not pop up. Setting this property to true will allow the dialog to be displayed the next time it is triggered. 

#### Example
	// this will cause the install NaviBridge dialog to pop up (if NaviBridge not already installed) even if it has previously been canceled by the user
	NAVIBRIDGE.Enabled = true;
	 
	NAVIBRIDGE.addPOI({
		title:'My POI',
		lat:37.38922, 
		lon:-122.048496
	});

## Usage

See the example applications in the `example` folder of the module.

## Author

Matt Schmulen and Matthew Congrove

## Module History

View the [change log](changelog.html) for this module.

## Feedback and Support

Please direct all questions, feedback, and concerns to [info@appcelerator.com](mailto:info@appcelerator.com?subject=ti.navibridge%20Module).

## License

Copyright(c) 2011-2012 by Appcelerator, Inc. All Rights Reserved. Please see the LICENSE file included in the distribution for further details.
