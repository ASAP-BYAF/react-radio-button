import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
} from "@mui/material";
import { useState } from "react";

export function MyDialogRename(props) {
  const { onClose, title, message, oldText } = props;
  const [filterText, setFilterText] = useState(oldText);

  const handleInputChange = (event) => {
    const newText = event.target.value;
    setFilterText(newText);
  };

  return (
    <Dialog open onClose={() => onClose("cancel")}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <input
          type="text"
          placeholder="絞り込む文字を入力"
          value={filterText}
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
