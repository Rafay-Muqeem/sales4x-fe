export async function fetchUsers(){
    try {
        const users = await fetch("http://localhost:5000/api/user/", {
            method: "GET",
        })
       
        return users;

    } catch (error) {
        console.log(error);
    }
}