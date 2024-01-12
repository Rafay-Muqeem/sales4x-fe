export async function updateQuotation(id, data){
    try {
        const quotation = await fetch(`http://localhost:5000/api/quotation/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
       
        return quotation;

    } catch (error) {
        console.log(error);
    }
}