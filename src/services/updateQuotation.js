export async function updateQuotation(id, data, token){
    try {
        const quotation = await fetch(`http://localhost:5000/api/quotation/update/${id}`, {
            method: "PUT",
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