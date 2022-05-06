const userModule = require("../Model/user");
const bcryptThePassword = require("bcryptjs");
const uploadSchema = require("../Model/cardPost");
const profileSchema = require("../Model/profileSchema");
const commentsSchema = require("../Model/commentsSchema.js");

const cloud = require("cloudinary").v2;
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

const fs = require("fs");

exports.register = async (req, res, next) => {
  const {
    firstName,
    lastName,
    bio,
    gender,
    date_of_birth,
    mobile,
    email,
    password,
  } = req.body;
  const UserEmailExists = await userModule.findOne({ email });

  if (UserEmailExists) {
    return res.status(403).json({
      error: {
        message: "Email Already Exists Try to Login",
      },
    });
  }

  const newUser = new userModule({
    firstName,
    lastName,
    bio,
    gender,
    date_of_birth,
    mobile,
    email,
    password,
  });
  try {
    await newUser.save();

    return res.status(200).json({
      message: `${firstName} ${lastName} is Successfully Registered`,
    });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const userValidData = await userModule.findOne({ email });

  if (!userValidData)
    return res.status(403).json({
      error: {
        message: "Invalid Email",
      },
    });

  try {
    await userValidData.checkPassword(password);
  } catch (e) {
    return res.status(500).json({
      error: {
        message: e.message,
      },
    });
  }

  try {
    const getToken = await userValidData.generateToken(userValidData);
    return res.status(200).json({
      message: "Success",
      jwt_token: getToken,
      _id: userValidData._id,
      surname: userValidData.lastName,
      firstname: userValidData.firstName,
    });
  } catch (e) {
    return res.status(500).json({
      error: {
        message: e.message,
      },
    });
  }
};

exports.editProfile = async (req, res, next) => {
  const { _id } = req.user;
  const { id } = req.params;
  const { email } = req.body;
  console.log(email);

  if (_id === id) {
    const UserEmailExists = await userModule.findOne({ email });
    if (UserEmailExists) {
      try {
        await userModule.findByIdAndUpdate(_id, req.body, {
          new: true,
          runValidators: true,
        });
        return res.status(200).json({
          message: "Successfully Updated",
        });
      } catch (e) {
        return res.status(500).json({
          error: {
            message: e.message,
          },
        });
      }
    } else {
      return res.status(403).json({
        error: {
          message: "Email is not Exists",
        },
      });
    }
  } else {
    return res.status(300).json({
      message: "In valid Id in URL",
    });
  }
};

exports.editPassword = async (req, res, next) => {
  const { _id, currentPassword, newPassword, confirmPassword } = req.body;
  const userValidData = await userModule.findOne({ _id });
  if (newPassword === confirmPassword) {
    if (
      await bcryptThePassword.compare(currentPassword, userValidData.password)
    ) {
      try {
        const { _id } = req.user;
        const salt = await bcryptThePassword.genSalt(10);
        const passwordHashed = await bcryptThePassword.hash(newPassword, salt);

        await userModule.findByIdAndUpdate(
          _id,
          { password: passwordHashed }
          // {
          //   new: true,
          //   runValidators: true,
          // }
        );
        return res.status(200).json({
          message: "Successfully Updated",
        });
      } catch (e) {
        return res.status(500).json({
          error: {
            message: e.message,
          },
        });
      }
    }

    return res.status(300).json({
      message: "Password Doesn't Matched with Old Password",
    });
  } else {
    return res.status(300).json({
      message: "newPassword and confirmPassword Doesn't Matched",
    });
  }
};

async function uploadToCloudinary(locaFilePath) {
  // locaFilePath :
  // path of image which was just uploaded to "uploads" folder

  var mainFolderName = "main";
  // filePathOnCloudinary :
  // path of image we want when it is uploded to cloudinary
  var filePathOnCloudinary = mainFolderName + "/" + locaFilePath;

  return cloud.uploader
    .upload(locaFilePath, { public_id: filePathOnCloudinary })
    .then((result) => {
      // Image has been successfully uploaded on cloudinary
      // So we dont need local image file anymore
      // Remove file from local uploads folder
      fs.unlinkSync(locaFilePath);

      return {
        message: "Success",
        url: result.url,
      };
    })
    .catch((error) => {
      // Remove file from local uploads folder
      fs.unlinkSync(locaFilePath);
      return { message: "Fail" };
    });
}

cloud.config({
  cloud_name: "duivdefdy",
  api_key: "369672334532652",
  api_secret: "460IDIJ4yVGig1Zu6HKvE5mUNAE",
  secure: true,
});

exports.uploadPhoto =
  ("/uploadPhoto",
  async (req, res, next) => {
    const { likes, caption } = req.body.payload;
    const { _id } = req.user;
    // req.file is the `profile-file` file
    // req.body will hold the text fields, if there were any
    var locaFilePath = req.body.payload.photo.path;
    var result = await uploadToCloudinary(locaFilePath);

    const profileData = await profileSchema.find({ createdBy: _id });
    const userData = await userModule.find({ _id });
    const newPhoto = new uploadSchema({
      createdBy: _id,
      url: result.url,
      likes,
      caption,
      pic: profileData[0].url,
      postedBy: userData[0].firstName,
    });

    try {
      await newPhoto.save();
      return res.status(200).json({
        message: `Photo is Successfully Uploaded`,
      });
    } catch (e) {
      error.status = 400;
      next(e);
    }
  });

exports.postLikesForPost = async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;

  const post = await uploadSchema.findById(id);
  const likedPost = post.likes.filter((like) => like === _id);
  try {
    if (likedPost.length > 0) {
      const filteredLikes = post.likes.filter((like) => like != _id);
      await uploadSchema.updateOne(
        { _id: id },
        { $set: { likes: filteredLikes } }
      );

      return res.status(200).json({ message: "success" });
    } else {
      const addedNewLike = [...post.likes, _id];
      await uploadSchema.updateOne(
        { _id: id },
        { $set: { likes: addedNewLike } }
      );
      return res.status(200).json({ message: "Success" });
    }
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.getPhotos = async (req, res, next) => {
  const { _id } = req.user;
  const { size, pageNo } = req.query;
  try {
    const photo = await uploadSchema
      .find({})
      .sort({ _id: -1 })
      .limit(size)
      .skip(size * (pageNo - 1))
      .exec();

    res.status(200).json(photo);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.addProfile =
  ("/addProfile",
  async (req, res, next) => {
    const { _id } = req.user;
    // req.file is the `profile-file` file
    // req.body will hold the text fields, if there were any
    var locaFilePath = req.body.payload.photo.path;
    var result = await uploadToCloudinary(locaFilePath);

    const alreadyExists = await profileSchema.findOne({ createdBy: _id });
    console.log(alreadyExists, "email");

    try {
      if (!alreadyExists) {
        const newProfile = new profileSchema({
          createdBy: _id,
          url: result.url,
        });

        await newProfile.save();
        return res.status(200).json({
          message: `Photo is Successfully Uploaded`,
        });
      } else {
        await profileSchema.findOneAndUpdate(
          { createdBy: _id },
          { url: result.url }
        );

        return res.status(200).json({
          message: `Photo is Successfully Updated`,
        });
      }
    } catch (error) {
      error.status = 400;
      next(error);
    }
  });

exports.getProfile = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const photo = await profileSchema.find({ createdBy: _id });
    // console.log(photo);
    res.status(200).json(photo);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  const { _id } = req.user;
  try {
    await profileSchema.findByIdAndUpdate(_id, req.body);
    res.status(200).json({ success: true });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.DeleteProfile = async (req, res, next) => {
  const { _id } = req.user;
  try {
    await profileSchema.deleteOne({ createdBy: _id });
    res.status(200).json({ message: "Successfully Deleted profile" });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

exports.getProfileDetails = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const data = await userModule.findOne({ _id });
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};
exports.postComment = async (req, res, next) => {
  const { _id } = req.user;
  const { comment } = req.body;
  const { postId } = req.params;

  const profileData = await profileSchema.find({ createdBy: _id });
  const userData = await userModule.find({ _id });
  console.log(userData);
  const newComment = new commentsSchema({
    createdBy: _id,
    postId: postId,
    comment: comment,
    pic: profileData[0].url,
    name: userData[0].firstName,
  });

  try {
    await newComment.save();
    return res.status(200).json({
      message: `Successfully Updated`,
    });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

exports.postLikesForComment = async (req, res, next) => {
  const { postId } = req.params;
  const { _id } = req.user;
  console.log(postId);

  try {
    const post = await commentsSchema.findOne({ postId });
    await commentsSchema.findOneAndUpdate(
      { postId },
      { likes: [...post.likes, _id] }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.getCommentsAndLikes = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const commentDetails = await commentsSchema.find({ postId: postId });
    console.log(commentDetails);
    res.status(200).json(commentDetails);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.multerDone = async (req, res) => {
  res.send(req.file);
};

exports.googleLogin = async (req, res) => {
  const { token } = req.body;
  console.log(token);

  const ticket = await client.verifyIdToken({
    idToken: token,
    requiredAudience: process.env.google_client_id,
  });

  const { email } = ticket.getPayload();
  console.log(email);
  try {
    const userValidData = await userModule.findOne({ email });
    console.log(userValidData);
    if (!userValidData) {
      res.status(400).json({ message: "user not Exists" });
    } else {
      const getToken = await userValidData.generateToken(userValidData);
      return res.status(200).json({
        status: 200,
        message: "Success",
        jwt_token: getToken,
        _id: userValidData._id,
        surname: userValidData.lastName,
        firstname: userValidData.firstName,
      });
    }
  } catch (err) {
    err.status = 500;
    next(err);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const commentDetails = await commentsSchema.find({});
    res.status(200).json(commentDetails);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

exports.allUsers = async (req, res, next) => {
  try {
    const recent = await profileSchema.find();
    res.status(200).json(recent);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};
exports.deleteProfilePhoto = async (req, res, next) => {
  const { _id } = req.user;
  try {
    await profileSchema.findOneAndUpdate({ createdBy: _id }, { url: "" });
    res.status(200).json({ message: "Successfully Deleted" });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};
