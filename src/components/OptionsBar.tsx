import { Dropdown, IconButton, IDropdownOption } from "@fluentui/react";
import "styles/OptionsBar.css";

function OptionsBar() {
  const options: IDropdownOption[] = [
    { key: "50", text: "50" },
    { key: "100", text: "100" },
  ];
  return (
    <div className="OptionsBar">
      <div className="OptionsBar__Tag">Date Range:</div>
      <div className="OptionsBar__Text">Last 30 Days</div>
      <div className="OptionsBar__Tag">Max Records:</div>

      <Dropdown defaultSelectedKey={"50"} options={options} />
    </div>
  );
}
export default OptionsBar;
