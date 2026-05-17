# SmartEntry Safe Export Script - Markdown Version
# ===============================================
# Exports important project files into Markdown
# Skips real .env files
# Redacts secrets automatically

$OutputDir = "project_dump"
$MaxFileSizeKB = 250

# Delete old dump folder
if (Test-Path $OutputDir) {
    Remove-Item -Recurse -Force $OutputDir
}

New-Item -ItemType Directory -Path $OutputDir | Out-Null

# Folders to ignore completely
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
    ".cache",
    "coverage",
    ".vercel",
    "project_dump"
)

# File extensions to ignore
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
    ".mov",
    ".zip",
    ".rar",
    ".7z",
    ".db",
    ".sqlite",
    ".sqlite3",
    ".pem",
    ".key",
    ".crt"
)

# Real env files to skip
$SensitiveEnvFileNames = @(
    ".env",
    ".env.local",
    ".env.production",
    ".env.development",
    ".env.test",
    "analysis.env"
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
        if ($File.Extension.ToLower() -eq $ext) {
            return $true
        }
    }

    foreach ($envName in $SensitiveEnvFileNames) {
        if ($File.Name.ToLower() -eq $envName.ToLower()) {
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

function Protect-SecretContent {
    param (
        [string]$Content
    )

    if (:IsNullOrEmpty($Content)) {
        return $Content
    }

    $redacted = $Content

    # Redact common KEY=value secrets
    $secretKeys = @(
        "SUPABASE_SERVICE_KEY",
        "SUPABASE_SERVICE_ROLE_KEY",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "SUPABASE_ANON_KEY",
        "FRED_API_KEY",
        "TELEGRAM_BOT_TOKEN",
        "TELEGRAM_CHANNEL_ID",
        "STRIPE_SECRET_KEY",
        "STRIPE_WEBHOOK_SECRET",
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
        "STRIPE_PRICE_ID",
        "API_KEY",
        "SECRET_KEY",
        "ACCESS_TOKEN",
        "REFRESH_TOKEN",
        "JWT_SECRET",
        "DATABASE_URL"
    )

    foreach ($key in $secretKeys) {
        $escapedKey = :Escape($key)
        $pattern = "(?im)^(\s*$escapedKey\s*=\s*)(.+)$"
        $redacted = :Replace($redacted, $pattern, '$1[REDACTED]')
    }

    # Redact Supabase/JWT-like tokens
    $redacted = :Replace(
        $redacted,
        "eyJ[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+",
        "[REDACTED_JWT]"
    )

    # Redact Stripe secret keys
    $redacted = :Replace(
        $redacted,
        "sk_(live|test)_[A-Za-z0-9_]+",
        "[REDACTED_STRIPE_SECRET]"
    )

    # Redact Stripe webhook secrets
    $redacted = :Replace(
        $redacted,
        "whsec_[A-Za-z0-9_]+",
        "[REDACTED_STRIPE_WEBHOOK]"
    )

    # Redact Stripe public keys too
    $redacted = :Replace(
        $redacted,
        "pk_(live|test)_[A-Za-z0-9_]+",
        "[REDACTED_STRIPE_PUBLIC_KEY]"
    )

    # Redact Telegram bot tokens
    $redacted = :Replace(
        $redacted,
        "\b\d{8,12}:[A-Za-z0-9_\-]{30,}\b",
        "[REDACTED_TELEGRAM_BOT_TOKEN]"
    )

    # Redact 32-char hex keys like FRED keys
    $redacted = :Replace(
        $redacted,
        "(?i)\b[a-f0-9]{32}\b",
        "[REDACTED_32_CHAR_KEY]"
    )

    return $redacted
}

function Add-FileToMarkdown {
    param (
        [string]$OutputFile,
        [System.IO.FileInfo]$File
    )

    $rootPath = (Get-Location).Path
    $relativePath = $File.FullName.Replace($rootPath + "\", "")
    $lang = Get-CodeLanguage -Extension $File.Extension

    try {
        $content = Get-Content -Path $File.FullName -Raw -ErrorAction Stop
    }
    catch {
        $content = "[Could not read file: $($_.Exception.Message)]"
    }

    $safeContent = Protect-SecretContent -Content $content

    Add-Content -Path $OutputFile -Value ""
    Add-Content -Path $OutputFile -Value "---"
    Add-Content -Path $OutputFile -Value ""
    Add-Content -Path $OutputFile -Value "## File: $relativePath"
    Add-Content -Path $OutputFile -Value ""

    Add-Content -Path $OutputFile -Value ('```' + $lang)
    Add-Content -Path $OutputFile -Value $safeContent
    Add-Content -Path $OutputFile -Value '```'
}

function Export-FolderToMarkdown {
    param (
        [string]$FolderName,
        [string]$OutputName
    )

    if (-not (Test-Path $FolderName)) {
        return
    }

    $outputFile = Join-Path $OutputDir ($OutputName + ".md")

    Write-Host "Exporting $FolderName -> $OutputName.md"

    Add-Content -Path $outputFile -Value "# Folder: $FolderName"
    Add-Content -Path $outputFile -Value ""
    Add-Content -Path $outputFile -Value "Generated from SmartEntry project."
    Add-Content -Path $outputFile -Value "Secrets are automatically redacted."
    Add-Content -Path $outputFile -Value ""

    Get-ChildItem -Path $FolderName -Recurse -File | Sort-Object FullName | ForEach-Object {
        if (-not (Test-SkipFile -File $_)) {
            Add-FileToMarkdown -OutputFile $outputFile -File $_
        }
    }
}

function Add-RootFileIfExists {
    param (
        [string]$OutputFile,
        [string]$FilePath
    )

    if (Test-Path $FilePath) {
        $fileItem = Get-Item $FilePath

        if (-not (Test-SkipFile -File $fileItem)) {
            Add-FileToMarkdown -OutputFile $OutputFile -File $fileItem
        }
    }
}

# Export classic project folders
$ProjectFolders = @(
    @{ Path = "frontend"; Name = "frontend" },
    @{ Path = "backend"; Name = "backend" },
    @{ Path = "analysis"; Name = "analysis" },
    @{ Path = "telegram-bot"; Name = "telegram-bot" },
    @{ Path = "n8n"; Name = "n8n" },
    @{ Path = "docker"; Name = "docker" },
    @{ Path = "supabase"; Name = "supabase" }
)

foreach ($folder in $ProjectFolders) {
    Export-FolderToMarkdown -FolderName $folder.Path -OutputName $folder.Name
}

# Export root Next.js structure if project is at root instead of frontend/
$RootAppFolders = @(
    @{ Path = "app"; Name = "root-app" },
    @{ Path = "components"; Name = "root-components" },
    @{ Path = "lib"; Name = "root-lib" },
    @{ Path = "hooks"; Name = "root-hooks" },
    @{ Path = "public"; Name = "root-public" },
    @{ Path = "styles"; Name = "root-styles" }
)

foreach ($folder in $RootAppFolders) {
    Export-FolderToMarkdown -FolderName $folder.Path -OutputName $folder.Name
}

# Export root config files
$rootOutputFile = Join-Path $OutputDir "root.md"

Add-Content -Path $rootOutputFile -Value "# Root Files"
Add-Content -Path $rootOutputFile -Value ""
Add-Content -Path $rootOutputFile -Value "Generated from SmartEntry project."
Add-Content -Path $rootOutputFile -Value "Real env files are skipped. Secrets are redacted."
Add-Content -Path $rootOutputFile -Value ""

$RootFilesToExport = @(
    "README.md",
    "plan.md",
    "plan-tracker-and-dependencies.md",
    ".env.example",
    "package.json",
    "package-lock.json",
    "next.config.js",
    "next.config.mjs",
    "next.config.ts",
    "tailwind.config.js",
    "tailwind.config.ts",
    "postcss.config.js",
    "postcss.config.mjs",
    "tsconfig.json",
    "middleware.ts",
    "middleware.js",
    "vercel.json",
    "docker-compose.yml",
    "go.ps1"
)

foreach ($filePath in $RootFilesToExport) {
    Add-RootFileIfExists -OutputFile $rootOutputFile -FilePath $filePath
}

# Create safe project manifest
$manifestFile = Join-Path $OutputDir "project_manifest.md"

Add-Content -Path $manifestFile -Value "# Project Manifest"
Add-Content -Path $manifestFile -Value ""
Add-Content -Path $manifestFile -Value "This is a safe file tree. Secrets and ignored folders are excluded."
Add-Content -Path $manifestFile -Value ""

Get-ChildItem -Recurse -File | Sort-Object FullName | ForEach-Object {
    if (-not (Test-SkipFile -File $_)) {
        $rootPath = (Get-Location).Path
        $relativePath = $_.FullName.Replace($rootPath + "\", "")
        Add-Content -Path $manifestFile -Value "- $relativePath"
    }
}

Write-Host ""
Write-Host "DONE! Safe Markdown files created in: $OutputDir"
Write-Host ""
Write-Host "Send me the relevant files from project_dump."
Write-Host ""
Write-Host "Important:"
Write-Host "- Real .env files are skipped."
Write-Host "- Secrets inside exported code are redacted."
Write-Host "- If you already exposed keys, rotate them now."