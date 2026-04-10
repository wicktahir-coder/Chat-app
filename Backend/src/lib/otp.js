import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

// Store OTP + full user data in Redis, expires in 5 min
export const saveOTP = async (email, otp, userData) => {
  await redis.set(`otp:${email}`, otp, "EX", 300);
  await redis.set(`pending:${email}`, JSON.stringify(userData), "EX", 300);
};

export const verifyOTP = async (email, otp) => {
  const stored = await redis.get(`otp:${email}`);
  if (!stored) return { valid: false, message: "OTP expired" };
  if (stored !== otp) return { valid: false, message: "Invalid OTP" };

  // Get pending user data
  const pendingUser = await redis.get(`pending:${email}`);

  // Clean up Redis
  await redis.del(`otp:${email}`);
  await redis.del(`pending:${email}`);

  return { valid: true, userData: JSON.parse(pendingUser) };
};