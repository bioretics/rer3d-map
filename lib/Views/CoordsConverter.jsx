import React from 'react';

import MenuPanel from 'terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuPanel.jsx';
import PanelStyles from 'terriajs/lib/ReactViews/Map/Panels/panel.scss';
//import Styles from './related-maps.scss';
import Styles from '../../node_modules/terriajs/lib/ReactViews/Map/Panels/SharePanel/share-panel.scss';
import classNames from 'classnames';

function CoordsConverter(props) {
    
    var epsgList = [
        {code: 4326, text: 'WGS 84'}, 
        {code: 32632, text: 'UTM zone 32N'}, {code: 32633, text: 'UTM zone 33N'}, 
        {code: 4265, text: 'Monte Mario'}, {code: 3003, text: 'Monte Mario / Italy zone 1'}, {code: 3004, text: 'Monte Mario / Italy zone 2'}, {code: 4806, text: 'Monte Mario (Rome)'}, 
        {code: 4230, text: 'ED50'}, {code: 23032, text: 'ED50 / UTM zone 32N'}, {code: 23033, text: 'ED50 / UTM zone 33N'}, 
        {code: 4258, text: 'ETRS89'}, {code: 25832, text: 'ETRS89 / UTM zone 32N'}, {code: 25833, text: 'ETRS89 / UTM zone 33N'} ];
    
    var x, y;
    var sCrs = epsgList[0].code;
    var tCrs = epsgList[0].code;

    const dropdownTheme = {
        inner: Styles.dropdownInner
    };

    var changedX = function(event) {
        x = event.target.value;
    }

    var changedY = function(event) {
        y = event.target.value;
    }

    var changedS = function(event) {
        sCrs = event.target.value;
    }

    var changedT = function(event) {
        tCrs = event.target.value;
    }


    /*var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(testo,"text/xml");

    var x = xmlDoc.getElementsByTagName("AllowedValues")[0];
    var y = x.childNodes;
    var i, j;
    for (i = 0; i <	y.length; i++) {
        //alert(y[i].childNodes[0].nodeValue);
        if (y[i].nodeType == 1) {
            j = y[i].firstChild;
            alert(j.nodeValue);
        }
    }*/


    return (
        <MenuPanel theme={dropdownTheme}
                   btnText="Convertitore di coordinate"
                   smallScreen={props.smallScreen}
                   viewState={props.viewState}
                   btnTitle="Convertitore di coordinate">
            <div className={classNames(PanelStyles.header)}>
                <label className={PanelStyles.heading}>CONVERTITORE DI COORDINATE</label>
            </div>

            <div className={classNames(PanelStyles.section, Styles.section)}>
				<p>
					<label>CRS sorgente</label>
				</p>
				<p>
					<select style={{color: 'gray'}} onChange={changedS} defaultValue={sCrs} >
						{ epsgList.map(function(epsg) { return <option key={epsg.code} value={epsg.code}>{epsg.text}</option>; }) }
					</select>
				</p>
				<p>
					CRS destinazione
				</p>
				<p>
					<select style={{color: 'gray'}} onChange={changedT} defaultValue={tCrs} >
						{ epsgList.map(function(epsg) { return <option key={epsg.code} value={epsg.code}>{epsg.text}</option>; }) }
					</select>
				</p>
			</div>
			<div className={classNames(PanelStyles.section, Styles.section)}>
				<p>
					<label>Coord X</label>
                </p>
                <p>
					<input type="text" style={{color: 'gray'}} onChange={changedX} />
				</p>
				<p>
					<label>Coord Y</label>
                </p>
                <p>
					<input type="text" style={{color: 'gray'}} onChange={changedY} />
				</p>
			</div>
			<div className={classNames(PanelStyles.section, Styles.section)}>
				<p>
					<input style={{color: 'black', width: 200}} type="button" value="Converti" onClick={(event)=>props.loadRes(x, y, sCrs, tCrs, props, event)} />
				</p>
            </div>

            <div style={{border: 'solid gray'}}>
                <label>Coordinate convertite</label>
                <p id="conversionOutput"></p>
            </div>

        </MenuPanel>
    );
}

CoordsConverter.propTypes = {
    viewState: React.PropTypes.object.isRequired,
    smallScreen: React.PropTypes.bool,
    loadRes: React.PropTypes.func,
    terria: React.PropTypes.object
};


 CoordsConverter.defaultProps = {    
    loadRes: (x, y, sourceCrs, targetCrs, props) => {
        var xmlRequest = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
                        <wps:Execute service="WPS" version="1.0.0" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1"
                        xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0
                        http://schemas.opengis.net/wps/1.0.0/wpsExecute_request.xsd">
                        <ows:Identifier>TransformCoordinates</ows:Identifier>
                        <wps:DataInputs>
                            <wps:Input>
                            <ows:Identifier>SourceCRS</ows:Identifier>
                            <wps:Data>
                                <wps:LiteralData>epsg:` + sourceCrs + `</wps:LiteralData>
                            </wps:Data>
                            </wps:Input>
                            <wps:Input>
                            <ows:Identifier>TargetCRS</ows:Identifier>
                            <wps:Data>
                                <wps:LiteralData>epsg:` + targetCrs + `</wps:LiteralData>
                            </wps:Data>
                            </wps:Input>
                            <wps:Input>
                            <ows:Identifier>InputData</ows:Identifier>
                            <wps:Data>
                                <wps:ComplexData>
                                <MultiGeometry srsName="http://www.opengis.net/gml/srs/epsg.xml#4326" xmlns="http://www.opengis.net/gml">
                                    <geometryMember>
                                    <Point>
                                        <coord>
                                        <X>` + x + `</X>
                                        <Y>` + y + `</Y>
                                        </coord>
                                    </Point>
                                    </geometryMember>
                                </MultiGeometry>
                                </wps:ComplexData>
                            </wps:Data>
                            </wps:Input>
                        </wps:DataInputs>
                        <wps:ResponseForm>
                            <wps:RawDataOutput>
                            <ows:Identifier>TransformedData</ows:Identifier>
                            </wps:RawDataOutput>
                        </wps:ResponseForm>
                        </wps:Execute>`;


        var url = "/proxy/http://geoportale.regione.emilia-romagna.it/rer_wcts/services";

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", processRequest, false);
        xhr.open('POST', url, true);

        xhr.setRequestHeader("Content-type", "text/xml");

        xhr.send(xmlRequest);

        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                document.getElementById("conversionOutput").innerHTML = xhr.responseText;
            }
        }
    }
};

export default CoordsConverter;