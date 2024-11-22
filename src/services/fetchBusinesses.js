export async function fetchBusinesses(token){
    try {
        const businesses = await fetch("http://localhost:5000/api/business/", {
            method: "GET",
            headers: {
                "auth-token": token
            }
        })
       
        return businesses;

    } catch (error) {
        console.log(error);
    }
}