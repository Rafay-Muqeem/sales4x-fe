export async function addInvoice(data){
    console.log(data);
    try {
        const invoice = await fetch("https://solutions4x.com/api/invoice/create", {
            method: "POST",
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