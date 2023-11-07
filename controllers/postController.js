import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res, next) => {
  try {
    const { postedBy, text } = req.body;
    let { img } = req.body;

    if (!postedBy || !text)
      return res
        .status(400)
        .json({ error: "Postedby ans text fields are required" });

    const user = await User.findById(postedBy);

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res
        .status(402)
        .json({ error: "can't create post to another users" });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `text must be less than${maxLength} character` });
    }
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }
    const newPost = new Post({ postedBy, text, img });
    await newPost.save();

    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
    console.log(error);
  }
};
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "post not found" });
    }
    return res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
    console.log(error);
  }
};
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to delete post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const likeUnlikePost = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "post not found" });
    }
    const userLikedPost = await post.likes.includes(userId);

    if (userLikedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      return res.status(200).json({ message: "post unliked successfully" });
    } else {
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
      return res.status(200).json({ message: "post liked successfully" });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
    console.log(error);
  }
};

const replyToPost = async (req, res, next) => {
  try {
    const { text } = req.body;
    const { id: postId } = req.params;
    const { _id: userId, profilePic, username } = req.user;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const reply = { userId, text, profilePic, username };

    post.replies.push(reply);
    await post.save();

    res.status(200).json(reply);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
    console.log(error);
  }
};

const getFeedPosts = async (req, res, next) => {
  try {
    const id = req.user;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    const following = user.following;

    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });
    res.status(200).json(feedPosts);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
    console.log(error);
  }
};

const getUserPosts = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const posts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status.json({ error: error.message });
  }
};

export default {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
};
