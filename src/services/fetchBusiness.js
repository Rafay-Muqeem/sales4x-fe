export async function fetchBusiness(){
    try {
        const businesses = await fetch("http://localhost:5000/api/business/", {
            method: "GET",
        })
       
        return businesses;

    } catch (error) {
        console.log(error);
    }
}