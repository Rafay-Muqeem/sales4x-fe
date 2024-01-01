export async function fetchCustomers(){
    try {
        const customers = await fetch("https://solutions4x.com/api/customer/", {
            method: "GET",
        })
       
        return customers;

    } catch (error) {
        console.log(error);
    }users
}