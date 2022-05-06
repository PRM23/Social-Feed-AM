import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { Button, TextField } from "@material-ui/core";
import { Avatar, Paper } from "@material-ui/core";
import { Checkbox } from "@material-ui/core";
import { FormControlLabel } from "@material-ui/core";
import { GoogleLogin } from "react-google-login";
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha,
} from "react-google-recaptcha-v3";
import { Link, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";

import { IconButton } from "@material-ui/core";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPassword, setShowPsw] = useState(false);
  const [errorMsg, setError] = useState(false);
  const [val, setVal] = useState("");
  const navigate = useNavigate();
  const TEST_SITE_KEY = "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";
  const [snakeBarOpen, setSnakeBarOpen] = React.useState(false);
  let reCaptchaToken = "";
  const recaptchaRef = (value) => {
    reCaptchaToken = value;
  };

  const responseGoogle = async (response) => {
    const url = "http://localhost:5000/am/socialMedia/googleLogin";
    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ token: response.tokenId }),
    };

    const res = await fetch(url, options);
    const data = await res.json();

    if (res.status === 200) {
      navigate("/Feed");
      console.log(data.firstName);
      localStorage.setItem("ID:", JSON.stringify(data._id));
      localStorage.setItem("token:", JSON.stringify(data.jwt_token));
      localStorage.setItem("ProfileDetails", JSON.stringify(data));
      localStorage.setItem("Name", JSON.stringify(data.firstName));
      // localStorage.setItem("_activeUser", JSON.stringify(userDetails));
      console.log(data.response);
    } else {
      setError(true);
      setVal(data.message);
    }
  };
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

  const paperstyle = {
    padding: 20,
    height: "65vh",
    width: 300,
    margin: "20px auto",
  };

  const SubmitHandler = async () => {
    const url = "http://localhost:5000/am/socialMedia/login";

    const userDetails = {
      email: email,
      password: pwd,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    console.log(response);

    if (response.status === 200) {
      navigate("/Feed");
      console.log(data.firstName);
      localStorage.setItem("ID:", data._id);

      localStorage.setItem("token:", data.jwt_token);
      localStorage.setItem("ProfileDetails", JSON.stringify(data));
      localStorage.setItem("Name", JSON.stringify(data.firstName));
      localStorage.setItem("_activeUser", JSON.stringify(userDetails));
      console.log(data.response);
    } else {
      setError(true);
      setVal(data.error.message);
    }
  };
  return (
    <>
      <Grid>
        <div>
          <Snackbar
            open={snakeBarOpen}
            autoHideDuration={6000}
            onClose={handleSnakeBarClose}
            message="Note archived"
            action={action}
          />
        </div>
        <Paper elevation={10} style={paperstyle}>
          <Grid align="center" style={{ padding: 10 }}>
            <h2>Login</h2>
          </Grid>

          <TextField
            label="Email"
            placeholder="Enter Email"
            style={{ margin: 10 }}
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            style={{ margin: 10 }}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            fullWidth
            required
          />

          <FormControlLabel
            control={
              <Checkbox
                name="checkedB"
                color="primary"
                style={{ align: "20px" }}
                onChange={() => setShowPsw((pre) => !pre)}
              ></Checkbox>
            }
            label="Show Password"
          />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            style={{ margin: 10 }}
            fullWidth
            onClick={SubmitHandler}
          >
            Login
          </Button>
          {errorMsg && <p style={{ color: "red" }}>{val}</p>}
          <GoogleLogin
            clientId="106931131045-lbt1lo7ctfq3flp93m08vjuuvehrm47e.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            fullWidth
          />

          <p></p>

          <Link to="/signup">
            <p>Don't have account Create Account</p>
          </Link>
        </Paper>
      </Grid>
    </>
  );
};

export default Login;
