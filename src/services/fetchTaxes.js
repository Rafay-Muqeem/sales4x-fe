export async function fetchTaxes(){
    try {
        const taxes = await fetch("http://localhost:5000/api/tax/", {
            method: "GET",
        })
       
        return taxes;

    } catch (error) {
        console.log(error);
    }
}