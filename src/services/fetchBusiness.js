export async function fetchBusiness(){
    try {
        const businesses = await fetch("https://solutions4x.com/api/business/", {
            method: "GET",
        })
       
        return businesses;

    } catch (error) {
        console.log(error);
    }
}