const mongoose = require("mongoose");
const assert = require("assert");
const bcrypt = require("bcrypt");

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [
            function (email) {
              const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              return re.test(String(email).toLowerCase());
            },
            "Email is incorrect"
          ]
    },
    password: {
        type: String,
        required: true,
        validate: [
              function (val) {
                return val.length > 6
              },
              "The password length should be more than 6 characters"
        ]
    },
});

schema.methods = {
  setNewPassword: async function (password, repeatPassword) {
    assert.deepStrictEqual(password, repeatPassword);
    this.password = password;
    await this.validate();
    this.password = await bcrypt.hash(password, 10);
    await this.save();
  },
}

module.exports = mongoose.model('User', schema);