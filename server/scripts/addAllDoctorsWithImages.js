import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Doctor from '../models/Doctor.js';

dotenv.config();

const IMAGE_BASE_URL = 'http://localhost:5000/uploads/';

const allDoctors = [
  { name: "Dr. Princy Singh", email: "princy.singh@healthmate.com", speciality: "Neurologist", degree: "MBBS, MD - Neurology", experience: "5 Years", fees: 500, image: `${IMAGE_BASE_URL}doc1.png`, about: "Dr. Princy Singh is a renowned neurologist with over 5 years of experience." },
  { name: "Dr. Ramit Sambhoyal", email: "ramit.sambhoyal@healthmate.com", speciality: "General physician", degree: "MBBS", experience: "8 Years", fees: 400, image: `${IMAGE_BASE_URL}doc2.png`, about: "Dr. Ramit Sambhoyal is an experienced general physician." },
  { name: "Dr. Sanjay Barude", email: "sanjay.barude@healthmate.com", speciality: "Gastroenterologist", degree: "MBBS, MD - Gastroenterology", experience: "10 Years", fees: 600, image: `${IMAGE_BASE_URL}doc3.png`, about: "Dr. Sanjay Barude is a specialist in digestive system disorders." },
  { name: "Dr. Shushmita Mukharjee", email: "shushmita.mukharjee@healthmate.com", speciality: "Gynecologist", degree: "MBBS, MD - Gynecology", experience: "7 Years", fees: 550, image: `${IMAGE_BASE_URL}doc4.png`, about: "Dr. Shushmita Mukharjee is a compassionate gynecologist." },
  { name: "Dr. Shubindu Mahindru", email: "shubindu.mahindru@healthmate.com", speciality: "Dermatologist", degree: "MBBS, MD - Dermatology", experience: "6 Years", fees: 500, image: `${IMAGE_BASE_URL}doc5.png`, about: "Dr. Shubindu Mahindru is a leading dermatologist." },
  { name: "Dr. Neelesh Jain", email: "neelesh.jain@healthmate.com", speciality: "Neurologist", degree: "MBBS, MD - Neurology", experience: "4 Years", fees: 520, image: `${IMAGE_BASE_URL}doc6.png`, about: "Dr. Neelesh Jain is a skilled neurologist." },
  { name: "Dr. Manoj Bansal", email: "manoj.bansal@healthmate.com", speciality: "Gastroenterologist", degree: "MBBS, MD - Gastroenterology", experience: "9 Years", fees: 620, image: `${IMAGE_BASE_URL}doc7.png`, about: "Dr. Manoj Bansal is an expert in liver diseases." },
  { name: "Dr. K L Prajapati", email: "kl.prajapati@healthmate.com", speciality: "Gastroenterologist", degree: "MBBS, MD - Gastroenterology", experience: "12 Years", fees: 650, image: `${IMAGE_BASE_URL}doc8.png`, about: "Dr. K L Prajapati is a senior gastroenterologist." },
  { name: "Dr. Indu Bhawna", email: "indu.bhawna@healthmate.com", speciality: "Neurologist", degree: "MBBS, MD - Neurology", experience: "5 Years", fees: 510, image: `${IMAGE_BASE_URL}doc9.png`, about: "Dr. Indu Bhawna specializes in pediatric neurology." },
  { name: "Dr. Abhay Bhagwat", email: "abhay.bhagwat@healthmate.com", speciality: "Neurologist", degree: "MBBS, MD - Neurology", experience: "6 Years", fees: 540, image: `${IMAGE_BASE_URL}doc10.png`, about: "Dr. Abhay Bhagwat is an expert in stroke management." },
  { name: "Dr. Nipun Puranik", email: "nipun.puranik@healthmate.com", speciality: "Neurologist", degree: "MBBS, MD - Neurology", experience: "3 Years", fees: 480, image: `${IMAGE_BASE_URL}doc11.png`, about: "Dr. Nipun Puranik specializes in movement disorders." },
  { name: "Dr. Aveg Bhandari", email: "aveg.bhandari@healthmate.com", speciality: "Neurologist", degree: "MBBS, MD - Neurology", experience: "4 Years", fees: 490, image: `${IMAGE_BASE_URL}doc12.png`, about: "Dr. Aveg Bhandari focuses on cognitive neurology." },
  { name: "Dr. Alok Mandliya", email: "alok.mandliya@healthmate.com", speciality: "Neurologist", degree: "MBBS, MD - Neurology", experience: "7 Years", fees: 530, image: `${IMAGE_BASE_URL}doc13.png`, about: "Dr. Alok Mandliya specializes in peripheral nerve disorders." },
  { name: "Dr. Saloni Dashore", email: "saloni.dashore@healthmate.com", speciality: "General physician", degree: "MBBS", experience: "5 Years", fees: 380, image: `${IMAGE_BASE_URL}doc14.png`, about: "Dr. Saloni Dashore is a dedicated general physician." },
  { name: "Dr. Rajesh Karanjiya", email: "rajesh.karanjiya@healthmate.com", speciality: "General physician", degree: "MBBS", experience: "9 Years", fees: 420, image: `${IMAGE_BASE_URL}doc15.png`, about: "Dr. Rajesh Karanjiya specializes in diabetes management." },
  { name: "Dr. Himanshu Kelkar", email: "himanshu.kelkar@healthmate.com", speciality: "Pediatricians", degree: "MBBS, MD - Pediatrics", experience: "6 Years", fees: 450, image: `${IMAGE_BASE_URL}doc16.png`, about: "Dr. Himanshu Kelkar is a compassionate pediatrician." },
  { name: "Dr. Kawita Bapat", email: "kawita.bapat@healthmate.com", speciality: "Gynecologist", degree: "MBBS, MD - Gynecology", experience: "8 Years", fees: 580, image: `${IMAGE_BASE_URL}doc17.png`, about: "Dr. Kawita Bapat specializes in high-risk pregnancy." },
  { name: "Dr. Diksha Chachria", email: "diksha.chachria@healthmate.com", speciality: "Gynecologist", degree: "MBBS, MD - Gynecology", experience: "4 Years", fees: 480, image: `${IMAGE_BASE_URL}doc18.png`, about: "Dr. Diksha Chachria focuses on adolescent gynecology." },
  { name: "Dr. Manju Patidar", email: "manju.patidar@healthmate.com", speciality: "Gynecologist", degree: "MBBS, MD - Gynecology", experience: "10 Years", fees: 600, image: `${IMAGE_BASE_URL}doc19.png`, about: "Dr. Manju Patidar is an expert in menopause management." },
  { name: "Dr. Shaheen Kapoor", email: "shaheen.kapoor@healthmate.com", speciality: "Dermatologist", degree: "MBBS, MD - Dermatology", experience: "7 Years", fees: 520, image: `${IMAGE_BASE_URL}doc20.png`, about: "Dr. Shaheen Kapoor specializes in acne treatment." },
  { name: "Dr. Shraddha Pitalia", email: "shraddha.pitalia@healthmate.com", speciality: "Dermatologist", degree: "MBBS, MD - Dermatology", experience: "5 Years", fees: 490, image: `${IMAGE_BASE_URL}doc21.png`, about: "Dr. Shraddha Pitalia focuses on pediatric dermatology." },
  { name: "Dr. Dilip Hemnani", email: "dilip.hemnani@healthmate.com", speciality: "Dermatologist", degree: "MBBS, MD - Dermatology", experience: "11 Years", fees: 650, image: `${IMAGE_BASE_URL}doc22.png`, about: "Dr. Dilip Hemnani is an expert in hair transplantation." },
  { name: "Dr. Harshita Kothari", email: "harshita.kothari@healthmate.com", speciality: "Dermatologist", degree: "MBBS, MD - Dermatology", experience: "3 Years", fees: 460, image: `${IMAGE_BASE_URL}doc23.png`, about: "Dr. Harshita Kothari specializes in cosmetic dermatology." },
  { name: "Dr. Ashish Jaiswal", email: "ashish.jaiswal@healthmate.com", speciality: "Pediatricians", degree: "MBBS, MD - Pediatrics", experience: "8 Years", fees: 550, image: `${IMAGE_BASE_URL}doc24.png`, about: "Dr. Ashish Jaiswal specializes in neonatal care." },
  { name: "Dr. Mahendra Rathod", email: "mahendra.rathod@healthmate.com", speciality: "Pediatricians", degree: "MBBS, MD - Pediatrics", experience: "6 Years", fees: 500, image: `${IMAGE_BASE_URL}doc25.png`, about: "Dr. Mahendra Rathod focuses on pediatric gastroenterology." }
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
          available: true,
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
    
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

addAllDoctors();