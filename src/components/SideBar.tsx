import { Icon, SearchBox } from "@fluentui/react";
import "styles/SideBar.css";

function SideBar() {
  return (
    <div className="SideBar">
      <div className="SideBar__Title">Saved Queries</div>
      <div className="SideBar__SearchBar">
        <SearchBox placeholder="Search" disabled />
      </div>
      <div className="SideBar__QueryTitle">
        <Icon className="SideBar__QueryIcon" iconName="CaretSolidDown" /> My
        Queries
      </div>
    </div>
  );
}
export default SideBar;
