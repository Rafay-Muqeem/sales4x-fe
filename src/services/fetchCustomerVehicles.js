export async function fetchCustomerVehicles(customerId, token){
    try {
        const customerVehicles = await fetch(`http://localhost:5000/api/customervehicle/customer/${customerId}`, {
            method: "GET",
            headers: {
                "auth-token": token
            },
        })
        return customerVehicles;

    } catch (error) {
        console.log(error);
    }
}