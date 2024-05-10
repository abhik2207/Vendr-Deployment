const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: [true, 'Please provide email of the user'], unique: true },
    password: { type: Buffer, required: [true, 'Please provide brand of the user'] },
    role: { type: String, required: [true, 'Please provide role of the user'], default: 'user' },
    addresses: { type: [Schema.Types.Mixed] },
    name: { type: String },
    salt: { type: Buffer },
    resetPasswordToken: { type: String, default: '' }
});

const virtual = userSchema.virtual('id');
virtual.get(function () {
    return this._id;
});
userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
})

const UserModel = mongoose.model('User', userSchema);
exports.User = UserModel;