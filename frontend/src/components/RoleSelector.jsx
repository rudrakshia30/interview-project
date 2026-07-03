import { useState } from "react";
import { roles } from "../data/roles";

function RoleSelector({onStartInterview,loading,error}) {
  const [selectedRole, setSelectedRole] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [questionCount, setQuestionCount] = useState(5);
}