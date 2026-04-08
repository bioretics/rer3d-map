import PropTypes from "prop-types";
import React from "react";
import RelatedMaps from "terriajs/lib/ReactViews/RelatedMaps/RelatedMaps";
import PositionRightOfWorkbench from "terriajs/lib/ReactViews/Workbench/PositionRightOfWorkbench";
import {
  ExperimentalMenu,
  MenuLeft
} from "terriajs/lib/ReactViews/StandardUserInterface/customizable/Groups";
import MenuItem from "terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuItem";
import StandardUserInterface from "terriajs/lib/ReactViews/StandardUserInterface/StandardUserInterface";
import version from "../../version";
import "./global.scss";
import Styles from "./UserInterfaceMenuLeft.scss";

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
  const relatedMaps = props.viewState.terria.configParameters.relatedMaps;
  const aboutButtonHrefUrl =
    props.viewState.terria.configParameters.aboutButtonHrefUrl;
  const hasMenuLeftContent =
    aboutButtonHrefUrl || (relatedMaps && relatedMaps.length > 0);
  const menuLeftPositionClassName = `${Styles.menuLeftPosition} ${
    props.viewState.isMapFullScreen ? Styles.isMapFullScreen : ""
  }`;

  return (
    <StandardUserInterface {...props} version={version}>
      <MenuLeft>
        {hasMenuLeftContent ? (
          <PositionRightOfWorkbench
            viewState={props.viewState}
            className={menuLeftPositionClassName}
          >
            {aboutButtonHrefUrl ? (
              <div className={Styles.menuLeftItem}>
                <MenuItem
                  caption="About"
                  href={aboutButtonHrefUrl}
                  key="about-link"
                />
              </div>
            ) : null}
            {relatedMaps && relatedMaps.length > 0 ? (
              <div className={Styles.menuLeftItem}>
                <RelatedMaps relatedMaps={relatedMaps} />
              </div>
            ) : null}
          </PositionRightOfWorkbench>
        ) : null}
      </MenuLeft>
      <ExperimentalMenu>
        {/* {isBrowserSupportedAV() && (
          <SplitPoint
            loadComponent={loadAugmentedVirtuality}
            viewState={props.viewState}
            terria={props.viewState.terria}
            experimentalWarning={true}
          />
        )} */}
      </ExperimentalMenu>
    </StandardUserInterface>
  );
}

UserInterface.propTypes = {
  terria: PropTypes.object,
  viewState: PropTypes.object
};
