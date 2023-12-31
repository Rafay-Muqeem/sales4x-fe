export async function addTax(data){
    try {
        const tax = await fetch("http://localhost:5000/api/tax/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
       
        return tax;

    } catch (error) {
        console.log(error);
    }
}