export async function addCustomer(data, token){
    try {
        const customer = await fetch("http://localhost:5000/api/customer/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify(data)
        })
       
        return customer;

    } catch (error) {
        console.log(error);
    }
}