const mongoose = require("mongoose");

const schema = mongoose.Schema;

const orderSchema = new schema({
  user: {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  products: [
    {
      product: { type: Object, required: true },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});
module.exports = mongoose.model("Order", orderSchema);
