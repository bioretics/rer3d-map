Geoportale3D change log
=======================

### 1.4.0 - 25/01/2018
* Updated to TerriaMap of 10/11/2017 and terriajs v. 5.5.4.
* Added to SharePanel new features: save screenshot to file on local disk; save/load map config from/to file on local disk.
* Enabled coordinate conversion panel with new features: goto coordinates; grab coordinates from last picked point.
* Some words and sentences translated to italian language.
* Some minor layout and style changes.


### 1.3.0 - 29/11/2017
* Fixed packages versions.
* Fixed a accessibility issues (link in "Condividi" panel).
* Disabled rerAddressNormService and reenabled BingAddressNormService due to bugs in RER soap webservice.
* Temporarily disabled coordinate conversion panel waiting for some improvements.
* Disabled the elevation error quota.
* RER url are no longer proxied becouse they are no longer CORS.
* Changed "About 3D" link.
* Translated some sentences left in English.
* The popup with navigation info isn't show every time the Geoportale3D page is open but when user click on "Come navigare" button.
* Changed the basemap (now many maps can be merged).


### 1.2.0 - 29/12/2016
* Fixed accessibility issues (color contrast, alt, ...).
* Enabled keyboard map navigation.
* Added start message with info about navigation ways.


### 1.1.0 - 07/12/2016
* Fixed coordinate conversion panel.
* Changed address search to use Norm_Indirizzo call instead of Norm_Indirizzo_Unico that is bugged.
* Renamed "Geoportale" button to "About 3D".
* Added disclaimer with information about map navitagion.
* Translated other texts to italian.
* Fixed icon of a base map.


### 1.0.0 - 14/10/2016
* Updated to [TerriaMap](https://github.com/TerriaJS/TerriaMap) unreleased 2016-10-14 version.
* Updated to [TerriaJS](https://github.com/TerriaJS/terriajs) 4.5.0 version.
* Added a coordinate conversion panel that use RER conversion REST service.
* Added rerAddressNormService to use safely the soap library.
* Translated to italian the TerriaMap and TerriaJS interfaces and messages.
* Changed Base Maps that now are: 7 from RER wms, Bing Aerial with Labels, OpenStreetMap Positron.
* Removed Related Maps and About panels.
* Added a link to the site http://geoportale.regione.emilia-romagna.it
* Updated favicons, logo and title.
* Prepared configuration file .json for 5 maps.
* Updated config.json and devserverconfig.json
* Now TerriaJS and TerriaMap are linked with [npmgitdev] (https://github.com/TerriaJS/npmgitdev) that need libstdc++.so.6.0.20.


