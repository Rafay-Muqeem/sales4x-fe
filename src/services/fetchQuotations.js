export async function fetchQuotations(token){
    try {
        const quotations = await fetch("http://localhost:5000/api/quotation/", {
            method: "GET",
            headers: {
                "auth-token": token
            }
        })
        return quotations;

    } catch (error) {
        console.log(error);
    }users
}