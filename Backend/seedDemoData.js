/*
 * SIH demo seed — safe to run repeatedly.
 * Creates 22 fictional farmers, each with a linked account and request.
 * Existing accounts with the same demo mobile are left unchanged.
 *
 * Run: npm.cmd run seed:demo
 * Farmer password: farmer123
 * Officer: 9000000001 / officer123
 * Admin:   9999999998 / admin123
 */
require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Farmer = require("./models/Farmer");
const ProcurementRequest = require("./models/ProcurementRequest");
const Counter = require("./models/Counter");
const Notification = require("./models/Notification");

const farmers = [
  ["Aarav Patil", "9100000001", "Khamgaon", "Buldhana", "Maharashtra", "Soybean", 420, "Pending"],
  ["Sakshi Jadhav", "9100000002", "Malkapur", "Buldhana", "Maharashtra", "Tur", 350, "Pending"],
  ["Rohan Shinde", "9100000003", "Chikhli", "Buldhana", "Maharashtra", "Cotton", 680, "Approved"],
  ["Priya Pawar", "9100000004", "Mehkar", "Buldhana", "Maharashtra", "Soybean", 510, "Pending"],
  ["Vikram More", "9100000005", "Deulgaon Raja", "Buldhana", "Maharashtra", "Tur", 290, "Scheduled"],
  ["Anjali Deshmukh", "9100000006", "Shegaon", "Buldhana", "Maharashtra", "Maize", 760, "Approved"],
  ["Suresh Wagh", "9100000007", "Nandura", "Buldhana", "Maharashtra", "Soybean", 480, "Pending"],
  ["Kavita Kale", "9100000008", "Jalgaon Jamod", "Buldhana", "Maharashtra", "Cotton", 610, "Scheduled"],
  ["Mahesh Gawande", "9100000009", "Lonar", "Buldhana", "Maharashtra", "Tur", 320, "Approved"],
  ["Neha Chavan", "9100000010", "Sindkhed Raja", "Buldhana", "Maharashtra", "Soybean", 390, "Pending"],
  ["Ganesh Dhumal", "9100000011", "Motala", "Buldhana", "Maharashtra", "Maize", 830, "Scheduled"],
  ["Pooja Nikam", "9100000012", "Sangrampur", "Buldhana", "Maharashtra", "Cotton", 570, "Approved"],
  ["Ramesh Kharat", "9100000013", "Khamgaon", "Buldhana", "Maharashtra", "Soybean", 440, "Pending"],
  ["Sunita Pawar", "9100000014", "Malkapur", "Buldhana", "Maharashtra", "Tur", 260, "Scheduled"],
  ["Nitin Jagtap", "9100000015", "Chikhli", "Buldhana", "Maharashtra", "Cotton", 720, "Approved"],
  ["Meena Borse", "9100000016", "Mehkar", "Buldhana", "Maharashtra", "Soybean", 530, "Pending"],
  ["Dinesh Sable", "9100000017", "Shegaon", "Buldhana", "Maharashtra", "Maize", 690, "Scheduled"],
  ["Lata Ingle", "9100000018", "Nandura", "Buldhana", "Maharashtra", "Tur", 300, "Approved"],
  ["Prakash Raut", "9100000019", "Lonar", "Buldhana", "Maharashtra", "Cotton", 640, "Pending"],
  ["Asha Gite", "9100000020", "Motala", "Buldhana", "Maharashtra", "Soybean", 470, "Scheduled"],
  ["Santosh Dighe", "9100000021", "Sangrampur", "Buldhana", "Maharashtra", "Maize", 810, "Approved"],
  ["Rekha Koli", "9100000022", "Deulgaon Raja", "Buldhana", "Maharashtra", "Tur", 280, "Pending"],
];

async function ensureStaff(name, mobile, password, role) {
  if (await User.findOne({ mobile })) return;
  await User.create({ name, mobile, password: await bcrypt.hash(password, 10), role });
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const password = await bcrypt.hash("farmer123", 10);
  let created = 0;
  for (const [name, mobile, village, district, state, cropName, quantity, status] of farmers) {
    if (await User.findOne({ mobile })) continue;
    const farmer = await Farmer.create({ name, mobile, village, district, state });
    await User.create({ name, mobile, password, role: "Farmer", farmer: farmer._id });
    const counter = await Counter.findOneAndUpdate({ name: "procurementToken" }, { $inc: { value: 1 } }, { new: true, upsert: true });
    const scheduledDate = status === "Scheduled" ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined;
    const request = await ProcurementRequest.create({ farmer: farmer._id, cropName, quantity, unit: "kg", procurementCenter: "Buldhana Smart Procurement Centre", status, tokenNumber: counter.value, scheduledDate });
    await Notification.create({ farmer: farmer._id, title: "Procurement Request Submitted", message: `Demo request for ${cropName} registered. Token number: ${request.tokenNumber}.`, type: "Request" });
    created += 1;
  }
  await ensureStaff("Demo Officer", "9000000001", "officer123", "Officer");
  await ensureStaff("Demo Admin", "9999999998", "admin123", "Admin");
  console.log(`Demo seed complete. Created ${created} of 22 farmer accounts.`);
  console.log("Farmers: 9100000001–9100000022 / farmer123");
  console.log("Officer: 9000000001 / officer123");
  console.log("Admin: 9999999998 / admin123");
  await mongoose.disconnect();
}
seed().catch((error) => { console.error("SEED ERROR:", error.message); process.exit(1); });
