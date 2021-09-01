import { Request, response, Response } from 'express';
import User from "../models/user.model";
import bcrypt from "bcryptjs";
const crypto = require("crypto");
const nodemailer = require('nodemailer');
// import Children from "../models/children.model";
var _ = require('lodash');
const { result } = require('lodash');
// import State from '../models/state.model';

// create new user
exports.user_create = async (req: Request, res: Response) => {
  try {
    const userexits = await User.find({ email: req.body.email });
    console.log("Usere", userexits);
    if (userexits.length > 0) {
      return res.status(422).send({
        data: {},
        message: "User already exists",
        error: false
      });
    }
    var user = new User(req.body);
    await user.save();
    res.status(200).send({
      data: { user },
      message: "user created successfully",
      error: false
    });
  } catch (err) {
    if (err.errors && err.name == "ValidationError") {
      res.status(422).send({
        message: `User validation failed for ${err.message.split(":")[1]}`,
        error: err,
        status: false
      })
    }
    else {
      res.status(500).send({
        message: 'Something went wrong in creating user',
        error: err,
        status: false
      });
    }
  }
};

// get user based on role
exports.get_user_by_role = async (req: Request, res: Response) => {
  User.find({ _id: req.params.id, role: req.query.role }).then(data => {
    try {
      if (data.length > 0) {
        res.send(data)
      }
      else {
        res.send({
          data: data,
          messsage: "No data"
        })
      }

    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Something went wrong in creating user",
        error: err,
        status: false
      });
    }
  })
};
exports.finduserData = async (req: any, res: any) => {
  User.findOne({ _id: req.params.id }).then(data => {
    try {
      if (data) {
        res.json(data)
      }
      else {
        res.send({
          data: data,
          message: "No Data"
        })
      }
    }
    catch (err) {
      res.status(500).send({
        message: "somthing wrong.",
        error: err,
        status: false
      });
    }
  })
};
// update user by id
exports.update_user = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (req.files) {
    let fielData: any = req.files;
    if (fielData['profilePicture']) {
      req.body.profilePicture = fielData['profilePicture'][0].originalname
    }
    if (fielData['bannerImage']) {
      req.body.bannerImage = fielData['bannerImage'][0].originalname
    }
  }
  const user = await User.findByIdAndUpdate({ _id: id }, req.body);
  //console.log("ywuwfcuwevcjec",req.body);
  if (!user) {
    res.status(404).send({
      message: `Cannot update User with id=${id}. Maybe Post was not found!`
    });
  }
  res.status(200).send({
    message: `User updated successfully`
  });

  //   if (req.file) {
  //     req.body.photo = req.file.originalname
  //   }
  // })

};



exports.user_login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const user:any = await User.findOne({email});
    if(!user){
      res.status(401).send({
        message: "User not found",
        status: false
      });
      const isMatch = await bcrypt.compare(password, user.password);
	      if (!isMatch) {
	    	throw new Error("Unable to login");
    	}
    }
    const token = await user.generateAuthToken(user);
    res.send({ user , token});
  } catch (err) {

    res.status(500).send({
      message: "Something went wrong in login",
      error: err,
      status: false
    });
  }
};
async function login_user(email: string, password: string) {
  const user: any = await User.findOne({ email });
  console.log(user, 'user')
  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;

};

// get user based on role
exports.get_user_by_email = async (req: Request, res: Response) => {
  User.find({ email: req.body.email }).then(data => {
    try {
      if (data.length > 0) {
        res.send(data)
      }
      else {
        res.send({
          data: data,
          messsage: "No data"
        })
      }

    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Something went wrong in creating user",
        error: err,
        status: false
      });
    }
  })
};

// exports.user_login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findByCredentials(email, password);
//     const token = await user.generateAuthToken();
//     res.send({ user, token });
//   } catch (err) {
//     console.log(err);

