import bcrypt from 'bcrypt';
export const hashing = (password) => {
  const saltrounds = 10;
  const salt = bcrypt.genSaltSync(saltrounds);
  return bcrypt.hashSync(password, salt);
};
export const comparePassword = (plain, hashed) =>
  bcrypt.compareSync(plain, hashed);
