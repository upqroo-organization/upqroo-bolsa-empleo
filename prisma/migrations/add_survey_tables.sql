-- Add survey tables to the database
-- This is a reference SQL for the survey functionality

-- Survey table
CREATE TABLE Survey (
    id VARCHAR(191) NOT NULL,
    title VARCHAR(191) NOT NULL,
    description TEXT,
    isActive BOOLEAN NOT NULL DEFAULT true,
    startDate DATETIME(3) NOT NULL,
    endDate DATETIME(3) NOT NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL,
    PRIMARY KEY (id)
);

-- Survey questions table
CREATE TABLE SurveyQuestion (
    id VARCHAR(191) NOT NULL,
    surveyId VARCHAR(191) NOT NULL,
    question TEXT NOT NULL,
    `order` INTEGER NOT NULL,
    isRequired BOOLEAN NOT NULL DEFAULT true,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL,
    PRIMARY KEY (id),
    INDEX SurveyQuestion_surveyId_idx (surveyId),
    FOREIGN KEY (surveyId) REFERENCES Survey(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Survey responses table
CREATE TABLE SurveyResponse (
    id VARCHAR(191) NOT NULL,
    surveyId VARCHAR(191) NOT NULL,
    companyId VARCHAR(191) NOT NULL,
    studentId VARCHAR(191) NOT NULL,
    isCompleted BOOLEAN NOT NULL DEFAULT false,
    comments TEXT,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX SurveyResponse_surveyId_companyId_studentId_key (surveyId, companyId, studentId),
    INDEX SurveyResponse_surveyId_idx (surveyId),
    INDEX SurveyResponse_companyId_idx (companyId),
    INDEX SurveyResponse_studentId_idx (studentId),
    FOREIGN KEY (surveyId) REFERENCES Survey(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (companyId) REFERENCES company(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (studentId) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Survey answers table
CREATE TABLE SurveyAnswer (
    id VARCHAR(191) NOT NULL,
    responseId VARCHAR(191) NOT NULL,
    questionId VARCHAR(191) NOT NULL,
    rating INTEGER NOT NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX SurveyAnswer_responseId_questionId_key (responseId, questionId),
    INDEX SurveyAnswer_responseId_idx (responseId),
    INDEX SurveyAnswer_questionId_idx (questionId),
    FOREIGN KEY (responseId) REFERENCES SurveyResponse(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (questionId) REFERENCES SurveyQuestion(id) ON DELETE CASCADE ON UPDATE CASCADE
);