const mongoose = require('mongoose')
const {Schema} = mongoose
const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    favorites: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Hostel",
        },
      ],
    phone:{
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
              return /^\d{10}$/.test(v); // Ensures exactly 10 digits
            },
            message: (props) => `${props.value} is not a valid phone number! It must be 10 digits.`,
          },
    },
    role: {
        type: String,
        enum: ["owner", "renter"],
        required: true,
    },    
    date:{
        type: Date,
        default: Date.now
    },
})
module.exports = mongoose.model('user',UserSchema)
