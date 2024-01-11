export async function delCustomer(id){
    try {
        const customer = await fetch(`https://solutions4x.com/api/customer/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
       
        return customer.json();

    } catch (error) {
        console.log(error);
    }
}