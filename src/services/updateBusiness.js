export async function updateBusiness(id, data, token){
    try {
        const business = await fetch(`http://localhost:5000/api/business/update/${id}`, {
            method: "PUT",
            headers: {
                // "Content-Type": "application/json",
                "auth-token": token
            },
            body: data
        })
       
        return business;

    } catch (error) {
        console.log(error);
    }
}