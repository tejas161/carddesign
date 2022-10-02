const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');





const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    date:{
        type:Date,
        default:Date.now
    },
    messages:[
        {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            phone: {
                type: Number,
                required: true
            },
            message: {
                type: String,
                required: true
            }
        }

    ],
    tokens: [
        {
            token: {
                type: String,
                required: true

            }
        }
    ]

});



// we are hashing password
userSchema.pre('save', async function (next) {

    if (this.isModified('password')) {

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        this.cpassword = await bcrypt.hash(this.cpassword, salt);



    }
    next();





});


userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;

    } catch (err) {
        console.log(err);
    }
}

userSchema.methods.addMessage = async function(name,email,phone,message){
    try{

   this.messages = this.messages.concat({name,email,phone,message});
   await this.save();
   return this.messages;

    }
    catch(err)
    {
        console.log(err);
    }
}



const User = mongoose.model('USER', userSchema);

module.exports = User;