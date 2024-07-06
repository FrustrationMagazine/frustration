const { STRIPE_PROD_SECRET_KEY } = require("./constants");
const Stripe = require("stripe");
const stripe = Stripe(STRIPE_PROD_SECRET_KEY);
module.exports = stripe;
