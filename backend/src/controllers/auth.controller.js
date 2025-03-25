import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup =  async (req, res) => {
    const { email, fullName, password } = req.body;
    try {

        if(!email || !fullName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        const salt = await bcrypt.genSalt(10);;
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword
        })

        if(newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({_id: newUser._id, email: newUser.email, fullName: newUser.fullName, profilePic: newUser.profilePic});
        } else {
            res.status(400).json({ message: "Invalid user Data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal error" });
    }
};

export const login = async (req, res) => {
    const { identifier, password } = req.body;
    
    try {
        // Chercher l'utilisateur par email ou fullname
        const user = await User.findOne({
            $or: [
                { email: identifier },
                { fullName: identifier }
            ]
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal error" });
    }
};


export const logout = (req, res) => {
    try {
        res.cookie("token", "", {maxAge: 0});
        res.status(200).json({ message: "Logout successful" });

    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal error" });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const { profilePic, fullName, email } = req.body;
        const userId = req.user._id;

        // Créer l'objet de mise à jour avec les champs fournis
        const updateFields = {};
        
        // Traitement de la photo de profil si elle est fournie
        if (profilePic) {
            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            updateFields.profilePic = uploadResponse.secure_url;
        }
        
        // Ajout du nom complet s'il est fourni
        if (fullName !== undefined) {
            updateFields.fullName = fullName;
        }
        
        // Traitement de l'email s'il est fourni
        if (email !== undefined) {
            // Vérifier si l'email est déjà utilisé par un autre utilisateur
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use by another account" });
            }
            updateFields.email = email;
        }

        // Vérifier si nous avons des champs à mettre à jour
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields to update provided" });
        }

        // Mise à jour de l'utilisateur avec tous les champs fournis
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updateFields, 
            { new: true }
        ).select("-password"); // Exclure le mot de passe de la réponse

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({ message: "Internal error" });
    }
};


export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal error" });
    }
};
