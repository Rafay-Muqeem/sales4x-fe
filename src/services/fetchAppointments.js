export async function fetchAppointments(){
    try {
        const appointments = await fetch("https://solutions4x.com/api/appointment/", {
            method: "GET",
        })
       
        return appointments;

    } catch (error) {
        console.log(error);
    }
}