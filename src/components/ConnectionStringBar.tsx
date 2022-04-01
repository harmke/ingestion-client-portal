import {
  ITextFieldStyles,
  Label,
  PrimaryButton,
  Text,
  TextField,
} from "@fluentui/react";
import { useCallback, useState } from "react";
import "styles/ConnectionStringBar.css";

interface ConnectionStringBarProps {
  blobServiceSas: string;
  onConnect: (blobServiceSas: string) => void;
}

function ConnectionStringBar({
  blobServiceSas,
  onConnect,
}: ConnectionStringBarProps) {
  const [sasValue, setSasValue] = useState<string>("");

  const textFieldStyles: Partial<ITextFieldStyles> = {
    // fieldGroup: { width: 300 },
  };

  const handleTextFieldChange = useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setSasValue(newValue || "");
    },
    []
  );
  return (
    <div className="ConnectionStringBar">
      <Label className="ConnectionStringBar__Label">
        SAS Connection String:{" "}
      </Label>
      <TextField
        className="ConnectionStringBar__TextField"
        styles={textFieldStyles}
        value={sasValue}
        placeholder={blobServiceSas}
        onChange={handleTextFieldChange}
      />
      <PrimaryButton
        text="Connect"
        onClick={() => {
          onConnect(sasValue || blobServiceSas);
        }}
      />
    </div>
  );
}
export default ConnectionStringBar;
