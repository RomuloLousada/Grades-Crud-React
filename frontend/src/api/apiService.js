import axios from "axios"

const API_URL = "http://localhost:3001/grade/";

const GRADE_VALIDATION = [
  {
    id: 1,
    gradeType: "Exercícios",
    minValue: 0,
    maxValue: 10
  },
  {
    id: 2,
    gradeType: "Trabalho Prático",
    minValue: 0,
    maxValue: 40
  },
  {
    id: 3,
    gradeType: "Desafio",
    minValue: 0,
    maxValue: 50
  }
];

async function getAllGrades() {
  const res = await axios.get(API_URL);
  
  const grades = res.data.grades.map((grade) => {
    const { student, subject, type } = grade;

    return {
      ...grade,
      studentLowerCase: student.toLowerCase(),
      subjectLowerCase: subject.toLowerCase(),
      typeLowerCase: type.toLowerCase(),
      isDeleted: false
    };
  });

  let allStudents = new Set();
  let allSubjects = new Set();
  let allTypes = new Set();

  grades.forEach((grade) =>{
    allStudents.add(grade.student);
    allSubjects.add(grade.subject);
    allTypes.add(grade.type);
  });

  allStudents = Array.from(allStudents);
  allSubjects = Array.from(allSubjects);
  allTypes = Array.from(allTypes);

  let nextId = grades.length +1;
  const allCombinations = [];

  allStudents.forEach((student) => {
    allSubjects.forEach((subject) => {
      allTypes.forEach((type) => {
        allCombinations.push({
          student,
          subject,
          type
        });
      });
    });
  });

  allCombinations.splice(0, 1);

  allCombinations.forEach(({ student, subject, type }) => {
    const hasItem = grades.find((grade) => {
      return grade.subject === subject &&
      grade.student === student &&
      grade.type === type
    })

    if (!hasItem) {
      grades.push({
        id: nextId++,
        student: student,
        studentLowerCase: student.toLowerCase(),
        subject: subject,
        subjectLowerCase: subject.toLowerCase(),
        type: type,
        typeLowerCase: type.toLowerCase(),
        value: 0,
        isDeleted: true
      });
    }
  });

  grades.sort((a, b) => {
    return a.typeLowerCase.localeCompare(b.typeLowerCase);
  });

  grades.sort((a, b) => {
    return a.subjectLowerCase.localeCompare(b.subjectLowerCase);
  });
  
  grades.sort((a, b) => {
    return a.studentLowerCase.localeCompare(b.studentLowerCase);
  });

  return grades;
}

async function insertGrade(grade) {
  const response = await axios.post(API_URL, grade);
  return response.data.id;
}

async function updateGrade(grade) {
  const response = await axios.put(API_URL, grade);
  return response.data;
}

async function deleteGrade(grade) {
  const response = await axios.delete(`${API_URL}/${grade.id}`);
  return response.data;
}

async function getValidationFromGradeType(gradeType) {
  const gradeValidation = GRADE_VALIDATION.find((item) => {
    return item.gradeType === gradeType;
  });

  const { minValue, maxValue } = gradeValidation;

  return {
    minValue: minValue,
    maxValue: maxValue
  };
}

export { getAllGrades, insertGrade, updateGrade, deleteGrade, getValidationFromGradeType };