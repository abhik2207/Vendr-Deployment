const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    items: { type: [Schema.Types.Mixed], required: [true, 'Please provide items for the order'] },
    totalAmount: { type: Number, required: [true, 'Please provide total amount for the order'] },
    totalItems: { type: Number, required: [true, 'Please provide total number of items for the order'] },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'Provide a user ID'] },
    selectedPaymentMode: { type: String, required: [true, 'Please provide a payment mode for the order'] },
    selectedAddress: { type: Schema.Types.Mixed, required: [true, 'Please provide an address for the order'] },
    status: { type: String, required: [true, 'Please provide a status for the order'], default: 'pending' }
});

const virtual = orderSchema.virtual('id');
virtual.get(function () {
    return this._id;
});
orderSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
})

const OrderModel = mongoose.model('Order', orderSchema);
exports.Order = OrderModel;