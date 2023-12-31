export async function delTax(id){
    try {
        const tax = await fetch(`http://localhost:5000/api/tax/delete/${id}`, {
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