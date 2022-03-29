import { Icon, SearchBox } from "@fluentui/react";
import { getClassNames } from "./SideBar.classNames";

function SideBar() {
  const classNames = getClassNames();

  return (
    <div className={classNames.root}>
      <div className={classNames.title}>Saved Queries</div>
      <div className={classNames.searchBar}>
        <SearchBox placeholder="Search" disabled />
      </div>
      <div className={classNames.queryTitle}>
        <Icon className={classNames.queryIcon} iconName="CaretSolidDown" /> My
        Queries
      </div>
    </div>
  );
}
export default SideBar;
