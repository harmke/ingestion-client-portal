import { IconButton, Persona } from "@fluentui/react";
import logo from "assets/IAP_logo_69x48.png";
import { getClassNames } from "./NavBar.classNames";

function NavBar() {
  const classNames = getClassNames();
  return (
    <div className={classNames.root}>
      <div className={classNames.left}>
        <img className={classNames.logo} src={logo} alt="IAP logo" />
        <div className={classNames.title}>Ingestion Client Portal</div>
        <div className={classNames.tabName}>Home</div>
        <div className={classNames.tabName}>Query</div>
        <div className={classNames.tabName}>Designer</div>
        <div className={classNames.tabName}>Admin</div>
      </div>
      <div className={classNames.right}>
        <IconButton
          className={classNames.icon}
          data-event-id="Refresh IAP data"
          iconProps={{ iconName: "Refresh" }}
          ariaLabel={"Refresh IAP data"}
          title="Refresh IAP data"
        />
        <IconButton
          className={classNames.icon}
          data-event-id="Open Notifications Panel"
          iconProps={{ iconName: "Ringer" }}
          ariaLabel={"Notifications"}
          title="Open Notifications Panel"
        />
        <IconButton
          className={classNames.icon}
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