//     res.status(500).send({
//       message: "Something went wrong in login",
//       error: err,
//       status: false
//     });
//   }
// };

// exports.user_get = async (req, res) => {
//   console.log(req.user);
//   try {
//     const user = await User.find({ _id: req.user._id });
//     res.status(200).send({
//       data: { user },
//       message: "user fetched successfully",
//       error: false
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({
//       message: "Something went wrong in fetching",
//       error: err,
//       status: false
//     });
//   }
// };
exports.gmail_authenticate = async (req: Request, res: Response) => {
  User.find({ email: req.body.email }).then((data: any) => {
    try {
      console.log("dataaa", data)
      if (data.length > 0) {
        data[0].token = req.body.token
        res.send(data)
      }
      else {
        res.send({
          messsage: "Email does not exist"
        })
      }

    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Something went wrong in creating user",
        error: err,
        status: false
      });
    }
  })
};

exports.fb_authenticate = async (req: Request, res: Response) => {
  User.find({ email: req.body.email }).then((data: any) => {
    try {
      console.log("dataaa", data)
      if (data.length > 0) {
        data[0].token = req.body.token
        res.send(data)
      }
      else {
        res.send({
          messsage: "Email does not exist"
        })
      }

    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Something went wrong ",
        error: err,
        status: false
      });
    }
  })
};

var state = ["Alabama",
  "Alaska",
  "American Samoa",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District Of Columbia",
  "Federated States Of Micronesia",
  "Florida",
  "Georgia",
  "Guam",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Marshall Islands",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Northern Mariana Islands",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Palau",
  "Pennsylvania",
  "Puerto Rico",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virgin Islands",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming"
]
exports.state = async (req: Request, res: Response) => {

  console.log(state, "state-----=?")
  //   try {
  //     var user = new State();
  //     await user.save();
  //     res.status(200).send({
  //       data: { user },
  //       message: "user created successfully",
  //       error: false
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).send({
  //       message: "Something went wrong in creating user",
  //       error: err,
  //       status: false
  //     });
  //   }
};
exports.findAllStates = async (req: Request, res: Response) => {

  return res.json({ data: state });

}

exports.userDetails = async (req: any, res: any) => {
  User.findOne({ _id: req.params.id }).then((data:any) => {
    try {
      if (data) {
        let groupedData = _.mapValues(_.groupBy(data.addPackages, 'serviceId'));
        data.addPackages = groupedData
        res.json(data)
      }
      else {
        res.send({
          data: data,
          messsage: "No data"
        })
      }

    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Something went wrong.",
        error: err,
        status: false
      });
    }
  })
};

exports.update_users = async (req: Request, res: Response) => {
  const id = req.params.id;
  const Users=await User.findByIdAndUpdate({_id:id},req.body);
  console.log("ywuwfcuwevcjec",req.body);
  console.log("ywuwfcuwevcjec",Users);
  
  if(!Users){
  
  res.status(404).send({
  message: `Cannot update User with id=${id}. Maybe Post was not found!`
  });
  }
  res.status(200).send({
  message: `User updated successfully`
  });
  };

exports.ResetPassword = async (req: any, res: any, user: any) => {
  if (!req.body.email) {
    return res
      .status(500)
      .json({ message: 'Email is required' });
  }
  const userSet = await User.findOne({
    email: req.body.email
  });
  if (!userSet) {
    return res
      .status(409)
      .json({ message: 'Email does not exist' });
  }
  var resetToken = new User({ _userId: userSet.id, resetToken: crypto.randomBytes(16).toString('hex') });
  resetToken.save(function (err) {
    console.log(resetToken, "^^^resetToken^^^")
    //    { resetToken: resetToken, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true })

    User.find({ _id: userSet._id }, { resetToken: resetToken }).remove().exec();
    res.status(200).json({ message: 'Reset Password successfully.' });
    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      port: 465,
      auth: {
        user: 'user',
        pass: 'password'
      }
    });
    var mailOptions = {
      to: user.email,
      from: 'your email',
      subject: 'Node.js Password Reset',
      text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://localhost:4200/response-reset-password/' + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    }
    transporter.sendMail(mailOptions, (err: any, info: any) => {
      res.send("An email has been sent to " + user.email + "with further instructions");
      console.log('sent')
      res.redirect('/req_reset_password');
    })
  })
}

