import React from 'react';

import version from '../../version';

import StandardUserInterface from 'terriajs/lib/ReactViews/StandardUserInterface/StandardUserInterface.jsx';
import MenuItem from 'terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuItem';
import RelatedMaps from './RelatedMaps';
import { Menu, ExperimentalMenu } from 'terriajs/lib/ReactViews/StandardUserInterface/customizable/Groups';
import SplitPoint from 'terriajs/lib/ReactViews/SplitPoint';

import './global.scss';

function loadAugmentedVirtuality(callback) {
    require.ensure('terriajs/lib/ReactViews/Map/Navigation/AugmentedVirtualityTool', () => {
        const AugmentedVirtualityTool = require('terriajs/lib/ReactViews/Map/Navigation/AugmentedVirtualityTool');
        callback(AugmentedVirtualityTool);
    }, 'AugmentedVirtuality');
}

function isBrowserSupportedAV() {
    return /Android|iPhone|iPad/i.test(navigator.userAgent);
}

export default function UserInterface(props) {
    return (
        <StandardUserInterface {... props} version={version}>
            <Menu>
				{/*<RelatedMaps viewState={props.viewState} />*/}
                {/*<CoordsConverter viewState={props.viewState} terria={props.terria} />*/}
                <MenuItem caption="About 3D" href="https://geoportale.regione.emilia-romagna.it/it/contenuti/geoportale-3d" key="about-link"/>
            </Menu>
            <ExperimentalMenu>
                <If condition={isBrowserSupportedAV()}>
                    <SplitPoint loadComponent={loadAugmentedVirtuality} viewState={props.viewState} terria={props.viewState.terria} experimentalWarning={true}/>
                </If>
            </ExperimentalMenu>
        </StandardUserInterface>
    );
}
