import * as React from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MuiAlert from "@mui/material/Alert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  CardMedia,
  CardActions,
  Button,
  TextField,
  Grid,
  form,
} from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroll-component";
import SendIcon from "@mui/icons-material/Send";
import MenuIcon from "@material-ui/core/Menu";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Menu from "@material-ui/core/Menu";
import { MenuItem } from "@material-ui/core";
import { DialogTitle } from "@material-ui/core";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CommentIcon from "@mui/icons-material/Comment";
import { useState } from "react";
import { useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";
import { Stack } from "@mui/material";
import Badge from "@mui/material/Badge";

import { Paper } from "@material-ui/core";

export default function Feed() {
  const [post, setPost] = useState([]);
  const [items, setItems] = useState(Array.from({ length: 20 }));
  const [opt, setOpt] = useState(false);
  const [op, setOp] = useState(false);
  const [ChangePwdOpen, setChangePwdOpen] = useState(false);
  const [openComment, setOpenComment] = useState("");
  const [caption, setCaption] = useState("");
  const [feedImage, setFeedImage] = useState("");
  const token = localStorage.getItem("token:");
  const [snakeBarOpen, setSnakeBarOpen] = React.useState(false);
  const [snakeCommentBarOpen, setCommentSnakeBarOpen] = React.useState(false);
  const [cnt, setCnt] = useState(0);
  const [comment, setComment] = useState("");
  const [commentsList, setCommentList] = useState([]);
  const [CloseHandler, setCloseHandler] = useState(false);
  const [ShowCommentsList, SetShowCommentsList] = useState(false);
  const [firstComments, setFirstComments] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [page, setPage] = useState(3);
  const personId = localStorage.getItem("ID:");
  console.log(personId);
  const user = JSON.parse(localStorage.getItem("ProfileDetails"));
  console.log(user.firstname);

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const handleSnakeBarClick = () => {
    setSnakeBarOpen(true);
  };
  const handleCommentSnakeBarClick = () => {
    setCommentSnakeBarOpen(true);
  };
  const handleCommentSnakeBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setCommentSnakeBarOpen(false);
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

  useEffect(() => {
    getData(page);
    getCommentsFirst();
    getAllUsers();
  }, [page]);

  const getAllUsers = async () => {
    const options = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const res = await fetch(
      "http://localhost:5000/am/socialMedia/allUsers",
      options
    );
    const data = await res.json();
    setAllUsers(data);
  };

  const getData = async (i) => {
    const size = i !== undefined ? page : "";
    console.log(size);
    let url = ` http://localhost:5000/am/socialMedia/getPhotos?size=${size}`;
    const options = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    const res = await fetch(url, options);
    const data = await res.json();
    setPost(data);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const EditHandler = () => {
    navigate(`/edit/${personId}`);
  };

  const Logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const openHandler = () => {
    // setChangePwdOpen(true);
    navigate("/ChangePassword");
  };

  const AddImage = (e) => {
    let formData = new FormData();
    formData.append("photo", e.target.files[0]);
    axios
      .post("http://localhost:5000/am/socialMedia/multerDone", formData)
      .then((res) => setFeedImage(res.data).catch((e) => console.log(e)));
  };

  const getCommentsFirst = async () => {
    let Commenturl = `http://localhost:5000/am/socialMedia/getComments`;
    const options = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    const res = await fetch(Commenturl, options);
    const data = await res.json();

    setFirstComments(data);
  };

  const UploadImage = async () => {
    let Imageurl = "http://localhost:5000/am/socialMedia/uploadPhoto";
    const payload = { caption: caption, photo: feedImage };
    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ payload }),
    };
    const res = await fetch(Imageurl, options);
    if (res.status === 200) {
      setOpt(false);
      setCaption("");
      handleSnakeBarClick();
      // getData();
    }
  };

  const LikeHandler = async (id) => {
    let Likeurl = `http://localhost:5000/am/socialMedia/postLikesForPost/${id}`;

    const options = {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    };
    const res = await fetch(Likeurl, options);
    if (res.status === 200) {
      getData();
    }
  };

  const getComments = async (id) => {
    let Commenturl = `http://localhost:5000/am/socialMedia/getCommentsAndLikes/${id}`;
    const options = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    const res = await fetch(Commenturl, options);
    const data = await res.json();
    if (res.status === 200) {
      getCommentsFirst();

      setCommentList(data);
    }
  };

  const paperstyle = {
    padding: 20,
    height: "25vh",
    width: 450,
    margin: "20px auto",
  };

  const CommentHandler = async (id) => {
    let Commenturl = `http://localhost:5000/am/socialMedia/postComment/${id}`;

    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment, likes: [] }),
    };
    if (comment !== "") {
      const res = await fetch(Commenturl, options);
      const data = await res.json();
      if (res.status === 200) {
        setOpenComment("");
        setComment("");
        getComments(id);
        // CloseHandler(true);
        handleCommentSnakeBarClick();
      }
    }
  };
  console.log(post);

  const fetchMoreData = () => {
    console.log("first")
    setTimeout(() => {
      setPage((prev) => prev + 3);
    }, 1000);
  };

  const profilePic = allUsers.filter((each, i) => {
    return each.createdBy === personId;
  });

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="sticky"
          style={{
            boxShadow: " 5px 5px 5px 0 gray",
            backgroundColor: "#2885ad",
            height: "70px",
          }}
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              {profilePic[0] && profilePic[0].url === "" ? (
                <Avatar>{user && user.firstname[0]}</Avatar>
              ) : (
                <img
                  src={profilePic[0] && profilePic[0].url}
                  style={{
                    height: "8vh",
                    width: "60px",
                    margin: "20px",
                    borderRadius: "600px",
                  }}
                />
              )}

              <h3 style={{ padding: "10px", textTransform: "capitalize" }}>
                {/* {console.log(localName.firstName)} */}
                {user && user.firstname}
              </h3>
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={EditHandler}>Edit Profile</MenuItem>

              <MenuItem onClick={openHandler}>Change Password</MenuItem>

              <MenuItem onClick={Logout}>Logout</MenuItem>
            </Menu>
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
              style={{ margin: "15px", color: "#1a2b33" }}
            >
              Social Feed
            </Typography>
          </Toolbar>
          <div>
            <Snackbar
              open={snakeCommentBarOpen}
              autoHideDuration={6000}
              onClose={handleCommentSnakeBarClose}
              action={action}
            >
              <Alert
                onClose={handleCommentSnakeBarClose}
                severity="success"
                sx={{ width: "100%" }}
              >
                Comment Added Successfully!
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
                Post Added Successfully!
              </Alert>
            </Snackbar>
          </div>
        </AppBar>
        <InfiniteScroll
          dataLength={post.length}
          loader={<h4>Loading...</h4>}
          next={fetchMoreData}
          hasMore={true}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          <Grid
            container
            spacing={40}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center",
              "min-height": "105vh",
            }}
          >
            <Paper elevation={5} style={paperstyle}>
              <Grid align="center"></Grid>

              <div>
                <Button variant="outlined" component="label" className="image">
                  {" "}
                  Upload Image
                  <input type="file" hidden onChange={AddImage} fullWidth />
                </Button>{" "}
              </div>

              <TextField
                type="text"
                label="Add Caption"
                style={{ margin: "10px" }}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                fullWidth
              />

              <Button
                color="primary"
                onClick={UploadImage}
                variant="contained"
                style={{ margin: 10 }}
              >
                Add Post
              </Button>
            </Paper>
            {console.log(post)}
            {post &&
              post.map((a, i) => {
                console.log(a.likes.length);
                const commentsCnt =
                  firstComments &&
                  firstComments.filter((each) => {
                    return each.postId === a._id;
                  });
                const image = allUsers.filter(
                  (user) => user.createdBy === a.createdBy
                )[0]?.url;
                return (
                  <Card
                    style={{
                      boxShadow: " 5px 5px 5px 0 gray",

                      width: "35%",
                      marginTop: "10px",
                    }}
                  >
                    <div style={{ display: "flex", alignContent: "center" }}>
                      {image === "" ? (
                        <Avatar>{user && user.firstname[0]}</Avatar>
                      ) : (
                        <img
                          src={image}
                          style={{
                            height: "8vh",
                            width: "60px",
                            margin: "20px",
                            borderRadius: "600px",
                          }}
                        />
                      )}
                      <h3>{a.postedBy}</h3>
                    </div>
                    <CardMedia
                      component="img"
                      style={{ width: "100%", height: "60vh" }}
                      image={a.url}
                    />

                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        <b style={{ marginRight: "10px" }}>{a.postedBy}</b>
                        {a.caption}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton>
                        <Badge badgeContent={a.likes.length} color="secondary">
                          <FavoriteIcon
                            color={a.likes.includes(personId) ? "primary" : ""}
                            onClick={() => LikeHandler(a._id)}
                          />
                        </Badge>
                      </IconButton>

                      <Badge badgeContent={commentsCnt.length} color="primary">
                        <CommentIcon
                          onClick={() => {
                            SetShowCommentsList(a._id);
                            getComments(a._id);
                          }}
                        ></CommentIcon>
                      </Badge>

                      <IconButton
                        aria-label="add to favorites"
                        style={{ marginLeft: "60%" }}
                        onClick={() => {
                          const data = post.map((each) => {
                            if (each._id === a._id) {
                              return { ...each, openDrop: !each.openDrop };
                            } else {
                              return each;
                            }
                          });
                          setPost(data);
                        }}
                      >
                        <KeyboardArrowDownIcon />
                      </IconButton>
                    </CardActions>
                    {ShowCommentsList === a._id &&
                      commentsList?.map((each, i) => {
                        const image = allUsers.filter(
                          (user) => user.createdBy === each.createdBy
                        )[0]?.url;
                        return (
                          <div
                            style={{
                              alignContent: "center",
                              margin: "10px",
                            }}
                          >
                            <h5
                              style={{
                                display: "flex",
                                alignContent: "center",
                              }}
                            >
                              <p
                                style={{
                                  color: "#0f6b85",
                                  marginRight: "10px",
                                }}
                              >
                                {" "}
                                Commented By :{" "}
                              </p>
                              <p> {each.name}</p>
                            </h5>
                            <div
                              style={{
                                display: "flex",
                                alignContent: "center",
                              }}
                            >
                              <b>
                                {image === "" ? (
                                  <Avatar>{user && user.firstname[0]}</Avatar>
                                ) : (
                                  <img
                                    style={{
                                      height: "6vh",
                                      width: "50px",

                                      borderRadius: "600px",
                                    }}
                                    src={image}
                                  />
                                )}
                              </b>
                              <p style={{ marginLeft: "55px" }}>
                                {each.comment}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    {a.openDrop === true && (
                      <div key={a._id}>
                        <TextField
                          type="text"
                          style={{ padding: "5px" }}
                          label="Comment Here"
                          variant="outlined"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <SendIcon
                          variant="contained"
                          style={{
                            margin: "10px",
                            marginTop: "20px",
                          }}
                          form="myform"
                          onClick={() => CommentHandler(a._id)}
                        >
                          Comment
                        </SendIcon>
                      </div>
                    )}
                  </Card>
                );
              })}

            <Stack spacing={1}>
              <Skeleton variant="text" />
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="rectangular" width={500} height={118} />
            </Stack>
          </Grid>
        </InfiniteScroll>
      </Box>
    </>
  );
}
