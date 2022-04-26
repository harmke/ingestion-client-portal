import { Label, PrimaryButton, TextField } from "@fluentui/react";
import { useCallback, useState } from "react";
import { getClassNames } from "./ConnectionStringBar.classNames";

interface ConnectionStringBarProps {
  blobServiceSas: string;
  onConnect: (blobServiceSas: string) => void;
}

function ConnectionStringBar({
  blobServiceSas,
  onConnect,
}: ConnectionStringBarProps) {
  const classNames = getClassNames();
  const [sasValue, setSasValue] = useState<string>("");

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
    <div className={classNames.root}>
      <Label className={classNames.label}>SAS Connection String: </Label>
      <TextField
        className={classNames.textField}
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
