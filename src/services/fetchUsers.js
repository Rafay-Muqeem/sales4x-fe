export async function fetchUsers(){
    try {
        const users = await fetch("https://solutions4x.com/api/user/", {
            method: "GET",
        })
       
        return users;

    } catch (error) {
        console.log(error);
    }
}