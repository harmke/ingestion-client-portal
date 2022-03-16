import "styles/FilterBar.css";
import { Icon, IconButton } from "@fluentui/react";

function FilterBar() {
  return (
    <div className="FilterBar">
      <div className="FilterBar__Tag">Filters:</div>
      <IconButton
        className="FilterBar__Icon"
        iconProps={{ iconName: "CirclePlus" }}
        title="Add Filters"
        size={11}
      />
    </div>
  );
}
export default FilterBar;
