const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const port = 8000;

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const jwt = require("jsonwebtoken")
// mongodb+srv://asadjahangir2002:GNjBBqQPDPBppyrL@cluster0.0krli.mongodb.net/
mongoose
    .connect("mongodb+srv://asadjahangir2002:GNjBBqQPDPBppyrL@cluster0.0krli.mongodb.net/", {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    }).then(() => {
        console.log("Connected to MongoDb")
    }).catch((err) => {
        console.log("Error connecting to mongoDb", err)
    });

app.listen(port, () => {
    console.log("Server is running on port 8000")
})



const User = require("./models/user")
const Order = require("./models/order")

//function to send verification Email to the user
const sendVerificationEmail = async (email, verificationToken) => {
    //configure a nodemailer transport
    const transporter = nodemailer.createTransport({
        //configure the email service
        service: "gmail",
        auth: {
            user: "asadjahangir2002@gmail.com",
            pass: "wdgc pbsp bumn fktg"
        }
    })

    //compose the email message
    const mailOptions = {
        from: "amazon.com",
        to: email,
        subject: "Email Verification",
        text: `Please click the following link to verify your email: http://localhost:8000/verify/${verificationToken}`
    }
    //send the email
    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.log("Error sending verification email", error)
    }
}


//endpoint to register in the app
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create a new user
        const newUser = new User({ name, email, password });

        // Generate and store the verification token
        newUser.verificationToken = crypto.randomBytes(20).toString("hex");

        // Save the user to the database
        await newUser.save();

        // Send verification email to the user
        await sendVerificationEmail(newUser.email, newUser.verificationToken);
        res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
        console.log("Error registering user", error);
        res.status(500).json({ message: "Register failed" });
    }
});


app.get("/",(req,res)=> res.send("hiii"))



app.get('/verify/:token', async (req, res) => {
    try {
        const token = req.params.token;

        //Find the user with the given verification token
        const user = await User.findOne({ verificationToken: token })
        if (!user) {
            return res.status(404).json({ message: "Invalid verification token" })
        }
        //mark the user as verified
        user.verified = true,
            user.verificationToken = undefined;

        await user.save()

        res.status(200).json({ message: "Email verified succefully" })
    } catch (error) {
        res.status(500).json({ message: "Email verification Failed" })
    }
})

const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString("hex")

    return secretKey
}

const secretKey = generateSecretKey();

// endpoint to login the user
app.post("/login",async (req,res) => {
    try {
        const {email,password} =req.body;

        //check if the user exists
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({message:'Invalid email or password'})
        }
        //check if the password is correct
        if(user.password !== password){
            return res.status(401).json({message:"Invalid password"})
        }

        // if email and password same then we generate a token
        const token = jwt.sign({userId:user._id},secretKey)
        res.status(200).json({token})
    } catch (error) {
        res.status(500).json({message:"Login failed"})
    }
})