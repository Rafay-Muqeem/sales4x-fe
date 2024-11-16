export async function delInvoice(id, token){
    try {
        const invoice = await fetch(`http://localhost:5000/api/invoice/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
        })
       
        return invoice;

    } catch (error) {
        console.log(error);
    }
}