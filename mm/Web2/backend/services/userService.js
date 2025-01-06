const bcrypt = require('bcrypt');
const userDao = require('../dao/userDao');

class UserService {
    async registerUser(vorname, nachname, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return userDao.createUser(vorname, nachname, email, hashedPassword);
    }

    async loginUser(email, password) {
        const user = await userDao.findUserByEmail(email);
        if (!user) {
            throw new Error('Ungültige Anmeldedaten');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Ungültige Anmeldedaten');
        }
        return user;
    }
}

module.exports = new UserService();
