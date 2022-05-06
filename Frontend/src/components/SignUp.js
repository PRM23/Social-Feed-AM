import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { Button, TextField } from "@material-ui/core";
import { Avatar, Paper } from "@material-ui/core";
import { Checkbox } from "@material-ui/core";
import { FormControlLabel } from "@material-ui/core";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [valid, setValid] = useState("");
  const [errorMsg, setError] = useState(false);
  const [val, setVal] = useState("");
  const navigate = useNavigate();
  const paperstyle = {
    padding: 20,
    height: "70vh",
    width: 285,
    margin: "20px auto",
  };
  const SubmitHandler = async () => {
    const url = "http://localhost:5000/am/socialMedia/register";
    const userDetails = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: pwd,
    };
    console.log(userDetails);

    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    if (response.status === 200) {
      console.log(response);
    
      navigate("/login");
    } else {
      setError(true);
      setVal(data.error.message);
      console.log(data.error.message);
    }
  };
  console.log(val);

  return (
    <>
      <Grid>
        <Paper elevation={10} style={paperstyle}>
          <Grid align="center" style={{ padding: 10 }}>
            <h2>Sign Up</h2>
          </Grid>

          <TextField
            label="First Name"
            placeholder="Enter First Name"
            style={{ margin: 10 }}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Last Name"
            placeholder="Enter Last Name"
            style={{ margin: 10 }}
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            placeholder="Enter Valid Email"
            style={{ margin: 10 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            placeholder="Enter Password"
            style={{ margin: 10 }}
            fullWidth
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />
          {errorMsg && <p style={{ color: "red" }}>{val}</p>}
          <Button
            type="submit"
            color="primary"
            variant="contained"
            style={{ margin: 5 }}
            fullWidth
            onClick={SubmitHandler}
          >
            Register
          </Button>
        </Paper>
      </Grid>
    </>
  );
};

export default SignUp;
