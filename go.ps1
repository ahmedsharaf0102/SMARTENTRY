# SmartEntry Export Script - Markdown Version
# ===========================================

$OutputDir = "project_dump"
$MaxFileSizeKB = 200

# Delete old dump folder
if (Test-Path $OutputDir) {
    Remove-Item -Recurse -Force $OutputDir
}

New-Item -ItemType Directory -Path $OutputDir | Out-Null

# Ignore folders
$IgnoreFolders = @(
    "node_modules",
    ".git",
    ".next",
    "dist",
    "build",
    "__pycache__",
    "venv",
    ".venv",
    ".turbo",
    ".cache"
)

# Ignore file extensions
$IgnoreExtensions = @(
    ".lock",
    ".log",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".webp",
    ".mp4",
    ".zip",
    ".db",
    ".sqlite"
)

function Test-SkipFile {
    param (
        [System.IO.FileInfo]$File
    )

    foreach ($folder in $IgnoreFolders) {
        if ($File.FullName -like "*\$folder\*") {
            return $true
        }
    }

    foreach ($ext in $IgnoreExtensions) {
        if ($File.Extension -eq $ext) {
            return $true
        }
    }

    if ($File.Length -gt ($MaxFileSizeKB * 1024)) {
        return $true
    }

    return $false
}

function Get-CodeLanguage {
    param (
        [string]$Extension
    )

    switch ($Extension.ToLower()) {
        ".js" { return "javascript" }
        ".mjs" { return "javascript" }
        ".cjs" { return "javascript" }
        ".ts" { return "typescript" }
        ".tsx" { return "tsx" }
        ".jsx" { return "jsx" }
        ".py" { return "python" }
        ".json" { return "json" }
        ".css" { return "css" }
        ".scss" { return "scss" }
        ".html" { return "html" }
        ".md" { return "markdown" }
        ".yml" { return "yaml" }
        ".yaml" { return "yaml" }
        ".env" { return "bash" }
        ".example" { return "bash" }
        ".ps1" { return "powershell" }
        ".sh" { return "bash" }
        ".sql" { return "sql" }
        default { return "" }
    }
}

function Add-FileToMarkdown {
    param (
        [string]$OutputFile,
        [System.IO.FileInfo]$File
    )

    $rootPath = (Get-Location).Path
    $relativePath = $File.FullName.Replace($rootPath + "\", "")
    $lang = Get-CodeLanguage -Extension $File.Extension

    Add-Content -Path $OutputFile -Value ""
    Add-Content -Path $OutputFile -Value "---"
    Add-Content -Path $OutputFile -Value ""
    Add-Content -Path $OutputFile -Value "## File: $relativePath"
    Add-Content -Path $OutputFile -Value ""

    # Important: use single quotes for markdown fences because PowerShell treats backtick as escape character
    Add-Content -Path $OutputFile -Value ('```' + $lang)

    Get-Content -Path $File.FullName -Raw | Add-Content -Path $OutputFile

    Add-Content -Path $OutputFile -Value '```'
}

function Export-FolderToMarkdown {
    param (
        [string]$FolderName
    )

    if (-not (Test-Path $FolderName)) {
        return
    }

    $outputFile = Join-Path $OutputDir ($FolderName + ".md")

    Write-Host "Exporting $FolderName..."

    Add-Content -Path $outputFile -Value "# Folder: $FolderName"
    Add-Content -Path $outputFile -Value ""
    Add-Content -Path $outputFile -Value "Generated from SmartEntry project."
    Add-Content -Path $outputFile -Value ""

    Get-ChildItem -Path $FolderName -Recurse -File | ForEach-Object {
        if (-not (Test-SkipFile -File $_)) {
            Add-FileToMarkdown -OutputFile $outputFile -File $_
        }
    }
}

# Export project folders
$FoldersToExport = @(
    "frontend",
    "backend",
    "analysis",
    "telegram-bot",
    "n8n",
    "docker"
)

foreach ($folder in $FoldersToExport) {
    Export-FolderToMarkdown -FolderName $folder
}

# Export root files
$rootOutputFile = Join-Path $OutputDir "root.md"

Add-Content -Path $rootOutputFile -Value "# Root Files"
Add-Content -Path $rootOutputFile -Value ""
Add-Content -Path $rootOutputFile -Value "Generated from SmartEntry project."
Add-Content -Path $rootOutputFile -Value ""

$RootFilesToExport = @(
    "README.md",
    "plan.md",
    "plan-tracker-and-dependencies.md",
    ".env.example",
    "package.json",
    "docker-compose.yml",
    "go.ps1"
)

foreach ($filePath in $RootFilesToExport) {
    if (Test-Path $filePath) {
        $fileItem = Get-Item $filePath

        if (-not (Test-SkipFile -File $fileItem)) {
            Add-FileToMarkdown -OutputFile $rootOutputFile -File $fileItem
        }
    }
}

Write-Host ""
Write-Host "DONE! Markdown files created in: $OutputDir"
Write-Host ""
Write-Host "You can now send me these files:"
Write-Host "- project_dump/root.md"
Write-Host "- project_dump/frontend.md"
Write-Host "- project_dump/backend.md"
Write-Host "- project_dump/analysis.md"
Write-Host "- project_dump/telegram-bot.md"
Write-Host "- project_dump/docker.md"
Write-Host "- project_dump/n8n.md"