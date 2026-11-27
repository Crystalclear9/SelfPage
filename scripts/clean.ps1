[CmdletBinding(SupportsShouldProcess)]
param()

$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
# Only reproducible build output and local QA reports are eligible for cleanup.
foreach ($name in @('dist', '.local')) {
    $candidate = [IO.Path]::GetFullPath((Join-Path $projectRoot $name))
    if ([IO.Path]::GetDirectoryName($candidate) -ne $projectRoot) {
        throw "Cleanup target is outside the project: $candidate"
    }
    if (-not (Test-Path -LiteralPath $candidate)) { continue }
    $item = Get-Item -LiteralPath $candidate -Force
    if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
        throw "Cleanup does not follow linked directories: $candidate"
    }
    if (Get-ChildItem -LiteralPath $candidate -Recurse -Force | Where-Object { $_.Attributes -band [IO.FileAttributes]::ReparsePoint }) {
        throw "Cleanup target contains linked files or directories: $candidate"
    }
    if ($PSCmdlet.ShouldProcess($candidate, 'Remove generated files')) {
        Remove-Item -LiteralPath $candidate -Recurse -Force
        Write-Output "Removed $candidate"
    }
}
