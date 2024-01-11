export async function fetchVehicles(){
    try {
        const vehicles = await fetch("https://solutions4x.com/api/vehicle/", {
            method: "GET",
        })
       
        return vehicles;

    } catch (error) {
        console.log(error);
    }
}