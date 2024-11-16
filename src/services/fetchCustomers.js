export async function fetchCustomers(token){
    try {
        const customers = await fetch("http://localhost:5000/api/customer/", {
            method: "GET",
            headers: {
                "auth-token": token
            },
        })
        return customers;

    } catch (error) {
        console.log(error);
    }users
}