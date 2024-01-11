export async function updateVehicle(id, data){
    try {
        console.log(data);
        const vehicle = await fetch(`https://solutions4x.com/api/vehicle/update/${id}`, {
            method: "PUT",
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