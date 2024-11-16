export async function addVehicle(data, token){
    try {
        const vehicle = await fetch("http://localhost:5000/api/vehicle/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify(data)
        })
       
        return vehicle;

    } catch (error) {
        console.log(error);
    }
}