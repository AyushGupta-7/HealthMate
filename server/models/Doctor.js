import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Doctor name is required'],
        trim: true 
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    image: { 
        type: String, 
        required: [true, 'Doctor image is required'],
        default: ''
    },
    speciality: { 
        type: String, 
        required: [true, 'Speciality is required'],
        enum: ['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist']
    },
    degree: { 
        type: String, 
        required: [true, 'Degree is required'],
        default: 'MBBS'
    },
    experience: { 
        type: String, 
        required: [true, 'Experience is required'],
        default: '0 Years'
    },
    about: { 
        type: String, 
        required: [true, 'About description is required'],
        default: ''
    },
    available: { 
        type: Boolean, 
        default: true 
    },
    fees: { 
        type: Number, 
        required: [true, 'Consultation fee is required'],
        default: 0
    },
    slots_booked: { 
        type: Object, 
        default: {} 
    },
    address: {
        line1: { type: String, required: true, default: '' },
        line2: { type: String, default: '' },
        city: { type: String, required: true, default: '' },
        state: { type: String, required: true, default: '' },
        pincode: { type: String, default: '' }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { minimize: false });

// Remove password field when sending response
doctorSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
export default doctorModel;