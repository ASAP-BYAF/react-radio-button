import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
} from "@mui/material";

// export type MyDialogProps = {
//   onClose: (value: string) => void
//  title?: string
//  message?: string
// }

// export function MyDialog(props: MyDialogProps) {
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
