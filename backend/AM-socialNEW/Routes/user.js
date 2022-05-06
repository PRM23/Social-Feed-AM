const express = require("express");
const router = express.Router(); // Routing Purpose of the Api^S
const auth = require("../Middleware/auth");
var multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const pathName = path.join(__dirname, "../images");
    console.log(pathName);
    cb(null, pathName);
  },
  filename: (req, file, cb) => {
    fileName = Date.now() + "-" + file.originalname;
    console.log(fileName);
    cb(null, fileName);
  },
});
var upload = multer({ storage: storage });
const {
  register,
  login,
  editProfile,
  editPassword,
  uploadPhoto,
  getPhotos,
  addProfile,
  getProfile,
  updateProfile,
  DeleteProfile,
  postComment,
  postLikesForComment,
  getCommentsAndLikes,
  postLikesForPost,
  multerDone,
  getProfileDetails,
  googleLogin,
  getComments,
  allUsers,
  deleteProfilePhoto,
} = require("../Controllers/user");

router.post("/register", register); // Register Route

router.post("/login", login); // Login Route;

router.post("/uploadPhoto", auth, uploadPhoto);

router.post("/multerDone", upload.single("photo"), multerDone);

router.post("/postLikesForPost/:id", auth, postLikesForPost);

router.post("/postComment/:postId", auth, postComment);

router.post("/postLikesForComment/:postId", auth, postLikesForComment);

router.get("/getCommentsAndLikes/:postId", auth, getCommentsAndLikes);

router.post("/addProfile", auth, addProfile);

router.get("/getPhotos", auth, getPhotos);

router.get("/getComments", auth, getComments);

router.get("/getProfileDetails", auth, getProfileDetails);

router.get("/getProfile", auth, getProfile);

router.put("/updateProfile", auth, updateProfile);

router.delete("/DeleteProfile", auth, DeleteProfile);

router.put("/editProfile/:id", auth, editProfile);

router.put("/editPassword/:id", auth, editPassword);

router.get("/allUsers", auth, allUsers);

router.post("/googleLogin", googleLogin);

router.delete("/deleteProfilePhoto", auth, deleteProfilePhoto);

module.exports = router;
