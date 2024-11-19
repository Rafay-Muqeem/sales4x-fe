export async function delVehicle(id, token){
    try {
        const vehicle = await fetch(`http://localhost:5000/api/vehicle/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
        })
       
        return vehicle;

    } catch (error) {
        console.log(error);
    }
}