import mongoose from 'mongoose';
import User from './models/User';
import Complaint from './models/Complaint';
import Notification from './models/Notification';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');

    // Clear existing data
    await User.deleteMany({});
    await Complaint.deleteMany({});
    await Notification.deleteMany({});

    // Create users
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password', salt);

    const citizen = new User({ name: 'Rahul Kumar', email: 'citizen@example.com', password: hash, role: 'citizen' });
    const admin = new User({ name: 'Admin User', email: 'admin@example.com', password: hash, role: 'admin' });
    const bbmp = new User({ name: 'BBMP Officer', email: 'bbmp@example.com', password: hash, role: 'bbmp' });
    const bescom = new User({ name: 'BESCOM Officer', email: 'bescom@example.com', password: hash, role: 'bescom' });

    await citizen.save();
    await admin.save();
    await bbmp.save();
    await bescom.save();

    // Create complaints
    const comp1 = new Complaint({
      citizen: citizen._id,
      issueType: 'Pothole',
      description: 'Large pothole on main road',
      location: 'MG Road, Bengaluru',
      lat: 12.9716,
      lng: 77.5946,
      priority: 'high',
      status: 'pending',
      aiSuggestedDept: 'BBMP',
    });
    await comp1.save();

    const comp2 = new Complaint({
      citizen: citizen._id,
      issueType: 'Streetlight Not Working',
      description: 'Streetlight not functioning',
      location: 'Koramangala, Bengaluru',
      lat: 12.9352,
      lng: 77.6245,
      priority: 'medium',
      status: 'assigned',
      aiSuggestedDept: 'BESCOM',
      assignedDept: 'BESCOM',
    });
    await comp2.save();

    // Create notification
    const notif = new Notification({
      recipient: citizen._id.toString(),
      recipientType: 'citizen',
      message: 'Your complaint about "Streetlight Not Working" has been assigned to BESCOM. Expected resolution: 3 days.',
      complaint: comp2._id,
    });
    await notif.save();

    console.log('Seeded data successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();