const supabase = require("../config/supabase.config");

async function upsertSupabase(data, table) {
	const { error } = await supabase.from(table).upsert(data);
	if (error) console.log(error);
}

async function insertSupabase(data, table) {
	const { error } = await supabase.from(table).insert(data);
	if (error) console.log(error);
}

async function deleteUser(id) {
	try {
		const { data, error } = await supabase.auth.admin.deleteUser(id);
		if (error) throw error;
		console.log(data);
	} catch (e) {
		console.error(error);
	} finally {
		console.log("Fin de l'opération de suppression de l'utilisateur");
	}
}

async function createUser(email, password, first_name, last_name) {
	try {
		const { data, error } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				data: {
					first_name: first_name,
					last_name: last_name
				}
			}
		});
		if (error) throw error;
		console.log(data);
	} catch (e) {
		console.error(e);
	} finally {
		console.log("Fin de l'opération de création d'utilisateur");
	}
}

module.exports = {
	upsertSupabase,
	insertSupabase,
	createUser,
	deleteUser
};
