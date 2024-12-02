export async function fetchCustomer(id, token){
    try {
        const customer = await fetch(`http://localhost:5000/api/customer/${id}`, {
            method: "GET",
            headers: {
                "auth-token": token
            },
        })
        return customer;

    } catch (error) {
        console.log(error);
    }users
}