export async function fetchPermissions(){
    try {
        const permissions = await fetch("https://solutions4x.com/api/permission/", {
            method: "GET",
        })
       
        return permissions;

    } catch (error) {
        console.log(error);
    }
}