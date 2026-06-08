import sys
from pathlib import Path
from csv import DictReader

if __package__ is None or __package__ == "":
    sys.path.append(str(Path(__file__).resolve().parent.parent.parent))

import app.models.exercise as exercise_model

class ExerciseFactory:

    _instance = None


    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.csv_path = Path(__file__).resolve().parent.parent / "repository" / "HackatonEjercios.csv"
        return cls._instance

    def create_exercise(self, id: int, category: str, title: str, description: str, expected_input: str, expected_out: str, hint : str, solution:str, solved: bool):
        if solution is None:
            solution = ""
        return exercise_model.Exercise(
            id=id,
            category=category,
            title=title,
            description=description,
            expected_input=expected_input,
            expected_output=expected_out,
            hint=hint,
            solution=solution,
            solved=solved
        )

    def get_exercises_from_csv(self):
        id = 1
        exercises = []
        file_path = ExerciseFactory._instance.csv_path
        with open(file_path, 'r', encoding='utf-8-sig') as f:
            dict_reader = DictReader(f)
            for row in dict_reader:
                if not row.get('Titulo'):
                    continue
                exercise = self.create_exercise(
                    id=id,
                    category=row['Dificultad'],
                    title=row['Titulo'],
                    description=row['Descripcion'],
                    expected_input=row['Entrada_esperada'],
                    expected_out=row['Salida_esperada'],
                    hint=row['Pista'],
                    solution=row['Solucion '],
                    solved=(row['Resuelto'] == 'Si')
                )
                id += 1
                exercises.append(exercise)
        return exercises

exercise_factory = ExerciseFactory()



        

