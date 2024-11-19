export async function addQuotaion(data, token){
    try {
        const quotation = await fetch("http://localhost:5000/api/quotation/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify(data)
        })
       
        return quotation;

    } catch (error) {
        console.log(error);
    }
}