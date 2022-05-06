import Snackbar from "@mui/material/Snackbar";
import { Button } from "@material-ui/core";
import React from "react";
import { IconButton } from "@material-ui/core";

function SnakeBar() {
  const [snakeBarOpen, setSnakeBarOpen] = React.useState(false);

  const handleSnakeBarClick = () => {
    setSnakeBarOpen(true);
  };

  const handleSnakeBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnakeBarOpen(false);
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
    <div>
      <Button onClick={handleSnakeBarClick}>Open simple snackbar</Button>
      <Snackbar
        open={snakeBarOpen}
        autoHideDuration={6000}
        onClose={handleSnakeBarClose}
        message="Note archived"
        action={action}
      />
    </div>
  );
}

export default SnakeBar;
