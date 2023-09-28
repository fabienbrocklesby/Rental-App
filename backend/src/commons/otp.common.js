import otpGenerator from 'otp-generator';

export default async () => (otpGenerator.generate(6, { specialChars: false }));
