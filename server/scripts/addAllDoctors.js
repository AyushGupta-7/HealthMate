import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Doctor from '../models/Doctor.js';

dotenv.config();

const allDoctors = [
    { name: "Dr. Princy Singh", email: "princy.singh@healthmate.com", speciality: "Neurologist", degree: "MBBS, MD - Neurology", experience: "5 Years", fees: 500, image: "https://randomuser.me/api/portraits/women/1.jpg", about: "Dr. Princy Singh is a renowned neurologist with over 5 years of experience in treating complex neurological disorders." },
    { name: "Dr. Ramit Sambhoyal", email: "ramit.sambhoyal@healthmate.com", speciality: "General physician", degree: "MBBS", experience: "8 Years", fees: 400, image: "https://randomuser.me/api/portraits/men/1.jpg", about: "Dr. Ramit Sambhoyal is an experienced general physician providing comprehensive primary care services." },
    { name: "Dr. Sanjay Barude", email: "sanjay.barude@healthmate.com", speciality: "Gastroenterologist", degree: "MBBS, MD - Gastroenterology", experience: "10 Years", fees: 600, image: "https://randomuser.me/api/portraits/men/2.jpg", about: "Dr. Sanjay Barude is a specialist in digestive system disorders." },
    { name: "Dr. Shushmita Mukharjee", email: "shushmita.mukharjee@healthmate.com", speciality: "Gynecologist", degree: "MBBS, MD - Gynecology", experience: "7 Years", fees: 550, image: "https://randomuser.me/api/portraits/women/2.jpg", about: "Dr. Shushmita Mukharjee is a compassionate gynecologist specializing in women's health." },
    { name: "Dr. Shubindu Mahindru", email: "shubindu.mahindru@healthmate.com", speciality: "Dermatologist", degree: "MBBS, MD - Dermatology", experience: "6 Years", fees: 500, image: "https://randomuser.me/api/portraits/men/3.jpg", about: "Dr. Shubindu Mahindru is a leading dermatologist specializing in skin care." },
    { name: "Dr. Neelesh Jain", email: "neelesh.jain@healthmate.com", speciality: "Neurologist", degree: "MBBS, MD - Neurology", experience: "4 Years", fees: 520, image: "https://randomuser.me/api/portraits/men/4.jpg", about: "Dr. Neelesh Jain is a skilled neurologist focusing on stroke management." },
    { name: "Dr. Manoj Bansal", email: "manoj.bansal@healthmate.com", speciality: "Gastroenterologist", degree: "MBBS, MD - Gastroenterology", experience: "9 Years", fees: 620, image: "https://randomuser.me/api/portraits/men/5.jpg", about: "Dr. Manoj Bansal is an expert in liver diseases." },
    { name: "Dr. K L Prajapati", email: "kl.prajapati@healthmate.com", speciality: "Gastroenterologist", degree: "MBBS, MD - Gastroenterology", experience: "12 Years", fees: 650, image: "https://randomuser.me/api/portraits/men/6.jpg", about: "Dr. K L Prajapati is a senior gastroenterologist." },
    { name: "Dr. Indu Bhawna", email: "indu.bhawna@healthmate.com", speciality: "Neurologist", degree: "MBBS, MD - Neurology", experience: "5 Years", fees: 510, image: "https://randomuser.me/api/portraits/women/3.jpg", about: "Dr. Indu Bhawna specializes in pediatric neurology." },
    { name: "Dr. Abhay Bhagwat", email: "abhay.bhagwat@healthmate.com", speciality: "Neurologist", degree: "MBBS, MD - Neurology", experience: "6 Years", fees: 540, image: "https://randomuser.me/api/portraits/men/7.jpg", about: "Dr. Abhay Bhagwat is an expert in stroke management." },
    { name: "Dr. Nipun Puranik", email: "nipun.puranik@healthmate.com", speciality: "Neurologist", degree: "MBBS, MD - Neurology", experience: "3 Years", fees: 480, image: "https://randomuser.me/api/portraits/men/8.jpg", about: "Dr. Nipun Puranik specializes in movement disorders." },
    { name: "Dr. Aveg Bhandari", email: "aveg.bhandari@healthmate.com", speciality: "Neurologist", degree: "MBBS, MD - Neurology", experience: "4 Years", fees: 490, image: "https://randomuser.me/api/portraits/men/9.jpg", about: "Dr. Aveg Bhandari focuses on cognitive neurology." },
    { name: "Dr. Alok Mandliya", email: "alok.mandliya@healthmate.com", speciality: "Neurologist", degree: "MBBS, MD - Neurology", experience: "7 Years", fees: 530, image: "https://randomuser.me/api/portraits/men/10.jpg", about: "Dr. Alok Mandliya specializes in peripheral nerve disorders." },
    { name: "Dr. Saloni Dashore", email: "saloni.dashore@healthmate.com", speciality: "General physician", degree: "MBBS", experience: "5 Years", fees: 380, image: "https://randomuser.me/api/portraits/women/4.jpg", about: "Dr. Saloni Dashore is a dedicated general physician." },
    { name: "Dr. Rajesh Karanjiya", email: "rajesh.karanjiya@healthmate.com", speciality: "General physician", degree: "MBBS", experience: "9 Years", fees: 420, image: "https://randomuser.me/api/portraits/men/11.jpg", about: "Dr. Rajesh Karanjiya specializes in diabetes management." },
    { name: "Dr. Himanshu Kelkar", email: "himanshu.kelkar@healthmate.com", speciality: "Pediatricians", degree: "MBBS, MD - Pediatrics", experience: "6 Years", fees: 450, image: "https://randomuser.me/api/portraits/men/12.jpg", about: "Dr. Himanshu Kelkar is a compassionate pediatrician." },
    { name: "Dr. Kawita Bapat", email: "kawita.bapat@healthmate.com", speciality: "Gynecologist", degree: "MBBS, MD - Gynecology", experience: "8 Years", fees: 580, image: "https://randomuser.me/api/portraits/women/5.jpg", about: "Dr. Kawita Bapat specializes in high-risk pregnancy." },
    { name: "Dr. Diksha Chachria", email: "diksha.chachria@healthmate.com", speciality: "Gynecologist", degree: "MBBS, MD - Gynecology", experience: "4 Years", fees: 480, image: "https://randomuser.me/api/portraits/women/6.jpg", about: "Dr. Diksha Chachria focuses on adolescent gynecology." },
    { name: "Dr. Manju Patidar", email: "manju.patidar@healthmate.com", speciality: "Gynecologist", degree: "MBBS, MD - Gynecology", experience: "10 Years", fees: 600, image: "https://randomuser.me/api/portraits/women/7.jpg", about: "Dr. Manju Patidar is an expert in menopause management." },
    { name: "Dr. Shaheen Kapoor", email: "shaheen.kapoor@healthmate.com", speciality: "Dermatologist", degree: "MBBS, MD - Dermatology", experience: "7 Years", fees: 520, image: "https://randomuser.me/api/portraits/women/8.jpg", about: "Dr. Shaheen Kapoor specializes in acne treatment." },
    { name: "Dr. Shraddha Pitalia", email: "shraddha.pitalia@healthmate.com", speciality: "Dermatologist", degree: "MBBS, MD - Dermatology", experience: "5 Years", fees: 490, image: "https://randomuser.me/api/portraits/women/9.jpg", about: "Dr. Shraddha Pitalia focuses on pediatric dermatology." },
    { name: "Dr. Dilip Hemnani", email: "dilip.hemnani@healthmate.com", speciality: "Dermatologist", degree: "MBBS, MD - Dermatology", experience: "11 Years", fees: 650, image: "https://randomuser.me/api/portraits/men/13.jpg", about: "Dr. Dilip Hemnani is an expert in hair transplantation." },
    { name: "Dr. Harshita Kothari", email: "harshita.kothari@healthmate.com", speciality: "Dermatologist", degree: "MBBS, MD - Dermatology", experience: "3 Years", fees: 460, image: "https://randomuser.me/api/portraits/women/10.jpg", about: "Dr. Harshita Kothari specializes in cosmetic dermatology." },
    { name: "Dr. Ashish Jaiswal", email: "ashish.jaiswal@healthmate.com", speciality: "Pediatricians", degree: "MBBS, MD - Pediatrics", experience: "8 Years", fees: 550, image: "https://randomuser.me/api/portraits/men/14.jpg", about: "Dr. Ashish Jaiswal specializes in neonatal care." },
    { name: "Dr. Mahendra Rathod", email: "mahendra.rathod@healthmate.com", speciality: "Pediatricians", degree: "MBBS, MD - Pediatrics", experience: "6 Years", fees: 500, image: "https://randomuser.me/api/portraits/men/15.jpg", about: "Dr. Mahendra Rathod focuses on pediatric gastroenterology." }
];

const addAllDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        let addedCount = 0;
        let existingCount = 0;

        for (const doctor of allDoctors) {
            const existing = await Doctor.findOne({ email: doctor.email });
            if (!existing) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('Doctor@123', salt);

                await Doctor.create({
                    ...doctor,
                    password: hashedPassword,
                    address: { line1: "Clinic Address", city: "Indore", state: "Madhya Pradesh", pincode: "452001" }
                });
                addedCount++;
                console.log(`✅ Added: ${doctor.name}`);
            } else {
                existingCount++;
                console.log(`⚠️ Already exists: ${doctor.name}`);
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`   Added: ${addedCount} doctors`);
        console.log(`   Already existed: ${existingCount} doctors`);
        console.log(`   Total: ${allDoctors.length} doctors`);

        const totalDoctors = await Doctor.countDocuments();
        console.log(`\n📋 Total doctors in database: ${totalDoctors}`);

        process.exit();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

addAllDoctors();