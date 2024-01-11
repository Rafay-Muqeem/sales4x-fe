export async function delVehicle(id){
    try {
        const vehicle = await fetch(`https://solutions4x.com/api/vehicle/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
       
        return vehicle.json();

    } catch (error) {
        console.log(error);
    }
}