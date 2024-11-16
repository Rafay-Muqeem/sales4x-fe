export async function fetchAppointments(token){
    try {
        const appointments = await fetch("http://localhost:5000/api/appointment/", {
            method: "GET",
            headers: {
                "auth-token": token
            }
        })
       
        return appointments;

    } catch (error) {
        console.log(error);
    }
}