console.log("start !!");

// const INFO = console.log;
// const { upsertSupabase, insertSupabase } = require("./functions/supabase.js");
// const { getStripeBalance, getStripeBalanceTransactions } = require("./functions/stripe");
// const { getHelloAssoPayments, convertHelloAssoPaymentsToSupabase } = require("./functions/helloasso");

// (async function () {
// 	// 1. Compte courant sur Stripe
// 	// INFO("Récupération du compte courant de Stripe");
// 	// const stripeBalance = await getStripeBalance();
// 	// upsertSupabase(stripeBalance, "balance");
// 	// INFO("Fin récupération du compte courant de Stripe");

// 	// STRIPE
// 	// INFO("⚙️ Récupération des données de Stripe");
// 	// const stripeBalanceTransactions = await getStripeBalanceTransactions((updateOnlyFromLast = true));
// 	// upsertSupabase(stripeBalanceTransactions, "balance_transactions");
// 	// INFO("⚙️ Fin de récupération des données de Stripe");

// 	// HELLOASSO
// 	// INFO("⚙️ Récupération des données de Helloasso");
//   // let payments = await getHelloAssoPayments();
// 	// payments = convertHelloAssoPaymentsToSupabase(payments);
// 	// upsertSupabase(payments, "balance_transactions");
// 	// INFO("⚙️ Fin de récupération des données de Helloasso");

// 	// X. Update date
// 	// INFO("Mise à jour de la table des événéments");
// 	// insertSupabase([{ event: "update" }], "events");
// 	// INFO("End update Supabase");
// })();
