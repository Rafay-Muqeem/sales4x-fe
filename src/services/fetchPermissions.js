export async function fetchPermissions(token){
    try {
        const permissions = await fetch("http://localhost:5000/api/permission/", {
            method: "GET",
            headers: {
                "auth-token": token
            }
        })
       
        return permissions;

    } catch (error) {
        console.log(error);
    }
}