exports.ValidPasswordToken = async (req: any, res: any) => {
  if (!req.body.resetToken) {
    return res
      .status(500)
      .json({ message: 'Token is required' });
  }
  const user = await User.findOne({
    resettoken: req.body.resetToken
  });
  if (!user) {
    return res
      .status(409)
      .json({ message: 'Invalid URL' });
  }
  User.findOneAndUpdate({ _id: user._id }).then(() => {
    res.status(200).json({ message: 'Token verified successfully.' });
  }).catch((err) => {
    return res.status(500).send({ msg: err.message });
  });
},
  exports.NewPassword = async (req: any, res: any) => {
    User.findOne({ resettoken: req.body.resetToken }, function (err: any, userToken: any, next: any) {
      if (!userToken) {
        return res
          .status(409)
          .json({ message: 'Token has expired' });
      }

      User.findOne({
        _id: userToken._id
      }, function (err: any, userEmail: any, next: any) {
        if (!userEmail) {
          return res
            .status(409)
            .json({ message: 'User does not exist' });
        }
        return bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res
              .status(400)
              .json({ message: 'Error hashing password' });
          }
          userEmail.password = hash;
          userEmail.save(function (err: any) {
            if (err) {
              return res
                .status(400)
                .json({ message: 'Password can not reset.' });
            } else {
              userToken.remove();
              return res
                .status(201)
                .json({ message: 'Password reset successfully' });
            }

          });
        });
      });

    })
  }


exports.findAllAtheletes = async (req: any, res: any) => {
  const user_role = req.query.user_role;
  const userId = req.query.userId;
  // console.log(id,"id")
  User.find({ 'user_role': user_role }).then(data => {
    try {
      if (data) {
        // console.log(data,"data")
        let list: any = [];
        data.forEach(element => {
          // console.log(id,element._id,"id")
          if (element._id != userId) {
            list.push(element);
          }
        });
        res.status(200).send({
          data,
          // list,
          message: "List retrieved successfully."
        })
      }
      else {
        res.send({
          data: data,
          messsage: "No data"
        })
      }

    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Something went wrong.",
        error: err,
        status: false
      });
    }
  })
}


exports.update_users_password = (req: Request, res: Response) => {
  User.findById({ _id: req.params.id }, (err: any, data: any) => {
    if (err) {
      return res
        .status(400)
        .json({ message: 'Error hashing password' });
    }
    else if(!data)
    {
      return res
      .status(404)
      .json({ message: 'User Not Found' });
    }
    else {
      const hash = bcrypt.hashSync( data.password);
      let updateObj ={
          password: hash
      }
      User.findByIdAndUpdate(req.params.id, updateObj, {new: true},(err:any, model:any) =>{
        if (err) {
          return res
            .status(400)
            .json({ message: 'Error hashing password' });
        }
        else{
          return res.status(200).send({
            message: `User updated successfully`
          });
        }
      })
    }
  })
};

/**
 * get all the atheletes and children...
 */
//  exports.findAllAtheletesAndChildren = async (req: any, res: any) => {
//   User.find({ user_role: 1 }).then((userData: any) => {
//     Children.find({}).then((ChildrenData: any) => {
//       let finalresult = userData.concat(ChildrenData)
//       if (finalresult.length  == 0) {
//         return res.json({ status: 403, message: "No data avilable", data: {} })
//       }
//       else {
//         return res.json({ status: 200, message: "get data sucessfully", data:finalresult })
//       }
//     })
//   })
// }