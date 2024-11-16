export async function updateInvoice(id, data, token){
    try {
        const invoice = await fetch(`http://localhost:5000/api/invoice/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify(data)
        })
       
        return invoice;

    } catch (error) {
        console.log(error);
    }
}