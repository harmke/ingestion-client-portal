import { Dropdown, IDropdownOption, Label, Text } from "@fluentui/react";
import { getClassNames } from "./OptionsBar.classNames";

function OptionsBar() {
  const classNames = getClassNames();
  const options: IDropdownOption[] = [
    { key: "50", text: "50" },
    { key: "100", text: "100" },
  ];
  return (
    <div className={classNames.root}>
      <Label className={classNames.tag}>Date Range:</Label>
      <Text className={classNames.tag}>Last 30 Days</Text>
      <Label className={classNames.tag}>Max Records:</Label>

      <Dropdown defaultSelectedKey={"50"} options={options} />
    </div>
  );
}
export default OptionsBar;
