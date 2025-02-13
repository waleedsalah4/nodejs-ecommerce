import Stripe from "stripe";

// console.log("api", process.env.STRIPE_SECRET);
// if (!process.env.STRIPE_SECRET) {
//   throw new Error("STRIPE_SECRET is missing in .env file");
// }
export const stripe = new Stripe(process.env.STRIPE_SECRET);
