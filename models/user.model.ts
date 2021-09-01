import { mongoose } from "../db/mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

var userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      // required: true,
      // unique: true
    },
    password: {
      type: String,
    },
    name: {
      type: String,

      trim: true
    },
    token: {
      type: String,

    },
    resetToken: {
      type: String,
    },
    userId: {
      type: String
    },
    sports: {
      type: Array,
    },
    addSports: {
      type: Array,
    },
    addSevices: {
      type: Array,
    },
    addPackages: {
      type: Array,
    },
    awards: {
      type: String,
    },
    skillBuilding: {
      type: Array,
    },
    standardRate: {
      type: String,

      trim: true
    },

    tagline: {
      type: String
    },

    lifestyle: {
      type: String,
    },
    paidservice: {
      type: Boolean,
    },
    profilePicture: {
      data: Buffer,
      type: String
    },
    bannerImage: {
      data: Buffer,
      type: String
    },
    level: {
      type: Array,
    },
    payperhour: {
      type: Number
    },
    user_role: {
      type: Number
    },
    age: {
      type: Number,
      maxlength: 100,
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    },
    website: {
      type: String
    },
    height: {
      type: String
    },
    weight: {
      type: String

    },
    birthdate: {
      type: Date
    },


    bio: {
      type: String
    },

    athletic_lifecycle: {
      type: Array
    },

    profileDescription: {
      type: String
    },
    social: {
      type: String
    },


    locality: {
      type: String,

      trim: true
    },
    location: {
      type: Object,

      trim: true
    },
    city: {
      type: String,

      trim: true
    },
    state: {
      type: String,

      trim: true
    },

    zip: {
      type: Number,

      trim: true
    },
    country: {
      type: String,

      trim: true
    },

    organizationName: {
      type: String,

      trim: true
    },



    athleticInterests: {
      type: Array
    },
    athleticSkills: {
      type: Array
    },
    athleticWeakness: {
      type: Array
    },
    athleticGoals: {
      type: Array
    }

  },

  {
    timestamps: true
  }
);

export interface IUser {
  name: string;
  email?: string;
  password: string;
  // company: Types.ObjectId | Record<string, unknown>;
  // gender: Gender;
  // friends: String<string>;
  // creditCards?: Map<string, string>;
}


userSchema.methods.generateAuthToken = async function () {
  var user: any = this;
  var token = jwt.sign({ _id: user._id.toString() }, "thisismydemo", { expiresIn: '6h' });
  user.token = token;
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email: string, password: string) => {
  const user: any = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

//Hash the plain text password
userSchema.pre("save", async function (this: any, next: any) {
  var user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

var User = mongoose.model("User", userSchema);
export default User
