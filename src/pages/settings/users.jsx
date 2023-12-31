import React, { useState, useEffect } from "react";
import {
  XCircleIcon, PencilIcon, PlusCircleIcon
} from "@heroicons/react/24/outline";
import { Card } from "@material-tailwind/react";
import UserForm from "../forms/userForm";
import { fetchUsers } from "@/services/fetchUsers";
import { delUser } from "@/services/delUser";
import { fetchBusiness } from "@/services/fetchBusiness";
import { fetchPermissions } from "@/services/fetchPermissions";

function Users() {

  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState('');
  const [users, setUsers] = useState([])
  const [businesses, setBusinesses] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    getUsers()
    getPermissions()
    getBusinesses()
  }, [refresh])

  const getUsers = async () => {
    const users = await fetchUsers();
    setUsers(await users.json());
  }

  const getBusinesses = async () => {
    const businesses = await fetchBusiness();
    setBusinesses(await businesses.json())
  }
  
  const getPermissions = async () => {
    const permissions = await fetchPermissions();
    setPermissions(await permissions.json())
  }

  const addUser = () => {
    setRefresh(!refresh);
    handleOpen();
  }

  async function handleDel(id) {
    const user = await delUser(id);
    setRefresh(!refresh)
  }

  const handleEdit = (data) => {
    console.log(data)
    setData(data)
    handleOpen()
  }

  return (
    <div className="flex flex-col w-full bg-transparent rounded-md p-4">
      <UserForm businesses={businesses} permissions={permissions} userData={data} setUserData={setData} open={open} handleOpen={handleOpen} refresh={refresh} setRefresh={setRefresh} />
      <div className="flex items-center mb-2">
        <h2 className="text-lg font-semibold">Users</h2>
        <PlusCircleIcon onClick={addUser} className="ml-4 mr-1 h-7 w-7 text-blue-600 cursor-pointer" />
        <span className="text-base">Add new user</span>
      </div>
      <Card className="h-full w-full">
        <table className="border-collapse w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-4 py-2 w-1/2">User Name</th>
              <th className="text-center px-4 py-2 w-1/4">Role</th>
              <th className="text-center px-4 py-2 w-1/4">Business</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200">
                <td className="text-left px-4 py-2"><PencilIcon  onClick={() => handleEdit(user)} className="inline-block mr-2 h-5 w-5 text-blue-700 cursor-pointer" />{user.first_name} {user.last_name}</td>
                <td className="text-center px-4 py-2">{user.role}</td>
                <td className="text-center px-4 py-2">{businesses.length !==0 ? businesses.filter( business => business.id === user.BusinessId)[0].name: ''}</td>
                <td className="text-center px-4 py-2 cursor-pointer"><XCircleIcon onClick={() => handleDel(user.id)} className="h-6 w-6 text-gray-600 hover:text-red-500" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default Users;