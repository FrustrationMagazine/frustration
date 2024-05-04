const stripe = require("./config/stripeClient.js");
const supabase = require("./config/supabaseClient.js");
const {
  normalizeName,
  convertDateUTC,
  determineSubscription,
} = require("./functions/utils.js");

// Distinguer nom et prénom dans le formulaire abonnement
async function getData() {

  let { data } = await stripe.subscriptions.list({ limit: 10 });

  const promises = data.map(async (subscription, index, subscriptions) => {
    let customer = await stripe.customers.retrieve(subscription.customer);
    let subscription_item = subscription.items.data[0];

    customer = {
      id_customer: customer.id,
      name: normalizeName(customer.name),
      email: customer.email.toLowerCase(),
      address: subscription.metadata.adresse,
      zip_code: subscription.metadata.code_postal?.replace(/\D+/g, "") ?? null,
      city: normalizeName(subscription.metadata.ville) ?? null,
    };

    subscription = {
      id_subscription: subscription.id,
      created: convertDateUTC(subscription.created),
      start_date: convertDateUTC(subscription.start_date),
      interval: subscription_item.plan.interval,
      amount: subscription_item.plan.amount / 100,
      currency: subscription_item.plan.currency,
      cancel_at: subscription.cancel_at,
      current_period_start: convertDateUTC(subscription.current_period_start),
      current_period_end: convertDateUTC(subscription.current_period_end),
    };

    subscriber = {
      ...customer,
      ...subscription,
      ...determineSubscription(subscription.amount),
    };

    return subscriber;
  });

  Promise.all(promises).then(async (values) => {
    data = values;
    const { error } = await supabase.from("subscribers").upsert(values);
    if (error) console.log(error);
  });
}

getData();
