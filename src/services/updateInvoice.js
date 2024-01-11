export async function updateInvoice(id, data){
    try {
        const invoice = await fetch(`https://solutions4x.com/api/invoice/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
       
        return invoice;

    } catch (error) {
        console.log(error);
    }
}