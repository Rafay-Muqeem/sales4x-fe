export async function fetchPermissions(){
    try {
        const permissions = await fetch("http://localhost:5000/api/permission/", {
            method: "GET",
        })
       
        return permissions;

    } catch (error) {
        console.log(error);
    }
}