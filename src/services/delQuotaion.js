export async function delQuotation(id){
    try {
        const quotation = await fetch(`https://solutions4x.com/api/quotation/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
       
        return quotation.json();

    } catch (error) {
        console.log(error);
    }
}