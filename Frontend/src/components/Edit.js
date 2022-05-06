import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import { Button, TextareaAutosize, TextField } from "@material-ui/core";
import { Avatar, Paper } from "@material-ui/core";
import { Checkbox } from "@material-ui/core";
import MuiPhoneNumber from "material-ui-phone-number";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Snackbar from "@mui/material/Snackbar";
import { IconButton } from "@material-ui/core";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

import MuiAlert from "@mui/material/Alert";
import {
  FormControlLabel,
  FormLabel,
  FormControl,
  RadioGroup,
  Radio,
} from "@material-ui/core";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const SignUp = () => {
  const user = JSON.parse(localStorage.getItem("ProfileDetails")) || [];
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [bio, setBio] = useState("");
  const [img, setImg] = useState("");
  const [firstname, setFirstName] = useState("");
  const [gender, setGender] = useState("");
  const [valid, setValid] = useState("");
  const [mobile, setMobile] = useState("");
  const [date, setDate] = useState(user.date_of_birth || "");
  const [feedImage, setFeedImage] = useState("");
  const [profileDetails, setProfileDetails] = useState({});
  const [snakeBarDeleteOpen, setSnakeBarDeleteOpen] = useState(false);
  const [snakeBarProfileOpen, setSnakeBarProfileOpen] = useState(false);
  const token = localStorage.getItem("token:");
  let id = localStorage.getItem("ID:");
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

  const handleSnakeBarDeleteClick = () => {
    setSnakeBarDeleteOpen(true);
  };
  const handleSnakeBarDeleteClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnakeBarDeleteOpen(false);
  };

  const handleSnakeBarProfileClick = () => {
    setSnakeBarProfileOpen(true);
  };
  const handleSnakeBarProfileClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnakeBarProfileOpen(false);
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

  useEffect(() => {
    getProfilePic();
    getProfileDetails();
  }, []);

  const getProfileDetails = async () => {
    const url = `http://localhost:5000/am/socialMedia/getProfileDetails`;
    const options = {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    if (response.status === 200) {
      localStorage.setItem("profileDetails", JSON.stringify(data));
      setProfileDetails(JSON.parse(localStorage.getItem("profileDetails")));
    }
    // console.log(data);
  };

  console.log(profileDetails);

  let val = "";
  const navigate = useNavigate();
  const paperstyle = {
    padding: "20px",
    "min- height": "100vh",
    width: 340,
    margin: "20px auto",
  };

  console.log(date);
  const SubmitHandler = async () => {
    const url = `http://localhost:5000/am/socialMedia/editProfile/${id}`;

    const userDetails = {
      firstName: firstname,
      bio: bio,
      gender: gender,
      date_of_birth: date,
      mobile: mobile,
      email: email,
    };
    console.log(userDetails);

    const options = {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-type": "Application/json",
      },
      body: JSON.stringify(userDetails),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      localStorage.setItem("Name", JSON.stringify(data.firstName));
      getProfileDetails();
      handleSnakeBarClick();
      setTimeout(() => {
        navigate("/Feed");
      }, 2000);
    } else {
      alert("error");
    }
  };

  const AddImage = (e) => {
    let formData = new FormData();
    formData.append("photo", e.target.files[0]);
    axios
      .post("http://localhost:5000/am/socialMedia/multerDone", formData)
      .then((res) => UploadImage(res.data).catch((e) => console.log(e)));
  };

  const UploadImage = async (picData) => {
    console.log("called");
    let Imageurl = "http://localhost:5000/am/socialMedia/addProfile";
    const payload = { photo: picData };
    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ payload }),
    };
    const res = await fetch(Imageurl, options);
    const data = await res.json();
    if (res.status === 200) {
      getProfilePic();
      handleSnakeBarProfileClick();
    }
  };

  const getProfilePic = async () => {
    const img = "http://localhost:5000/am/socialMedia/getProfile";

    const options = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    const res = await fetch(img, options);
    const data = await res.json();
    setFeedImage(data[0] && data[0].url);
  };
  const details = JSON.parse(localStorage.getItem("profileDetails"));
  console.log(feedImage);

  const RemoveProfile = async () => {
    const img = "http://localhost:5000/am/socialMedia/deleteProfilePhoto";

    const options = {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    const res = await fetch(img, options);
    const data = await res.json();

    if (res.status === 200) {
      getProfilePic();
      handleSnakeBarDeleteClick();
    }
  };

  return (
    <>
      <Grid>
        <Paper elevation={10} style={paperstyle}>
          <Grid align="center" style={{ padding: 10 }}>
            <h2>Edit Profile</h2>
          </Grid>
          <div
            style={{
              display: "flex",
            }}
          >
            {feedImage === undefined || feedImage === "" ? (
              <Avatar>{user && user.firstname[0]}</Avatar>
            ) : (
              <img
                alt="upload Profile"
                src={feedImage}
                style={{
                  height: "10vh",
                  width: "70px",
                  margin: "5px",
                  borderRadius: "600px",
                  marginRight: "0px",
                }}
              />
            )}
            <Button
              component="label"
              className="image"
              style={{ marginLeft: "0px" }}
            >
              <CameraAltIcon style={{ marginLeft: "0px" }} />
              <input type="file" hidden onChange={AddImage} />
            </Button>{" "}
            <Button
              variant="outlined"
              component="label"
              className="image"
              style={{
                height: "10vh",
                marginLeft: "35px",
                color: "#57ccd9",
                borderColor: "#57ccd9",
              }}
              onClick={RemoveProfile}
            >
              <h6 style={{ marginRight: "5px" }}>Delete Profile</h6>
              <PersonRemoveIcon />
            </Button>
          </div>
          <TextField
            label="Name"
            style={{ margin: 10 }}
            value={firstname === "" ? details && details.firstName : firstname}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            required
          />
          <p>Bio :</p>
          <TextareaAutosize
            label="Bio"
            placeholder="Enter Bio"
            style={{ width: "260px" }}
            minRows={4}
            fullWidth
            value={bio === "" ? details && details.bio : bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
          <FormControl>
            <FormLabel
              id="demo-radio-buttons-group-label"
              style={{
                marginTop: "10px",
              }}
            >
              Gender
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              value={gender == "" ? details && details.gender : gender}
              onChange={(e) => setGender(e.target.value)}
              name="radio-buttons-group"
            >
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>
          {/*  */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date of Birth"
              // value={date}
              value={date === "" ? details && details.date_of_birth : date}
              onChange={(newValue) => {
                setDate(newValue);
              }}
              fullWidth
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <TextField
            label="Email"
            type="email"
            placeholder="Enter Valid Email"
            style={{ marginBottom: "10px", marginTop: "10px" }}
            value={email === "" ? details && details.email : email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <MuiPhoneNumber
            onChange={(e) => setMobile(e)}
            defaultCountry={"in"}
            value={mobile === "" ? details && details.mobile : mobile}
            fullWidth
          />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            style={{ margin: "20px" }}
            onClick={SubmitHandler}
          >
            Update
          </Button>{" "}
          <Button
            type="submit"
            variant="contained"
            style={{ margin: "20px" }}
            onClick={() => navigate("/Feed")}
          >
            Cancel
          </Button>
        </Paper>
        <div>
          <Snackbar
            open={snakeBarDeleteOpen}
            autoHideDuration={6000}
            onClose={handleSnakeBarDeleteClick}
            action={action}
          >
            <Alert
              onClose={handleSnakeBarDeleteClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              Profile Deleted Successfully!
            </Alert>
          </Snackbar>
        </div>
        <div>
          <Snackbar
            open={snakeBarProfileOpen}
            autoHideDuration={6000}
            onClose={handleSnakeBarProfileClose}
            action={action}
          >
            <Alert
              onClose={handleSnakeBarProfileClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              Profile Updated Successfully!
            </Alert>
          </Snackbar>
        </div>
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
              Profile Updated Successfully!
            </Alert>
          </Snackbar>
        </div>
      </Grid>
    </>
  );
};

export default SignUp;
