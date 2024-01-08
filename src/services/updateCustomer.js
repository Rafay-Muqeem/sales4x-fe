export async function updateCustomer(id, data){
    try {
        const customer = await fetch(`https://solutions4x.com/api/customer/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
       
        return customer;

    } catch (error) {
        console.log(error);
    }
}