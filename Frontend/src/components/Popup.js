import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";

import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Button, TextField } from "@material-ui/core";
import Snackbar from "@mui/material/Snackbar";

import { IconButton, Grid } from "@material-ui/core";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { DialogTitle } from "@mui/material";

function ChangePassword() {
  const [op, setOp] = useState(true);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [errMsg, setErrMsg] = useState(false);
  const [val, setVal] = useState("");
  const token = localStorage.getItem("token:");
  const navigate = useNavigate();
  const [snakeBarOpen, setSnakeBarOpen] = React.useState(false);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const handleSnakeBarClick = () => {
    setSnakeBarOpen(true);
  };

  const handleSnakeBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnakeBarOpen(false);
  };
  const getCancel = () => {
    setOp(false);
    navigate("/Feed");
  };

  const getSubmit = async () => {
    const url = `http://localhost:5000/am/socialMedia/editPassword/${localStorage.getItem(
      "ID:"
    )}`;

    const payload = {
      _id: localStorage.getItem("ID:"),
      currentPassword: oldPwd,
      newPassword: newPwd,
      confirmPassword: confirmPwd,
    };

    const options = {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    };
    const res = await fetch(url, options);
    if (res.status === 200) {
      setErrMsg(false);
      handleSnakeBarClick();
      setTimeout(() => {
        navigate("/Feed");
      }, 2000);
    } else {
      const data = await res.json();
      setErrMsg(true);
      setVal(data.message);
    }
    console.log(await res.json());
  };
  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleSnakeBarClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={setSnakeBarOpen}
      ></IconButton>
    </React.Fragment>
  );

  return (
    <>
      <Grid>
        <Dialog title="Dialog" open={op}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              type="password"
              value={oldPwd}
              onChange={(e) => setOldPwd(e.target.value)}
              label="old password"
              fullWidth
            />
            <TextField
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              label="new password"
              fullWidth
            />
            <TextField
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              label="confirm password"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={getCancel}>
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              form="myform"
              onClick={getSubmit}
            >
              Submit
            </Button>
          </DialogActions>
          {errMsg && <h5 style={{ margin: "10px", color: "red" }}>{val}</h5>}
        </Dialog>
        <div>
          <Snackbar
            open={snakeBarOpen}
            autoHideDuration={6000}
            onClose={handleSnakeBarClose}
            action={action}
          >
            <Alert
              onClose={handleSnakeBarClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              Password Changed Successfully!
            </Alert>
          </Snackbar>
        </div>
      </Grid>
    </>
  );
}
export default ChangePassword;
