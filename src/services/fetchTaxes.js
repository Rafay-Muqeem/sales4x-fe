export async function fetchTaxes(token){
    try {
        const taxes = await fetch("http://localhost:5000/api/tax/", {
            method: "GET",
            headers: {
                "auth-token": token
            }
        })
       
        return taxes;

    } catch (error) {
        console.log(error);
    }
}