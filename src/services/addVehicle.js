export async function addVehicle(data){
    try {
        const vehicle = await fetch("https://solutions4x.com/api/vehicle/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
       
        return vehicle;

    } catch (error) {
        console.log(error);
    }
}