export async function fetchTaxes(){
    try {
        const taxes = await fetch("https://solutions4x.com/api/tax/", {
            method: "GET",
        })
       
        return taxes;

    } catch (error) {
        console.log(error);
    }
}