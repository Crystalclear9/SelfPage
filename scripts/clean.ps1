[CmdletBinding(SupportsShouldProcess)]
param()

$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
Add-Type -AssemblyName Microsoft.VisualBasic
# Only reproducible build output and local QA reports are eligible for cleanup.
foreach ($name in @('dist', '.local', 'node_modules/.vite', 'node_modules/.vite-temp')) {
    $candidate = [IO.Path]::GetFullPath((Join-Path $projectRoot $name))
    if (-not $candidate.StartsWith($projectRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Cleanup target is outside the project: $candidate"
    }
    if (-not (Test-Path -LiteralPath $candidate)) { continue }
    $parent = [IO.DirectoryInfo]::new([IO.Path]::GetDirectoryName($candidate))
    while ($parent.FullName -ne $projectRoot) {
        if ($parent.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw "Linked cleanup parent: $parent" }
        $parent = $parent.Parent
    }
    $item = Get-Item -LiteralPath $candidate -Force
    if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
        throw "Cleanup does not follow linked directories: $candidate"
    }
    if (Get-ChildItem -LiteralPath $candidate -Recurse -Force | Where-Object { $_.Attributes -band [IO.FileAttributes]::ReparsePoint }) {
        throw "Cleanup target contains linked files or directories: $candidate"
    }
    if ($PSCmdlet.ShouldProcess($candidate, 'Move generated files to Recycle Bin')) {
        [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory($candidate, 'OnlyErrorDialogs', 'SendToRecycleBin')
        Write-Output "Recycled $candidate"
    }
}
