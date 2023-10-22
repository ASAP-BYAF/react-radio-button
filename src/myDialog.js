import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
} from "@mui/material";

export function MyDialog(props) {
  const { onClose, title, message } = props;

  return (
    <Dialog open onClose={() => onClose("close")}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose("ok")}>OK</Button>
        <Button onClick={() => onClose("cancel")} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
