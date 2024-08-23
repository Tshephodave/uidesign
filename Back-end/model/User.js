const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname:{type:String, required: true},
  email: { type: String, required: true, unique: true },
  department:{type:String, enum:['finance','ict','customercareservice']},
  phone: {
    type: String,
    validate: {
        validator: function (v) {
            return /\d{3}-\d{3}-\d{4}/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
},
password: {
  type: String,
  required: true,
  minlength: 7,
  trim: true,
  validate(value) {
    if (value.toLowerCase().includes('password')) {
      throw new Error('Password cannot contain "password"')
    }
  }
},
passwordConfirm: {
  type: String,
  required: true,
  minlength: [7, 'Password should have atleast 7 characters.'],
  validate: {
    validator: function (val) {
      return toString(this.password) === toString(val)
    },
    message: 'Provided passwords do not match. Please try again'
  }
},
  location:{type: String, required: true},
  role: { type: String, enum: ['user', 'admin'], required: true },
});

module.exports = mongoose.model('User', userSchema);
