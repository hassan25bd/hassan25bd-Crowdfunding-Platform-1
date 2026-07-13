import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Campaign } from '../models/Campaign.js';
import { Contribution } from '../models/Contribution.js';
import { Withdrawal } from '../models/Withdrawal.js';
import { Report } from '../models/Report.js';

const hash = (pw) => bcrypt.hash(pw, 10);

const run = async () => {
  await connectDB();

  const existingAdmin = await User.findOne({ email: 'admin@crowdnest.com' });
  if (existingAdmin) {
    console.log('Seed already applied (admin@crowdnest.com exists). Skipping.');
    await mongoose.disconnect();
    return;
  }

  console.log('Seeding demo data...');

  const admin = await User.create({
    name: 'Platform Admin',
    email: 'admin@crowdnest.com',
    passwordHash: await hash('Admin@12345'),
    authProvider: 'local',
    role: 'admin',
    credits: 0,
    profilePictureUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces',
  });

  const creators = await User.insertMany([
    {
      name: 'Amara Okoye',
      email: 'amara.creator@crowdnest.com',
      passwordHash: await hash('Creator@123'),
      authProvider: 'local',
      role: 'creator',
      credits: 20,
      profilePictureUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=faces',
    },
    {
      name: 'David Chen',
      email: 'david.creator@crowdnest.com',
      passwordHash: await hash('Creator@123'),
      authProvider: 'local',
      role: 'creator',
      credits: 20,
      profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    },
    {
      name: 'Sofia Martinez',
      email: 'sofia.creator@crowdnest.com',
      passwordHash: await hash('Creator@123'),
      authProvider: 'local',
      role: 'creator',
      credits: 20,
      profilePictureUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces',
    },
  ]);

  const supporters = await User.insertMany([
    {
      name: 'Liam Johnson',
      email: 'liam.supporter@crowdnest.com',
      passwordHash: await hash('Supporter@123'),
      authProvider: 'local',
      role: 'supporter',
      credits: 220,
      profilePictureUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces',
    },
    {
      name: 'Priya Sharma',
      email: 'priya.supporter@crowdnest.com',
      passwordHash: await hash('Supporter@123'),
      authProvider: 'local',
      role: 'supporter',
      credits: 90,
      profilePictureUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=faces',
    },
    {
      name: 'Noah Williams',
      email: 'noah.supporter@crowdnest.com',
      passwordHash: await hash('Supporter@123'),
      authProvider: 'local',
      role: 'supporter',
      credits: 50,
      profilePictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces',
    },
  ]);

  const [amara, david, sofia] = creators;
  const [liam, priya, noah] = supporters;

  const campaignDefs = [
    {
      creator: amara,
      title: 'Solar-Powered Water Pump for Kagera Village',
      story:
        'Kagera village walks over two hours a day to fetch clean water. We are installing a solar-powered pump and filtration system that will bring safe drinking water directly to the village center, cutting that walk to zero and freeing up hundreds of hours a week for school and work.',
      category: 'Community',
      fundingGoal: 3000,
      minimumContribution: 10,
      deadline: futureDate(45),
      rewardInfo: 'Backers receive a photo update from the installation and a handwritten thank-you note from the village council.',
      imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80',
      amountRaised: 1450,
      status: 'approved',
    },
    {
      creator: david,
      title: 'Mobile Health Clinic Van',
      story:
        'We are outfitting a retired delivery van into a fully equipped mobile clinic to bring basic checkups, vaccinations, and prenatal care to three underserved rural counties that currently have no nearby clinic.',
      category: 'Health',
      fundingGoal: 5000,
      minimumContribution: 20,
      deadline: futureDate(60),
      rewardInfo: 'Supporters get quarterly impact reports showing patients served and services provided.',
      imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&q=80',
      amountRaised: 2600,
      status: 'approved',
    },
    {
      creator: sofia,
      title: 'Neighborhood Library Renovation',
      story:
        'Our free community library has served this neighborhood for 30 years, but the shelving is falling apart and there is no accessible seating for wheelchair users. This campaign funds new shelving, accessible tables, and a reading nook for kids.',
      category: 'Education',
      fundingGoal: 1800,
      minimumContribution: 5,
      deadline: futureDate(30),
      rewardInfo: 'Your name will be added to the donor plaque inside the renovated library.',
      imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80',
      amountRaised: 1800,
      status: 'approved',
    },
    {
      creator: amara,
      title: 'Community Garden Rebuild After Flooding',
      story:
        'Last month\'s flooding destroyed the raised beds and irrigation lines at our community garden, which supplies fresh produce to over 40 local families. We need to rebuild the beds and install a flood-resistant drip irrigation system.',
      category: 'Environment',
      fundingGoal: 1200,
      minimumContribution: 5,
      deadline: futureDate(21),
      rewardInfo: 'Backers over 50 credits get a basket of the first harvest.',
      imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&q=80',
      amountRaised: 340,
      status: 'approved',
    },
    {
      creator: david,
      title: 'Open-Source Prosthetic Hand Kit',
      story:
        'We are developing a low-cost, 3D-printable prosthetic hand kit and releasing the designs open-source so clinics in low-resource areas can produce them locally for a fraction of commercial cost.',
      category: 'Technology',
      fundingGoal: 4000,
      minimumContribution: 15,
      deadline: futureDate(50),
      rewardInfo: 'Early backers get access to the design files two weeks before public release.',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80',
      amountRaised: 980,
      status: 'approved',
    },
    {
      creator: sofia,
      title: 'Youth Mural Arts Program',
      story:
        'This campaign funds paint, supplies, and a stipend for a local artist to lead a summer mural program where teenagers design and paint murals on three blank walls downtown, turning neglected spaces into public art.',
      category: 'Art',
      fundingGoal: 900,
      minimumContribution: 5,
      deadline: futureDate(15),
      rewardInfo: 'Supporters are invited to the unveiling event and get a print of the final mural design.',
      imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&q=80',
      amountRaised: 210,
      status: 'approved',
    },
    {
      creator: david,
      title: 'Weekend Coding Bootcamp for Displaced Workers',
      story:
        'A free weekend coding bootcamp to help workers displaced by factory automation build web development skills and transition into tech roles, taught by volunteer working developers.',
      category: 'Education',
      fundingGoal: 1500,
      minimumContribution: 10,
      deadline: futureDate(40),
      rewardInfo: '',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
      amountRaised: 0,
      status: 'pending',
    },
  ];

  const campaigns = await Campaign.insertMany(
    campaignDefs.map((c) => ({
      creatorEmail: c.creator.email,
      creatorName: c.creator.name,
      title: c.title,
      story: c.story,
      category: c.category,
      fundingGoal: c.fundingGoal,
      minimumContribution: c.minimumContribution,
      deadline: c.deadline,
      rewardInfo: c.rewardInfo,
      imageUrl: c.imageUrl,
      amountRaised: c.amountRaised,
      status: c.status,
    }))
  );

  const solarPump = campaigns[0];
  const clinicVan = campaigns[1];
  const garden = campaigns[3];

  await Contribution.insertMany([
    {
      campaignId: solarPump._id,
      campaignTitle: solarPump.title,
      amount: 200,
      message: 'Amazing initiative, happy to help bring clean water to Kagera!',
      supporterEmail: liam.email,
      supporterName: liam.name,
      creatorEmail: amara.email,
      creatorName: amara.name,
      status: 'approved',
    },
    {
      campaignId: clinicVan._id,
      campaignTitle: clinicVan.title,
      amount: 100,
      message: 'My grandmother could really use a service like this. Rooting for you.',
      supporterEmail: priya.email,
      supporterName: priya.name,
      creatorEmail: david.email,
      creatorName: david.name,
      status: 'approved',
    },
    {
      campaignId: garden._id,
      campaignTitle: garden.title,
      amount: 30,
      message: 'Hope the new beds survive the next storm!',
      supporterEmail: noah.email,
      supporterName: noah.name,
      creatorEmail: amara.email,
      creatorName: amara.name,
      status: 'pending',
    },
  ]);

  await Withdrawal.create({
    creatorEmail: sofia.email,
    creatorName: sofia.name,
    withdrawalCredit: 200,
    withdrawalAmount: 10,
    paymentSystem: 'Stripe',
    accountNumber: 'acct_demo_001',
    status: 'pending',
  });

  await Report.create({
    campaignId: campaigns[4]._id,
    campaignTitle: campaigns[4].title,
    reporterEmail: noah.email,
    reporterName: noah.name,
    reason: 'The linked design files repository in the story looks inactive — worth double-checking before this gets more funding.',
    status: 'pending',
  });

  console.log('Seed complete.');
  console.log('Admin login: admin@crowdnest.com / Admin@12345');
  console.log(`Created ${creators.length} creators, ${supporters.length} supporters, ${campaigns.length} campaigns.`);

  await mongoose.disconnect();
};

function futureDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
