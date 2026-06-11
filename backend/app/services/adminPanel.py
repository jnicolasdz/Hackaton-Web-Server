
class AdminPanelService:
    def __init__(self):
        self.allows_file_download = False

    def set_permission_file_download(self, boolean: bool):
        self.allows_file_download = boolean
    
    def get_permission_file_download(self):
        return self.allows_file_download
        
admin_panel = AdminPanelService()
