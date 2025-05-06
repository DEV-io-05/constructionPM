import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} The hashed password
 */
export const hashPassword = async (password) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a password with a hash
 * @param {string} password - The plain text password to check
 * @param {string} hash - The hash to compare against
 * @returns {Promise<boolean>} Whether the password matches
 */
export const comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};

/**
 * Generate a random token
 * @param {number} length - Length of the token
 * @returns {string} Random token
 */
export const generateToken = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};