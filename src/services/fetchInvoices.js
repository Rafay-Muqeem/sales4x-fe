export async function fetchInvoices(){
    try {
        const invoices = await fetch("https://solutions4x.com/api/invoice/", {
            method: "GET",
        })
       
        return invoices;

    } catch (error) {
        console.log(error);
    }
}