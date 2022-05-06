import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Button, TextField } from "@material-ui/core";
function CreatePost({ op }) {
  return (
    <>
      <Dialog title="Dialog" open={op}>
        <DialogContent>
          <TextField name="upload-photo" type="file" label="Upload image" />

          <TextField type="text" label="Add Caption" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button variant="contained">Cancel</Button>
          <Button variant="contained" type="submit" form="myform">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default CreatePost;
