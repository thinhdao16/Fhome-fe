import React, { useEffect, useState } from "react";
import toastr from "cogo-toast";

const User = () => {
  const [users, setUsers] = useState([]);
  console.log(users)
  useEffect(() => {
    fetch(
      "https://f-homes-be.vercel.app/users"
    )
      .then((response) => response.json())
      .then((data) => setUsers(data.data.users));
  }, []);
  console.log(users);
  const handlePutUser = (id) => {
    fetch(`https://63fc47ff677c41587308cabf.mockapi.io/api/v1/user/user-v1/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: true,
        roleName:"landlord"
      })
    })
      .then((res) => res.json())
      .then((result) => {
        // update state to re-render the component
        setUsers((prevData) => {
          const updatedData = prevData.map((item) => {
            if (item.id === result.id) {
              return result;
            } else {
              return item;
            }
          });
          return updatedData;
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleDeleteUser = (id) => {
    fetch(`https://63fc47ff677c41587308cabf.mockapi.io/api/v1/user/user-v1/${id}`, {
      method: "DELETE"
    })
      .then((res) => res.json())
      .then((result) => {
        // update state to re-render the component
        setUsers((prevData) => {
          const filteredData = prevData.filter((item) => item.id !== id);
          return filteredData;
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  return (
    <div class="card mt-4">
      <div class="card-header">
        <h4 class="card-title"> Users </h4>
        <button
          type="button"
          class="btn btn-primary btn-sm rounded-0 float-end"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
          data-bs-backdrop="static"
        >
          Add User
        </button>
      </div>
      <div class="card-body">
        <div class="col-md-12">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th> Id </th>
                <th> Full Name </th>
                <th> Mobile No </th>
                <th> Email </th>
                <th> Action </th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>
                    <input
                      type="checkbox"
                      onChange={() => handleSelectUser(user._id)}
                      checked={selectedUsers.includes(user._id)}
                    />
                  </td>
                  <td>{user.email}</td>
                  <td><img src={user.img} /></td>
                  <td>{user.phoneNumber}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handlePutUser(user.id)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default User;
