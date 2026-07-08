import "./InterviewComplete.css";

function getQuestionText(question) {
    if (typeof question === "string") {
        return question;
    }

    return (question?.question || question?.text || question?.content || "");
}

function InterviewComplete({ session, recordings, onRestart }) {
    return (
        <main className="page-container">
            <section className="completion-panel">
                <p className="eyebrow">Interview completed</p>

                <h1>Your recorded answers</h1>

                <p className="completion-description">
                    Download your original videos before refreshing or closing this browser tab.
                </p>

                <div className="completed-answers">
                    {session.questions.map((question, questionIndex) => {
                        const recording = recordings[questionIndex];

                        return (
                            <article className="completed-answer-card" key={questionIndex}>
                                <p className="completed-question-number">Question {questionIndex + 1}</p>

                                <h2>{getQuestionText(question)}</h2>

                                {recording ? (
                                    <>
                                        <video
                                            className="completed-video"
                                            src={recording.videoUrl}
                                            controls
                                            playsInline
                                        />

                                        <a
                                            className="download-answer-button"
                                            href={recording.videoUrl}
                                            download={recording.fileName}
                                        >
                                            Download Video
                                        </a>

                                        <div className="completed-transcript">
                                            <strong>Transcript</strong>

                                            <p>{recording.transcript}</p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="missing-recording">
                                        This recording is unavailable. It may have been removed by refreshing the page.
                                    </p>
                                )}
                            </article>
                        );
                    })}
                </div>

                <button type="button" className="primary-button" onClick={onRestart}>
                    Start New Interview
                </button>
            </section>
        </main>
    );
}

export default InterviewComplete;