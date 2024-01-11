export async function delInvoice(id){
    try {
        const invoice = await fetch(`https://solutions4x.com/api/invoice/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
       
        return invoice.json();

    } catch (error) {
        console.log(error);
    }
}