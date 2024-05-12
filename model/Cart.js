const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: [true, 'Please provide a product ID'] },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'Please provide an user ID'] },
    quantity: { type: Number, required: [true, 'Please provide quantity of the product'] },
    color: { type: Schema.Types.Mixed },
    size: { type: Schema.Types.Mixed }
});

const virtual = cartSchema.virtual('id');
virtual.get(function () {
    return this._id;
});
cartSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
})

const CartModel = mongoose.model('Cart', cartSchema);
exports.Cart = CartModel;