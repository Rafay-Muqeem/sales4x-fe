export async function delTax(id){
    try {
        const tax = await fetch(`https://solutions4x.com/api/tax/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
       
        return tax.json();

    } catch (error) {
        console.log(error);
    }
}