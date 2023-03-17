import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";

import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import styled from "styled-components";

const TodoList = () => {
  const [data, setData] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [todoDetails, setTodoDetails] = useState(null);
  const [loader, setLoader] = useState(true);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchTodoList = async () => {
      try {
        const res = await axios({
          url: "https://jsonplaceholder.typicode.com/todos",
        });
        // console.log(res.data);
        setData(res.data);
        setFilteredData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTodoList();
  }, []);

  const showDetails = async (userId, todoId) => {
    setLoader(true);
    try {
      const user = await axios({
        url: `https://jsonplaceholder.typicode.com/users/${userId}`,
      });
      const todo = await axios({
        url: `https://jsonplaceholder.typicode.com/todos/${todoId}`,
      });
      setUserDetails(user.data);
      setTodoDetails(todo.data);
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    const newData = data.filter((item) => {
      return (
        item.id == val ||
        item.title.includes(val) ||
        (val === "false"
          ? item.completed === false
          : val === "true"
          ? item.completed === true
          : null)
      );
    });
    setFilteredData(newData);
  };

  const columns = [
    { field: "id", headerName: "ToDo ID", width: 80 },
    {
      field: "title",
      headerName: "Title",
      width: 250,
    },
    { field: "completed", headerName: "Status", width: 100 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Button
              variant="outlined"
              onClick={() => showDetails(params.row.userId, params.row.id)}
            >
              View Details
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <Container>
      <Box sx={{ height: 370, width: "50%", marginTop: "2%" }}>
        <input
          className="form-control mr-sm-2"
          onChange={handleSearch}
          style={{ width: "50%", marginLeft: "auto" }}
          type="search"
          placeholder="Search"
          aria-label="Search"
        ></input>
        <DataGrid
          rows={filteredData}
          disableRowSelectionOnClick={false}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
        />
      </Box>
      {userDetails !== null && todoDetails !== null && (
        <RightContainer>
          {loader && <span>Loading...</span>}
          {!loader && (
            <>
              <HeadingContainer>
                <h3>User Details</h3>
              </HeadingContainer>

              <List>
                <Item>
                  <Key>ToDo ID:</Key> <span>{todoDetails.id}</span>
                </Item>
                <Item>
                  <Key>ToDo Title:</Key> <span>{todoDetails.title}</span>
                </Item>
                <Item>
                  <Key>User ID: </Key>
                  <span>{userDetails.id}</span>
                </Item>
                <Item>
                  <Key>Name:</Key> <span>{userDetails.name}</span>
                </Item>
                <Item>
                  <Key>Email:</Key> <span>{userDetails.email}</span>
                </Item>
              </List>
            </>
          )}
        </RightContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const RightContainer = styled.div`
  width: 46%;
  max-height: 60vh;
  min-height: 60vh;
  margin-left: 2%;
  margin-right: 2%;
  margin-top: 5%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px solid gray;
`;

const HeadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const List = styled.ul`
  list-style: none;
`;

const Key = styled.span`
  margin-right: 5%;
  font-weight: bold;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2%;
`;

export default TodoList;
