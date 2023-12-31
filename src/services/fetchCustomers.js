export async function fetchCustomers(){
    try {
        const customers = await fetch("http://localhost:5000/api/customer/", {
            method: "GET",
        })
       
        return customers;

    } catch (error) {
        console.log(error);
    }
}