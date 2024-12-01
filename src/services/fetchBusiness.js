export async function fetchBusiness(id, token){
    try {
        const business = await fetch(`http://localhost:5000/api/business/${id}`, {
            method: "GET",
            headers: {
                "auth-token": token
            }
        })
       
        return business;

    } catch (error) {
        console.log(error);
    }
}