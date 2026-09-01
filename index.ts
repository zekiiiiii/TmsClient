import { Temporal } from "@js-temporal/polyfill";
import { Student, isStudent, parseStudent } from "./models/student.model";
import { AssessmentItem, calculateGrade } from "./models/assessment.model";
import { describeEnrollment, EnrollmentStatus } from "./models/enrollment.model";
import { Course, CourseStatus, describeCourse } from "./models/course.model";
import { renderResponse, ApiResponse } from "./models/api-resonse.model";

// Module 2 Lab Session 1: Type Safety and Domain
/*
Create the Project
Initialize the TypeScript Compiler
Configure Strict Mode
Verify
Try Transpiling to the ./dist directory and see what is generated
*/

console.log("========= M2 : Session 1 ========");

// Exercise 2: TMS Domain Models
const student: Student = {
    id: "STU-001",
    name: "Hana Tadesse",
    enrollmentDate: Temporal.Now.instant(),
}

// student.id = "STU-999"; 
// console.log(student.gpa.toFixed(2));
// console.log(student.gpa?.toFixed(2) ?? "Not yet graded");



//Exercise 3: Safe API Parsing (Type Guards and Unknown)

function processStudent(raw: unknown) {
    if (isStudent(raw)) {
        const gpaDisplay = raw.gpa?.toFixed(2) ?? "Not yet graded";
        console.log(`Student ${raw.name}  GPA: ${gpaDisplay}`);
    }
    else {
        console.error("invalid student data received");
    }
}

processStudent({ id: "STU-001", name: "Hana", gpa: 3.7 });

console.log(parseStudent({ id: "STU-001", name: "Hana" }));

// parseStudent({ id: 42, name: "Test" });



// Module 2 Lab Session 2: Unions, Generics, and Temporal


console.log("========= M2 : Session 2 ========");

//Exercise 4: Assessment Types (Discriminated Unions)

const quiz: AssessmentItem = {
    id: "QUIZ-001",
    kind: "quiz",
    title: "SQL Basics",
    correctAnswers: 8,
    totalQuestions: 10,
};
const lab: AssessmentItem = {
    id: "LAB-001",
    kind: "lab",
    title: "REST API Project",
    functionalityScore: 85,
    codeQualityScore: 90,
};
console.log(`Quiz grade: ${calculateGrade(quiz)}%`); // 80
console.log(`Lab grade: ${calculateGrade(lab)}%`); // 87

// quiz.id = "QUIZ-999";



//Exercise 5: Enrollment Lifecycle (State Machine Union)

const pending: EnrollmentStatus = {
    status: "PENDING",
    requestedAt: Temporal.Now.instant(),
    studentId: "STU-001",
    courseId: "CRS-101",
};


console.log(describeEnrollment(pending));



//Exercise 5 Part B: Course Lifecycle

const webDev: CourseStatus = {
    status: "ACTIVE",
    enrolledCount: 28,
    startDate: Temporal.PlainDate.from("2026-09-01"),
};

console.log(describeCourse(webDev));


//Exercise 6: Reusable API Response (Generics)

const studentRes: ApiResponse<Student> = {
    status: "success",
    data: {
        id: "STU-001",
        name: "Dawit Bekele",
        enrollmentDate: Temporal.Now.instant(),
        gpa: 3.4,
    },
    fetchedAt: Temporal.Now.instant(),
};
console.log(
    renderResponse(
        studentRes, 
        (s) => `${s.name} GPA: ${s.gpa ?? "N/A"}`),);
 

 const courseListRes: ApiResponse<Course[]> = {
    status: "success",
    data: [
        {
            id: "CRS-101",
            title: "Web Development Fundamentals",
            capacity: 30,
            startDate: Temporal.PlainDate.from("2026-09-01"),
        },
    ],
    fetchedAt: Temporal.Now.instant(),
};
console.log(
    renderResponse(
        courseListRes, 
        (courses) =>courses.map((c) => c.title).join(", "),),)


//Record the exact moment an enrollment is approved (UTC)
const approvedAt = Temporal.Now.instant();
console.log(`Approved at (UTC): ${approvedAt}`);



// Exercise 7: Temporal Timestamps (Dates, Timezones, Durations)

//Display in local timezone
const addisTime = approvedAt.toZonedDateTimeISO("Africa/Addis_Ababa");
const londonTime = approvedAt.toZonedDateTimeISO("Europe/London");
console.log(`Addis: ${addisTime.toPlainTime()}`);   //Addis: 15:37:11.36343136
console.log(`London: ${londonTime.toPlainTime()}`); //London: 13:37:11.36343136


//Course start date (date only, no time)
const courseStart = Temporal.PlainDate.from("2026-09-01");
const today = Temporal.Now.plainDateISO();
const daysUntilStart = today.until(courseStart).total({ unit: "days" });
console.log(`${Math.floor(daysUntilStart)} days until course starts`);


//Assignment deadline duration
const deadline = Temporal.PlainDate.from("2026-12-15");
const remaining = today.until(deadline);
console.log(
    `${remaining.total({ unit: "days" })} days until assignment is due`, );
