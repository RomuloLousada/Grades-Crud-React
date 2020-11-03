import React from 'react'
import Actions from '../actions/Actions';

export default function Grades({ grades, onDelete, onSave }) {
  const tableGrades = [];

  let currentStudent = grades[0].student;
  let currentSubject = grades[0].subject;
  let currentGrades = [];
  let id = 1;

  grades.forEach((grade) => {
    if (grade.subject !== currentSubject) {
      tableGrades.push(
        {
          id: id++,
          student: currentStudent,
          subject: currentSubject,
          grades: currentGrades
        }
      );

      currentSubject = grade.subject;
      currentGrades = [];
    }

    if (grade.student !== currentStudent) {
      currentStudent = grade.student;
    }

    currentGrades.push(grade);
  });

  tableGrades.push(
    {
      id: id++,
      student: currentStudent,
      subject: currentSubject,
      grades: currentGrades
    }
  );

  const handleActionClick = (id, type) => {
    const grade = grades.find((grade) => {
      return grade.id === id;
    });

    if (type === 'delete') {
      onDelete(grade);
    } else {
      onSave(grade);
    }
  }
  
  return (
    <div>
      {tableGrades.map(({id, grades}) => {
        const finalGrade = grades.reduce((acc, cur) => {
          return acc + cur.value;
        }, 0);
        const gradeStyle = finalGrade >= 70 ? styles.goodGrade : styles.badGrade;

        return (
          <table style={styles.table} className="striped center" key={id}>
            <thead>
              <tr>
                <th style={{width: '20%'}}>Aluno</th>
                <th style={{width: '20%'}}>Disciplina</th>
                <th style={{width: '20%'}}>Avaliação</th>
                <th style={{width: '20%'}}>Nota</th>
                <th style={{width: '20%'}} colSpan="2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {grades.map(({id, student, subject, type, value, isDeleted}) => {
                return (
                  <tr key={id}>
                    <td>{student}</td>
                    <td>{subject}</td>
                    <td>{type}</td>
                    <td>{isDeleted ? '-' : value}</td>
                    <td><Actions onActionClick={handleActionClick} id={id} type={isDeleted ? "add" : "edit"}/></td>
                    <td><Actions onActionClick={handleActionClick} id={id} type={isDeleted ? "" : "delete"}/></td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3"></td>
                <td colSpan="3" style={gradeStyle}>{finalGrade}</td>
              </tr>
            </tfoot>
          </table>
        );
      })}
    </div>
  )
}

const styles = {
  goodGrade: {
    fontWeight: 'bold',
    color: 'green'
  },
  badGrade: {
    fontWeight: 'bold',
    color: 'red'
  },
  table: {
    margin: '20px',
    padding: '10px'
  }
}