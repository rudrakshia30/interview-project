function InterviewQuestions({ session, onNext, onRestart }) {
    const currentIndex = session.currentQuestionIndex;
    const currentQuestion = session.questions[currentIndex];
    const isFirstQuestion = (currentIndex === 0);
    const isLastQuestion = (currentIndex === session.questions.length - 1);
    return (
        <main className="page-container">
            <section className="question-header">
                <div>
                    <p className="eyebrow">{session.role}</p>
                    <h1>Practice interview</h1>
                    <p className="subtitle">Difficulty: {session.difficulty}</p>
                </div>
                <button type="button" className="secondary-button" onClick={onRestart}>Restart Interview</button>
            </section>

            <section className="question-panel">
                <div className="progress-information">
                    <span>Question {currentIndex + 1} of{" "}{session.questions.length}</span>
                    <span className="category-badge">{currentQuestion.category}</span>
                </div>

                <div className="progress-track">
                    <div className="progress-fill" style={{width: `${((currentIndex + 1) /session.questions.length)*100}%`}}/>
                </div>

                <article className="question-card">
                    <p className="question-number">Question {currentIndex + 1}</p>
                    <h2>{currentQuestion.question}</h2>
                </article>

                <div className="navigation-buttons">
                    {isLastQuestion ? (
                        <button type="button" className="primary-button" onClick={onRestart} > Restart Interview </button>
                    ) : (
                        <button type="button" className="primary-button" onClick={onNext}>Next question </button>
                    )}
                </div>
            </section>
        </main>
    );
}

export default InterviewQuestions;