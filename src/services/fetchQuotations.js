export async function fetchQuotations(){
    try {
        const quotations = await fetch("http://localhost:5000/api/quotation/", {
            method: "GET",
        })
       
        return quotations;

    } catch (error) {
        console.log(error);
    }users
}