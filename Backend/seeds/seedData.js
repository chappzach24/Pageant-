const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Organization = require('../models/Organization');
const Pageant = require('../models/Pageant');
const Participant = require('../models/Participant');
const ContestantProfile = require('../models/ContestantProfile');
const Payment = require('../models/Payment');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Clear all data
const clearData = async () => {
  try {
    await User.deleteMany({});
    await Organization.deleteMany({});
    await Pageant.deleteMany({});
    await Participant.deleteMany({});
    await ContestantProfile.deleteMany({});
    await Payment.deleteMany({});
    console.log('✅ All data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

// Seed data
const seedData = async () => {
  try {
    console.log('🌱 Starting to seed data...');

    // Create organizer users
    const organizerUsers = await User.create([
      {
        username: 'sarah_organizer',
        email: 'sarah@pageantworld.com',
        password: 'password123',
        firstName: 'Sarah',
        lastName: 'Johnson',
        dateOfBirth: new Date('1985-06-15'),
        role: 'organizer'
      },
      {
        username: 'mike_events',
        email: 'mike@glamourevents.com',
        password: 'password123',
        firstName: 'Mike',
        lastName: 'Williams',
        dateOfBirth: new Date('1980-03-22'),
        role: 'organizer'
      },
      {
        username: 'lisa_pageants',
        email: 'lisa@crowncompetitions.com',
        password: 'password123',
        firstName: 'Lisa',
        lastName: 'Davis',
        dateOfBirth: new Date('1988-11-08'),
        role: 'organizer'
      }
    ]);
    console.log('✅ Organizer users created');

    // Create contestant users
    const contestantUsers = await User.create([
      {
        username: 'emma_contestant',
        email: 'emma.johnson@email.com',
        password: 'password123',
        firstName: 'Emma',
        lastName: 'Johnson',
        dateOfBirth: new Date('2010-03-15'),
        role: 'contestant'
      },
      {
        username: 'sophia_davis',
        email: 'sophia.davis@email.com',
        password: 'password123',
        firstName: 'Sophia',
        lastName: 'Davis',
        dateOfBirth: new Date('2015-07-22'),
        role: 'contestant'
      },
      {
        username: 'isabella_martinez',
        email: 'isabella.martinez@email.com',
        password: 'password123',
        firstName: 'Isabella',
        lastName: 'Martinez',
        dateOfBirth: new Date('2008-11-05'),
        role: 'contestant'
      },
      {
        username: 'olivia_wilson',
        email: 'olivia.wilson@email.com',
        password: 'password123',
        firstName: 'Olivia',
        lastName: 'Wilson',
        dateOfBirth: new Date('2012-09-12'),
        role: 'contestant'
      },
      {
        username: 'ava_brown',
        email: 'ava.brown@email.com',
        password: 'password123',
        firstName: 'Ava',
        lastName: 'Brown',
        dateOfBirth: new Date('2009-05-18'),
        role: 'contestant'
      },
      {
        username: 'mia_garcia',
        email: 'mia.garcia@email.com',
        password: 'password123',
        firstName: 'Mia',
        lastName: 'Garcia',
        dateOfBirth: new Date('2007-12-03'),
        role: 'contestant'
      },
      {
        username: 'charlotte_miller',
        email: 'charlotte.miller@email.com',
        password: 'password123',
        firstName: 'Charlotte',
        lastName: 'Miller',
        dateOfBirth: new Date('2011-08-27'),
        role: 'contestant'
      },
      {
        username: 'amelia_wilson',
        email: 'amelia.wilson@email.com',
        password: 'password123',
        firstName: 'Amelia',
        lastName: 'Wilson',
        dateOfBirth: new Date('2006-02-14'),
        role: 'contestant'
      }
    ]);
    console.log('✅ Contestant users created');

    // Create organizations
    const organizations = await Organization.create([
      {
        name: 'Pageant World Productions',
        description: 'Premier pageant organization specializing in youth competitions across the Midwest.',
        owner: organizerUsers[0]._id,
        contactEmail: 'info@pageantworld.com',
        contactPhone: '(555) 123-4567',
        address: {
          street: '123 Main Street',
          city: 'Columbus',
          state: 'OH',
          zipCode: '43215',
          country: 'USA'
        },
        socialMedia: {
          facebook: 'pageantworld',
          instagram: '@pageantworld',
          twitter: '@pageantworld'
        }
      },
      {
        name: 'Glamour Events LLC',
        description: 'Creating magical pageant experiences for contestants of all ages since 2015.',
        owner: organizerUsers[1]._id,
        contactEmail: 'contact@glamourevents.com',
        contactPhone: '(555) 234-5678',
        address: {
          street: '456 Oak Avenue',
          city: 'Cleveland',
          state: 'OH',
          zipCode: '44101',
          country: 'USA'
        },
        socialMedia: {
          facebook: 'glamourevents',
          instagram: '@glamour_events',
          twitter: '@glamourevents'
        }
      },
      {
        name: 'Crown Competitions',
        description: 'Elite pageant competitions focusing on scholarship and community service.',
        owner: organizerUsers[2]._id,
        contactEmail: 'hello@crowncompetitions.com',
        contactPhone: '(555) 345-6789',
        address: {
          street: '789 Elm Street',
          city: 'Cincinnati',
          state: 'OH',
          zipCode: '45201',
          country: 'USA'
        },
        socialMedia: {
          facebook: 'crowncompetitions',
          instagram: '@crown_comps',
          twitter: '@crowncomps'
        }
      }
    ]);
    console.log('✅ Organizations created');

    // Create pageants
    const pageants = await Pageant.create([
      {
        name: 'Miss Spring Festival 2025',
        pageantID: 'SPF2025-001',
        description: 'Annual spring festival pageant celebrating young talent and community spirit.',
        organization: organizations[0]._id,
        startDate: new Date('2025-04-15'),
        endDate: new Date('2025-04-16'),
        competitionYear: 2025,
        location: {
          venue: 'Grand Ballroom',
          address: {
            street: '100 Convention Center Drive',
            city: 'Columbus',
            state: 'OH',
            zipCode: '43215',
            country: 'USA'
          }
        },
        registrationDeadline: new Date('2025-03-15'),
        maxParticipants: 50,
        entryFee: {
          amount: 125,
          currency: 'USD'
        },
        ageGroups: ['9 - 12 Years', '13 - 18 Years'],
        categories: [
          {
            name: 'Evening Gown',
            description: 'Formal evening wear presentation',
            price: 25
          },
          {
            name: 'Talent',
            description: 'Individual talent performance',
            price: 25
          },
          {
            name: 'Interview',
            description: 'Personal interview with judges',
            price: 25
          },
          {
            name: 'Swimwear',
            description: 'Athletic wear presentation',
            price: 25
          }
        ],
        status: 'published',
        isPublic: true
      },
      {
        name: 'Teen Miss Summer 2025',
        pageantID: 'TMS2025-002',
        description: 'Summer pageant for teenage contestants focusing on leadership and talent.',
        organization: organizations[1]._id,
        startDate: new Date('2025-06-20'),
        endDate: new Date('2025-06-21'),
        competitionYear: 2025,
        location: {
          venue: 'Civic Center Theater',
          address: {
            street: '200 Public Square',
            city: 'Cleveland',
            state: 'OH',
            zipCode: '44101',
            country: 'USA'
          }
        },
        registrationDeadline: new Date('2025-05-20'),
        maxParticipants: 30,
        entryFee: {
          amount: 95,
          currency: 'USD'
        },
        ageGroups: ['13 - 18 Years'],
        categories: [
          {
            name: 'Evening Gown',
            description: 'Formal evening wear presentation',
            price: 30
          },
          {
            name: 'Talent',
            description: 'Individual talent performance',
            price: 30
          },
          {
            name: 'Interview',
            description: 'Personal interview with judges',
            price: 35
          }
        ],
        status: 'published',
        isPublic: true
      },
      {
        name: 'Little Miss Sunshine 2025',
        pageantID: 'LMS2025-003',
        description: 'Bright and cheerful pageant for our youngest contestants.',
        organization: organizations[2]._id,
        startDate: new Date('2025-08-10'),
        endDate: new Date('2025-08-11'),
        competitionYear: 2025,
        location: {
          venue: 'Community Theater',
          address: {
            street: '300 Arts District',
            city: 'Toledo',
            state: 'OH',
            zipCode: '43601',
            country: 'USA'
          }
        },
        registrationDeadline: new Date('2025-07-10'),
        maxParticipants: 25,
        entryFee: {
          amount: 75,
          currency: 'USD'
        },
        ageGroups: ['5 - 8 Years', '9 - 12 Years'],
        categories: [
          {
            name: 'Party Dress',
            description: 'Fun party dress presentation',
            price: 25
          },
          {
            name: 'Talent',
            description: 'Show us what you can do!',
            price: 25
          },
          {
            name: 'Interview',
            description: 'Tell us about yourself',
            price: 25
          }
        ],
        status: 'published',
        isPublic: true
      },
      {
        name: 'Miss Holiday Gala 2025',
        pageantID: 'MHG2025-004',
        description: 'Elegant holiday pageant with a winter wonderland theme.',
        organization: organizations[0]._id,
        startDate: new Date('2025-12-15'),
        endDate: new Date('2025-12-15'),
        competitionYear: 2025,
        location: {
          venue: 'Hotel Grand Ballroom',
          address: {
            street: '400 Luxury Lane',
            city: 'Cincinnati',
            state: 'OH',
            zipCode: '45202',
            country: 'USA'
          }
        },
        registrationDeadline: new Date('2025-11-15'),
        maxParticipants: 40,
        entryFee: {
          amount: 150,
          currency: 'USD'
        },
        ageGroups: ['13 - 18 Years', '19 - 39 Years'],
        categories: [
          {
            name: 'Evening Gown',
            description: 'Elegant formal wear',
            price: 40
          },
          {
            name: 'Talent',
            description: 'Holiday-themed talent',
            price: 35
          },
          {
            name: 'Interview',
            description: 'Personal interview',
            price: 35
          },
          {
            name: 'Holiday Fashion',
            description: 'Festive fashion presentation',
            price: 40
          }
        ],
        status: 'published',
        isPublic: true
      }
    ]);
    console.log('✅ Pageants created');

    // Create contestant profiles
    const contestantProfiles = [];
    for (let i = 0; i < contestantUsers.length; i++) {
      const profile = await ContestantProfile.create({
        user: contestantUsers[i]._id,
        biography: `I'm ${contestantUsers[i].firstName}, a passionate young performer who loves dancing, singing, and community service. I've been involved in pageants for ${Math.floor(Math.random() * 3) + 1} years and I'm excited to continue growing!`,
        funFact: [
          'I can speak three languages fluently!',
          'I have a black belt in karate.',
          'I play five different musical instruments.',
          'I volunteer at the local animal shelter every weekend.',
          'I love baking and want to open my own bakery someday.',
          'I collect vintage books and have over 200 in my collection.',
          'I can do magic tricks and love entertaining people.',
          'I write poetry and have been published in our school magazine.'
        ][i % 8],
        appearance: {
          hairColor: ['Blonde', 'Brown', 'Black', 'Auburn', 'Dark Brown'][Math.floor(Math.random() * 5)],
          eyeColor: ['Blue', 'Brown', 'Green', 'Hazel', 'Gray'][Math.floor(Math.random() * 5)]
        },
        emergencyContact: {
          name: `${contestantUsers[i].firstName === 'Emma' ? 'Sarah' : 'Maria'} ${contestantUsers[i].lastName}`,
          phone: `(555) ${100 + i}${200 + i}-${1000 + i * 111}`,
          relationship: 'Mother'
        },
        medicalInformation: {
          allergies: ['None', 'Peanuts', 'Shellfish', 'None', 'Seasonal allergies'][i % 5],
          medicalConditions: ['None', 'Asthma', 'None', 'None', 'None'][i % 5]
        },
        documents: {
          proofOfAgeType: 'birth-certificate'
        }
      });
      contestantProfiles.push(profile);
    }
    console.log('✅ Contestant profiles created');

    // Create participants (applications) with various statuses
    const participants = [];
    
    // Spring Festival participants (Mix of statuses)
    const springParticipants = [
      {
        user: contestantUsers[0]._id, // Emma - pending
        pageant: pageants[0]._id,
        contestantProfile: contestantProfiles[0]._id,
        categories: [
          { category: 'Evening Gown' },
          { category: 'Talent' },
          { category: 'Interview' }
        ],
        ageGroup: '13 - 18 Years',
        status: 'registered',
        paymentStatus: 'completed',
        paymentAmount: 100,
        totalPaid: 100,
        balanceDue: 0
      },
      {
        user: contestantUsers[1]._id, // Sophia - pending
        pageant: pageants[0]._id,
        contestantProfile: contestantProfiles[1]._id,
        categories: [
          { category: 'Talent' },
          { category: 'Interview' }
        ],
        ageGroup: '9 - 12 Years',
        status: 'registered',
        paymentStatus: 'completed',
        paymentAmount: 75,
        totalPaid: 75,
        balanceDue: 0
      },
      {
        user: contestantUsers[2]._id, // Isabella - approved
        pageant: pageants[0]._id,
        contestantProfile: contestantProfiles[2]._id,
        categories: [
          { category: 'Evening Gown' },
          { category: 'Talent' },
          { category: 'Interview' },
          { category: 'Swimwear' }
        ],
        ageGroup: '13 - 18 Years',
        status: 'confirmed',
        paymentStatus: 'completed',
        paymentAmount: 125,
        totalPaid: 125,
        balanceDue: 0,
        approvalDate: new Date('2025-02-01'),
        notes: 'Excellent application, strong experience in pageants.'
      },
      {
        user: contestantUsers[3]._id, // Olivia - rejected
        pageant: pageants[0]._id,
        contestantProfile: contestantProfiles[3]._id,
        categories: [
          { category: 'Evening Gown' },
          { category: 'Interview' }
        ],
        ageGroup: '9 - 12 Years',
        status: 'disqualified',
        paymentStatus: 'refunded',
        paymentAmount: 75,
        totalPaid: 75,
        totalRefunded: 75,
        balanceDue: 0,
        rejectionReason: 'Age verification documents not provided',
        notes: 'Missing required documentation.'
      }
    ];

    // Teen Summer participants
    const summerParticipants = [
      {
        user: contestantUsers[4]._id, // Ava - pending
        pageant: pageants[1]._id,
        contestantProfile: contestantProfiles[4]._id,
        categories: [
          { category: 'Evening Gown' },
          { category: 'Talent' },
          { category: 'Interview' }
        ],
        ageGroup: '13 - 18 Years',
        status: 'registered',
        paymentStatus: 'completed',
        paymentAmount: 95,
        totalPaid: 95,
        balanceDue: 0
      },
      {
        user: contestantUsers[5]._id, // Mia - pending
        pageant: pageants[1]._id,
        contestantProfile: contestantProfiles[5]._id,
        categories: [
          { category: 'Talent' },
          { category: 'Interview' }
        ],
        ageGroup: '13 - 18 Years',
        status: 'registered',
        paymentStatus: 'completed',
        paymentAmount: 65,
        totalPaid: 65,
        balanceDue: 0
      },
      {
        user: contestantUsers[6]._id, // Charlotte - approved
        pageant: pageants[1]._id,
        contestantProfile: contestantProfiles[6]._id,
        categories: [
          { category: 'Evening Gown' },
          { category: 'Interview' }
        ],
        ageGroup: '9 - 12 Years',
        status: 'confirmed',
        paymentStatus: 'completed',
        paymentAmount: 65,
        totalPaid: 65,
        balanceDue: 0,
        approvalDate: new Date('2025-01-15'),
        notes: 'Great enthusiasm and preparation.'
      }
    ];

    // Little Miss Sunshine participants
    const sunshineParticipants = [
      {
        user: contestantUsers[7]._id, // Amelia - pending
        pageant: pageants[2]._id,
        contestantProfile: contestantProfiles[7]._id,
        categories: [
          { category: 'Party Dress' },
          { category: 'Talent' }
        ],
        ageGroup: '13 - 18 Years',
        status: 'registered',
        paymentStatus: 'completed',
        paymentAmount: 50,
        totalPaid: 50,
        balanceDue: 0
      }
    ];

    // Create all participants
    const allParticipants = [...springParticipants, ...summerParticipants, ...sunshineParticipants];
    
    for (const participantData of allParticipants) {
      const participant = await Participant.create(participantData);
      participants.push(participant);
    }
    console.log('✅ Participants created');

    // Create payment records
    const payments = [];
    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];
      
      if (participant.paymentStatus === 'completed' || participant.paymentStatus === 'refunded') {
        const payment = await Payment.create({
          participant: participant._id,
          user: participant.user,
          pageant: participant.pageant,
          amount: participant.paymentAmount,
          status: 'completed',
          method: 'stripe',
          transactionId: `txn_${Date.now()}_${i}`,
          stripeSessionId: `cs_test_${Math.random().toString(36).substr(2, 9)}`,
          stripePaymentIntentId: `pi_${Math.random().toString(36).substr(2, 9)}`,
          description: `Registration payment`,
          metadata: {
            categories: participant.categories.map(cat => cat.category).join(', ')
          }
        });
        
        // Add payment to participant's history
        await Participant.findByIdAndUpdate(
          participant._id,
          { $push: { paymentHistory: payment._id } }
        );
        
        payments.push(payment);
      }
    }
    console.log('✅ Payment records created');

    console.log('\n🎉 Seed data creation completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${organizerUsers.length + contestantUsers.length}`);
    console.log(`🏢 Organizations: ${organizations.length}`);
    console.log(`🏆 Pageants: ${pageants.length}`);
    console.log(`👑 Contestants: ${contestantUsers.length}`);
    console.log(`📝 Applications: ${participants.length}`);
    console.log(`💳 Payments: ${payments.length}`);

    console.log('\n🔑 Test Login Credentials:');
    console.log('\n📋 Organizers:');
    console.log('Email: sarah@pageantworld.com | Password: password123');
    console.log('Email: mike@glamourevents.com | Password: password123');
    console.log('Email: lisa@crowncompetitions.com | Password: password123');
    
    console.log('\n👑 Contestants:');
    console.log('Email: emma.johnson@email.com | Password: password123');
    console.log('Email: sophia.davis@email.com | Password: password123');
    console.log('Email: isabella.martinez@email.com | Password: password123');

    console.log('\n📈 Application Status Summary:');
    console.log('- Pending Applications: 5');
    console.log('- Approved Applications: 2');
    console.log('- Rejected Applications: 1');

  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// Main seed function
const seed = async () => {
  await connectDB();
  await clearData();
  await seedData();
  mongoose.connection.close();
  console.log('\n✅ Database connection closed');
  process.exit(0);
};

// Run if called directly
if (require.main === module) {
  seed();
}

module.exports = { seed, clearData, seedData };