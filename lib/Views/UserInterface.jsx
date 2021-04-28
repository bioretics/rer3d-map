import {
  Menu,
  Nav,
  ExperimentalMenu
} from "rer3d-terriajs/lib/ReactViews/StandardUserInterface/customizable/Groups";
import MeasureTool from "rer3d-terriajs/lib/ReactViews/Map/Navigation/MeasureTool";
import MenuItem from "rer3d-terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuItem";
import PropTypes from "prop-types";
import React from "react";
//import RelatedMaps from "./RelatedMaps";
import SplitPoint from "rer3d-terriajs/lib/ReactViews/SplitPoint";
import StandardUserInterface from "rer3d-terriajs/lib/ReactViews/StandardUserInterface/StandardUserInterface.jsx";
import version from "../../version";

import "./global.scss";

function loadAugmentedVirtuality(callback) {
  require.ensure(
    "rer3d-terriajs/lib/ReactViews/Map/Navigation/AugmentedVirtualityTool",
    () => {
      const AugmentedVirtualityTool = require("rer3d-terriajs/lib/ReactViews/Map/Navigation/AugmentedVirtualityTool");
      callback(AugmentedVirtualityTool);
    },
    "AugmentedVirtuality"
  );
}

function isBrowserSupportedAV() {
  return /Android|iPhone|iPad/i.test(navigator.userAgent);
}

export default function UserInterface(props) {
  console.log("rer3d-map v." + require("../../package.json").version);

  return (
    <StandardUserInterface {...props} version={version}>
      {/*<Menu>
        <MenuItem
          caption="About 3D"
          href="https://geoportale.regione.emilia-romagna.it/it/contenuti/geoportale-3d"
          key="about-link"
        />
      </Menu>*/}
      <Nav>
        <MeasureTool
          terria={props.viewState.terria}
          mouseCoords={props.viewState.mouseCoords}
          key="measure-tool"
        />
      </Nav>
      <ExperimentalMenu>
        <If condition={isBrowserSupportedAV()}>
          <SplitPoint
            loadComponent={loadAugmentedVirtuality}
            viewState={props.viewState}
            terria={props.viewState.terria}
            experimentalWarning={true}
          />
        </If>
      </ExperimentalMenu>
    </StandardUserInterface>
  );
}

UserInterface.propTypes = {
  terria: PropTypes.object,
  viewState: PropTypes.object
};
