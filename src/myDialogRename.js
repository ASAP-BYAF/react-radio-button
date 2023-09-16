import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
} from "@mui/material";
import { useState } from "react";

// export type MyDialogProps = {
//   onClose: (value: string) => void
//  title?: string
//  message?: string
// }

// export function MyDialog(props: MyDialogProps) {
export function MyDialogRename(props) {
  const { onClose, title, message } = props;
  const [filterText, setFilterText] = useState("");

  const handleInputChange = (event) => {
    const newText = event.target.value;
    setFilterText(newText);
  };

  return (
    <Dialog open onClose={() => onClose("close")}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <input
          type="text"
          placeholder="絞り込む文字を入力"
          onChange={handleInputChange}
        />
        <Button onClick={() => onClose(filterText)}>確定</Button>
        <Button onClick={() => onClose("cancel")} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
