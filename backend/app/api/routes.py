from fastapi import APIRouter
from app.services.exerciseService import exercise_service

router = APIRouter()

class Routes: 

    @router.get("/exercises")
    def get_exercises():
        return exercise_service.get_all_exercises()
    
    @router.get("/exercises/{exercise_id}")
    def get_exercise_by_id(exercise_id: int):
        exercise = exercise_service.get_exercise_by_id(exercise_id)
        if exercise is not None:
            return exercise
        return {"error": "Exercise not found"}
    
    @router.get("/exercises/category/{category}")
    def get_exercises_by_category(category: int):
        return exercise_service.get_exercises_by_category(category)
    
    @router.get("/exercises/name/{name}")
    def get_exercises_by_title(title: str):
        return exercise_service.get_exercises_by_title(title)
    
    @router.post("/exercises/{exercise_id}/solve")
    def mark_exercise_as_solved(exercise_id: int):
        try:
            exercise_service.mark_exercise_as_solved(exercise_id)
            return {"message": f"Exercise with id {exercise_id} marked as solved."}
        except ValueError as e:
            return {"error": str(e)}
    
