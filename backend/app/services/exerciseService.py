from app.services.exerciseFactory import exercise_factory

class ExerciseService:
    
    def __init__(self):
        self.exercises = exercise_factory.get_exercises_from_csv()

    def get_all_exercises(self):
        return self.exercises

    def get_exercise_by_id(self, exercise_id: int):
        for exercise in self.exercises:
            if exercise.id == exercise_id:
                return exercise
        return None
    
    def get_exercises_by_category(self, category: int):
        return [exercise for exercise in self.exercises if exercise.category == category]
    
    def get_exercises_by_title(self, title: str):
        return [exercise for exercise in self.exercises if exercise.title == title]

    def mark_exercise_as_solved(self, exercise_id: int):
        exercise = self.get_exercise_by_id(exercise_id)
        if exercise is not None:
            exercise.solved = True
        else:
            raise ValueError(f"Exercise with id {exercise_id} not found.")

exercise_service = ExerciseService()