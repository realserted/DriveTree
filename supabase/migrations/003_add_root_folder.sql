-- ============================================================
-- DriveTree — Add root folder selection to connected drives
-- ============================================================

ALTER TABLE public.drivetree_connected_drives
  ADD COLUMN root_folder_id TEXT DEFAULT NULL,
  ADD COLUMN root_folder_name TEXT DEFAULT NULL;

COMMENT ON COLUMN public.drivetree_connected_drives.root_folder_id IS 'Google Drive folder ID to scope file browsing. NULL = entire Drive.';
COMMENT ON COLUMN public.drivetree_connected_drives.root_folder_name IS 'Display name of the selected root folder.';
