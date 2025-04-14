import bcrypt from 'bcrypt';
const saltRounds = 10;

export const hashValue = async (value: string): Promise<string> => {
  try {
    return await bcrypt.hash(value, saltRounds);
  } catch (e) {
    console.log(e);
  }
};

export const comparePasswordHelper = async (
  plainPassword: string,
  hashPassword: string,
): Promise<boolean> => {
  try {
    const response = await bcrypt.compare(plainPassword, hashPassword);
    return response;
  } catch (e) {
    console.log(e);
  }
};
