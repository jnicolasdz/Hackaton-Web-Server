from typing import Optional

from pydantic import BaseModel

class Exercise(BaseModel):
    
    id: int
    category: int
    title: str
    description: str
    expected_input: str
    expected_output: str
    hint: Optional[str] = None
    solved: Optional[bool] = None 
    solution: Optional[str] = None

    def __str__(self):
        return f"Exercise(id={self.id}, category='{self.category}', title='{self.title}')"
    
    def to_dict(self):
        return {
            "id": self.id,
            "category": self.category,
            "title": self.title,
            "description": self.description,
            "expected_input": self.expected_input,
            "expected_output": self.expected_output,
            "solved": self.solved,
            "hint": self.hint,
            "solution": self.solution
        }