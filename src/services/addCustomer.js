export async function addCustomer(data){
    try {
        const customer = await fetch("http://localhost:5000/api/customer/create", {
            method: "POST",
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