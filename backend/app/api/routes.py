from pathlib import Path
from fastapi import APIRouter
from app.services.exerciseService import exercise_service
from app.services.adminPanel import admin_panel
from fastapi.responses import FileResponse

BASE_DIR = Path(__file__).resolve().parent.parent
FILE_PATH = BASE_DIR / "repository" / "LPI-Learning-Material.pdf"
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
    
    @router.post("/admin/permissions/file-download")
    def set_permission_file_download(permission: bool):
        admin_panel.set_permission_file_download(permission)
        return {"message": f"File download permission set to {permission}."}    

    @router.get("/downloadFile")
    async def descargar_archivo():
        if not admin_panel.get_permission_file_download():
            return {"error": "File download permission is disabled."}
        else:
            path = FILE_PATH
            return FileResponse(
                path=path, 
                filename="LPI-Learning.pdf", 
                media_type="application/pdf"
            )
    
