export async function fetchUsers(token){
    try {
        const users = await fetch("http://localhost:5000/api/user/", {
            method: "GET",
            headers: {
                "auth-token": token
            }
        })
       
        return users;

    } catch (error) {
        console.log(error);
    }
}