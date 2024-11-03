import Stripe from "stripe";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
const stripe = new Stripe(
  "sk_test_51PEAiEKPMahiDoWNfI0l6eND14AvRyCL2CxsYE9YAjJGAEVfw9F005LZHlm5AKkytIms4J2fynju7kuVIqtUlrMa0033NcZugT"
);
const createCheckoutSession = async (req, res) => {
  console.log("Checkout session created");
  const { cart, orderId } = req.body;
  let po = cart.items.map((cartItem) => {
    return {
      price_data: {
        currency: "usd",
        unit_amount: cartItem.price * 100,
        product_data: {
          name: cartItem.product.name,
          images: [cartItem.product.image],
        },
      },
      quantity: cartItem.quantity,
    };
  });
  const order = await Order.findByIdAndUpdate(orderId, {
    paymentStatus: "Completed",
  });

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: po,
    mode: "payment",
    return_url: `http://localhost:5173/return?session_id={CHECKOUT_SESSION_ID}`,
    metadata: [orderId, cart._id],
  });

  res.send({ clientSecret: session.client_secret });
};

const sessionStatus = async (req, res) => {
  console.log("Inside Session Status");
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  if (session.payment_status === "paid") {
    // Retrieve orderId from metadata
    const orderId = session.metadata[0];
    const cartId = session.metadata[1];

    // Update the order status to 'Completed'
    await Order.findByIdAndUpdate(orderId, { paymentStatus: "Completed" });
    await Cart.findByIdAndDelete(cartId);
  }
  res.send({
    status: session.status,
    customer_email: session.customer_details.email,
  });
};
export { createCheckoutSession, sessionStatus };
