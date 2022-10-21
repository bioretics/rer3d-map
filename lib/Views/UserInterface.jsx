import PropTypes from "prop-types";
import React from "react";
import RelatedMaps from "terriajs/lib/ReactViews/RelatedMaps/RelatedMaps";
import {
  Nav,
  ExperimentalMenu,
  MenuLeft
} from "terriajs/lib/ReactViews/StandardUserInterface/customizable/Groups";
import MeasureTool from "terriajs/lib/ReactViews/Map/Navigation/Items/MeasureTool";
import MenuItem from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuItem";
import StandardUserInterface from "terriajs/lib/ReactViews/StandardUserInterface/StandardUserInterface";
import version from "../../version";
import "./global.scss";

// function loadAugmentedVirtuality(callback) {
//   require.ensure(
//     "terriajs/lib/ReactViews/Map/Navigation/AugmentedVirtualityTool",
//     () => {
//       const AugmentedVirtualityTool = require("terriajs/lib/ReactViews/Map/Navigation/AugmentedVirtualityTool");
//       callback(AugmentedVirtualityTool);
//     },
//     "AugmentedVirtuality"
//   );
// }

// function isBrowserSupportedAV() {
//   return /Android|iPhone|iPad/i.test(navigator.userAgent);
// }

export default function UserInterface(props) {
  // Print version to console
  console.log("rer3d-map v." + require("../../package.json").version);

  const relatedMaps = props.viewState.terria.configParameters.relatedMaps;

  return (
    <StandardUserInterface {...props} version={version}>
      {/*
      <MenuLeft>
        <MenuItem caption="About" href="about.html" key="about-link" />
        {relatedMaps && relatedMaps.length > 0 ? (
          <RelatedMaps relatedMaps={relatedMaps} />
        ) : null}
      </MenuLeft>
      */}
      <Nav>
        <MeasureTool
          terria={props.viewState.terria}
          mouseCoords={props.viewState.mouseCoords}
          key="measure-tool"
        />
      </Nav>
      <ExperimentalMenu>
        {/* <If condition={isBrowserSupportedAV()}>
          <SplitPoint
            loadComponent={loadAugmentedVirtuality}
            viewState={props.viewState}
            terria={props.viewState.terria}
            experimentalWarning={true}
          />
        </If> */}
      </ExperimentalMenu>
    </StandardUserInterface>
  );
}

UserInterface.propTypes = {
  terria: PropTypes.object,
  viewState: PropTypes.object
};
