export async function fetchInvoices(token){
    try {
        const invoices = await fetch("http://localhost:5000/api/invoice/", {
            method: "GET",
            headers: {
                "auth-token": token
            }
        })
       
        return invoices;

    } catch (error) {
        console.log(error);
    }
}