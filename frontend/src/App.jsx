
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoute from "./components/ProtectedRoute/PublicRoute";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";

import Tasks from "./pages/Tasks/Tasks";
import AddTodo from "./pages/AddTodo/AddTodo";
import EditTodo from "./pages/EditTodo/EditTodo";
import Account from "./pages/Account/Account";

const App = () => {
  return (
    <Routes>
      {/* Only for logged-out users */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Only for logged-in users, with the navbar */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/todos/new" element={<AddTodo />} />
          <Route path="/todos/:id/edit" element={<EditTodo />} />
          <Route path="/account" element={<Account />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;