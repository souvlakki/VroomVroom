@echo off

setlocal enabledelayedexpansion

for %%d in (
  "src\components"
  "src\components\ui"
  "src\features"
  "src\features\auth"
  "src\features\organizations"
  "src\features\teams"
  "src\features\children"
  "src\features\events"
  "src\features\transportation"
  "src\features\gps"
  "src\features\messaging"
  "src\features\notifications"
  "src\features\safety"
  "src\features\admin"
  "src\lib"
  "src\services"
  "src\stores"
  "src\types"
  "src\utils"
) do (
  if exist "%%d" (
    echo %%d exists
  ) else (
    echo %%d missing
  )
)

endlocal
