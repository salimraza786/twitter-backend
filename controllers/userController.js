import bcryptjs from "bcryptjs";
import { User } from "../models/userSchema.js ";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({
        msg: "Please enter all fields",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        msg: "User already exists",
        success: false,
      });
    }
    const hashPassword = await bcryptjs.hash(password, 16);
    await User.create({
      name,
      username,
      email,
      password: hashPassword,
    });
    return res.status(201).json({
      msg: "User created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        msg: "Please enter all fields",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        msg: "User does not exist this email",
        success: false,
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        msg: "Incorrect email or password",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(201).cookie("token", token, {
      expiredIn: "1d",
      httpOnly: true,
    }).json({
      msg: "User Logged in successfully",
      user,
      success: true,
      
    });
   
  } catch (error) {
    console.log(error);
  }
};

export const Logout =  (req, res) => {
  return res.cookie("token","",{
    expiredIn:new Date(Date.now()),
  }).json({
    msg: "User Logout successfully",
    success:true
  })
}

// bookmarks
export const bookmark = async (req, res) => {
  try {
      const loggedInUserId = req.body.id;
      const tweetId = req.params.id;
      const user = await User.findById(loggedInUserId);
      if (user.bookmarks.includes(tweetId)) {
          // remove
          await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: tweetId } });
          return res.status(200).json({
              message: "Removed from bookmarks."
          });
      } else {
          // bookmark
          await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: tweetId } });
          return res.status(200).json({
              message: "Saved to bookmarks."
          });
      }
  } catch (error) {
      console.log(error);
  }
};
// get profile
export const getMyProfile = async (req, res) => {
  try {
      const id = req.params.id;
      const user = await User.findById(id).select("-password");
      return res.status(200).json({
          user,
      })
  } catch (error) {
      console.log(error);
  }
};
// get other users
export const getOtherUsers = async (req,res) =>{ 
  try {
       const {id} = req.params;
       const otherUsers = await User.find({_id:{$ne:id}}).select("-password");
       if(!otherUsers){
          return res.status(401).json({
              message:"Currently do not have any users."
          })
       };
       return res.status(200).json({
          otherUsers
      })
  } catch (error) {
      console.log(error);
  }
}

// follow
export const follow = async(req,res)=>{
  try {
      const loggedInUserId = req.body.id; 
      const userId = req.params.id; 
      const loggedInUser = await User.findById(loggedInUserId);//patel
      const user = await User.findById(userId);//keshav
      if(!user.followers.includes(loggedInUserId)){
          await user.updateOne({$push:{followers:loggedInUserId}});
          await loggedInUser.updateOne({$push:{following:userId}});
      }else{
          return res.status(400).json({
              message:`User already followed to ${user.name}`
          })
      };
      return res.status(200).json({
          message:`${loggedInUser.name} just follow to ${user.name}`,
          success:true
      })
  } catch (error) {
      console.log(error);
  }
}

// unfollow
export const unfollow = async (req,res) => {
  try {
      const loggedInUserId = req.body.id; 
      const userId = req.params.id; 
      const loggedInUser = await User.findById(loggedInUserId);//patel
      const user = await User.findById(userId);//keshav
      if(loggedInUser.following.includes(userId)){
          await user.updateOne({$pull:{followers:loggedInUserId}});
          await loggedInUser.updateOne({$pull:{following:userId}});
      }else{
          return res.status(400).json({
              message:`User has not followed yet`
          })
      };
      return res.status(200).json({
          message:`${loggedInUser.name} unfollow to ${user.name}`,
          success:true
      })
  } catch (error) {
      console.log(error);
  }
}