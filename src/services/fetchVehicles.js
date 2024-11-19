export async function fetchVehicles(token){
    try {
        const vehicles = await fetch("http://localhost:5000/api/vehicle/", {
            method: "GET",
            headers: {
                "auth-token": token
            }
        })
       
        return vehicles;

    } catch (error) {
        console.log(error);
    }
}