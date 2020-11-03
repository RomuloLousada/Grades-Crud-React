import React, { useEffect, useState } from 'react';
import * as API from './api/apiService';
import Grades from './components/grades/Grades';
import ModalWindow from './components/modal/Modal';

export default function App() {
  const [ allGrades, setAllGrades ] = useState([]);
  const [ selectedGrade, setSelectedGrade ] = useState({});
  const [ isModalOpen, setIsModalOpen ] = useState(false);

  useEffect(() => {
    const fetchData = async() => {
      const fetchGrades = await API.getAllGrades();

      setAllGrades(fetchGrades);
    }

    fetchData();
  }, []);

  const handleDelete = async (gradeToDelete) => {
    const isDeleted = await API.deleteGrade(gradeToDelete);
    
    if (isDeleted) {
      const deletedGradeIndex = allGrades.findIndex((grade) => {
        return grade.id === gradeToDelete.id
      });

      const newGrades = Object.assign([], allGrades);
      newGrades[deletedGradeIndex].isDeleted = true;
      newGrades[deletedGradeIndex].value = 0;

      setAllGrades(newGrades);
    }
  };

  const handleSave = (gradeToSave) => {
    setSelectedGrade(gradeToSave);
    setIsModalOpen(true);
  };

  const onSaveGrade = async (formData) => {
    const { id, newValue } = formData;
    
    const newGrades = Object.assign([], allGrades);
    
    const gradeToSave = newGrades.find((grade) => {
      return grade.id === id;
    });
    
    gradeToSave.value = newValue;
    
    if (gradeToSave.isDeleted) {
      gradeToSave.isDeleted = false;
      await API.insertGrade(gradeToSave);
    } else {
      await API.updateGrade(gradeToSave)
    }
    
    setIsModalOpen(false);
  }

  const onCloseModal = () => {
    setIsModalOpen(false);
  }

  return (
    <div className="container center">
      <h3>Controle de Notas</h3>

      {allGrades.length === 0 && <p>Carregando Notas... </p>}
      {allGrades.length > 0 && <Grades grades={allGrades} onDelete={handleDelete} onSave={handleSave}/>}

      {isModalOpen && <ModalWindow selectedGrade={selectedGrade} onSave={onSaveGrade} onClose={onCloseModal}/>}
    </div>
  );
}