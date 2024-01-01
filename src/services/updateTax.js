export async function updateTax(id, data){
    try {
        const tax = await fetch(`https://solutions4x.com/api/tax/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
       
        return tax;

    } catch (error) {
        console.log(error);
    }
}