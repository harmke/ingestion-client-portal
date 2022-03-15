import { IconButton, Persona } from "@fluentui/react";
import "styles/NavBar.css";
import logo from "IAP_logo_69x48.png";

function NavBar() {
  return (
    <div className="NavBar">
      <div className="NavBar__Left">
        <img className="NavBar__Logo" src={logo} alt="IAP logo" />
        <div className="NavBar__Title">Ingestion Client Portal</div>
        <div className="NavBar__TabName">Home</div>
        <div className="NavBar__TabName">Query</div>
        <div className="NavBar__TabName">Designer</div>
        <div className="NavBar__TabName">Admin</div>
      </div>
      <div className="NavBar__Right">
        <IconButton
          className="NavBar__Icon"
          data-event-id="Refresh IAP data"
          iconProps={{ iconName: "Refresh" }}
          ariaLabel={"Refresh IAP data"}
          title="Refresh IAP data"
        />
        <IconButton
          className="NavBar__Icon"
          data-event-id="Open Notifications Panel"
          iconProps={{ iconName: "Ringer" }}
          ariaLabel={"Notifications"}
          title="Open Notifications Panel"
        />
        <IconButton
          className="NavBar__Icon"
          data-event-id="Open Page Help Panel"
          iconProps={{ iconName: "Help" }}
          title="Open Page Help Panel"
        />
        <Persona
          id="profileMenuParent"
          className={"headerRightPersona"}
          data-event-id="Check user details or switch security groups"
          size={11}
          styles={{
            root: {
              selectors: { ":hover": { cursor: "pointer" } },
            },
          }}
          hidePersonaDetails={true}
          title="Check user details or switch security groups"
          tabIndex={0}
          role="button"
        />
      </div>
    </div>
  );
}
export default NavBar;
