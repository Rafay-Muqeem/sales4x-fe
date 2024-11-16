export async function delTax(id, token){
    try {
        const tax = await fetch(`http://localhost:5000/api/tax/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
        })
       
        return tax;

    } catch (error) {
        console.log(error);
    }
}