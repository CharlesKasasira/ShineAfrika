// require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_TOLL
const supabaseKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY_TOLL
const supabase = createClient(supabaseUrl, supabaseKey)

const handler = async ( req, res ) => {
    try {
        const { email, password, username, roles, phoneNumber, organisation_id } = req.body

        if ( !email ) {
            const response = { "Status":"Failure","Details": "Email not provided"}
            return res.status(400).json(response)
        }

        if ( !password ) {
            const response = { "Status": "Failure", "Details": "Password not provided"}
            return res.status(400).json(response)
        }

        // if ( !details || details.length < 1 ) {
        //     const response = { "Status": "Failure", "Details": "Information not provided"}
        //     return res.status(400).json(response)
        // }

        // if ( !added_by ) {
        //     const response = { "Status": "Failure", "Details": "Manager not provided"}
        //     return res.status(400).json(response)
        // }

        const { data: user, error } = await supabase.auth.api.createUser({
            email: email,
            password: password,
            email_confirm: true
        })

        if ( error ) throw error
        // Call the supabase function that inserts the customers data into the profiles and members tables respectively.
        // res.status(200).json(response)
        const { id } = user

        const response = await supabase.from("profiles")
                  .update({
                    username: username,
                    roles: roles,
                    phone: phoneNumber,
                    email: email,
                    organisation_id: organisation_id
                  })
                  .eq("id", id)
        if (response?.error) {
          throw error
        }
        else {
          const response = { "Status": "Success", "Details": "Memeber successfully created"}
          res.status(200).json(response) 

        }
    } catch ( error ){
        const response = {"Status":"Failure", "Details":error}
        return res.status(400).json(response)      
    }
    return;
}

export default handler;