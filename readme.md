version1- 

User opens application
        ↓
User selects an interview role
        ↓
User selects difficulty and number of questions
        ↓
React sends the selection to FastAPI
        ↓
FastAPI sends a prompt to Groq
        ↓
Groq generates structured interview questions
        ↓
FastAPI validates the questions
        ↓
React displays one question at a time
        ↓
Questions are saved in browser localStorage