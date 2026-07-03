import { useState } from "react";
import { roles } from "../data/roles";

function RoleSelector({onStartInterview,loading,error}) {
    const [selectedRole, setSelectedRole] = useState("");
    const [difficulty, setDifficulty] = useState("intermediate");
    const [questionCount, setQuestionCount] = useState(5);

    function handleSubmit(event) {
        event.preventDefault();
        if (!selectedRole) {
        return;
        }
    onStartInterview({role: selectedRole,difficulty,questionCount: Number(questionCount)});
  }
}