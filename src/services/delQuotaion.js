export async function delQuotation(id, token){
    try {
        const quotation = await fetch(`http://localhost:5000/api/quotation/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
        })
       
        return quotation;

    } catch (error) {
        console.log(error);
    }
}