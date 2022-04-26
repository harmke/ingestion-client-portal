import { IconButton, Label } from "@fluentui/react";
import { getClassNames } from "./FilterBar.classNames";

function FilterBar() {
  const classNames = getClassNames();
  return (
    <div className={classNames.root}>
      <Label>Filters: </Label>
      <IconButton
        className={classNames.icon}
        iconProps={{ iconName: "CirclePlus" }}
        title="Add Filters"
        size={10}
      />
    </div>
  );
}
export default FilterBar;
