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
    return(
        <main className="page-container">
            <section className="hero-section">
                <p className="eyebrow">AI INTERVIEW PRACTICE</p>
                <h1>Choose your interview role</h1>
                <p className="subtitle">
                Select a role and let AI prepare
                role-specific interview questions.
                </p>
            </section>
            <form className="interview-form" onSubmit={handleSubmit}>
                <div className="roles-grid">
                    {roles.map((role) => {
                        const isSelected = (selectedRole === role.name);
                        return (
                            <button key={role.id} type="button" className={isSelected? "role-card selected": "role-card"}
                                onClick={() =>setSelectedRole(role.name)}
                            >
                                <h2>{role.name}</h2>
                                <p>{role.description}</p>
                            </button>
                        );
                    })}
                </div>
                <div className="settings-panel">
                    <label> Difficulty
                        <select value={difficulty}
                            onChange={(event) =>setDifficulty(event.target.value)}
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </label>
                    <label>Number of questions
                        <select value={questionCount}
                            onChange={(event) =>setQuestionCount(Number(event.target.value))}
                        >
                        <option value={3}>3</option>
                        <option value={5}>5</option>
                        <option value={7}>7</option>
                        <option value={10}>10</option>
                        </select>
                    </label>
                </div>
                {error && (
                    <p className="error-message">{error}</p>
                )}

                <button type="submit" className="primary-button" disabled={!selectedRole || loading}>{loading? "Generating questions...": "Start interview"}</button>
            </form>
       </main>
    )
}
export default RoleSelector;